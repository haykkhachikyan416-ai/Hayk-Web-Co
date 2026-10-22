import { Seo } from '../components/Seo'
import { AutomationSection } from '../components/sections/AutomationSection'
import { FaqSection } from '../components/sections/FaqSection'
import { HeroSection } from '../components/sections/HeroSection'
import { Marquee } from '../components/sections/Marquee'
import { PillarsSection } from '../components/sections/PillarsSection'
import { ProcessSection } from '../components/sections/ProcessSection'
import { StartSection } from '../components/sections/StartSection'
import { WorkSection } from '../components/sections/WorkSection'
import { site } from '../content/site'

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    url: site.siteUrl,
    email: site.email,
    // Search engines expect E.164, not the formatted display string.
    ...(site.phone ? { telephone: site.phoneHref.replace('tel:', '') } : {}),
    areaServed: site.serviceAreas.filter((area) => area !== 'Remote'),
    description: site.hero.body,
    serviceType: ['Website design and development', 'AI automation for small businesses'],
  }

  return (
    <>
      <Seo
        description="HAYK WEB CO. builds fast, custom websites and practical AI automation — lead follow-up, booking, and AI assistants — for local businesses in Los Angeles."
        path="/"
        structuredData={structuredData}
      />
      <HeroSection />
      <Marquee />
      <PillarsSection />
      <AutomationSection />
      <WorkSection />
      <ProcessSection />
      <FaqSection />
      <StartSection />
    </>
  )
}
