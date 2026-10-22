export type ServiceGroup = 'web' | 'ai'

export type Service = {
  /** Which of the two offers this belongs to. Drives the grouping on /services. */
  group: ServiceGroup
  title: string
  summary: string
  benefit: string
  icon: string
}

/**
 * A real, launched client site. Kept as a separate type from `Concept` on
 * purpose: concepts are speculative and must stay labelled as such, and a
 * shared type would make it easy to drift one into the other.
 */
export type Project = {
  name: string
  category: string
  /** Live URL, opened in a new tab. */
  url: string
  /** Shown in the browser chrome — no scheme, no trailing slash. */
  domain: string
  tagline: string
  description: string
  /** Screenshot in public/work. Re-capture if the client redesigns. */
  image: string
  features: string[]
}

export type ChatMessage = { from: 'visitor' | 'ai'; text: string }

export type Concept = {
  name: string
  category: string
  tagline: string
  description: string
  accent: string
  features: string[]
}

const heroTitleLines = ['Websites that sell.', 'AI that works.'] as const

export const site = {
  name: 'HAYK WEB CO.',
  shortName: 'HWC',
  // The live host. haykwebco.com has no DNS record yet, and pointing
  // canonical tags, og:url, and the sitemap at a domain that does not
  // resolve can keep the site out of search results entirely.
  // When that domain goes live, change it in three places: here,
  // public/robots.txt, and public/sitemap.xml.
  siteUrl: 'https://hayk-web-co.vercel.app',
  email: 'haykwebco@gmail.com',
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
  primaryCta: { label: 'Get a free review', to: '/contact' },
  secondaryCta: { label: 'See live work', to: '#work' },
  /**
   * One line, reused beside every call to action. It is a commitment about
   * process only — response time and no follow-up marketing — so it stays true
   * without implying clients, results, or demand the business cannot evidence.
   */
  responsePromise: 'No pressure and no mailing list. Replies within 1 business day.',
  hero: {
    eyebrow: 'Websites + AI automation / Los Angeles',
    titleLines: heroTitleLines,
    title: heroTitleLines.join(' '),
    body: 'HAYK WEB CO. builds fast, custom websites that turn visitors into calls — and AI that answers leads, books jobs, and handles the busywork while you’re on the job.',
  },
  /** The scrolling band under the hero. Decorative, so it can stay terse. */
  marquee: [
    'Custom websites',
    'AI assistants',
    'Instant lead follow-up',
    'Local SEO',
    'Booking automation',
    'Redesigns',
    'Workflow automation',
  ],
  pillars: {
    web: {
      title: 'Custom websites',
      body: 'Designed from scratch around your business — not a template with your logo on it. Fast on every phone, easy to find on Google, and built so the next step is always obvious.',
      points: [
        'Custom design, no templates',
        'Mobile-first and fast',
        'Local SEO foundations',
        'Quote, call, and booking paths',
      ],
    },
    ai: {
      title: 'AI automation',
      body: 'AI that works the parts of your business that never stop: answering questions, replying to every lead in seconds, booking appointments, and moving information where it needs to go.',
      points: [
        'AI website assistant',
        'Instant lead follow-up',
        'Booking and reminders',
        'Connect the tools you already use',
      ],
    },
  },
  /**
   * The AI assistant conversation shown in the hero and the AI pillar. It is
   * for a fictional business, and every surface that plays it is labelled
   * `Demo Concept`.
   */
  demoChat: [
    { from: 'visitor', text: 'Hi — can someone look at a kitchen remodel this week?' },
    {
      from: 'ai',
      text: 'Happy to help! I can book a free in-home estimate. Does Thursday 10 AM or Friday 2 PM work better?',
    },
    { from: 'visitor', text: 'Friday works.' },
    { from: 'ai', text: 'You’re booked for Friday at 2 PM. A confirmation text is on its way.' },
  ] satisfies ChatMessage[],
  /**
   * The steps of the pinned "Demo Concept" automation walkthrough on the
   * homepage. Illustrative only — every surface that shows them is labelled.
   */
  automationFlow: [
    {
      time: '9:42 PM',
      title: 'A lead comes in after hours',
      body: 'Someone asks about an estimate through your website while you’re off the clock.',
    },
    {
      time: '9:42 PM',
      title: 'AI replies right away',
      body: 'It answers from information you approved, then asks for the details you need to quote.',
    },
    {
      time: '9:44 PM',
      title: 'The appointment gets booked',
      body: 'It offers open times from your calendar and confirms one — no phone tag.',
    },
    {
      time: '9:44 PM',
      title: 'You get the summary',
      body: 'Name, number, job details, and the booked time land on your phone, ready for the morning.',
    },
  ],
  services: [
    {
      group: 'web',
      title: 'Custom business websites',
      summary: 'A tailored website built around your services, customers, and goals.',
      benefit:
        'Look established, explain your value clearly, and make it easy for customers to act.',
      icon: 'PanelsTopLeft',
    },
    {
      group: 'web',
      title: 'Website redesigns',
      summary: 'A focused rebuild for sites that feel dated, confusing, or difficult to manage.',
      benefit: 'Keep what works while improving trust, clarity, speed, and mobile usability.',
      icon: 'RefreshCw',
    },
    {
      group: 'web',
      title: 'Landing pages',
      summary: 'Campaign pages built around one audience, one offer, and one next step.',
      benefit: 'Give ads, promotions, and seasonal offers a clearer path to conversion.',
      icon: 'MousePointerClick',
    },
    {
      group: 'web',
      title: 'Local SEO foundations',
      summary: 'Clean page structure, metadata, service-area signals, and search-friendly content.',
      benefit: 'Give search engines a clearer understanding of what you do and where you work.',
      icon: 'MapPin',
    },
    {
      group: 'web',
      title: 'Quote and booking forms',
      summary: 'Forms and scheduling that gather what you need for a useful follow-up.',
      benefit: 'Spend less time chasing details and respond to better-qualified inquiries.',
      icon: 'CalendarCheck',
    },
    {
      group: 'web',
      title: 'Website care',
      summary: 'Ongoing updates, content changes, monitoring, and technical care.',
      benefit: 'Keep your site current without adding another task to your week.',
      icon: 'Wrench',
    },
    {
      group: 'ai',
      title: 'AI website assistant',
      summary:
        'A chat assistant on your site that answers common questions from information you approve.',
      benefit: 'Visitors get answers at 10 PM, and you get their details instead of a lost lead.',
      icon: 'Bot',
    },
    {
      group: 'ai',
      title: 'Instant lead follow-up',
      summary: 'Every new inquiry gets a personal-sounding reply by email or text within moments.',
      benefit: 'Reach people while they are still interested, even when you are on a job.',
      icon: 'Zap',
    },
    {
      group: 'ai',
      title: 'Booking and reminders',
      summary: 'Automated scheduling, confirmations, and reminders connected to your calendar.',
      benefit: 'Fewer back-and-forth messages and fewer forgotten appointments.',
      icon: 'CalendarClock',
    },
    {
      group: 'ai',
      title: 'Workflow automation',
      summary: 'Connect forms, inbox, CRM, calendar, and spreadsheets so information moves itself.',
      benefit: 'Stop copying the same details between apps by hand.',
      icon: 'Workflow',
    },
    {
      group: 'ai',
      title: 'Custom AI tools',
      summary:
        'Small, focused AI helpers for your team — drafting quotes, summarizing calls, or answering questions from your own documents.',
      benefit: 'Hand repetitive writing and lookup work to software, and keep the judgment calls.',
      icon: 'Sparkles',
    },
  ] satisfies Service[],
  /*
   * Real launched work. Every line here is checkable against the live site —
   * name, what the business does, what the site contains. No metrics, no
   * outcomes, no testimonials: none of that can be evidenced yet, and the
   * concepts below are only credible because this section stays honest.
   */
  projects: [
    {
      name: 'HouseGlass LA',
      category: 'Glass installation / Los Angeles',
      url: 'https://www.houseglassla.com',
      domain: 'houseglassla.com',
      tagline: 'Glass you look through, not at.',
      description:
        'A full marketing site for a Los Angeles glass installer working in frameless showers, stair railings, and mirrors. Built around a gallery of finished installations and a quote form that accepts photos of the space.',
      image: '/work/houseglassla.webp',
      features: ['Finished-work gallery', 'Quote form with photo upload', 'Reviews and FAQ'],
    },
    {
      name: 'LA Glass',
      category: 'Glass installation / Los Angeles',
      url: 'https://laglass.org',
      domain: 'laglass.org',
      tagline: 'Custom glass, installed with precision.',
      description:
        'A site for a custom glass installer covering shower enclosures, shower doors, and railings across the Los Angeles area, structured so visitors reach completed work and a quote request without hunting for either.',
      image: '/work/laglass.webp',
      features: ['Completed work gallery', 'Free quote request', 'Service breakdown'],
    },
  ] satisfies Project[],
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
      title: 'Talk',
      body: 'A free call about your business, your customers, and what is slowing you down.',
    },
    {
      step: '02',
      title: 'Plan',
      body: 'A clear scope, timeline, and price before any work starts. No surprises.',
    },
    {
      step: '03',
      title: 'Build',
      body: 'Design, development, and automation, with check-ins at real milestones.',
    },
    {
      step: '04',
      title: 'Launch',
      body: 'Tested on real phones, connected to your tools, and handed over ready to use.',
    },
  ],
  faqs: [
    {
      question: 'How much does a website cost?',
      answer:
        'It depends on the number of pages, content, and integrations. A free review is the fastest way to find the right-sized scope, and you get a fixed price before any work starts.',
    },
    {
      question: 'What can AI actually do for my business?',
      answer:
        'The most useful jobs are the repetitive ones: answering the same customer questions, replying to new leads right away, booking appointments, sending reminders, and moving details between your apps. The review is where we find which of those would save you the most time.',
    },
    {
      question: 'Will an AI assistant say something wrong to my customers?',
      answer:
        'It is set up to answer only from information you approve — your services, areas, hours, and policies. When a question falls outside that, it collects the customer’s details and hands the conversation to you instead of guessing.',
    },
    {
      question: 'How long does a project take?',
      answer:
        'A focused landing page or a single automation can move quickly, while a custom multi-page site needs more time for content, design, and testing. You get a clear schedule before work begins.',
    },
    {
      question: 'Can you improve my current website?',
      answer:
        'Yes. A redesign can keep your useful content and brand while improving clarity, mobile usability, speed, search foundations, and the path to contact.',
    },
    {
      question: 'Do you guarantee first-page Google rankings?',
      answer:
        'No credible provider can guarantee a search position. HAYK WEB CO. builds strong technical and content foundations and helps you make practical improvements for local discovery.',
    },
  ],
}
