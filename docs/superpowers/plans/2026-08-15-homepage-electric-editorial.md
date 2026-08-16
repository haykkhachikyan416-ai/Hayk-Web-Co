# Electric Editorial Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing HAYK WEB CO. homepage into the approved Electric Editorial direction while preserving factual content, accessibility, interior routes, and conversion behavior.

**Architecture:** Keep the current page and section-component boundaries. Make the shared `Reveal` primitive fail open, refine the hero and Browser Workshop markup only where the new art direction needs meaningful structural hooks, and implement the remaining design through the existing stylesheet and Motion dependency. Keep business copy in `src/content/site.ts` and avoid new runtime dependencies.

**Tech Stack:** Vite, React 19, strict TypeScript, React Router DOM, Motion, Lucide React, Tailwind CSS 4, Vitest, Testing Library, Playwright browser QA.

## Global Constraints

- Preserve exact brand name `HAYK WEB CO.` and approved geometric logo.
- Preserve electric blue `#315CFF`, near black `#0B0D12`, and warm white `#F7F7F4` as the primary palette.
- Do not invent customers, testimonials, results, awards, statistics, employees, or experience claims.
- Keep all showcase work labeled `Demo Concept` or `Concept Project`.
- Preserve `src/content/site.ts` as the source of truth for business details and reusable copy.
- Preserve WCAG AA contrast, semantic structure, keyboard access, visible focus, 44 px touch targets, and `prefers-reduced-motion` behavior.
- Prevent horizontal overflow at 375, 430, 768, 1440, and 1920 px.
- Do not add a runtime dependency, remote image, video, canvas, or WebGL.
- Run `npm run format`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, browser QA, and `npm audit` before completion.

---

### Task 1: Make shared reveals resilient

**Files:**

- Create: `src/test/reveal.test.tsx`
- Modify: `src/components/ui/Reveal.tsx`

**Interfaces:**

- Consumes: `RevealProps = PropsWithChildren<{ className?: string; delay?: number }>`
- Produces: the unchanged `<Reveal>` API, with content visible before IntersectionObserver activity and a subtle in-view polish when motion is allowed.

- [ ] **Step 1: Write the failing reveal-resilience test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Reveal } from '../components/ui/Reveal'

describe('Reveal', () => {
  it('does not hide content while waiting for viewport observation', () => {
    render(
      <Reveal className="test-reveal">
        <p>Always available</p>
      </Reveal>,
    )

    const wrapper = screen.getByText('Always available').parentElement
    expect(wrapper).toHaveClass('test-reveal')
    expect(wrapper).toHaveAttribute('data-reveal', 'true')
    expect(wrapper).not.toHaveStyle({ opacity: '0' })
  })
})
```

- [ ] **Step 2: Run the test to verify RED**

Run: `npm test -- src/test/reveal.test.tsx`

Expected: FAIL because Motion currently applies the initial `opacity: 0` style.

- [ ] **Step 3: Implement the fail-open reveal**

Keep `initial={false}` so content is present in screenshots and unsupported-observer environments. Use a small keyframed opacity/vertical polish only once in view:

```tsx
<motion.div
  className={className}
  data-reveal="true"
  initial={false}
  whileInView={reduceMotion ? undefined : { opacity: [0.88, 1], y: [12, 0] }}
  viewport={{ once: true, amount: 0.18 }}
  transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
>
  {children}
</motion.div>
```

- [ ] **Step 4: Run the focused test to verify GREEN**

Run: `npm test -- src/test/reveal.test.tsx`

Expected: PASS with one test and no warnings.

---

### Task 2: Build the Electric Editorial hero thesis

**Files:**

- Modify: `src/components/sections/HeroSection.tsx`
- Modify: `src/components/BrowserWorkshop.tsx`
- Modify: `src/test/home.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**

- Consumes: `site.hero`, `site.primaryCta`, `site.secondaryCta`, and existing `BrowserWorkshop` pointer behavior.
- Produces: an accessible unchanged hero heading, three visual headline rows, an enlarged dimensional workshop, and a decorative diagonal build beam.

- [ ] **Step 1: Add the failing homepage structure assertions**

After the existing hero-heading assertion, require the three visual rows and the accessible visual:

```tsx
expect(screen.getByText('Websites that turn', { selector: '.home-hero__title-line' })).toBeVisible()
expect(screen.getByText('local attention', { selector: '.home-hero__title-line' })).toBeVisible()
expect(
  screen.getByText('into real customers.', { selector: '.home-hero__title-line--signal' }),
).toBeVisible()
expect(
  screen.getByRole('img', {
    name: /unfinished website transforming into a polished local business website/i,
  }),
).toBeInTheDocument()
```

- [ ] **Step 2: Run the homepage test to verify RED**

Run: `npm test -- src/test/home.test.tsx`

Expected: FAIL because the three `.home-hero__title-line` elements do not exist.

- [ ] **Step 3: Add semantic visual hooks without changing the heading text**

Render the current headline as three spans inside the existing `h1`, preserving the accessible sentence:

```tsx
<h1>
  <span className="home-hero__title-line">Websites that turn</span>
  <span className="home-hero__title-line">local attention</span>
  <span className="home-hero__title-line home-hero__title-line--signal">into real customers.</span>
</h1>
```

Add a decorative `.workshop-beam` and change the build label from `BUILD` to `ROUGH → READY`; both remain inside elements with `aria-hidden="true"`.

- [ ] **Step 4: Implement hero and workshop styling**

In `src/styles/index.css`:

- Increase the desktop hero grid to `grid-template-columns: minmax(0, 0.95fr) minmax(520px, 1.15fr)` and allow the workshop to extend beyond the shell without page overflow.
- Set the headline to tight `0.84` leading and `-0.075em` tracking; make each row block-level and color only the final row electric blue.
- Add a soft blue radial glow behind the workshop, a `rotate(-2.25deg)` base pose, stronger border/shadow depth, and a diagonal electric-blue `.workshop-beam` that visually intersects the build line.
- Use `clamp()` for hero spacing and headline sizes.
- On viewports below 860 px, restore a single-column grid and contain the workshop.
- On viewports below 520 px, remove rotation/perspective, keep the three headline lines legible, and fit the browser within the 32 px page gutters.

- [ ] **Step 5: Run the homepage test to verify GREEN**

Run: `npm test -- src/test/home.test.tsx`

Expected: PASS with the accessible original headline and all content-story assertions intact.

---

### Task 3: Carry the editorial system through the homepage

**Files:**

- Modify: `src/components/sections/ProcessSection.tsx`
- Modify: `src/components/sections/FinalCta.tsx`
- Modify: `src/test/home.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**

- Consumes: existing section markup, `site.painPoints`, `site.services`, `site.concepts`, `site.process`, `site.scopes`, and `site.faqs`.
- Produces: a decorative process progress rail, a decorative CTA beam label, and visual treatment that does not change section semantics.

- [ ] **Step 1: Add failing decorative-semantics tests**

```tsx
expect(screen.getByTestId('process-progress')).toHaveAttribute('aria-hidden', 'true')
expect(screen.getByTestId('final-build-beam')).toHaveAttribute('aria-hidden', 'true')
```

- [ ] **Step 2: Run the homepage test to verify RED**

Run: `npm test -- src/test/home.test.tsx`

Expected: FAIL because the progress rail and named final beam are not present.

- [ ] **Step 3: Add the two decorative hooks**

Insert before the process list:

```tsx
<div className="process-progress" data-testid="process-progress" aria-hidden="true">
  <span />
</div>
```

Add `data-testid="final-build-beam"` to the existing final CTA line while keeping `aria-hidden="true"`.

- [ ] **Step 4: Implement the section art direction in CSS**

- Pain: increase statement scale, add more vertical breathing room, and use blue numeric markers aligned to the content grid.
- Services: turn cards into a capability matrix with a blue top signal, blue hover/focus-within fill on one card, stronger type contrast, and no content hidden behind hover.
- Why: use an offset two-column layout with diagnostic check rows and pale-blue depth.
- Work: create three staggered studio boards on desktop using per-item translation/rotation within 2 degrees; reset transforms on mobile; use stronger browser shadows and accent-colored project rules.
- Process: position `.process-progress` above the list and animate its child from `scaleX(0)` to `scaleX(1)` with a one-shot CSS view animation where supported; keep the standard border as fallback.
- Performance: enlarge the blue field, enhance the phone shadow/orbit, and add safe hover depth only on fine-pointer devices.
- Scope: add a signal rule, focus-within depth, and refined featured-card hierarchy without changing links.
- FAQ: increase row rhythm and animate answer opacity/translation only when visible; hidden content remains controlled by the native `hidden` attribute.
- Final CTA: strengthen the beam glow, add a blue keyword treatment through CSS, and keep the beam behind all copy and controls.

- [ ] **Step 5: Run homepage and interaction regression tests**

Run: `npm test -- src/test/home.test.tsx src/test/mobile-menu.test.tsx src/test/contact.test.tsx`

Expected: PASS with all existing navigation, FAQ, and CTA behavior unchanged.

---

### Task 4: Lock responsive, reduced-motion, and browser behavior

**Files:**

- Modify: `src/styles/index.css`
- Modify: `scripts/browser_qa.py`

**Interfaces:**

- Consumes: existing five-viewport browser QA matrix and Chrome/Chromium fallback.
- Produces: explicit checks that homepage sections are not visually hidden and Electric Editorial decoration does not overflow.

- [ ] **Step 1: Extend browser QA assertions**

On the homepage route, immediately after `networkidle`, verify:

```python
hidden_reveals = page.locator('[data-reveal="true"]').evaluate_all(
    "els => els.filter(el => getComputedStyle(el).opacity === '0').length"
)
if hidden_reveals:
    failures.append(f"Homepage reveals started hidden: {label} ({hidden_reveals})")
if page.locator(".home-hero__title-line").count() != 3:
    failures.append(f"Hero title treatment missing: {label}")
if page.locator(".workshop-beam").count() != 1:
    failures.append(f"Workshop beam missing: {label}")
```

- [ ] **Step 2: Run browser QA before the final CSS pass**

Run the existing dev-server helper with `python scripts/browser_qa.py`.

Expected: any remaining overflow, hidden-section, or selector issue is reported against an exact viewport.

- [ ] **Step 3: Complete responsive and reduced-motion rules**

- At 860 px, remove all work-board rotations and offsets, stack the hero, and constrain decorative beams.
- At 520 px, use `clamp()` sizes that fit 375 px, keep full-width CTAs and 44 px touch targets, hide only nonessential decorative labels, and preserve the final browser composition.
- In `prefers-reduced-motion: reduce`, disable ticker travel, workshop tilt, process drawing, phone/project transforms, and all view-linked animation; show final states immediately.
- In `@media (hover: hover) and (pointer: fine)`, scope all depth and tilt hover effects so touch devices remain stable.

- [ ] **Step 4: Run browser QA again**

Run the existing dev-server helper with `python scripts/browser_qa.py`.

Expected: all seven routes at 375×812, 430×932, 768×1024, 1440×900, and 1920×1080 pass with zero overflow, zero console errors, visible homepage sections, and valid reduced-motion screenshots.

---

### Task 5: Document and verify the finished redesign

**Files:**

- Modify: `docs/PROJECT_MEMORY.md`
- Verify: all changed production and test files

**Interfaces:**

- Consumes: completed implementation and verification output.
- Produces: current project memory plus one clean Git commit pushed to the configured upstream.

- [ ] **Step 1: Update project memory**

Replace the stale current-state/design notes with a concise Electric Editorial summary, list the reveal-resilience change, record the final verification counts, and retain still-relevant deployment/contact limitations.

- [ ] **Step 2: Run the complete required verification**

Run, in order:

```powershell
npm run format
npm run lint
npm run typecheck
npm test
npm run build
python C:\Users\Hayk\.agents\skills\webapp-testing\scripts\with_server.py --server "npm run dev" --port 5173 -- python scripts\browser_qa.py
npm audit
```

Expected: every command exits 0; Vitest reports zero failed tests; browser QA reports zero failures and zero console messages at all required viewports; npm audit reports zero vulnerabilities.

- [ ] **Step 3: Inspect the exact diff**

Run:

```powershell
git status --short
git diff --check
git diff --stat
git diff
```

Expected: only the approved homepage redesign, its tests, browser QA, design/plan docs, and updated project memory are present; no generated screenshots or temporary companion files are tracked.

- [ ] **Step 4: Commit the verified change**

```powershell
git add docs/PROJECT_MEMORY.md docs/superpowers/specs/2026-08-15-homepage-electric-editorial-design.md docs/superpowers/plans/2026-08-15-homepage-electric-editorial.md scripts/browser_qa.py src/components/BrowserWorkshop.tsx src/components/sections/FinalCta.tsx src/components/sections/HeroSection.tsx src/components/sections/ProcessSection.tsx src/components/ui/Reveal.tsx src/styles/index.css src/test/home.test.tsx src/test/reveal.test.tsx
git commit -m "feat: redesign homepage with electric editorial motion"
```

Expected: one new commit containing the verified redesign.

- [ ] **Step 5: Push to the existing upstream**

Run: `git push`

Expected: the current branch is pushed successfully to its configured remote without force.
