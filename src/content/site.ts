export type Service = {
  title: string
  summary: string
  benefit: string
  icon: string
}

export type Concept = {
  name: string
  category: string
  tagline: string
  description: string
  accent: string
  features: string[]
}

export const site = {
  name: 'HAYK WEB CO.',
  shortName: 'HWC',
  siteUrl: 'https://haykwebco.com',
  email: 'hello@haykwebco.com',
  // Display form and the tel: target. E.164 keeps the link dialable from
  // any country and is what search engines expect in structured data.
  phone: '(747) 306-1007' as string | null,
  phoneHref: 'tel:+17473061007',
  serviceAreas: ['Los Angeles', 'Glendale', 'Burbank', 'Surrounding areas', 'Remote'],
  socialLinks: [] as { label: string; href: string }[],
  navigation: [
    { label: 'Services', to: '/services' },
    { label: 'Work', to: '/work' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
  primaryCta: { label: 'Get a Free Website Review', to: '/contact' },
  secondaryCta: { label: 'View Demo Work', to: '/work' },
  hero: {
    eyebrow: 'Web design for local service businesses',
    title: 'Websites that turn local attention into real customers.',
    body: 'HAYK WEB CO. designs fast, polished, mobile-first websites that help local businesses earn trust, generate calls, and turn visitors into customers.',
  },
  painPoints: [
    {
      label: 'Trust breaks quickly',
      title: 'An outdated site makes a strong business feel uncertain.',
      body: 'Customers judge clarity, polish, and credibility before they ever call. Your website should make the decision easier.',
    },
    {
      label: 'Most visits are mobile',
      title: 'Small screens cannot be an afterthought.',
      body: 'Fast pages, tap-friendly actions, and clear information help mobile visitors move from searching to contacting you.',
    },
    {
      label: 'Attention needs direction',
      title: 'A good-looking page still needs a clear next step.',
      body: 'Every page should guide visitors toward the call, quote, booking, or visit that matters to your business.',
    },
  ],
  services: [
    {
      title: 'Custom business websites',
      summary: 'A tailored website built around your services, customers, and goals.',
      benefit:
        'Look established, explain your value clearly, and make it easy for customers to act.',
      icon: 'PanelsTopLeft',
    },
    {
      title: 'Website redesigns',
      summary: 'A focused rebuild for sites that feel dated, confusing, or difficult to manage.',
      benefit: 'Keep what works while improving trust, clarity, speed, and mobile usability.',
      icon: 'RefreshCw',
    },
    {
      title: 'Landing pages',
      summary: 'Campaign pages built around one audience, one offer, and one next step.',
      benefit: 'Give ads, promotions, and seasonal offers a clearer path to conversion.',
      icon: 'MousePointerClick',
    },
    {
      title: 'Mobile optimization',
      summary: 'Responsive layouts tuned for real phones, thumbs, and on-the-go customers.',
      benefit: 'Reduce friction for the visitors most likely to call, book, or request a quote.',
      icon: 'Smartphone',
    },
    {
      title: 'Local SEO foundations',
      summary: 'Clean page structure, metadata, service-area signals, and search-friendly content.',
      benefit: 'Give search engines a clearer understanding of what you do and where you work.',
      icon: 'MapPin',
    },
    {
      title: 'Booking integrations',
      summary: 'Connect the scheduling tools your team already uses.',
      benefit: 'Let customers choose an available time without waiting for a callback.',
      icon: 'CalendarCheck',
    },
    {
      title: 'Quote and contact forms',
      summary: 'Purpose-built forms that gather the information needed for a useful follow-up.',
      benefit: 'Spend less time chasing details and respond to better-qualified inquiries.',
      icon: 'FileText',
    },
    {
      title: 'Website maintenance',
      summary: 'Ongoing updates, content changes, monitoring, and technical care.',
      benefit: 'Keep your site current without adding another task to your week.',
      icon: 'Wrench',
    },
    {
      title: 'Optional automation',
      summary: 'Practical workflows for routine follow-ups and internal handoffs.',
      benefit: 'Reduce repetitive admin work while keeping customer communication personal.',
      icon: 'Workflow',
    },
    {
      title: 'Lead-routing integrations',
      summary: 'Send inquiries to the inbox, CRM, or teammate who should handle them.',
      benefit: 'Help new opportunities reach the right person while interest is still high.',
      icon: 'Route',
    },
  ] satisfies Service[],
  concepts: [
    {
      name: 'Northline Build Co.',
      category: 'Local contractor',
      tagline: 'Built right. Communicated clearly.',
      description:
        'A confident contractor site organized around services, service areas, project trust, and fast quote requests.',
      accent: '#E6A83A',
      features: ['Service-area clarity', 'Project gallery', 'Quote-first flow'],
    },
    {
      name: 'Sera Table',
      category: 'Neighborhood restaurant',
      tagline: 'Dinner, handled beautifully.',
      description:
        'A warm reservation-led concept that gives the menu, atmosphere, hours, and location room to breathe.',
      accent: '#B64132',
      features: ['Menu storytelling', 'Reservation path', 'Mobile directions'],
    },
    {
      name: 'Forma Studio',
      category: 'Barber & beauty',
      tagline: 'Your next look starts here.',
      description:
        'A precise booking-focused concept balancing service detail, visual confidence, and easy appointment access.',
      accent: '#8A6DE9',
      features: ['Service menu', 'Booking integration', 'Stylist profiles'],
    },
  ] satisfies Concept[],
  process: [
    {
      step: '01',
      title: 'Review',
      body: 'We look at your current site, goals, customers, and the actions that matter most.',
    },
    {
      step: '02',
      title: 'Structure',
      body: 'We shape the message and page flow before visual details distract from the strategy.',
    },
    {
      step: '03',
      title: 'Build',
      body: 'We design and develop a responsive site with clear feedback at practical checkpoints.',
    },
    {
      step: '04',
      title: 'Launch',
      body: 'We test the details, connect the essentials, and prepare the site for a confident handoff.',
    },
  ],
  scopes: [
    {
      name: 'Focused Launch',
      bestFor: 'A clear, professional presence for a focused offer.',
      includes: [
        'One conversion-focused page',
        'Mobile-first build',
        'Contact or booking connection',
        'SEO essentials',
      ],
    },
    {
      name: 'Business Website',
      bestFor: 'An established local business with multiple services.',
      includes: [
        'Strategic multi-page structure',
        'Custom visual system',
        'Service and area pages',
        'Lead-generation setup',
      ],
      featured: true,
    },
    {
      name: 'Growth Build',
      bestFor: 'A business ready for deeper content and integrations.',
      includes: [
        'Expanded page system',
        'Advanced forms or booking',
        'Automation planning',
        'Ongoing optimization options',
      ],
    },
  ],
  faqs: [
    {
      question: 'How much does a website cost?',
      answer:
        'Scope depends on the number of pages, content needs, integrations, and how much strategy is required. A free website review is the fastest way to identify the right-sized approach without paying for features you do not need.',
    },
    {
      question: 'How long does a project take?',
      answer:
        'A focused landing page can move quickly, while a custom multi-page site needs more time for content, design, feedback, and testing. You will receive a clear project schedule before work begins.',
    },
    {
      question: 'Can you improve my current website?',
      answer:
        'Yes. A redesign can preserve useful content and brand assets while improving clarity, mobile usability, speed, search foundations, and the path to contact.',
    },
    {
      question: 'Will my website work well on phones?',
      answer:
        'Yes. Layout, navigation, forms, buttons, and page speed are planned mobile-first and tested across several real viewport sizes.',
    },
    {
      question: 'Do you guarantee first-page Google rankings?',
      answer:
        'No credible provider can guarantee a search position. HAYK WEB CO. builds strong technical and content foundations and can help you make practical improvements for local discovery.',
    },
    {
      question: 'Can you connect booking or lead tools?',
      answer:
        'Yes. Common scheduling, form, email, CRM, and lead-routing tools can be connected when they fit the project and your existing workflow.',
    },
  ],
}
