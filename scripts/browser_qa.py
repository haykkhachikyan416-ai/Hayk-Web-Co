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
        hidden_reveals = page.locator('[data-reveal="true"]').evaluate_all(
            """els => els.filter(el => {
              const style = getComputedStyle(el)
              const box = el.getBoundingClientRect()
              return style.opacity === '0' || style.display === 'none' ||
                style.visibility === 'hidden' || box.width === 0 || box.height === 0
            }).length"""
        )
        if hidden_reveals:
            failures.append(f"Homepage reveals started hidden: {label} ({hidden_reveals})")
        if page.locator(".home-hero__title-line").count() != 3:
            failures.append(f"Hero title treatment missing: {label}")
        clipped_hero_lines = page.locator(".home-hero__title-line").evaluate_all(
            "els => els.filter(el => { const box = el.getBoundingClientRect(); return box.left < -1 || box.right > window.innerWidth + 1 }).length"
        )
        if clipped_hero_lines:
            failures.append(f"Hero title clipped by viewport: {label} ({clipped_hero_lines})")
        if page.locator(".workshop-beam").count() != 1:
            failures.append(f"Workshop beam missing: {label}")

    if width == 1440 and route == "/":
        stage = page.locator(".workshop-stage")
        frame = page.locator(".workshop-window")
        box = stage.bounding_box()
        page.wait_for_timeout(1100)
        transform_before = frame.evaluate("el => getComputedStyle(el).transform")
        if box:
            page.mouse.move(box["x"] + box["width"] * 0.82, box["y"] + box["height"] * 0.24)
            page.wait_for_timeout(250)
            transform_after = frame.evaluate("el => getComputedStyle(el).transform")
            if transform_after == transform_before:
                failures.append(f"Workshop pointer tilt did not respond: {label}")
            page.mouse.move(0, 0)
        page.keyboard.press("Tab")
        active_text = page.evaluate("document.activeElement?.textContent?.trim()")
        skip_box = page.locator(".skip-link").bounding_box()
        if active_text != "Skip to content" or not skip_box or skip_box["width"] < 40:
            failures.append(f"Skip link was not keyboard-visible: {label}")
        page.evaluate("document.activeElement?.blur()")

    if width <= 430 and route == "/":
        page.wait_for_timeout(1100)
        mobile_workshop = page.locator(".workshop-window").evaluate(
            "el => ({ transform: getComputedStyle(el).transform, perspective: getComputedStyle(el.parentElement).perspective })"
        )
        if mobile_workshop["transform"] != "none" or mobile_workshop["perspective"] != "none":
            failures.append(f"Mobile workshop depth was not disabled: {label} ({mobile_workshop})")
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
                "heading", name="Website services built around your business."
            ).wait_for(state="visible")
            page.go_back(wait_until="networkidle")
            page.get_by_role(
                "heading", name="Websites that turn local attention into real customers."
            ).wait_for(state="visible")

    if width == 1440 and route == "/":
        scope_link = page.get_by_role("link", name="See project scopes")
        scope_link.click()
        if page.url.split("#")[-1] != "project-scope":
            failures.append(f"Project scope anchor did not navigate: {label}")
        faq_buttons = page.locator(".faq-item button")
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
        reduced_page.locator(".workshop-window").wait_for(state="visible")
        activate_scroll_reveals(reduced_page)
        reduced_state = reduced_page.evaluate(
            """() => ({
              hiddenReveals: [...document.querySelectorAll('[data-reveal="true"]')].filter(el => {
                const style = getComputedStyle(el)
                const box = el.getBoundingClientRect()
                return style.opacity === '0' || style.display === 'none' ||
                  style.visibility === 'hidden' || box.width === 0 || box.height === 0
              }).length,
              workshopTransform: getComputedStyle(document.querySelector('.workshop-window')).transform,
              finishedClip: getComputedStyle(document.querySelector('.workshop-canvas--finished')).clipPath,
              processTransform: getComputedStyle(document.querySelector('.process-progress > span')).transform,
              finalBeamTransform: getComputedStyle(document.querySelector('.final-cta__line')).transform,
            })"""
        )
        if reduced_state["hiddenReveals"]:
            failures.append(f"Reduced-motion content hidden: {reduced_state}")
        if reduced_state["workshopTransform"] != "none":
            failures.append(f"Reduced-motion workshop still transformed: {reduced_state}")
        if "100%" in reduced_state["finishedClip"]:
            failures.append(f"Reduced-motion finished workshop stayed clipped: {reduced_state}")
        if reduced_state["processTransform"] == "none":
            failures.append(f"Reduced-motion process line had no resolved scale: {reduced_state}")
        if reduced_state["finalBeamTransform"] == "none":
            failures.append(f"Reduced-motion final beam lost its diagonal: {reduced_state}")
        reduced_page.screenshot(path=str(OUTPUT_DIR / "home-reduced-motion.png"), full_page=True)
        reduced.close()

        visual = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        visual_page = visual.new_page()
        visual_page.goto(BASE_URL, wait_until="networkidle")
        for name, selector in (
            ("services", ".home-services"),
            ("why", ".why-section"),
            ("work", ".work-section"),
            ("performance", ".performance-section"),
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
