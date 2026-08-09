# HAYK WEB CO.

Production-ready Vite, React, and TypeScript website for HAYK WEB CO., focused on local-service business websites and free website-review inquiries.

## Local development

```bash
npm install
npm run dev
```

Vite binds to `0.0.0.0:5173` and prints both addresses:

```text
Local:   http://localhost:5173/
Network: http://192.168.x.x:5173/
```

Use the Local URL on this computer. To test on a phone, keep the terminal open, connect the phone and computer to the same Wi-Fi, and open the Network URL—not `localhost`. If Windows asks, allow Node.js on private networks.

## Contact email setup

The frontend is fully buildable without email credentials. The deployed form returns an honest configuration error until these server-only environment variables are set in the host:

- `RESEND_API_KEY` — API key created in Resend.
- `CONTACT_TO_EMAIL` — inbox that receives website-review requests.
- `CONTACT_FROM_EMAIL` — optional sender on a Resend-verified domain. The development fallback is `HAYK WEB CO. <onboarding@resend.dev>`.

Copy `.env.example` to `.env.local` only for local serverless testing. Never use a `VITE_` prefix for the Resend key because Vite exposes those values to the browser bundle.

## Quality commands

```bash
npm run format
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
npm audit
```

## Deployment

Import the repository into Vercel, keep the detected Vite build settings (`npm run build`, output `dist`), and add the contact environment variables. `vercel.json` provides SPA deep-link rewrites and response security headers. `public/_redirects` provides the equivalent fallback for compatible static hosts.

Before using another production domain, change `siteUrl` in `src/content/site.ts` and update `public/robots.txt` and `public/sitemap.xml`.
