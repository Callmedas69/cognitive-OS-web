from playwright.sync_api import sync_playwright
import os
OUT = "C:/Users/HERRYA~1/AppData/Local/Temp/cogos"
os.makedirs(OUT, exist_ok=True)
B = "http://localhost:3002"

with sync_playwright() as p:
    b = p.chromium.launch(headless=True, args=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
    pg = b.new_page(viewport={"width": 1280, "height": 820})
    pg.goto(B); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(500)

    def shot(text, name):
        pg.get_by_text(text, exact=False).first.scroll_into_view_if_needed()
        pg.wait_for_timeout(1000)
        # color of the H2 title + top bar
        h2 = pg.get_by_role("heading", level=2, name=text).first
        tcol = pg.evaluate("e => getComputedStyle(e).color", h2.element_handle())
        bar = pg.locator("div.fixed.top-0").first
        bcol = pg.evaluate("e => getComputedStyle(e).backgroundColor", bar.element_handle())
        bw = pg.evaluate("e => e.style.width", bar.element_handle())
        ink = pg.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--mood-ink').trim()")
        print(f"  {name:11s} title={tcol} | topbar={bcol} w={bw} | --mood-ink={ink}")
        pg.screenshot(path=f"{OUT}/amp_{name}.png")

    shot("The 30-minute tax", "problem")
    shot("The filesystem is the fix", "filesystem")
    shot("Bring your own agent", "agent")

    # reduced-motion: frozen emerald ink
    rm = b.new_page(viewport={"width":1280,"height":820}, reduced_motion="reduce")
    rm.goto(B); rm.wait_for_load_state("networkidle")
    rm.get_by_text("The 30-minute tax").first.scroll_into_view_if_needed(); rm.wait_for_timeout(700)
    rink = rm.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--mood-ink').trim()")
    print("  reduced-motion --mood-ink (expect #047857):", rink)
    b.close()
print("DONE")
