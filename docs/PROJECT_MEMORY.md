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
- Vitest: 5 files, 17 tests passed.
- Production build: 2,119 modules transformed; exit 0.
- Browser QA: all seven routes at 375×812, 430×932, 768×1024, 1440×900, and 1920×1080; zero failures and zero console messages.
- Browser checks cover overflow, metadata, canonical URLs, image loading, header alignment, responsive logos/menu, keyboard Escape, form errors, touch targets, and reduced motion.
- Vite development and production preview: Local and Network URLs printed; homepage returned HTTP 200.
- `npm audit` against the official npm registry: 0 vulnerabilities.

## Contact and deployment

The endpoint sends through Resend when these production variables are configured: `RESEND_API_KEY` and `CONTACT_TO_EMAIL`; `CONTACT_FROM_EMAIL` is optional. No secrets or submissions are stored in the repository. Local Vite shows a friendly explanation because it does not emulate the production function runtime.

Vercel configuration is ready, but the site is not deployed because no authenticated hosting target was provided. Before launch, confirm the assumed canonical domain `https://haykwebco.com` and the assumed public email `hello@haykwebco.com` in `src/content/site.ts`.

## Known limitation

The supplied logos were reference images rather than standalone vector files. Faithful deterministic SVG variants were reconstructed from those references. Replace them with the original production vector exports if exact source artwork becomes available.

## Next recommended action

Confirm the domain/email, add the contact environment variables in the hosting dashboard, deploy, and complete one live submission test.
