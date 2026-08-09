# HAYK WEB CO. Website Design Specification

## Product goal

Create a polished marketing website that makes local-service business owners feel understood and moves qualified visitors toward a free website review. The site must communicate trust, mobile competence, local-search fundamentals, speed, and practical lead generation without fabricated proof or developer-heavy language.

## Approved direction: Browser Workshop

The visual thesis is transformation. A bespoke browser-window composition in the homepage hero begins as a rough, low-trust layout and resolves into a finished local-business website. A precise electric-blue build line connects the brand's HW/browser mark to the act of improving a website. Supporting sections stay restrained so this orchestrated hero remains the memorable moment.

## Design system

- Canvas: Warm White `#F7F7F4`
- Ink: Near Black `#0B0D12`
- Signal: Electric Blue `#315CFF`
- Steel: `#5E6574`
- Mist: `#E8EDFF`
- Display: Space Grotesk variable, bold with tight tracking.
- Body: Manrope variable, readable at 16–20 px.
- Utility: system monospace for browser/status labels only.
- Corners: mostly 0–16 px, used according to object meaning rather than uniformly.
- Grid: 12-column desktop, 4-column mobile, capped at 1200 px with full-bleed color fields.

## Experience architecture

Shared sticky navigation and footer frame seven routes: Home, Services, Work, About, Contact, Privacy, and a 404 fallback. Home progresses from promise to pain recognition, services, honest concept work, ordered process, mobile/performance principles, project scopes, FAQ, and a final review CTA. Interior pages provide deeper intent-specific content without duplicating business data outside `src/content/site.ts`.

## Components and behavior

- Header switches between full light-background and white dark-background logo variants and uses a compact monogram on narrow screens.
- Mobile navigation is a keyboard-operable dialog-like panel with focus-safe open/close behavior, Escape support, route-change closing, and scroll locking.
- Hero animation uses Motion transforms and opacity only; reduced-motion visitors see the resolved final state.
- Concept previews are real React/CSS browser compositions for contractor, restaurant, and barber/beauty businesses, always labeled `Demo Concept`.
- Contact form validates required fields client-side and at `api/contact.ts`, includes a hidden honeypot and elapsed-time check, exposes accessible errors, and provides loading/success/error states. Email delivery uses `RESEND_API_KEY` and `CONTACT_TO_EMAIL`; missing configuration returns an honest service-unavailable response while the app remains buildable.

## SEO and deployment

Each route supplies a unique title, description, canonical URL, and social metadata through React Helmet Async. The home route includes accurate ProfessionalService structured data without a fabricated street address. Static robots, sitemap, social image, favicon, and Vercel SPA rewrite configuration are included. Direct route refreshes resolve to `index.html`, while `/api/*` remains serverless.

## Accessibility, performance, and testing

Use semantic landmarks and headings, WCAG AA contrast, visible focus, 44 px touch targets, form labels and live errors, menu state announcements, reduced-motion CSS, lazy route imports, and size-conscious assets. Automated tests cover navigation, core copy/content integrity, form validation, successful and failed submission states, and route fallback. Browser QA covers all routes at 375×812, 430×932, 768×1024, 1440×900, and 1920×1080, checks overflow and console errors, operates the mobile menu and form, and captures screenshots for visual review.

## Content integrity

No fake testimonials, customer logos, customer results, awards, employee claims, project counts, revenue claims, or lorem ipsum. Demo work is presented as design capability, not prior paid engagement.
