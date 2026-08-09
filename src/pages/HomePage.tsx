import { Seo } from '../components/Seo'
import { FaqSection } from '../components/sections/FaqSection'
import { FinalCta } from '../components/sections/FinalCta'
import { HeroSection } from '../components/sections/HeroSection'
import { PainSection } from '../components/sections/PainSection'
import { PerformanceSection } from '../components/sections/PerformanceSection'
import { ProcessSection } from '../components/sections/ProcessSection'
import { ScopeSection } from '../components/sections/ScopeSection'
import { ServicesSection } from '../components/sections/ServicesSection'
import { WhySection } from '../components/sections/WhySection'
import { WorkSection } from '../components/sections/WorkSection'
import { site } from '../content/site'

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    url: site.siteUrl,
    email: site.email,
    areaServed: site.serviceAreas.filter((area) => area !== 'Remote'),
    description: site.hero.body,
    serviceType: 'Website design and development',
  }

  return (
    <>
      <Seo
        description="HAYK WEB CO. creates fast, polished, mobile-first websites that help local businesses earn trust and generate inquiries."
        path="/"
        structuredData={structuredData}
      />
      <HeroSection />
      <PainSection />
      <ServicesSection />
      <WhySection />
      <WorkSection />
      <ProcessSection />
      <PerformanceSection />
      <ScopeSection />
      <FaqSection />
      <FinalCta />
    </>
  )
}
