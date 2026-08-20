export const site = {
  name: "GUIDESOFT",
  legalName: "GuideSoft IT Solutions",
  short: "GUIDESOFT",
  domain: "guideitsol.in",
  url: "https://www.guideitsol.in",
  tagline: "Learn real technology. Build real skills. Launch your career.",
  email: "info@guideitsol.in",
} as const;

export const nav = [
  { label: "Courses", to: "/courses" },
  { label: "Live batches", to: "/live-batches" },
  { label: "Learning paths", to: "/learning-paths" },
  { label: "Internships", to: "/internships" },
  { label: "Career center", to: "/career-center" },
  { label: "Verify", to: "/verify" },
  { label: "Dashboard", to: "/student-dashboard" },
  { label: "Contact", to: "/contact" },
] as const;

export const services = [
  {
    slug: "web-development",
    title: "Web Platforms",
    summary:
      "Type-safe React and Next-generation SSR platforms with design systems, CMS and analytics baked in.",
    points: ["React & TypeScript", "SSR / SEO-first", "Headless CMS", "Core Web Vitals > 95"],
  },
  {
    slug: "mobile-apps",
    title: "Mobile Apps",
    summary:
      "Cross-platform iOS and Android apps with offline-first data, push, payments and store release support.",
    points: ["React Native & Flutter", "Offline sync", "App Store releases", "Crash-free > 99.5%"],
  },
  {
    slug: "cloud",
    title: "Cloud & DevOps",
    summary:
      "Container-based delivery on AWS and Azure with IaC, observability and cost governance from day one.",
    points: ["Docker & Kubernetes", "CI/CD pipelines", "Terraform IaC", "24×7 monitoring"],
  },
  {
    slug: "product-design",
    title: "Product Design",
    summary:
      "Research-led UX, accessible design systems and prototypes validated with real users before a line of code.",
    points: ["Discovery sprints", "WCAG AA systems", "Prototyping", "Usability testing"],
  },
  {
    slug: "data-ai",
    title: "Data & AI",
    summary:
      "Warehouses, dashboards and applied AI assistants that turn operational data into daily decisions.",
    points: ["ETL pipelines", "BI dashboards", "LLM assistants", "Forecasting models"],
  },
  {
    slug: "managed-it",
    title: "Managed IT",
    summary:
      "Dedicated pods for support, security patching and continuous improvement of the systems you already run.",
    points: ["L1–L3 support", "Security patching", "SLA-backed", "Quarterly roadmaps"],
  },
] as const;

export const stats = [
  { value: "120+", label: "Products shipped" },
  { value: "9 yrs", label: "Average team tenure" },
  { value: "40+", label: "Engineers & designers" },
  { value: "98%", label: "Client retention" },
] as const;

export const process = [
  {
    step: "01",
    title: "Discover",
    body: "A two-week paid discovery: stakeholder interviews, technical audit, and a costed delivery plan you own.",
  },
  {
    step: "02",
    title: "Design",
    body: "Clickable prototypes and an accessible design system, validated with your users before engineering starts.",
  },
  {
    step: "03",
    title: "Build",
    body: "Two-week sprints, demo every Friday, trunk-based delivery with automated tests and preview environments.",
  },
  {
    step: "04",
    title: "Scale",
    body: "Observability, performance budgets and an SLA-backed support pod that keeps shipping after launch.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "They replaced a five-year-old portal in four months and our support tickets dropped by half. The team behaved like owners, not vendors.",
    name: "Ananya Rao",
    role: "COO, Meridian Logistics",
  },
  {
    quote:
      "The mobile app hit 4.7 stars in its first quarter. Release engineering and analytics were handled before we even asked.",
    name: "Vikram Shetty",
    role: "Head of Digital, Southbank Finance",
  },
  {
    quote:
      "Discovery alone paid for itself. We killed two features that would have wasted a year of budget.",
    name: "Priya Nair",
    role: "Founder, CareStack Health",
  },
] as const;

export const plans = [
  {
    name: "Launch",
    price: "₹4,50,000",
    cadence: "fixed scope",
    description: "For founders validating a product with a real, production-grade first release.",
    features: [
      "Discovery workshop",
      "Design system + 12 screens",
      "Web or mobile MVP",
      "Analytics & SEO setup",
      "6 weeks delivery",
      "30 days hypercare",
    ],
    cta: "Start a launch",
    featured: false,
  },
  {
    name: "Scale",
    price: "₹8,90,000",
    cadence: "per month, dedicated pod",
    description: "A cross-functional pod embedded with your team, shipping every two weeks.",
    features: [
      "4–6 person dedicated pod",
      "Product design + engineering",
      "CI/CD & cloud infrastructure",
      "Fortnightly releases",
      "Performance budgets",
      "Named delivery lead",
    ],
    cta: "Book a pod",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual agreement",
    description: "Multi-pod programmes with compliance, migrations and 24×7 managed operations.",
    features: [
      "Multiple parallel pods",
      "Legacy migration planning",
      "ISO 27001 aligned process",
      "24×7 managed support",
      "Quarterly business reviews",
      "Custom SLAs",
    ],
    cta: "Talk to sales",
    featured: false,
  },
] as const;

export const faqs = [
  {
    q: "How quickly can a team start?",
    a: "Most engagements begin within two weeks. Discovery can usually start within five working days of a signed proposal.",
  },
  {
    q: "Do you work fixed-price or time and material?",
    a: "Both. Fixed scope suits well-defined launches; dedicated pods on a monthly retainer suit evolving products. Discovery is always fixed-price.",
  },
  {
    q: "Who owns the code and design files?",
    a: "You do, from the first commit. Repositories, cloud accounts and design files are created in your organisation wherever possible.",
  },
  {
    q: "Can you work with our in-house engineers?",
    a: "Yes. Roughly half our engagements are blended teams. We follow your review standards or bring our own if you prefer.",
  },
  {
    q: "What about support after launch?",
    a: "Every project includes 30 days of hypercare. After that you can move to an SLA-backed managed support plan with defined response times.",
  },
  {
    q: "Which time zones do you cover?",
    a: "Teams operate on IST with a four-hour overlap guaranteed for European and US East Coast clients. Extended coverage is available on enterprise plans.",
  },
] as const;

export const caseStudies = [
  {
    slug: "meridian-logistics",
    client: "Meridian Logistics",
    title: "A shipment portal that cut support tickets by 52%",
    sector: "Logistics",
    result: "52% fewer tickets",
    body: "Replaced a legacy shipment portal with a real-time React platform serving 18,000 monthly users across three countries.",
  },
  {
    slug: "southbank-finance",
    client: "Southbank Finance",
    title: "A 4.7-star lending app shipped in 19 weeks",
    sector: "Financial services",
    result: "4.7★ store rating",
    body: "Cross-platform lending app with offline document capture, biometric login and end-to-end audit logging.",
  },
  {
    slug: "carestack-health",
    client: "CareStack Health",
    title: "Clinic operations unified on one cloud platform",
    sector: "Healthcare",
    result: "3× faster onboarding",
    body: "Scheduling, records and billing consolidated into a HIPAA-aligned platform used by 60 clinics.",
  },
] as const;
