from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import ConsoleMessage, Page, sync_playwright
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError


BASE_URL = "http://127.0.0.1:5173"
ROUTES = ["/", "/services", "/work", "/about", "/contact", "/privacy", "/not-a-real-route"]
VIEWPORTS = [(375, 812), (430, 932), (768, 1024), (1440, 900), (1920, 1080)]
OUTPUT_DIR = Path("test-results/qa")


def route_name(route: str) -> str:
    return "home" if route == "/" else route.strip("/").replace("/", "-")


def settle_images(page: Page) -> None:
    """Force every image to resolve, then wait, so "broken" means broken.

    Two things defeat the naive check. `loading="lazy"` images report
    `complete === false` until they approach the viewport, and the reveal scroll
    passes them far too quickly to trigger a fetch — then it returns to the top,
    which puts them out of range again, so they never load at all and a plain
    wait would hang forever.

    Promoting the unfinished ones to eager asks the real question a broken-image
    audit is for: if this src were requested, would it decode? Viewport position
    stops mattering. Anything that then finishes with zero pixels is genuinely
    broken; anything still pending is a slow network, not a bad file.
    """
    page.evaluate(
        """() => {
          for (const image of document.images) {
            if (!image.complete) image.loading = 'eager'
          }
        }"""
    )
    try:
        page.wait_for_function(
            "() => [...document.images].every((image) => image.complete)",
            timeout=15000,
        )
    except PlaywrightTimeoutError:
        # Not a failure by itself — the metrics below still report anything that
        # resolved to zero pixels, and pendingImages records what never settled.
        pass


def activate_scroll_reveals(page: Page) -> None:
    page.evaluate(
        """async () => {
          const step = Math.max(window.innerHeight * 0.75, 320)
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo(0, y)
            await new Promise((resolve) => setTimeout(resolve, 70))
          }
          window.scrollTo(0, 0)
          await new Promise((resolve) => setTimeout(resolve, 350))
        }"""
    )


def check_page(page: Page, route: str, width: int, height: int, failures: list[str]) -> None:
    label = f"{route} @ {width}x{height}"
    page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
    page.locator("h1").first.wait_for(state="visible")
    page.wait_for_timeout(250)

    metrics = page.evaluate(
        """() => ({
          viewport: window.innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          headerTop: document.querySelector('header')?.getBoundingClientRect().top,
          h1: document.querySelector('h1')?.textContent?.trim(),
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
          brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length,
          pendingImages: [...document.images].filter((image) => !image.complete).length,
        })"""
    )
    if metrics["documentWidth"] > metrics["viewport"] + 1 or metrics["bodyWidth"] > metrics["viewport"] + 1:
        failures.append(f"Horizontal overflow: {label} ({metrics})")
    if metrics["headerTop"] != 0:
        failures.append(f"Header gap: {label} (top={metrics['headerTop']})")
    if not metrics["h1"]:
        failures.append(f"Missing H1: {label}")
    if not metrics["title"] or not metrics["description"] or not metrics["canonical"]:
        failures.append(f"Missing SEO metadata: {label} ({metrics})")
    if metrics["brokenImages"]:
        failures.append(f"Broken images: {label} ({metrics['brokenImages']})")

    if route == "/":
        # Reveals are CSS scroll-driven, so "hidden before it is reached" is
        # correct. What must never happen is content still invisible once it
        # is actually on screen: bring each one to the middle and read it.
        stuck_reveals = page.evaluate(
            """async () => {
              const stuck = []
              for (const el of document.querySelectorAll('[data-reveal]')) {
                el.scrollIntoView({ block: 'center', behavior: 'instant' })
                await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
                const box = el.getBoundingClientRect()
                const opacity = Number(getComputedStyle(el).opacity)
                if (opacity < 0.9 || box.width === 0 || box.height === 0) {
                  stuck.push(`${el.className || el.tagName}: opacity ${opacity}`)
                }
              }
              window.scrollTo({ top: 0, behavior: 'instant' })
              return stuck
            }"""
        )
        if stuck_reveals:
            failures.append(f"Homepage content still hidden on screen: {label} ({stuck_reveals})")
        if page.locator(".hero__line").count() != 2:
            failures.append(f"Hero title treatment missing: {label}")
        clipped_hero_lines = page.locator(".hero__line-inner").evaluate_all(
            "els => els.filter(el => { const box = el.getBoundingClientRect(); return box.left < -1 || box.right > window.innerWidth + 1 }).length"
        )
        if clipped_hero_lines:
            failures.append(f"Hero title clipped by viewport: {label} ({clipped_hero_lines})")
        field_modes = page.locator(".signal-field").evaluate_all("els => els.map(el => el.dataset.mode)")
        if len(field_modes) != 2 or any(mode not in ("live", "fallback") for mode in field_modes):
            failures.append(f"Signal field did not settle: {label} ({field_modes})")

    if width == 1440 and route == "/":
        # Fresh load first: the reveal pass above scrolls the whole page, and
        # Chrome moves its sequential-focus starting point with the scroll, so
        # Tab would begin from wherever that pass ended rather than the top.
        page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
        page.keyboard.press("Tab")
        active_text = page.evaluate("document.activeElement?.textContent?.trim()")
        skip_box = page.locator(".skip-link").bounding_box()
        if active_text != "Skip to content" or not skip_box or skip_box["width"] < 40:
            failures.append(f"Skip link was not keyboard-visible: {label}")
        page.evaluate("document.activeElement?.blur()")

        float_card = page.locator(".hero__float--site")
        page.wait_for_timeout(1400)
        before = float_card.evaluate("el => getComputedStyle(el).transform")
        hero_box = page.locator(".hero").bounding_box()
        if hero_box:
            page.mouse.move(hero_box["x"] + hero_box["width"] * 0.9, hero_box["y"] + hero_box["height"] * 0.85)
            page.wait_for_timeout(700)
            after = float_card.evaluate("el => getComputedStyle(el).transform")
            if after == before:
                failures.append(f"Hero cards did not respond to the pointer: {label}")
            page.mouse.move(0, 0)

        # The AI flow pins while scroll drives its four steps. Sticky breaks
        # silently (an overflow on an ancestor is enough), so measure it.
        flow = page.evaluate(
            """async () => {
              const section = document.querySelector('.flow')
              const sticky = section.querySelector('.flow__sticky')
              const header = document.querySelector('.site-header').getBoundingClientRect().height
              const top = section.getBoundingClientRect().top + window.scrollY
              const travel = section.offsetHeight - window.innerHeight
              const readings = []
              for (const fraction of [0.05, 0.35, 0.6, 0.95]) {
                window.scrollTo({ top: top + travel * fraction, behavior: 'instant' })
                await new Promise((resolve) => setTimeout(resolve, 250))
                readings.push({
                  stickyTop: Math.round(sticky.getBoundingClientRect().top),
                  active: section.querySelectorAll('[data-active="true"]').length,
                })
              }
              window.scrollTo({ top: 0, behavior: 'instant' })
              return { pinned: section.dataset.pinned, header: Math.round(header), readings }
            }"""
        )
        if flow["pinned"] != "true":
            failures.append(f"AI flow was not pinned on desktop: {label} ({flow})")
        elif any(abs(r["stickyTop"] - flow["header"]) > 2 for r in flow["readings"]):
            failures.append(f"AI flow lost its pin while scrolling: {label} ({flow})")
        actives = [r["active"] for r in flow["readings"]]
        if actives != sorted(actives) or actives[0] >= actives[-1] or actives[-1] != 4:
            failures.append(f"AI flow steps did not advance with scroll: {label} ({flow})")

    if width <= 430 and route == "/":
        # Phones show the live site as the hero visual and leave the floating
        # chat for desktop.
        hero_cards = page.evaluate(
            """() => ({
              site: getComputedStyle(document.querySelector('.hero__float--site')).display,
              chat: getComputedStyle(document.querySelector('.hero__float--chat')).display,
            })"""
        )
        if hero_cards["site"] == "none" or hero_cards["chat"] != "none":
            failures.append(f"Phone hero visual wrong: {label} ({hero_cards})")
        pinned = page.locator(".flow").get_attribute("data-pinned")
        if pinned != "false":
            failures.append(f"AI flow must not pin on phones: {label} ({pinned})")
        full_display = page.locator(".site-header .brand-logo__full").evaluate("el => getComputedStyle(el).display")
        mark_display = page.locator(".site-header .brand-logo__mark").evaluate("el => getComputedStyle(el).display")
        if full_display != "none" or mark_display == "none":
            failures.append(f"Mobile logo variant incorrect: {label}")
        menu = page.locator(".menu-toggle")
        menu.click()
        if menu.get_attribute("aria-expanded") != "true":
            failures.append(f"Mobile menu did not open: {label}")
        page.keyboard.press("Escape")
        if menu.get_attribute("aria-expanded") != "false":
            failures.append(f"Mobile menu did not close with Escape: {label}")
        if width == 375:
            menu.click()
            page.get_by_role("navigation", name="Mobile navigation").get_by_role(
                "link", name="Services", exact=True
            ).click()
            page.wait_for_url("**/services")
            page.get_by_role(
                "heading", name="Websites and AI automation, built around your business."
            ).wait_for(state="visible")
            page.go_back(wait_until="networkidle")
            page.get_by_role("heading", name="Websites that sell. AI that works.").wait_for(state="visible")

    if width == 1440 and route == "/":
        page.get_by_role("link", name="See live work").click()
        # Smooth scrolling over the pinned section takes about a second; read
        # the landing position only once scrolling has actually stopped.
        page.wait_for_function(
            """() => new Promise((resolve) => {
              let last = -1
              const tick = () => {
                if (Math.abs(scrollY - last) < 1) return resolve(true)
                last = scrollY
                setTimeout(tick, 150)
              }
              setTimeout(tick, 150)
            })""",
            timeout=8000,
        )
        if page.url.split("#")[-1] != "work":
            failures.append(f"Live work anchor did not navigate: {label}")
        work_top = page.locator("#work").evaluate("el => Math.round(el.getBoundingClientRect().top)")
        if work_top < 0 or work_top > 140:
            failures.append(f"Live work anchor landed off target: {label} (top={work_top})")
        faq_buttons = page.locator(".faq__item button")
        for index in range(faq_buttons.count()):
            button = faq_buttons.nth(index)
            if button.get_attribute("aria-expanded") != "true":
                button.click()
            if button.get_attribute("aria-expanded") != "true":
                failures.append(f"FAQ button did not expand: {label} item {index}")

    if route == "/" or width in (375, 1440):
        activate_scroll_reveals(page)
        settle_images(page)
        page.screenshot(
            path=str(OUTPUT_DIR / f"{route_name(route)}-{width}x{height}.png"),
            full_page=True,
        )

    if route == "/contact" and width in (375, 1440):
        submit = page.get_by_role("button", name="Request my free review")
        submit.click()
        page.get_by_text("Please enter your name.").wait_for(state="visible")
        controls = page.locator(".form-field input, .form-field select, .form-field textarea, button.form-submit")
        for index in range(controls.count()):
            box = controls.nth(index).bounding_box()
            if box and box["height"] < 44:
                failures.append(f"Touch target below 44px: {label} control {index} ({box['height']})")

def launch(playwright) -> tuple[object, str]:
    """
    Prefer the Chrome installed on this machine over Playwright's bundled
    Chromium, which lags real releases. Chrome 151 began returning a Promise
    from window.scrollTo and broke the site; the bundled build still returned
    undefined, so a full green sweep hid a crash that every visitor would see.
    """
    try:
        return playwright.chromium.launch(headless=True, channel="chrome"), "installed Chrome"
    except Exception:
        return playwright.chromium.launch(headless=True), "bundled Chromium (Chrome not found)"


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    failures: list[str] = []
    browser_messages: list[str] = []
    checked: list[str] = []

    with sync_playwright() as playwright:
        browser, engine = launch(playwright)
        print(f"Running against {engine} {browser.version}")
        for width, height in VIEWPORTS:
            context = browser.new_context(viewport={"width": width, "height": height}, device_scale_factor=1)
            page = context.new_page()

            def on_console(message: ConsoleMessage) -> None:
                if message.type in ("error", "warning"):
                    browser_messages.append(f"{message.type}: {message.text}")

            page.on("console", on_console)
            page.on("pageerror", lambda error: browser_messages.append(f"pageerror: {error}"))
            for route in ROUTES:
                check_page(page, route, width, height, failures)
                checked.append(f"{route} @ {width}x{height}")
            context.close()

        reduced = browser.new_context(viewport={"width": 375, "height": 812}, reduced_motion="reduce")
        reduced_page = reduced.new_page()
        reduced_page.goto(BASE_URL, wait_until="networkidle")
        reduced_page.locator(".hero__line").first.wait_for(state="visible")
        activate_scroll_reveals(reduced_page)
        reduced_state = reduced_page.evaluate(
            """() => ({
              hiddenReveals: [...document.querySelectorAll('[data-reveal]')].filter(el => {
                const style = getComputedStyle(el)
                const box = el.getBoundingClientRect()
                return style.opacity !== '1' || style.animationName !== 'none' ||
                  box.width === 0 || box.height === 0
              }).length,
              heroLines: [...document.querySelectorAll('.hero__line-inner')].map(el => getComputedStyle(el).transform),
              chatHidden: document.querySelectorAll('.chat-demo__slot:not([data-state="shown"])').length,
              flowPinned: document.querySelector('.flow').dataset.pinned,
              flowInactive: document.querySelectorAll('.flow-step:not([data-active="true"])').length,
            })"""
        )
        if reduced_state["hiddenReveals"]:
            failures.append(f"Reduced-motion content hidden or animating: {reduced_state}")
        if any(t not in ("none", "matrix(1, 0, 0, 1, 0, 0)") for t in reduced_state["heroLines"]):
            failures.append(f"Reduced-motion hero title still offset: {reduced_state}")
        if reduced_state["chatHidden"]:
            failures.append(f"Reduced-motion chat demo not fully shown: {reduced_state}")
        if reduced_state["flowPinned"] != "false" or reduced_state["flowInactive"]:
            failures.append(f"Reduced-motion AI flow should be a plain, fully lit list: {reduced_state}")
        reduced_page.screenshot(path=str(OUTPUT_DIR / "home-reduced-motion.png"), full_page=True)
        reduced.close()

        visual = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        visual_page = visual.new_page()
        visual_page.goto(BASE_URL, wait_until="networkidle")
        for name, selector in (
            ("pillars", ".pillars"),
            ("work", ".work"),
            ("steps", ".steps"),
            ("faq", ".faq"),
        ):
            section = visual_page.locator(selector)
            section.scroll_into_view_if_needed()
            visual_page.wait_for_timeout(900)
            section.screenshot(path=str(OUTPUT_DIR / f"home-section-{name}.png"))
        visual.close()

        social = browser.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
        social.goto(f"{BASE_URL}/social-card.svg", wait_until="networkidle")
        social.screenshot(path="public/social-card.png")
        social.close()
        browser.close()

    unique_messages = sorted(set(browser_messages))
    if unique_messages:
        failures.extend(f"Browser console: {message}" for message in unique_messages)

    summary = {
        "engine": engine,
        "checked": checked,
        "viewports": [f"{width}x{height}" for width, height in VIEWPORTS],
        "routes": ROUTES,
        "console_messages": unique_messages,
        "failures": failures,
    }
    (OUTPUT_DIR / "summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
