import { Analytics } from '@vercel/analytics/react'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import HomePage from './pages/HomePage'

const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const WorkPage = lazy(() => import('./pages/WorkPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="route-loading" role="status">
            Loading page…
          </div>
        }
      >
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="work" element={<WorkPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
      {/*
        The /react entry point, not /next — Vercel's setup page assumes a
        Next.js app. Auto-tracking picks up React Router navigations on its
        own, so no route prop is needed, and in production it loads from
        /_vercel/insights on this origin, which the strict script-src 'self'
        CSP already allows.

        Rendered only in production builds. That beacon exists solely on a
        Vercel deployment, so mounting it locally injects a tag that 404s on
        every page load. Leaving `mode` on 'development' is not the fix: that
        path loads va.vercel-scripts.com instead, which the CSP blocks and
        which would send local browsing to an external host.
      */}
      {import.meta.env.PROD && <Analytics />}
    </>
  )
}
