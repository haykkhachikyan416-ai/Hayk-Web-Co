import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/*
 * The security headers Vercel serves, read from vercel.json so there is one
 * source of truth. `vite preview` applies them too, which makes the local
 * production preview enforce the same CSP as the live site. Without this,
 * CSP-only failures (an inline <script>, a data: font) passed every local
 * check and only broke once deployed.
 */
type HeaderRule = { headers: { key: string; value: string }[] }
const vercelHeaders = Object.fromEntries(
  (
    JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf-8')) as {
      headers: HeaderRule[]
    }
  ).headers.flatMap((rule) => rule.headers.map(({ key, value }) => [key, value])),
)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Never inline fonts. Vite turns files under 4 KB into data: URIs, and
    // the CSP is `font-src 'self'`, which refuses data: — the ~3 KB
    // Cyrillic-ext subsets of Manrope and JetBrains Mono were silently
    // blocked in production while every local check passed.
    assetsInlineLimit: (filePath) => (/\.(woff2?|ttf|otf)$/.test(filePath) ? false : undefined),
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true,
    headers: vercelHeaders,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
