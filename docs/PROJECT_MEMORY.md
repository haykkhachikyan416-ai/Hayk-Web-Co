# HAYK WEB CO. Project Memory

## Current state

The production-ready marketing site is implemented with the Electric Editorial homepage direction. It is a responsive Vite/React application with complete interior routes, accessible contact handling, SEO assets, automated tests, deployment configuration, and browser-tested motion behavior.

## Brand and design decisions

- Exact name: `HAYK WEB CO.`
- Approved palette: electric blue `#315CFF`, near black `#0B0D12`, warm white `#F7F7F4`.
- Direction: Electric Editorial - sharp asymmetric layouts, quiet technical grids, dimensional browser-interface details, and restrained motion.
- Hero signature: an unfinished browser composition resolves into a polished local-business page while one electric-blue build beam connects the transformation to the final CTA.
- The header uses full light/dark logos at larger widths and compact marks on mobile.
- Work examples are labeled `Demo Concept`; no clients, results, awards, or statistics are invented.

## Technology

Vite, React, strict TypeScript, Tailwind CSS, React Router DOM, Motion, Lucide React, Vitest, Testing Library, npm, and a Vercel-compatible Web API function. Fonts are self-hosted from reputable `@fontsource-variable` packages.

## Important files

- `src/content/site.ts`: source of truth for business details and reusable content.
- `src/App.tsx`: lazy-loaded routes and shared layout.
- `src/components/BrowserWorkshop.tsx`: interactive hero transformation.
- `src/components/ui/Reveal.tsx`: fail-open in-view polish; content never starts visually hidden.
- `src/components/ContactForm.tsx`: accessible contact form states.
- `api/contact.ts`: validation, spam controls, rate limit, and optional Resend delivery.
- `src/styles/index.css`: tokens, responsive layout, focus treatment, and reduced-motion rules.
- `scripts/browser_qa.py`: required viewport and route browser checks.
- `vercel.json`: Vite SPA rewrite, API function support, and security headers.
- `docs/superpowers/specs/2026-08-08-hayk-web-co-design.md`: approved design.
- `docs/superpowers/plans/2026-08-08-hayk-web-co-site.md`: implementation plan.
- `docs/superpowers/specs/2026-08-15-homepage-electric-editorial-design.md`: approved Electric Editorial homepage design.
- `docs/superpowers/plans/2026-08-15-homepage-electric-editorial.md`: test-first redesign plan.

## Implemented routes

`/`, `/services`, `/work`, `/about`, `/contact`, `/privacy`, plus a custom 404 route.

## Electric Editorial homepage - 2026-08-15

The homepage retains its original conversion story and business facts, but now carries a more distinctive visual system from the hero through the final CTA.

- The hero headline is split into three visual rows while keeping the original accessible heading name. The final row uses electric blue as the sole headline accent.
- The three hero rows and accessible heading are generated from the same `site.hero.titleLines` source, so content edits cannot make them diverge.
- `BrowserWorkshop` adds a diagonal blue build beam, stronger depth, a rough-to-ready label, and mobile/reduced-motion containment.
- Editorial status labels are real `aria-hidden` elements, and the hero is explicitly marked `Demo Concept / Local Service` so decoration never implies active client work.
- Pain, services, why, demo work, process, performance, scopes, FAQ, and final CTA share a deliberate grid, depth, and motion vocabulary without adding dependencies or unsupported claims.
- Reveal wrappers use `initial={false}` and light in-view keyframes. This fixes the former failure mode where off-screen sections appeared blank in full-page screenshots before IntersectionObserver activation.
- Homepage board styling is scoped to `.work-section`; an early QA pass caught a global negative-inset outline widening the separate `/work` route by six pixels on mobile.
- Browser QA now fails when a homepage reveal is hidden or has no layout box, the split headline is missing or clipped by the viewport, or the workshop beam is absent.
- The 375 px headline deliberately wraps inside its visual rows; it no longer clips behind the hero's overflow boundary.
- Fine-pointer tilt is disabled below 521 px, and reduced-motion QA verifies the fully resolved workshop, process rail, and diagonal final beam.
- The existing mobile-menu rotation test now wraps its media-query callback in React `act`, removing the suite's prior state-update warning.

### Verification

- Prettier wrote all files with no remaining changes.
- ESLint and strict TypeScript exited 0.
- Vitest: 12 files, 49 tests passed with no warnings.
- Production build: 2,125 modules transformed; exit 0.
- Browser QA against installed Chrome 151.0.7922.138: all seven routes at 375x812, 430x932, 768x1024, 1440x900, and 1920x1080; zero failures and zero console messages.
- `npm audit`: 0 vulnerabilities.

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

## Vercel Web Analytics — 2026-08-14

`@vercel/analytics` is mounted in `src/App.tsx` beside the router.

- Import from `@vercel/analytics/react`, **not** `/next`. Vercel's setup page shows Next.js instructions; this is a Vite SPA.
- Auto-tracking follows React Router navigations by itself, so no `route`/`path` props are needed.
- In production the beacon is same-origin (`/_vercel/insights/script.js`), which the strict `script-src 'self'` CSP in `vercel.json` already permits. No CSP change was required.
- The component is rendered only when `import.meta.env.PROD` is true. That beacon exists solely on a Vercel deployment, so mounting it elsewhere injects a tag that 404s on every page load. Setting `mode="development"` is **not** the alternative: that path loads `va.vercel-scripts.com`, which the CSP blocks and which would send local browsing to an external host.
- `vite preview` sets `PROD`, so it also mounts analytics and shows the same 404 against localhost. That is expected. The browser QA sweep runs against the dev server, where nothing is injected, so its console check stays meaningful.

Verified in Chrome 151: the dev server logs no analytics request at all, the production bundle still contains the tracking code for Vercel, and the QA sweep passes 35 route/viewport combinations with an empty console.

## FormSubmit delivery — 2026-08-14

`FORMSUBMIT_TARGET` is now the first-choice provider, ahead of Web3Forms and Resend. It needs no account and no key — just the receiving address, POSTed to `https://formsubmit.co/ajax/<target>`.

Two behaviors of that API were verified against the live endpoint and both defeat the obvious implementation:

- It answers **HTTP 200 even when it refuses the submission**, so `response.ok` is not a delivery signal.
- It reports status as the **string** `"true"`/`"false"`, and the non-empty string `"false"` is truthy in JavaScript. A plain `if (payload.success)` would tell customers their message was sent while nothing was delivered.

The handler therefore compares `success` against both `true` and `'true'` explicitly. A test asserts the `"false"` case returns 502; it was confirmed to fail when the check is replaced with `Boolean(payload?.success)`.

Other details: `_captcha: 'false'` is required because reCAPTCHA would otherwise block a server-to-server POST, and `_replyto` carries the visitor's address so replies reach the customer. Activation is a real operational step — FormSubmit swallows the first submission and emails an "Activate Form" link, so the form does not work until that link is clicked.

The API tests now issue a distinct `x-forwarded-for` per request. The handler's rate limiter keeps module-level state that persists across tests, so a shared IP made later tests fail with 429 depending on execution order.

## Zero-setup email delivery — 2026-08-14

Resend needs an account plus DNS records on a verified domain before mail reliably reaches an inbox, which was too much setup for a first launch. `api/contact.ts` now supports Web3Forms as a first-choice provider and keeps Resend as a fallback.

- `WEB3FORMS_ACCESS_KEY` alone is enough to deliver. No account, no domain, no DNS.
- Web3Forms sends from its own SPF/DKIM-aligned domain, so deliverability does not depend on a new domain's sending reputation. That is what keeps notifications out of spam.
- The visitor's address is sent as `replyto`, so replying to a notification reaches the customer.
- Provider selection: Web3Forms when its key is present, otherwise Resend when both `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are set, otherwise an honest 503.
- The Web3Forms access key is designed to be publicly visible, but it is still read from a server-only variable here so it never enters the browser bundle.

Every spam control is provider-independent and unchanged: honeypot, minimum fill time, per-IP rate limit, body-size cap, and server-side revalidation. A honeypot hit returns success without contacting any mail service, which is covered by a test.

## Line endings — 2026-08-14

`core.autocrlf=true` is set on this machine, so a checkout rewrote the whole working tree to CRLF while Prettier's `endOfLine` default expects LF. `npm run format:check` then failed on 57 files nobody had edited. A `.gitattributes` with `* text=auto eol=lf` pins the working tree to LF and keeps the check meaningful; binary assets are marked so they are never converted.

## Contact endpoint was dead in production — 2026-08-19

**Every submission to `/api/contact` on the live deployment was failing**, and had been since
launch. Probing `hayk-web-co.vercel.app` showed two symptoms:

- Every `POST` returned HTTP 500 `FUNCTION_INVOCATION_FAILED`, regardless of payload —
  including the honeypot path, which returns at line 60 before any environment variable is
  read. So the crash was not in the business logic and not a missing provider key.
- `GET` did not return 405. It hung until the gateway gave up.

Cause: `api/contact.ts` has the Web signature `(request: Request) => Response`, which is the
**Edge** runtime's contract, but the file declared no runtime, so Vercel used the default
**Node** runtime and called it as `(req, res)`. Node's `req.headers` is a plain object with
no `.get`, so `request.headers.get('content-length')` threw on every POST; and returning a
`Response` writes nothing to Node's `res`, so GET was never answered. The two symptoms look
unrelated but have one cause.

Fix: `export const config = { runtime: 'edge' }`. Do not remove it.

Consequences worth knowing:

- Local tests never caught this. Vitest calls the handler directly with a real Web `Request`,
  which is the Edge shape — so the suite was green against a production endpoint that was
  100% broken. A passing `contact-api.test.ts` says nothing about the deployed runtime.
- `resend` is now imported with a dynamic `await import()` inside its own branch rather than
  at the top of the file. It ships no edge export condition and pulls Node built-ins; a
  top-level import risks failing at module load and taking down _every_ request, including
  the FormSubmit path that never touches it.
- **Confirmed after deploying: no mail provider is configured.** With the runtime fixed, the
  503 branch became reachable for the first time and a live submission returned
  `{"ok":false,"message":"Email is not configured yet."}`. Nothing was sent — that branch
  returns before contacting any provider. So the endpoint now _runs_ correctly but still
  delivers nowhere. Set one of `FORMSUBMIT_TARGET`, `WEB3FORMS_ACCESS_KEY`, or the
  `RESEND_API_KEY` + `CONTACT_TO_EMAIL` pair in the Vercel dashboard, redeploy, and submit
  once. If FormSubmit is chosen, its activation link must be clicked before anything is
  delivered — until then it answers HTTP 200 with `{"success":"false"}`, which the handler
  correctly reports as a 502 rather than a false success.
- Verified live after deploy: `GET /api/contact` returns 405 with `Allow: POST` (it used to
  hang), and a honeypot POST returns 200 without contacting any provider (it used to be a
  500). Both were failing before the runtime fix.

## Quote-request friction pass — 2026-08-19

The contact form required seven fields. It now requires three things: a name, one way to
reply, and a sentence about the work.

- `validateContact` in `src/lib/contact.ts` is the single source of truth for both the browser
  and the server, so relaxing it in one place moved both together.
- Email and phone are individually optional but **jointly required**. That error belongs to
  the pair, not to either input, so `ContactErrors` gained a non-field `contactMethod` key and
  the two inputs share one message. A malformed value in either is still rejected — a typo in
  the only reply route means the answer never arrives.
- Business name, business type, main goal, budget, and current website are all optional and
  live in a closed `<details>` disclosure. Submitting with an error inside it forces it open,
  or the message would be announced but invisible.
- `QuickQuoteForm` in the hero posts to the same endpoint with `source: 'quick-quote-hero'`;
  the full form sends `contact-page`. One combined "email or phone" field keeps it to three
  inputs, split by `splitContactMethod`. The existing "Free website review" CTAs are unchanged.
- Optional answers left blank now travel as `Not provided` and the subject falls back to the
  person's name, so a fast-path lead cannot email a dangling `Budget:` or a subject that
  trails off after the dash. `_replyto`/`replyto` is **omitted entirely** for a phone-only
  lead — FormSubmit rejects a submission carrying an empty one.
- `site.responsePromise` carries the one-line commitment reused beside every CTA. It promises
  response time and no mailing list only; no testimonials, logos, ratings, or client claims
  were added, and the `Demo Concept` labelling is untouched.

Two contrast bugs were caught by measuring rather than by eye, both introduced by this work:
the hero sets `color: var(--paper)` for its dark background, which the new white quick-quote
card inherited (white-on-white title and labels), and `--steel` on the near-black CTA
backgrounds reached only 3.3:1. Both now measure ≥ 4.5:1; the worst new value on the site is
5.01:1.

### Verification

- Prettier, ESLint, strict TypeScript: exit 0. `npm audit`: 0 vulnerabilities.
- Vitest: 13 files, 65 tests passed (was 49).
- Production build: exit 0.
- Browser QA: all seven routes at 375x812, 430x932, 768x1024, 1440x900, 1920x1080 — zero
  failures, zero console messages.
- Both submit flows driven end to end in a real browser at 1440x900 and 390x844, with
  `/api/contact` intercepted: hero quick-quote and full contact form each reach an explicit
  confirmation naming the one-business-day response; a 500 shows a visible error with a
  direct contact route; submitting with no reply route is blocked and never calls fetch; a
  phone number alone is accepted. No horizontal overflow at either width.
- Not verified: live end-to-end delivery, which needs the runtime fix deployed and the
  provider variables confirmed. See the section above.

## Contact delivery is live — 2026-08-20

Confirmed working end to end against the deployment. Getting there took three
independent fixes, and the second one is the trap worth remembering.

1. **Edge runtime** (above) — the function crashed on every request.
2. **A provider variable** — with the runtime fixed, the 503 branch became
   reachable and reported that no mail provider was configured. `FORMSUBMIT_TARGET`
   was then set in Vercel.
3. **Referer and Origin headers** — still refused. With the provider's own reason
   surfaced, FormSubmit was answering:

   > "Make sure you open this page through a web server, FormSubmit will not work
   > in pages browsed as HTML files."

   A server-to-server fetch sends neither header, so FormSubmit concluded the
   submission came from a page opened off the local filesystem. **It returns that
   refusal as HTTP 200 with `{"success":"false"}` — byte-identical in shape to an
   unactivated form.** So the symptom pointed at the activation link, which had
   already been clicked, and clicking it again changed nothing. Only after both
   headers were added did FormSubmit register the form and send a real activation
   email. Both are taken from the incoming request, so previews and a future custom
   domain each present their own origin.

The provider's reason is no longer returned to the browser — it is operator
information and goes to the function logs via `console.error`. A live submission
now returns 200 and the notification arrives.

Debugging note: a plain 502 for all three providers made this nearly unfindable
from the outside. If delivery ever breaks again, temporarily echoing the provider
reason is what turns a guess into an answer.

## Launched client work — 2026-08-20

The site now shows two real, live client sites alongside the demo concepts:
HouseGlass LA (`houseglassla.com`) and LA Glass (`laglass.org`), both Los Angeles
glass installers.

- `site.projects` is a separate array and a separate `Project` type from
  `concepts`/`Concept`, and `ProjectShowcase` is a separate component from
  `ConceptBrowser`. That separation is deliberate: the two carry opposite claims,
  and a shared type or component would make it easy for a future edit to put a
  `Demo Concept` pill on real work or drop it from a concept.
- Real screenshots live in `public/work/*.webp`, captured at 1440x900 @2x and
  cropped to a 16:10 band. Re-capture if either client redesigns.
- Every statement about these projects is checkable against the live site — name,
  business, what the site contains. No metrics, outcomes, rankings, or
  testimonials: none can be evidenced, and the concepts' credibility depends on
  the real work staying equally plain. `src/test/app.test.tsx` enforces this with
  a regex guard over the rendered page (percentages, ROI, "increased sales/leads",
  "#1"), verified to catch real claims and to not false-positive on ordinary copy.
- Both cards open the live site in a new tab from the screenshot and the name.
- The cards live on two dark backgrounds (`/work` and the homepage board), so the
  on-dark text tones are the component's default rather than an override scoped to
  one page. Scoping them to the homepage was the bug this replaced: `/work` fell
  back to `--steel` and measured 3.25:1. Worst value is now 8.16:1.

`scripts/browser_qa.py` counted `!image.complete || naturalWidth === 0` as broken,
which conflates "has not started loading" with "failed". Lazy images below the
fold are never complete, the reveal scroll passes them too fast to trigger a fetch,
and returning to the top puts them out of range — so they never load and the sweep
failed on good artwork. `settle_images` now promotes unfinished images to eager
before waiting, and the metric flags only images that finished with zero pixels.
Confirmed the corrected check still detects a genuinely missing file.

### Verification

- Prettier, ESLint, strict TypeScript: exit 0. `npm audit`: 0 vulnerabilities.
- Vitest: 13 files, 69 tests passed.
- Production build: exit 0.
- Browser QA against installed Chrome: all seven routes at five viewports; zero
  failures, zero console messages.
- Work cards checked at 1440x900 and 390x844: two `Live site` pills, three
  `Demo Concept` pills, both screenshots decoded, both outbound links
  `target="_blank"` with `rel="noopener"`, no horizontal overflow.
- Live contact submission returned 200 and the email was received.

## Contact and deployment

The endpoint sends through Resend when these production variables are configured: `RESEND_API_KEY` and `CONTACT_TO_EMAIL`; `CONTACT_FROM_EMAIL` is optional. No secrets or submissions are stored in the repository. Local Vite shows a friendly explanation because it does not emulate the production function runtime.

Vercel configuration is ready, but the site is not deployed because no authenticated hosting target was provided. Before launch, confirm the assumed canonical domain `https://haykwebco.com` and the assumed public email `hello@haykwebco.com` in `src/content/site.ts`.

## Known limitation

The supplied logos were reference images rather than standalone vector files. Faithful deterministic SVG variants were reconstructed from those references. Replace them with the original production vector exports if exact source artwork becomes available.

## Next recommended action

Contact delivery is confirmed working, so the launch checklist is down to the
assumed domain `https://haykwebco.com`: confirm it, then update `site.siteUrl`,
`public/robots.txt`, and `public/sitemap.xml` together. Re-capture the screenshots
in `public/work` if either client site is redesigned.
