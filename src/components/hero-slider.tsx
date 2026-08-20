import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Pause,
  Play,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { EnquiryDialog } from "@/components/enquiry-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface HeroSlide {
  id: number;
  category: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  courseSlug: string;
  salaryRange: string;
  duration: string;
  mode: string;
  techStack: string[];
  keyHighlights: string[];
  projectPreview: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    category: "Full Stack Cloud",
    badge: "Most Popular Track",
    title: "Java Full Stack & Cloud Architecture",
    tagline: "Master Java 21, Spring Boot 3, Microservices & AWS Cloud Deployment",
    description:
      "Enterprise backend systems, event-driven microservices with Kafka, secure REST APIs, and full-scale AWS cloud deployment with live projects.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=85",
    courseSlug: "java-full-stack",
    salaryRange: "₹8.5 - ₹18 LPA",
    duration: "16 Weeks",
    mode: "Live Online & Classroom",
    techStack: ["Java 21", "Spring Boot 3", "AWS ECS", "Kafka", "PostgreSQL", "Docker"],
    keyHighlights: ["12 Enterprise Lab Projects", "1-on-1 Code Reviews", "AWS Cloud Sandbox"],
    projectPreview: "Multi-Tenant E-Commerce Microservices Engine on AWS ECS",
  },
  {
    id: 2,
    category: "Generative AI & ML",
    badge: "Next-Gen AI Era",
    title: "Python, GenAI & Agentic Systems",
    tagline: "Engineer Autonomous AI Agents, RAG Pipelines & Production LLM Apps",
    description:
      "From Python fundamentals to fine-tuning LLMs, building retrieval-augmented generation (RAG) systems, vector databases, and multi-agent workflows.",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&auto=format&fit=crop&q=85",
    courseSlug: "python-full-stack",
    salaryRange: "₹10.0 - ₹24 LPA",
    duration: "14 Weeks",
    mode: "Live Instructor-Led",
    techStack: ["Python 3.12", "LangChain", "LlamaIndex", "PyTorch", "FastAPI", "Pinecone"],
    keyHighlights: [
      "Autonomous Agent Capstone",
      "LLM Evaluation Frameworks",
      "Production GPU Labs",
    ],
    projectPreview: "Enterprise Financial Document RAG & Autonomous Analyst Agent",
  },
  {
    id: 3,
    category: "Data & Intelligence",
    badge: "High Hiring Demand",
    title: "Data Science, Machine Learning & Analytics",
    tagline: "Turn Raw Enterprise Data into Predictive Machine Intelligence",
    description:
      "Master statistical modeling, predictive algorithms, business intelligence with Tableau, automated ETL pipelines, and scalable Spark processing.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=85",
    courseSlug: "data-science",
    salaryRange: "₹9.0 - ₹20 LPA",
    duration: "16 Weeks",
    mode: "Hybrid & Weekend Cohorts",
    techStack: ["Pandas", "Scikit-Learn", "Apache Spark", "Tableau", "MLflow", "SQL Server"],
    keyHighlights: [
      "Kaggle Competition Mentorship",
      "Big Data Clusters",
      "Real Retail & BFSI Data",
    ],
    projectPreview: "Customer Churn Prediction & Real-Time ETL Pipeline with Spark",
  },
  {
    id: 4,
    category: "Cloud & Infrastructure",
    badge: "Global Certifications",
    title: "AWS Cloud DevOps & Platform Engineering",
    tagline: "Architect Resilient Multi-Region Cloud & Kubernetes GitOps",
    description:
      "Automate end-to-end delivery pipelines with Terraform IaC, multi-tenant Kubernetes clusters, ArgoCD GitOps, and 24x7 Prometheus/Grafana observability.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=85",
    courseSlug: "aws-devops",
    salaryRange: "₹9.5 - ₹22 LPA",
    duration: "14 Weeks",
    mode: "Live Online Hands-On",
    techStack: ["AWS Cloud", "Kubernetes", "Terraform", "GitHub Actions", "Docker", "Prometheus"],
    keyHighlights: [
      "AWS Solution Architect Prep",
      "Live Kubernetes Cluster",
      "Zero-Downtime Deployments",
    ],
    projectPreview: "Multi-Region Kubernetes GitOps Delivery Platform with ArgoCD",
  },
  {
    id: 5,
    category: "Modern Web",
    badge: "React 19 & Next.js",
    title: "MERN & Modern Full-Stack Web Architecture",
    tagline: "Build Scalable Web Products with React 19, Node.js & TypeScript",
    description:
      "Full-stack web engineering from high-performance React client architectures, Next.js App Router, GraphQL APIs, and NoSQL databases to production deployments.",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1600&auto=format&fit=crop&q=85",
    courseSlug: "react-fullstack",
    salaryRange: "₹7.5 - ₹16 LPA",
    duration: "12 Weeks",
    mode: "Flexible & Interactive",
    techStack: ["React 19", "Next.js", "TypeScript", "Node.js", "MongoDB", "TailwindCSS"],
    keyHighlights: [
      "Production SaaS Platform",
      "SSR & Edge Optimization",
      "Full Auth & Stripe Flow",
    ],
    projectPreview: "Real-Time Collaborative Workspace with Live Video & WebSockets",
  },
  {
    id: 6,
    category: "Product & Experience",
    badge: "Design Systems Master",
    title: "UI/UX Product Design & User Research",
    tagline: "Design Frictionless, High-Conversion Digital Experiences",
    description:
      "Master end-to-end product design from user discovery interviews, wireframing, component-driven Figma design tokens, and interactive micro-animations to design-to-code handoff.",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1600&auto=format&fit=crop&q=85",
    courseSlug: "ui-ux-design",
    salaryRange: "₹7.0 - ₹15 LPA",
    duration: "10 Weeks",
    mode: "Studio & Portfolio Led",
    techStack: ["Figma", "Design Tokens", "FigJam", "Protopie", "UserTesting", "WCAG 2.2"],
    keyHighlights: [
      "3 Real Case Studies",
      "Portfolio Review by Lead Designers",
      "Interactive Prototypes",
    ],
    projectPreview: "Fintech Mobile Banking App & Complete Design System Tokens",
  },
  {
    id: 7,
    category: "Quality Engineering",
    badge: "SDET Automation",
    title: "QA Automation & SDET Engineering",
    tagline: "Build Scalable Enterprise Test Automation Frameworks",
    description:
      "Elevate beyond manual testing to build robust test frameworks using Playwright, Selenium WebDriver, Cypress, API testing with RestAssured, and CI test pipelines.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&auto=format&fit=crop&q=85",
    courseSlug: "software-testing",
    salaryRange: "₹6.5 - ₹14 LPA",
    duration: "12 Weeks",
    mode: "Live Practical Sessions",
    techStack: ["Playwright", "Selenium", "Cypress", "RestAssured", "JUnit", "Jenkins CI"],
    keyHighlights: [
      "Enterprise Test Automation Suite",
      "Cross-Browser Grid",
      "API & Performance Testing",
    ],
    projectPreview: "End-to-End Enterprise E-Commerce Automation Framework",
  },
  {
    id: 8,
    category: "Security & SOC",
    badge: "Defense & SOC Analyst",
    title: "Cyber Security, Ethical Hacking & SOC",
    tagline: "Defend Enterprise Infrastructure & Hunt Advanced Threats",
    description:
      "Hands-on threat intelligence, SIEM operations with Splunk, network forensics with Wireshark, ethical hacking, vulnerability assessments, and SOC incident response.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&auto=format&fit=crop&q=85",
    courseSlug: "cyber-security",
    salaryRange: "₹8.0 - ₹19 LPA",
    duration: "14 Weeks",
    mode: "Virtual Cyber Range",
    techStack: ["Splunk SIEM", "Wireshark", "Burp Suite", "Kali Linux", "Metasploit", "NIST"],
    keyHighlights: [
      "Virtual Cyber Range Attack Sims",
      "SOC L1/L2 Incident Response",
      "Security Audit Reports",
    ],
    projectPreview: "Enterprise SOC Threat Hunting & Incident Response Playbook",
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [isPlaying, nextSlide]);

  const current = HERO_SLIDES[currentIndex];

  return (
    <section
      className="relative min-h-[90vh] lg:min-h-[94vh] w-full overflow-hidden border-b border-border bg-background flex flex-col justify-between"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      aria-label="Flagship Career Tracks Carousel"
    >
      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        defaultCourseSlug={current.courseSlug}
      />

      {/* ============================================================ */}
      {/* 100% FULL-BLEED OCCUPIED BACKGROUND IMAGE WITH CINEMATIC FX */}
      {/* ============================================================ */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current.id}
          custom={direction}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="absolute inset-0 -z-10"
        >
          <img
            src={current.image}
            alt={current.title}
            className="h-full w-full object-cover object-center brightness-[0.75] saturate-[1.15] contrast-[1.05]"
          />
          {/* Edge-to-edge subtle gradient overlay so image remains 100% vibrant while text has maximum readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </motion.div>
      </AnimatePresence>

      {/* ============================================================ */}
      {/* MAIN HERO CONTENT GRID                                       */}
      {/* ============================================================ */}
      <div className="mx-auto flex max-w-7xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          {/* Left Column: Glassmorphic Typography & Action Controls */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-6 rounded-3xl border border-border/80 bg-background/80 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl"
            >
              {/* Category, Badge, and Slide Counter */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  {current.category}
                </span>
                <Badge
                  variant="outline"
                  className="border-highlight/40 bg-highlight/10 text-highlight text-xs font-bold"
                >
                  {current.badge}
                </Badge>
                <span className="ml-auto font-mono text-xs font-semibold text-muted-foreground">
                  Track 0{current.id} / 08
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.1]">
                  {current.title}
                </h1>
                <p className="mt-3 text-base font-semibold text-primary sm:text-lg">
                  {current.tagline}
                </p>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {current.description}
                </p>
              </div>

              {/* Tech Stack Pills */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2">
                  Mastered Tech Stack & Frameworks
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {current.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-border/80 bg-surface/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-border/60">
                {current.keyHighlights.map((h) => (
                  <div key={h} className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => setEnquiryOpen(true)}
                  className="shadow-xl shadow-primary/25 font-bold"
                >
                  Enquire for Next Cohort <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>

                <Button asChild variant="subtle" size="lg" className="border border-border font-semibold">
                  <Link to="/courses/$slug" params={{ slug: current.courseSlug }}>
                    View Full Syllabus <ExternalLink className="h-3.5 w-3.5 ml-1.5 text-muted-foreground" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Column: 100% Visual Showcase & Live Stats Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-surface/90 p-6 backdrop-blur-2xl shadow-2xl"
            >
              {/* Highlight image preview */}
              <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-2xl border border-white/10 shadow-inner">
                <img
                  src={current.image}
                  alt={current.title}
                  className="h-full w-full object-cover object-center brightness-95 transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-md bg-background/85 px-2.5 py-1 text-[11px] font-bold text-foreground backdrop-blur-md">
                    <Zap className="h-3 w-3 text-primary" /> Live Cohort Capstone
                  </span>
                  <Badge variant="default" className="bg-primary text-primary-foreground text-[10px]">
                    {current.mode}
                  </Badge>
                </div>
              </div>

              {/* Capstone Description */}
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Capstone Project
                </p>
                <p className="text-sm font-bold text-foreground mt-0.5">{current.projectPreview}</p>
              </div>

              {/* Stats Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-border/80">
                <div className="rounded-xl border border-border/80 bg-background/60 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Salary Range</span>
                  </div>
                  <p className="mt-1 font-display text-lg font-extrabold text-foreground">
                    {current.salaryRange}
                  </p>
                </div>

                <div className="rounded-xl border border-border/80 bg-background/60 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Duration</span>
                  </div>
                  <p className="mt-1 font-display text-lg font-extrabold text-foreground">
                    {current.duration}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 8-TRACK VISUAL THUMBNAILS & NAVIGATION CONTROLS              */}
      {/* ============================================================ */}
      <div className="border-t border-border/80 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Previous / Next Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-all hover:border-primary/60 hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next Slide"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-all hover:border-primary/60 hover:bg-accent"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying((v) => !v)}
              aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* 8-Track Thumbnail Navigation Bar */}
          <div className="flex flex-1 items-center justify-start lg:justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`group relative flex items-center gap-2 rounded-xl border px-3 py-1.5 text-left transition-all shrink-0 ${
                    isActive
                      ? "border-primary bg-primary/15 shadow-md ring-1 ring-primary/40"
                      : "border-border/80 bg-surface/60 hover:border-primary/40 hover:bg-surface"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-6 w-6 rounded-md object-cover border border-border"
                  />
                  <div className="hidden sm:block text-left">
                    <p className={`text-[11px] font-bold truncate max-w-[110px] ${isActive ? "text-primary" : "text-foreground"}`}>
                      {slide.category}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">0{slide.id}</span>
                </button>
              );
            })}
          </div>

          {/* Slide Indicator Badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Slide <strong className="text-foreground">{currentIndex + 1}</strong> of {HERO_SLIDES.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
