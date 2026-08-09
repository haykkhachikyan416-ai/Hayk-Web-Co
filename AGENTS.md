# HAYK WEB CO. Project Guide

## Purpose

Build and maintain the production marketing website for HAYK WEB CO., a website-development business serving local service businesses in Los Angeles, Glendale, Burbank, nearby areas, and appropriate remote clients.

## Brand

- Exact name: `HAYK WEB CO.`
- Palette: electric blue `#315CFF`, near black `#0B0D12`, warm white `#F7F7F4`.
- Voice: confident, direct, trustworthy, and understandable to business owners. Avoid unnecessary developer jargon.
- Visual language: sharp editorial layouts, browser-interface details, quiet grids, deliberate spacing, restrained motion.
- Preserve the approved geometric HW/browser-window logo. Do not redesign it.
- Never invent customers, testimonials, results, awards, statistics, employees, or experience claims. Label all speculative work `Demo Concept` or `Concept Project`.

## Stack and conventions

- Vite, React, strict TypeScript, Tailwind CSS, React Router DOM, Motion, Lucide React, npm.
- `src/content/site.ts` is the source of truth for business details, navigation, services, packages, FAQs, and CTAs.
- Shared layout belongs in `src/components/layout`; reusable primitives in `src/components/ui`; landing sections in `src/components/sections`; routes in `src/pages`; utilities in `src/lib` and hooks in `src/hooks`.
- Preserve user files and unrelated instructions. Never store secrets or submissions in the repository.

## Quality rules

- Design mobile-first and verify 375, 430, 768, 1440, and 1920 px widths. Prevent horizontal overflow.
- Meet WCAG AA contrast, provide semantic structure, keyboard navigation, visible focus, accessible errors, 44 px touch targets, and `prefers-reduced-motion` support.
- Use test-first development for behavior. Before finishing run `npm run format`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, browser QA, and `npm audit`.
- Development: `npm run dev`; production preview: `npm run preview`. Both must expose Local and Network URLs.
- Keep `docs/PROJECT_MEMORY.md` current after major phases and before handoff; replace stale notes instead of appending a transcript.
