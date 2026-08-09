# HAYK WEB CO. Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify the complete Browser Workshop website for HAYK WEB CO.

**Architecture:** A Vite SPA lazy-loads route pages inside one accessible layout. Editable business data lives in `src/content/site.ts`; shared visual and behavioral components consume it. A Vercel-compatible serverless function validates and sends contact requests, while static metadata and rewrite files support discovery and direct-route navigation.

**Tech Stack:** Vite, React, strict TypeScript, Tailwind CSS, React Router DOM, Motion, Lucide React, React Helmet Async, Vitest, Testing Library, npm.

## Global Constraints

- Exact brand name: `HAYK WEB CO.` and exact primary colors `#315CFF`, `#0B0D12`, `#F7F7F4`.
- Use only necessary reputable packages from the official npm registry and preserve `package-lock.json`.
- Do not fabricate customers, testimonials, results, awards, statistics, employees, or experience claims.
- `npm run dev` and `npm run preview` expose the server on `0.0.0.0:5173`.
- Meet accessibility, reduced-motion, responsive, SEO, honest-content, and direct-route requirements in the approved spec.

---

### Task 1: Toolchain, memory, and brand foundations

**Files:** Create `package.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `.prettierrc.json`, `index.html`, `src/styles/index.css`, `public/brand/*.svg`, and `public/favicon.svg`.

**Interfaces:** Produces npm scripts `dev`, `build`, `preview`, `lint`, `typecheck`, `test`, and `format`; produces CSS tokens and responsive layout utilities consumed everywhere.

- [ ] Add exact official-registry dependency names and install with npm to create `package-lock.json`.
- [ ] Configure strict TypeScript, Vite host/port, Tailwind's Vite integration, Vitest/jsdom, ESLint, and Prettier.
- [ ] Create deterministic full-logo and monogram SVG variants using the supplied geometry and colors.
- [ ] Run `npm run typecheck` and `npm audit`; expect successful typecheck and an honest audit report.
- [ ] Commit the independently working foundation.

### Task 2: Content model, routing, SEO, and shared layout

**Files:** Test `src/test/app.test.tsx`; create `src/content/site.ts`, `src/lib/seo.ts`, `src/components/Seo.tsx`, `src/components/layout/Header.tsx`, `Footer.tsx`, `SiteLayout.tsx`, `src/App.tsx`, and `src/main.tsx`.

**Interfaces:** `site` exports typed navigation, service, project, scope, FAQ, contact, and service-area data; `Seo` accepts `{ title, description, path, image? }`; `SiteLayout` renders nested routes.

- [ ] Write tests requiring all routes, accessible navigation, honest demo labels, and the custom 404.
- [ ] Run `npm test -- src/test/app.test.tsx`; expect failure because application modules do not exist.
- [ ] Implement the typed content model, lazy route shell, page metadata helper, header/mobile menu, and footer.
- [ ] Re-run the test; expect the route and navigation assertions to pass.
- [ ] Commit the routable shell.

### Task 3: Homepage and reusable Browser Workshop components

**Files:** Test `src/test/home.test.tsx`; create `src/components/ui/*`, `src/components/sections/*`, `src/components/BrowserWorkshop.tsx`, `src/components/ConceptBrowser.tsx`, and `src/pages/HomePage.tsx`.

**Interfaces:** `BrowserWorkshop` has no required props and resolves immediately under reduced motion; `ConceptBrowser` consumes one typed concept entry; common buttons consume internal `to` or external `href` targets.

- [ ] Write tests for the headline, both CTAs, required homepage sections, four process steps, project labels, and FAQ buttons.
- [ ] Run the focused test; expect missing-section failures.
- [ ] Implement all homepage sections, semantic structure, accordion behavior, hero transformation, and responsive styling.
- [ ] Re-run the focused and full test suites; expect all assertions to pass.
- [ ] Commit the complete homepage.

### Task 4: Interior routes and contact experience

**Files:** Test `src/test/contact.test.tsx`; create `src/pages/ServicesPage.tsx`, `WorkPage.tsx`, `AboutPage.tsx`, `ContactPage.tsx`, `PrivacyPage.tsx`, `NotFoundPage.tsx`, `src/components/ContactForm.tsx`, `src/lib/contact.ts`, `api/contact.ts`, and `.env.example`.

**Interfaces:** `validateContact(values)` returns `Partial<Record<keyof ContactValues,string>>`; the form posts JSON to `/api/contact`; the endpoint accepts POST JSON and returns `{ ok: boolean, message: string }`.

- [ ] Write tests for required validation, invalid email, honeypot exclusion, loading, success, and API-error states.
- [ ] Run the focused test; expect failures because validation and form modules do not exist.
- [ ] Implement validation, form state, server validation, spam controls, optional Resend delivery, and all interior page content.
- [ ] Re-run focused and full tests; expect all assertions to pass.
- [ ] Commit routes and contact handling.

### Task 5: Static SEO, social assets, deployment, and documentation

**Files:** Create `public/robots.txt`, `public/sitemap.xml`, `public/social-card.svg`, `vercel.json`, and update `README.md`, `docs/PROJECT_MEMORY.md`.

**Interfaces:** Vercel routes `/api/*` to functions and rewrites other unmatched paths to `/index.html`; README documents email variables and local-network access.

- [ ] Add accurate crawl rules, the editable canonical base URL `https://haykwebco.com` centralized in content, structured-data values, social artwork, and SPA rewrites.
- [ ] Document `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` without storing secrets.
- [ ] Update memory to reflect the completed implementation and pending QA.
- [ ] Run formatting, lint, typecheck, tests, and build; expect zero project errors.
- [ ] Commit deployment readiness.

### Task 6: Browser QA, audit, review, and final memory

**Files:** Create `scripts/browser_qa.py`; modify only files implicated by QA; update `docs/PROJECT_MEMORY.md`.

**Interfaces:** Browser script starts against `http://127.0.0.1:5173`, records console/page errors, visits every route, measures document overflow, tests the mobile menu and contact validation, and saves viewport screenshots under `test-results/qa/`.

- [ ] Run the webapp-testing server helper with the QA script at 375×812, 430×932, 768×1024, 1440×900, and 1920×1080.
- [ ] Inspect screenshots and recorded results, then fix every project-caused console, interaction, contrast, layout, overflow, or content issue.
- [ ] Re-run browser QA until it reports every route and viewport passing.
- [ ] Run `npm run format`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm audit`, and start `npm run preview` to verify Local/Network output.
- [ ] Perform a requirements-based code review, update memory with exact evidence and blockers, and commit the verified result.
