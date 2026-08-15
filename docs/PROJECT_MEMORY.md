# HAYK WEB CO. Project Memory

## Current state

The production-ready Browser Workshop marketing site is implemented. It is a responsive Vite/React application with complete interior routes, accessible contact handling, SEO assets, automated tests, and deployment configuration.

## Brand and design decisions

- Exact name: `HAYK WEB CO.`
- Approved palette: electric blue `#315CFF`, near black `#0B0D12`, warm white `#F7F7F4`.
- Direction: sharp Browser Workshop editorial layouts, quiet grids, browser-interface details, and restrained motion.
- Hero signature: an unfinished browser composition resolves into a polished local-business page.
- The header uses full light/dark logos at larger widths and compact marks on mobile.
- Work examples are labeled `Demo Concept`; no clients, results, awards, or statistics are invented.

## Technology

Vite, React, strict TypeScript, Tailwind CSS, React Router DOM, Motion, Lucide React, Vitest, Testing Library, npm, and a Vercel-compatible Web API function. Fonts are self-hosted from reputable `@fontsource-variable` packages.

## Important files

- `src/content/site.ts`: source of truth for business details and reusable content.
- `src/App.tsx`: lazy-loaded routes and shared layout.
- `src/components/BrowserWorkshop.tsx`: interactive hero transformation.
- `src/components/ContactForm.tsx`: accessible contact form states.
- `api/contact.ts`: validation, spam controls, rate limit, and optional Resend delivery.
- `src/styles/index.css`: tokens, responsive layout, focus treatment, and reduced-motion rules.
- `scripts/browser_qa.py`: required viewport and route browser checks.
- `vercel.json`: Vite SPA rewrite, API function support, and security headers.
- `docs/superpowers/specs/2026-08-08-hayk-web-co-design.md`: approved design.
- `docs/superpowers/plans/2026-08-08-hayk-web-co-site.md`: implementation plan.

## Implemented routes

`/`, `/services`, `/work`, `/about`, `/contact`, `/privacy`, plus a custom 404 route.

## Verification — 2026-08-09

- Prettier: all matched files formatted.
- ESLint: exit 0.
- Strict TypeScript: exit 0.
- Vitest: 6 files, 19 tests passed.
- Production build: 2,119 modules transformed; exit 0.
- Browser QA: all seven routes at 375×812, 430×932, 768×1024, 1440×900, and 1920×1080; zero failures and zero console messages.
- Browser checks cover overflow, metadata, canonical URLs, image loading, header alignment, responsive logos/menu, keyboard Escape, form errors, touch targets, and reduced motion.
- Vite development and production preview: Local and Network URLs printed; homepage returned HTTP 200.
- Bootstrap fallback: a blocked or failed JavaScript startup now displays recovery guidance instead of a blank page.
- The homepage is eagerly loaded so first paint does not wait behind a route-level lazy boundary; interior routes remain code-split.
- `npm audit` against the official npm registry: 0 vulnerabilities.

## Blank-page investigation — 2026-08-09

A reported blank white page was investigated against the committed code. The cause was environmental, not a defect:

- The development and production builds both rendered the full homepage in a real Chromium browser at 1440×900 and 1920×1080.
- A stale `vite --host 0.0.0.0` process from an earlier session was still holding port 5173. Stray processes were stopped and one clean server was started.
- A browser tab keeps its title and favicon after the server that fed it is gone, which makes a dead tab look like a broken site.

The boot path was hardened so this failure mode can never present as a blank page again:

- `src/lib/boot.ts` installs `error` and `unhandledrejection` listeners and paints a fixed-position panel with the real error text. Its styles are inline so it stays readable when the stylesheet itself is what failed.
- The panel only takes over when the alternative is a blank page. `reportBootFailure` checks whether `#root` holds anything beyond the boot fallback; once the site is on screen, a late stray error is logged rather than hidden behind a full-screen "failed to start" message. Both directions are covered by tests and were confirmed in a live browser.
- `src/components/AppErrorBoundary.tsx` wraps the router, so a throw inside any section shows a reload prompt instead of emptying `#root`.
- `src/main.tsx` guards the missing-mount case and routes bootstrap throws to the same panel.
- These handlers live in bundled modules rather than an inline `<script>`. The `script-src 'self'` directive in `vercel.json` allows no inline scripts and no hashes, so an inline handler would work in local preview and be silently blocked in production.
- `src/test/boot-failure.test.tsx` covers the boundary, the panel, and duplicate suppression. The panel was also confirmed in a live browser by throwing after boot.
- The existing 1.5s CSS `.boot-fallback` in `index.html` is unchanged; it still covers the case where the JavaScript module never executes at all.

### Verification after the change

- Prettier, ESLint, and strict TypeScript: exit 0.
- Vitest: 7 files, 24 tests passed.
- Production build: exit 0.
- Browser QA: all seven routes at all five viewports; zero failures and zero console messages.

## Chrome 151 crash — 2026-08-09

`SiteLayout` scrolled to the top on every route change with a concise-arrow effect:

```ts
useEffect(() => window.scrollTo({ top: 0, behavior: 'instant' }), [pathname])
```

Chrome 151 began returning a Promise from `window.scrollTo`. The concise arrow returned that Promise to React as the effect's cleanup, React called it, and `TypeError: destroy is not a function` took down the entire layout on first paint. Every page was affected.

The effect now has a braced body, as does the same shape in `Header`. Three things were added so the class of bug cannot recur:

- `no-restricted-syntax` in `eslint.config.js` rejects any `useEffect`/`useLayoutEffect` written with a concise-arrow body.
- `src/test/scroll-restore.test.tsx` mocks `window.scrollTo` to return a Promise and asserts the homepage still renders. Confirmed to fail with the old code and pass with the fix.
- `scripts/browser_qa.py` now launches the Chrome installed on the machine (`channel="chrome"`) and falls back to bundled Chromium only when Chrome is absent. It prints and records the engine in `summary.json`.

That last point is the real lesson: the bundled Chromium lagged the real release, so a fully green 35-combination sweep hid a crash that every visitor with a current Chrome would hit. Browser QA must run against a current browser to mean anything.

The error boundary added earlier did its job here — it surfaced the exact `TypeError` on screen instead of a blank page, which is how the bug was located.

### Verification after the fix

- Prettier, ESLint (with the new rule), and strict TypeScript: exit 0.
- Vitest: 8 files, 25 tests passed.
- Browser QA against installed Chrome 151.0.7922.76: all seven routes at all five viewports; zero failures and zero console messages.
- Manual pass in Chrome 151: homepage plus navigation through every route with no crash panel and an empty console.

## Contact and deployment

The endpoint sends through Resend when these production variables are configured: `RESEND_API_KEY` and `CONTACT_TO_EMAIL`; `CONTACT_FROM_EMAIL` is optional. No secrets or submissions are stored in the repository. Local Vite shows a friendly explanation because it does not emulate the production function runtime.

Vercel configuration is ready, but the site is not deployed because no authenticated hosting target was provided. Before launch, confirm the assumed canonical domain `https://haykwebco.com` and the assumed public email `hello@haykwebco.com` in `src/content/site.ts`.

## Known limitation

The supplied logos were reference images rather than standalone vector files. Faithful deterministic SVG variants were reconstructed from those references. Replace them with the original production vector exports if exact source artwork becomes available.

## Next recommended action

Confirm the domain/email, add the contact environment variables in the hosting dashboard, deploy, and complete one live submission test.
