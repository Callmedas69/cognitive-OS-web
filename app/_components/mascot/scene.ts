import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * Vanilla Three.js scene for the 0xNull voxel mascot.
 *
 * Render recipe is load-bearing — the GLB is 156 overlapping cube meshes and
 * naive settings z-fight into a glassy mess. Proven fixes (do not change
 * without re-testing):
 *   - Tight camera near/far bracket (1200..4200) around the model → depth
 *     precision; THIS is the #1 z-fight fix.
 *   - Every material side = FrontSide (override doubleSided) → kills glassy
 *     see-through, halves z-fight.
 *   - No geometry merge / quantize / recompute-normals. Renders clean as-is.
 *   - NeutralToneMapping + neutral greys (ACES muddied it to navy).
 *
 * The orb voxels carry the mood: their emissive follows the page --mood var,
 * so the mascot glows the scroll mood.
 */

export type MascotHandle = {
  resize: () => void;
  dispose: () => void;
};

const MODEL_URL = "/models/0xnull.glb";

function classify(color: THREE.Color) {
  const { r, g, b } = color;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  // near-white → eyes
  if (min > 0.78 && max > 0.85) return "eye" as const;
  // warm skin (r highest, low blue) → hands
  if (r > 0.55 && r >= g && b < g && b < 0.6 && max - min > 0.1) return "hand" as const;
  // blue-dominant → orb (mood target)
  if (b > 0.32 && b >= r && b >= g - 0.05 && b - r > 0.06) return "orb" as const;
  return "body" as const;
}

export async function createMascot(
  canvas: HTMLCanvasElement,
  opts: { reducedMotion: boolean }
): Promise<MascotHandle> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();

  // Tight bracket around the model (centered at origin, ~±320u) is the
  // z-fight fix. Camera sits at z=2600 looking at origin.
  const camera = new THREE.PerspectiveCamera(35, 1, 1200, 4200);
  camera.position.set(0, 0, 2600);
  camera.lookAt(0, 0, 0);

  // Neutral grey lighting — true voxel colors, no navy cast.
  const hemi = new THREE.HemisphereLight(0xffffff, 0x9a9a9a, 0.65);
  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(600, 900, 1400);
  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  fill.position.set(-700, -200, 600);
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(hemi, key, fill, ambient);

  const root = new THREE.Group();
  scene.add(root);

  const orbMeshes: THREE.Mesh[] = [];
  const eyeMeshes: THREE.Mesh[] = [];
  const handMeshes: THREE.Mesh[] = [];

  // --- load model ---
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(MODEL_URL);
  const model = gltf.scene;

  model.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => {
      (m as THREE.MeshStandardMaterial).side = THREE.FrontSide; // opaque voxels, no backfaces
    });
    const first = mats[0] as THREE.MeshStandardMaterial | undefined;
    const kind = first?.color ? classify(first.color) : "body";
    if (kind === "orb") orbMeshes.push(mesh);
    else if (kind === "eye") eyeMeshes.push(mesh);
    else if (kind === "hand") handMeshes.push(mesh);
  });

  // Center the model at origin (keep original scale — camera is tuned to it).
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  root.add(model);

  // Mood: dedicated emissive material colour for orb voxels.
  const moodColor = new THREE.Color("#10b981");
  const moodTarget = new THREE.Color("#10b981");
  orbMeshes.forEach((mesh) => {
    const m = mesh.material as THREE.MeshStandardMaterial;
    m.emissive = moodColor;
    m.emissiveIntensity = 0.55;
  });

  function readMoodVar(): string {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--mood")
      .trim();
    return v || "#10b981";
  }

  // --- sizing ---
  function resize() {
    const w = canvas.clientWidth || 180;
    const h = canvas.clientHeight || 180;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();

  // --- pointer parallax ---
  const pointer = { x: 0, y: 0 };
  const onPointerMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  let raf = 0;
  let nextBlink = 2 + Math.random() * 4;
  let blinkUntil = 0;
  const clock = new THREE.Clock();

  function renderOnce() {
    moodTarget.set(readMoodVar());
    moodColor.copy(moodTarget);
    renderer.render(scene, camera);
  }

  function tick() {
    raf = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    const dt = clock.getDelta();

    // idle float + breathe
    root.position.y = Math.sin((t / 3) * Math.PI * 2) * 22;
    const breathe = 1 + Math.sin((t / 4) * Math.PI * 2) * 0.02;
    root.scale.setScalar(breathe);

    // pointer parallax tilt (max ~8°), eased
    const maxTilt = THREE.MathUtils.degToRad(8);
    root.rotation.y += (pointer.x * maxTilt - root.rotation.y) * 0.06;
    root.rotation.x += (pointer.y * maxTilt * 0.6 - root.rotation.x) * 0.06;

    // mood emissive — follow the (already CSS-lerped) --mood var
    moodTarget.set(readMoodVar());
    moodColor.lerp(moodTarget, 0.12);
    const pulse = 0.5 + Math.sin((t / 2.2) * Math.PI * 2) * 0.12;
    orbMeshes.forEach((mesh) => {
      const m = mesh.material as THREE.MeshStandardMaterial;
      m.emissive.copy(moodColor);
      m.emissiveIntensity = pulse;
    });

    // blink — squash eye voxels on Y briefly
    if (t > nextBlink && blinkUntil === 0) blinkUntil = t + 0.12;
    if (blinkUntil > 0) {
      const closing = t < blinkUntil;
      eyeMeshes.forEach((mesh) => {
        mesh.scale.y = closing ? 0.12 : 1;
      });
      if (!closing) {
        blinkUntil = 0;
        nextBlink = t + 5 + Math.random() * 3;
      }
    }

    // hands micro-bob
    handMeshes.forEach((mesh, i) => {
      mesh.position.y = Math.sin((t / 1.8 + i) * Math.PI * 2) * 4;
    });

    void dt;
    renderer.render(scene, camera);
  }

  if (opts.reducedMotion) {
    renderOnce();
  } else {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    tick();
  }

  return {
    resize,
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => m?.dispose());
        }
      });
      renderer.dispose();
    },
  };
}
