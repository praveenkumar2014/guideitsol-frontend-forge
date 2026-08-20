import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
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
    badge: "Flagship Career Track",
    title: "Java Full Stack & Cloud Architecture",
    tagline: "Master Java 21, Spring Boot 3, Microservices & AWS Cloud Deployment",
    description:
      "Architect high-throughput enterprise backend systems, event-driven Kafka pipelines, secure REST APIs, and full-scale AWS cloud infrastructure with industry mentors.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&auto=format&fit=crop&q=90",
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
    category: "Generative AI & LLMs",
    badge: "Next-Gen AI Era",
    title: "Python, GenAI & Agentic Systems",
    tagline: "Engineer Autonomous AI Agents, RAG Pipelines & Production LLM Apps",
    description:
      "From Python fundamentals to fine-tuning LLMs, building retrieval-augmented generation (RAG) systems, vector databases, and multi-agent workflows with LangChain & LlamaIndex.",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&auto=format&fit=crop&q=90",
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
    category: "Data Science & ML",
    badge: "High Hiring Demand",
    title: "Data Science, Machine Learning & Big Data Analytics",
    tagline: "Turn Raw Enterprise Data into Predictive Machine Intelligence",
    description:
      "Master statistical modeling, predictive algorithms, business intelligence with Tableau, automated ETL pipelines, and scalable distributed Spark processing.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&auto=format&fit=crop&q=90",
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
    category: "Cloud & DevOps",
    badge: "Global Certifications",
    title: "AWS Cloud DevOps & Platform Engineering",
    tagline: "Architect Resilient Multi-Region Cloud & Kubernetes GitOps",
    description:
      "Automate end-to-end delivery pipelines with Terraform IaC, multi-tenant Kubernetes clusters, ArgoCD GitOps, and 24x7 Prometheus/Grafana observability.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=90",
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
      "Full-stack web engineering from high-performance React client architectures, Next.js App Router, GraphQL APIs, and NoSQL databases to production edge deployments.",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1920&auto=format&fit=crop&q=90",
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
    category: "Product Design",
    badge: "Design Systems Master",
    title: "UI/UX Product Design & User Experience Research",
    tagline: "Design Frictionless, High-Conversion Digital Experiences",
    description:
      "Master end-to-end product design from user discovery interviews, wireframing, component-driven Figma design tokens, and interactive micro-animations to design-to-code handoff.",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1920&auto=format&fit=crop&q=90",
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
    category: "QA Automation",
    badge: "SDET Automation",
    title: "QA Automation & SDET Engineering",
    tagline: "Build Scalable Enterprise Test Automation Frameworks",
    description:
      "Elevate beyond manual testing to build robust test frameworks using Playwright, Selenium WebDriver, Cypress, API testing with RestAssured, and CI test pipelines.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&auto=format&fit=crop&q=90",
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
    category: "Cyber Defense",
    badge: "SOC Security Analyst",
    title: "Cyber Security, Ethical Hacking & SOC Defense",
    tagline: "Defend Enterprise Infrastructure & Hunt Advanced Threats",
    description:
      "Hands-on threat intelligence, SIEM operations with Splunk, network forensics with Wireshark, ethical hacking, vulnerability assessments, and SOC incident response.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&auto=format&fit=crop&q=90",
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
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, nextSlide]);

  const current = HERO_SLIDES[currentIndex];

  return (
    <section
      className="relative h-[90vh] sm:h-[92vh] lg:h-[95vh] w-full overflow-hidden bg-slate-950 text-white select-none"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      aria-label="Flagship Career Tracks Carousel"
    >
      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        defaultCourseSlug={current.courseSlug}
      />

      {/* ========================================================================= */}
      {/* 100% FULL-SCREEN BACKGROUND IMAGE SLIDER WITH SMOOTH FADE & ZOOM ANIMATION */}
      {/* ========================================================================= */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current.id}
          custom={direction}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 h-full w-full"
        >
          {/* Full-bleed 100% Background Image */}
          <img
            src={current.image}
            alt={current.title}
            className="h-full w-full object-cover object-center brightness-[0.88] saturate-[1.2] contrast-[1.05]"
          />

          {/* Premium Cinema Vignette & Gradients (Keeps 100% image visible while maximizing text readability) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* FLOATING LEFT & RIGHT SLIDE ARROWS                                       */}
      {/* ========================================================================= */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/70 hover:border-white/50 active:scale-95"
      >
        <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/70 hover:border-white/50 active:scale-95"
      >
        <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
      </button>

      {/* ========================================================================= */}
      {/* MAIN HERO CONTENT - IMMERSIVE CINEMA OVERLAY                             */}
      {/* ========================================================================= */}
      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-between px-6 sm:px-12 lg:px-16 pt-16 pb-8">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/60 bg-primary/20 px-4 py-1 text-xs font-bold text-primary-foreground backdrop-blur-md shadow-lg shadow-primary/20">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {current.category}
            </span>
            <Badge variant="outline" className="border-amber-400/50 bg-amber-400/15 text-amber-300 text-xs font-bold backdrop-blur-md">
              {current.badge}
            </Badge>
          </div>

          <div className="flex items-center gap-3 font-mono text-sm font-bold text-white/80">
            <span className="text-primary text-base">0{current.id}</span>
            <span className="text-white/40">/</span>
            <span>08</span>
          </div>
        </div>

        {/* Center Content Typography */}
        <div className="my-auto max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              className="space-y-5"
            >
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-2xl leading-[1.1]">
                {current.title}
              </h1>

              <p className="text-lg sm:text-2xl font-bold text-primary-foreground drop-shadow-md">
                {current.tagline}
              </p>

              <p className="text-sm sm:text-base leading-relaxed text-slate-200/90 max-w-2xl drop-shadow">
                {current.description}
              </p>

              {/* Mastered Tech Stack Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-white/70 mr-1">
                  Stack:
                </span>
                {current.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-white/20 bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Metrics & Highlights Row */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-white/90">
                <div className="flex items-center gap-1.5 rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 backdrop-blur-md">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span>Salary: <strong className="text-white font-bold">{current.salaryRange}</strong></span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 backdrop-blur-md">
                  <Clock className="h-4 w-4 text-sky-400" />
                  <span>Duration: <strong className="text-white font-bold">{current.duration}</strong></span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 backdrop-blur-md">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>{current.mode}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => setEnquiryOpen(true)}
                  className="shadow-2xl shadow-primary/40 font-extrabold text-base px-6 py-6"
                >
                  Enquire for Next Cohort <ArrowRight className="h-5 w-5 ml-2" />
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-black/40 text-white hover:bg-white/20 font-bold backdrop-blur-md px-6 py-6"
                >
                  <Link to="/courses/$slug" params={{ slug: current.courseSlug }}>
                    View Full Syllabus <ExternalLink className="h-4 w-4 ml-2 text-white/80" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM 8-SLIDE THUMBNAILS & PROGRESS BAR                                 */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-3 pt-4 border-t border-white/15">
          {/* 8 Track Interactive Pill Thumbnails */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`group relative flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-left transition-all shrink-0 ${
                    isActive
                      ? "border-primary bg-primary/30 shadow-lg shadow-primary/25 ring-2 ring-primary/60 scale-105"
                      : "border-white/15 bg-black/50 hover:border-white/40 hover:bg-black/70 opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-7 w-7 rounded-lg object-cover border border-white/20"
                  />
                  <div className="hidden md:block text-left">
                    <p className={`text-xs font-extrabold ${isActive ? "text-white" : "text-white/80"}`}>
                      {slide.category}
                    </p>
                    <p className="text-[10px] text-white/60 font-mono">0{slide.id} / 08</p>
                  </div>
                </button>
              );
            })}

            {/* Play / Pause Autoplay Controller */}
            <button
              type="button"
              onClick={() => setIsPlaying((v) => !v)}
              aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/50 shrink-0"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
