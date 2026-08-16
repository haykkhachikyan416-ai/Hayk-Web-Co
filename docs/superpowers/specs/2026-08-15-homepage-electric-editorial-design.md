# HAYK WEB CO. Electric Editorial Homepage Design

## Goal

Elevate the existing homepage into a more distinctive, premium, and animated expression of HAYK WEB CO. while preserving its truthful business content, conversion path, approved logo, and interior-page behavior.

The homepage continues to serve one job: persuade local service-business owners that HAYK WEB CO. understands how customers judge a business online and move qualified visitors toward a free website review.

## Approved direction

The approved direction is **Electric Editorial**. It retains the existing near-black, warm-white, and electric-blue palette, but gives the page a stronger point of view through oversized typography, dimensional browser compositions, asymmetric editorial layouts, and a single blue “build beam” that visually connects the brand mark, website transformation, and final call to action.

The current homepage section order and factual content remain intact. Copy may be tightened only where necessary for visual composition, without adding unsupported claims.

## Visual system

- Ink: Near Black `#0B0D12`
- Canvas: Warm White `#F7F7F4`
- Signal: Electric Blue `#315CFF`
- Signal Light: `#E8EDFF`
- Steel: `#707789`
- Grid Line Dark: `rgba(247, 247, 244, 0.055)`
- Grid Line Light: `rgba(11, 13, 18, 0.07)`
- Display type: Space Grotesk Variable, used with tight tracking and compact leading.
- Body type: Manrope Variable for readable explanatory copy.
- Utility type: system monospace for coordinates, browser chrome, status labels, and truthful metadata.
- Corners remain purposeful: browser objects and controls may be subtly rounded; editorial panels and section boundaries stay sharp.

## Homepage treatment

### Header and hero

The header remains structurally unchanged and keeps the approved logo behavior. The hero becomes a near-full-viewport editorial stage. The headline and CTA occupy the left side on wide screens while an enlarged, slightly tilted Browser Workshop composition breaks the right grid edge. A faint technical grid sits behind both.

The hero’s browser transformation remains the signature interaction. It gains a luminous blue build beam, stronger depth, and clearer rough-to-ready labeling. The beam must not interfere with text readability or pointer use. On small screens the composition stacks naturally, fits within the viewport width, and removes perspective tilt.

The existing priority ticker closes the hero as a high-contrast signal strip and creates a clean transition to the content below.

### Pain and services

The pain section becomes a large editorial statement followed by three decisive columns. Typography and spacing create urgency without relying on invented statistics.

The services section remains dark but becomes a capability matrix with one visually active tile at a time. Hover and focus may introduce electric-blue emphasis, but every tile remains readable without interaction. The link to the full services page stays prominent.

### Why and demo work

The “Why HAYK WEB CO.” section uses the pale signal field as a quieter diagnostic interlude. Its four principles read like checked build criteria rather than generic feature cards.

The three Demo Concept previews become staggered studio boards. Their vertical offsets create a gallery rhythm on desktop, and they collapse to a simple single-column sequence on mobile. Each preview retains its `Demo Concept` label and industry-specific accent. No work is represented as a real client engagement.

### Process, performance, scopes, and FAQ

The ordered four-step process keeps its genuine sequence and uses a connecting progress rule that draws as the section enters view.

The performance section keeps the electric-blue field and phone composition. The phone receives subtle depth and fine-pointer hover rotation within a small safe range. The layout presents benefits before decoration on mobile.

Project scopes and FAQs retain their current semantics and content. Scope cards gain more deliberate hierarchy and hover/focus depth. FAQ rows keep native button behavior, visible state, and generous touch targets.

### Final CTA

The final CTA returns to the hero’s dark grid. The blue build beam resolves through the section and points toward the primary CTA, visually completing the page without obstructing the text. The existing honest free-review offer remains unchanged.

## Motion system

Motion is orchestrated rather than scattered:

1. Hero copy enters through clipped vertical reveals while the browser settles into depth.
2. The Browser Workshop transformation scans from rough to finished along the build beam.
3. Section headings use a consistent clipped reveal; supporting content uses short staggered entrances.
4. Service tiles and scope cards use restrained hover/focus elevation and blue signal details.
5. Demo Concept boards gain subtle scroll depth and hover lift on fine-pointer devices.
6. The process rule and final CTA beam draw once when entering view.

All motion uses transform, opacity, or clip-path where practical. Continuous ambient animation is avoided. With `prefers-reduced-motion`, the resolved final states render immediately, parallax/tilt is disabled, and scrolling remains stable.

## Component and code boundaries

- `src/content/site.ts` remains the source of truth for business details and reusable copy.
- Homepage composition remains in `src/pages/HomePage.tsx` and the existing section components.
- `BrowserWorkshop` owns pointer tilt and rough-to-ready transformation behavior.
- `Reveal` owns the shared entrance vocabulary and must never leave content hidden when JavaScript, observers, or reduced motion are unavailable.
- Shared homepage visual tokens and responsive rules remain in `src/styles/index.css` unless a small, focused component requires inline Motion values.
- Interior routes and contact/API behavior are outside the redesign scope.

## Accessibility and resilience

- Preserve one `h1`, semantic section headings, landmarks, accessible names, keyboard navigation, and visible focus.
- Preserve 44 px minimum touch targets for interactive controls.
- Maintain WCAG AA contrast in default, hover, focus, expanded, and disabled states.
- Decorative beams, grids, and labels remain hidden from assistive technology.
- Pointer interactions are enhancements only and do not gate content.
- The homepage must not overflow horizontally at 375, 430, 768, 1440, or 1920 px.
- Reveal behavior must fail open so a full-page screenshot or unsupported observer cannot produce visually blank sections.

## Performance and testing

- Do not add remote images, video, WebGL, or a new runtime dependency.
- Prefer CSS geometry and existing React/Motion primitives.
- Add behavior tests before implementation for updated accessible content and reveal resilience.
- Preserve existing homepage content-integrity coverage and all route/contact tests.
- Run formatting, lint, strict typecheck, Vitest, production build, browser QA across all required viewports, and `npm audit` before completion.
- Browser QA must confirm no horizontal overflow, no console errors, visible section content after load/scroll, functional mobile navigation, keyboard focus, and reduced-motion final states.

## Content integrity

No customers, testimonials, results, awards, statistics, employees, or experience claims may be invented. All existing showcase work remains labeled `Demo Concept` or `Concept Project`.
