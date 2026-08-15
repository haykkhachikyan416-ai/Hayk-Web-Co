from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import ConsoleMessage, Page, sync_playwright


BASE_URL = "http://127.0.0.1:5173"
ROUTES = ["/", "/services", "/work", "/about", "/contact", "/privacy", "/not-a-real-route"]
VIEWPORTS = [(375, 812), (430, 932), (768, 1024), (1440, 900), (1920, 1080)]
OUTPUT_DIR = Path("test-results/qa")


def route_name(route: str) -> str:
    return "home" if route == "/" else route.strip("/").replace("/", "-")


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
          brokenImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).length,
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

    if width == 1440 and route == "/":
        page.keyboard.press("Tab")
        active_text = page.evaluate("document.activeElement?.textContent?.trim()")
        skip_box = page.locator(".skip-link").bounding_box()
        if active_text != "Skip to content" or not skip_box or skip_box["width"] < 40:
            failures.append(f"Skip link was not keyboard-visible: {label}")
        page.evaluate("document.activeElement?.blur()")

    if width <= 430 and route == "/":
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
