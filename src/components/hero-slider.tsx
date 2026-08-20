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
  GraduationCap,
  Pause,
  Play,
  Sparkles,
  TrendingUp,
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
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1400&auto=format&fit=crop&q=80",
    courseSlug: "java-full-stack",
    salaryRange: "₹8.5 - ₹18 LPA",
    duration: "16 Weeks",
    mode: "Live Online & Classroom",
    techStack: ["Java 21", "Spring Boot 3", "AWS ECS", "Kafka", "PostgreSQL", "Docker"],
    keyHighlights: ["12 Enterprise Lab Projects", "1-on-1 Code Reviews", "AWS Cloud Sandbox"],
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
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1400&auto=format&fit=crop&q=80",
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
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&auto=format&fit=crop&q=80",
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
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&auto=format&fit=crop&q=80",
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
  },
  {
    id: 5,
    category: "Web Engineering",
    badge: "Modern Frontend & API",
    title: "MERN & Modern Full-Stack Web Architecture",
    tagline: "Engineer Fast, Type-Safe React 19 & Next.js Platforms",
    description:
      "Build real-time collaborative apps, modern server components, state machines, robust Node.js microservices, and GraphQL APIs with zero lag.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&auto=format&fit=crop&q=80",
    courseSlug: "mern-stack",
    salaryRange: "₹7.5 - ₹16 LPA",
    duration: "14 Weeks",
    mode: "Classroom & Live Stream",
    techStack: ["React 19", "Next.js", "TypeScript", "Node.js", "MongoDB", "TailwindCSS"],
    keyHighlights: ["Production App Deployment", "Full-Stack Portfolio", "Real-Time WebSockets"],
  },
  {
    id: 6,
    category: "Product & Experience",
    badge: "Design Systems",
    title: "UI/UX Product Design & User Research",
    tagline: "Craft Pixel-Perfect Human Experiences & Multi-Brand Design Systems",
    description:
      "User discovery sprints, information architecture, wireframing, high-fidelity Figma design tokens, WCAG AA accessibility, and usability testing.",
    image:
      "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=1400&auto=format&fit=crop&q=80",
    courseSlug: "ui-ux-design",
    salaryRange: "₹7.0 - ₹15 LPA",
    duration: "12 Weeks",
    mode: "Live Interactive Studio",
    techStack: ["Figma", "Design Tokens", "FigJam", "Miro", "WCAG 2.2", "Protopie"],
    keyHighlights: ["4 Verified Case Studies", "Interactive Prototypes", "Hiring Portfolio Review"],
  },
  {
    id: 7,
    category: "Quality Engineering",
    badge: "SDET & Automation",
    title: "QA Automation & SDET Engineering",
    tagline: "Automate Enterprise Web, API & Mobile Test Suites with Zero Flakiness",
    description:
      "Master Playwright E2E automation, Selenium WebDriver, RestAssured API validation, Cypress, and integrate test suites directly into CI/CD pipelines.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&auto=format&fit=crop&q=80",
    courseSlug: "qa-automation",
    salaryRange: "₹6.5 - ₹14 LPA",
    duration: "12 Weeks",
    mode: "Hands-on Practice Labs",
    techStack: ["Playwright", "Selenium", "Cypress", "Postman", "JUnit", "Jenkins"],
    keyHighlights: [
      "Complete Test Frameworks",
      "CI Pipeline Integration",
      "Cross-Browser Automation",
    ],
  },
  {
    id: 8,
    category: "Cyber Defense",
    badge: "Enterprise Security",
    title: "Cyber Security, Ethical Hacking & SOC",
    tagline: "Defend Enterprise Infrastructures with Real-Time Threat Hunting & Defense",
    description:
      "Hands-on vulnerability assessments, SIEM Splunk log analysis, incident response, network packet analysis with Wireshark, and cloud security governance.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1400&auto=format&fit=crop&q=80",
    courseSlug: "cyber-security",
    salaryRange: "₹8.0 - ₹19 LPA",
    duration: "14 Weeks",
    mode: "Virtual Cyber Range Labs",
    techStack: [
      "Splunk SIEM",
      "Wireshark",
      "Burp Suite",
      "Linux Security",
      "AWS IAM",
      "NIST Framework",
    ],
    keyHighlights: [
      "Virtual Cyber Range Labs",
      "SOC L1/L2 Incident Drills",
      "Ethical Hacking Portfolio",
    ],
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1);
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
      className="relative min-h-[92vh] w-full overflow-hidden border-b border-border bg-background flex flex-col justify-between"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      aria-label="Flagship Career Tracks Carousel"
    >
      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        defaultCourseSlug={current.courseSlug}
      />

      {/* Background slide image with gradient overlays */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current.id}
          custom={direction}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 -z-10"
        >
          <img
            src={current.image}
            alt={current.title}
            className="h-full w-full object-cover object-center brightness-[0.25] saturate-[1.2]"
          />
          {/* Multi-layered cinematic gradient washes */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        </motion.div>
      </AnimatePresence>

      {/* Main hero slide content */}
      <div className="mx-auto flex max-w-7xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          {/* Left Column: Track Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              className="space-y-6"
            >
              {/* Category & Badge */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  {current.category}
                </span>
                <Badge
                  variant="outline"
                  className="border-highlight/40 bg-highlight/10 text-highlight text-xs"
                >
                  {current.badge}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Slide {currentIndex + 1} of {HERO_SLIDES.length}
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
                  {current.title}
                </h1>
                <p className="mt-4 text-lg font-medium text-primary/95 sm:text-xl">
                  {current.tagline}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {current.description}
                </p>
              </div>

              {/* Tech Stack Pills */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Core Technologies & Tools
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {current.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-border/80 bg-surface/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs & Advisor triggers */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => setEnquiryOpen(true)}
                  className="shadow-lg shadow-primary/20"
                >
                  Enquire for next cohort <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>

                <Button asChild variant="subtle" size="xl" className="border border-border/80">
                  <Link to="/courses/$slug" params={{ slug: current.courseSlug }}>
                    View full curriculum
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Column: Track Metrics Glass Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45 }}
              className="surface-panel relative overflow-hidden rounded-2xl border border-border/80 bg-surface/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Target Salary Potential
                    </p>
                    <p className="mt-1 text-2xl font-bold text-foreground flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-primary" />
                      {current.salaryRange}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Format
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{current.mode}</p>
                  </div>
                </div>

                {/* Key Training Highlights */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Included with Enrollment
                  </p>
                  <ul className="mt-3 space-y-2.5 text-sm text-foreground">
                    {current.keyHighlights.map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>Dedicated Placement Support & Mock Interviews</span>
                    </li>
                  </ul>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/60 bg-background/50 p-3.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>
                      Duration: <strong className="text-foreground">{current.duration}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span>
                      Prep: <strong className="text-foreground">Internship Included</strong>
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button asChild variant="outline" size="sm" className="w-full justify-between">
                    <Link to="/live-batches">
                      <span>View upcoming batch schedule</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Interactive Bottom Slider Controller & 8-Slide Thumbnail Pills */}
      <div className="border-t border-border/70 bg-background/90 backdrop-blur-xl py-3 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-all hover:border-primary hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying((v) => !v)}
              aria-label={isPlaying ? "Pause auto slide" : "Play auto slide"}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-all hover:border-primary hover:bg-accent"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next Slide"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-all hover:border-primary hover:bg-accent"
            >
              <ArrowRight className="h-4 w-4" />
            </button>

            <span className="ml-2 text-xs font-semibold text-muted-foreground hidden sm:inline">
              Track {currentIndex + 1} of 8
            </span>
          </div>

          {/* 8 Track Pills */}
          <div className="flex flex-1 items-center justify-start lg:justify-end gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "border border-primary/60 bg-primary/15 text-primary shadow-sm"
                      : "border border-border/60 bg-surface/60 text-muted-foreground hover:border-border hover:bg-surface hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>{slide.category}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
