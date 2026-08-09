import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'

const HomePage = lazy(() => import('./pages/HomePage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const WorkPage = lazy(() => import('./pages/WorkPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
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
  )
}
