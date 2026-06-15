import Image from "next/image";

/**
 * 2D 0xNull mascot for the hero (3D R3F treatment deferred — spec §2.5).
 * Gentle float, static under prefers-reduced-motion (handled in globals.css).
 */
export default function Mascot() {
  return (
    <div className="mascot-float pointer-events-none select-none" aria-hidden>
      <Image
        src="/0xnull.svg"
        alt="0xNull — the cognitiveOS mascot"
        width={180}
        height={180}
        priority
        className="h-auto w-[140px] sm:w-[180px]"
      />
    </div>
  );
}
