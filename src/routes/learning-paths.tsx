import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Cloud,
  Code2,
  Cpu,
  GraduationCap,
  Layers,
  Rocket,
  Shield,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

export const Route = createFileRoute("/learning-paths")({
  head: () => ({
    meta: [
      { title: `Learning Paths | ${site.name}` },
      {
        name: "description",
        content:
          "Structured learning paths at GuideSoft IT — from beginner to job-ready in Software Development, Data & AI, Cloud DevOps, Testing, and Design. Find the path that matches your career goal.",
      },
    ],
  }),
  component: LearningPaths,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const paths = [
  {
    id: "full-stack-developer",
    icon: Code2,
    color: "cyan",
    badge: "Most Popular",
    title: "Full Stack Developer",
    subtitle: "Java or Python → Spring Boot / Django → React → Cloud",
    duration: "32–40 weeks",
    salary: "₹6–18 LPA",
    level: "Beginner → Job-Ready",
    description: "The most comprehensive path to becoming a complete full-stack engineer. You choose your backend language (Java or Python), master a production framework, build a React frontend, and deploy to AWS Cloud — with system design and interview preparation woven throughout.",
    stages: [
      { name: "Foundation", weeks: "4 weeks", courses: ["Programming Fundamentals", "Git & Version Control", "Web Fundamentals (HTML/CSS/JS)"] },
      { name: "Backend Mastery", weeks: "14 weeks", courses: ["Java Full Stack Development OR Python Full Stack & GenAI", "REST API Design", "PostgreSQL & Database Design"] },
      { name: "Frontend Engineering", weeks: "8 weeks", courses: ["React & Next.js Frontend Development", "TypeScript Masterclass", "UI Component Design Systems"] },
      { name: "Cloud & DevOps", weeks: "6 weeks", courses: ["AWS Cloud & DevOps (Intro Track)", "Docker & Containerization", "CI/CD with GitHub Actions"] },
      { name: "Career Launch", weeks: "4–8 weeks", courses: ["System Design Fundamentals", "DSA & Interview Preparation", "Placement Program (6 mock interviews)"] },
    ],
    outcomes: ["Full-stack web applications", "REST & GraphQL APIs", "Cloud-deployed portfolio", "System Design competency"],
    hiresAt: ["TCS Digital", "Infosys", "Amazon India", "Flipkart", "Product Startups"],
  },
  {
    id: "data-scientist",
    icon: BarChart3,
    color: "amber",
    badge: "Highest Salary Potential",
    title: "Data Scientist & AI Engineer",
    subtitle: "Python → ML → Deep Learning → GenAI → MLOps",
    duration: "36–44 weeks",
    salary: "₹10–25 LPA",
    level: "Beginner → Senior",
    description: "Go from zero to a production-ready AI/ML Engineer. This path covers the complete data science spectrum — from exploratory analysis and ML algorithms to deep learning, generative AI with LLMs, and deploying models to production with MLOps practices.",
    stages: [
      { name: "Python & Data Foundation", weeks: "6 weeks", courses: ["Python for Data Science", "SQL & Data Engineering Basics", "Statistics for Data Science"] },
      { name: "Machine Learning", weeks: "8 weeks", courses: ["Data Science & Machine Learning (Full Course)", "Kaggle Competitions Practice", "Feature Engineering & Model Evaluation"] },
      { name: "Deep Learning & NLP", weeks: "6 weeks", courses: ["Deep Learning with PyTorch", "NLP & Text Classification", "Computer Vision Fundamentals"] },
      { name: "Generative AI Engineering", weeks: "10 weeks", courses: ["Python Full Stack & Generative AI Engineering", "LLM Fine-tuning & RAG Systems", "Agentic AI with LangChain"] },
      { name: "MLOps & Production", weeks: "6 weeks", courses: ["MLflow & Experiment Tracking", "AWS SageMaker & Model Deployment", "AI Monitoring & Observability"] },
    ],
    outcomes: ["End-to-end ML models in production", "GenAI / LLM applications", "Data storytelling dashboards", "MLOps pipelines"],
    hiresAt: ["Amazon AI", "Microsoft India", "Swiggy", "HDFC Bank Data Team", "AI Startups"],
  },
  {
    id: "devops-cloud-engineer",
    icon: Cloud,
    color: "lime",
    badge: "Fastest Hiring",
    title: "Cloud & DevOps Engineer",
    subtitle: "Linux → Docker → Kubernetes → AWS → Terraform → CI/CD",
    duration: "24–28 weeks",
    salary: "₹8–20 LPA",
    level: "Basic IT → Senior Cloud",
    description: "Become the cloud infrastructure expert every engineering team desperately needs. This path takes you from Linux fundamentals through containerization, Kubernetes orchestration, AWS cloud architecture, and infrastructure as code — culminating in AWS certification readiness.",
    stages: [
      { name: "Linux & Networking", weeks: "3 weeks", courses: ["Linux System Administration", "TCP/IP Networking & DNS", "Shell Scripting & Automation"] },
      { name: "Containers & Orchestration", weeks: "6 weeks", courses: ["Docker: Complete Containerization", "Kubernetes Core (CKA Prep)", "AWS EKS: Managed Kubernetes"] },
      { name: "AWS Cloud Architecture", weeks: "8 weeks", courses: ["AWS Cloud & DevOps Engineering (Full Course)", "AWS Solutions Architect Associate Prep", "AWS Security & Cost Optimization"] },
      { name: "Infrastructure as Code", weeks: "4 weeks", courses: ["Terraform: Infrastructure as Code", "AWS CloudFormation", "Ansible: Configuration Management"] },
      { name: "CI/CD & DevSecOps", weeks: "4 weeks", courses: ["GitHub Actions & Jenkins Pipelines", "DevSecOps: Security in CI/CD", "GitOps with ArgoCD"] },
    ],
    outcomes: ["AWS multi-region architectures", "Kubernetes production clusters", "Terraform IaC modules", "AWS Certified (SAA-C03)"],
    hiresAt: ["Accenture Cloud", "Cognizant", "Microsoft Azure", "AWS PSA", "Cloud-native startups"],
  },
  {
    id: "sdet-qa-engineer",
    icon: Shield,
    color: "rose",
    badge: "Career Switch Friendly",
    title: "SDET & Quality Engineering",
    subtitle: "Java → Selenium → API Testing → Performance → CI/CD QA",
    duration: "20–24 weeks",
    salary: "₹5–14 LPA",
    level: "Non-IT → QA Engineer",
    description: "Software quality engineering is one of the most accessible entry points into tech. This path takes you from programming basics through the complete SDET toolkit — Selenium automation, API testing, performance testing with JMeter, and integrating quality gates into CI/CD pipelines.",
    stages: [
      { name: "Java & Testing Basics", weeks: "4 weeks", courses: ["Java for Testers", "Software Testing Fundamentals (ISTQB concepts)", "JIRA & Agile QA Practices"] },
      { name: "Web Automation with Selenium", weeks: "6 weeks", courses: ["Selenium & API Testing Automation (Full Course)", "Page Object Model Design", "TestNG & Parallel Execution"] },
      { name: "API & Performance Testing", weeks: "4 weeks", courses: ["REST API Testing with RestAssured", "Postman & Newman", "JMeter Performance Testing"] },
      { name: "BDD & Advanced Automation", weeks: "4 weeks", courses: ["Cucumber BDD & Gherkin", "Playwright for Modern Apps", "Visual & Accessibility Testing"] },
      { name: "DevOps Integration & Career", weeks: "4 weeks", courses: ["GitHub Actions QA Pipelines", "SDET Interview Preparation", "Automation Framework Architecture"] },
    ],
    outcomes: ["Complete Selenium + API test suites", "BDD with Cucumber framework", "CI/CD integrated quality gates", "JMeter performance reports"],
    hiresAt: ["HCL Technologies", "Cognizant QA", "Infosys Testing CoE", "Banking & Insurance firms"],
  },
  {
    id: "frontend-specialist",
    icon: Layers,
    color: "violet",
    badge: "Design + Code",
    title: "Frontend & UI Engineer",
    subtitle: "HTML/CSS → React → Next.js → TypeScript → Design Systems",
    duration: "20–24 weeks",
    salary: "₹5–12 LPA",
    level: "Beginner → Mid-level",
    description: "The dedicated path for engineers who want to master the craft of frontend engineering — where pixel-perfect design meets performant, accessible code. Covers the complete React ecosystem including Next.js 14, TypeScript, and production-grade component design systems.",
    stages: [
      { name: "Web Foundations", weeks: "3 weeks", courses: ["HTML5 & Semantic Markup", "CSS3: Flexbox, Grid & Animations", "JavaScript ES2024 & Browser APIs"] },
      { name: "React Mastery", weeks: "8 weeks", courses: ["React & Next.js Frontend Development (Full Course)", "TypeScript for React Engineers", "State Management: Zustand & React Query"] },
      { name: "UI/UX Design Principles", weeks: "4 weeks", courses: ["UI/UX Product Design (Core Modules)", "Figma for Developers", "Accessibility & WCAG 2.2"] },
      { name: "Production Engineering", weeks: "5 weeks", courses: ["Next.js 14 App Router & Server Components", "Performance: Core Web Vitals Optimization", "Testing React with Vitest & Playwright"] },
      { name: "Portfolio & Launch", weeks: "4 weeks", courses: ["Frontend System Design", "Portfolio Project Polish", "Frontend Interview Preparation"] },
    ],
    outcomes: ["Production-deployed React/Next.js apps", "TypeScript-first component libraries", "Core Web Vitals 90+ score", "Figma-to-code workflow"],
    hiresAt: ["Razorpay", "Freshworks", "Flipkart", "Design-led startups", "Product companies"],
  },
];

const comparisonMatrix = [
  { feature: "Course Duration", java: "24 weeks", python: "20 weeks", aws: "18 weeks", testing: "16 weeks", frontend: "14 weeks" },
  { feature: "Weekly Commitment", java: "12-15 hrs", python: "14-16 hrs", aws: "10-12 hrs", testing: "10 hrs", frontend: "12 hrs" },
  { feature: "Starting Salary", java: "₹6-12 LPA", python: "₹10-20 LPA", aws: "₹8-18 LPA", testing: "₹5-12 LPA", frontend: "₹5-10 LPA" },
  { feature: "Job Market Demand", java: "Very High", python: "Extremely High", aws: "Very High", testing: "High", frontend: "High" },
  { feature: "Prior Coding Needed", java: "No", python: "No", aws: "Helpful", testing: "Helpful", frontend: "No" },
  { feature: "AWS Certification Prep", java: "Partial", python: "No", aws: "SAA-C03 + DVA-C02", testing: "No", frontend: "No" },
];

function LearningPaths() {
  return (
    <div className="bg-background text-foreground">
      {/* HERO */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              5 Career Paths · 24–44 Weeks
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Choose your path.{" "}
              <span className="text-gradient">We'll get you there.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              GuideSoft IT's structured learning paths map your journey from where you are today to the specific engineering role you want — with the right courses, in the right sequence, with real placement support.
            </p>
            <div className="mt-6 flex justify-center gap-6 text-sm text-muted-foreground">
              {[
                { icon: GraduationCap, v: "5 Paths" },
                { icon: Target, v: "Job-Focused" },
                { icon: TrendingUp, v: "Industry-Aligned" },
                { icon: Star, v: "Mentor-Guided" },
              ].map((s) => (
                <div key={s.v} className="flex items-center gap-1.5">
                  <s.icon className="h-4 w-4 text-primary" />
                  <span>{s.v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PATHS */}
      <Section>
        <div className="space-y-12">
          {paths.map((path, idx) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={idx}
                className="surface-panel rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300"
              >
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">{path.badge}</Badge>
                          <Badge variant="secondary" className="text-xs">{path.level}</Badge>
                        </div>
                        <h2 className="font-display text-xl font-bold text-foreground">{path.title}</h2>
                        <p className="text-sm text-muted-foreground">{path.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex gap-6 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-semibold text-foreground text-sm">{path.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Salary Range</p>
                        <p className="font-semibold text-gradient text-sm">{path.salary}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-3xl">{path.description}</p>
                </div>

                {/* Stages */}
                <div className="p-6">
                  <p className="text-xs font-semibold text-foreground mb-4 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    Learning Stages
                  </p>
                  <div className="overflow-x-auto">
                    <div className="flex gap-3 min-w-max pb-2">
                      {path.stages.map((stage, si) => (
                        <div key={stage.name} className="flex items-start gap-2">
                          <div className="bg-surface border border-border rounded-xl p-3 w-52">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="text-xs">{si + 1}</Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />{stage.weeks}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-foreground mb-2">{stage.name}</p>
                            <ul className="space-y-1">
                              {stage.courses.map((c) => (
                                <li key={c} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                  <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {si < path.stages.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-muted-foreground mt-6 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">You'll be able to</p>
                      <ul className="space-y-1.5">
                        {path.outcomes.map((o) => (
                          <li key={o} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Zap className="h-3 w-3 text-primary shrink-0" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">Placed at companies like</p>
                      <div className="flex flex-wrap gap-1.5">
                        {path.hiresAt.map((c) => (
                          <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <EnquiryDialog courseName={`${path.title} Learning Path`}>
                      <Button id={`path-enquire-${path.id}`} className="rounded-xl">
                        Enquire About This Path
                      </Button>
                    </EnquiryDialog>
                    <Button asChild variant="outline" className="rounded-xl">
                      <Link to="/courses">See Individual Courses</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* COMPARISON */}
      <Section className="bg-surface/30">
        <SectionHeading
          eyebrow="Quick Comparison"
          title="Not sure which path to choose?"
          centered
        />
        <p className="text-center text-muted-foreground text-sm mt-2 mb-10">
          Here's a side-by-side view of our most popular individual courses. Book a free career counselling session for personalised guidance.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="py-3 px-4 text-left text-xs text-muted-foreground font-medium">Feature</th>
                <th className="py-3 px-4 text-center text-xs text-primary font-medium">Java Full Stack</th>
                <th className="py-3 px-4 text-center text-xs text-primary font-medium">Python & GenAI</th>
                <th className="py-3 px-4 text-center text-xs text-primary font-medium">AWS DevOps</th>
                <th className="py-3 px-4 text-center text-xs text-primary font-medium">SDET</th>
                <th className="py-3 px-4 text-center text-xs text-primary font-medium">React Frontend</th>
              </tr>
            </thead>
            <tbody>
              {comparisonMatrix.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? "bg-background" : "bg-surface/30"}>
                  <td className="py-3 px-4 font-medium text-foreground text-xs">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-xs text-muted-foreground">{row.java}</td>
                  <td className="py-3 px-4 text-center text-xs text-muted-foreground">{row.python}</td>
                  <td className="py-3 px-4 text-center text-xs text-muted-foreground">{row.aws}</td>
                  <td className="py-3 px-4 text-center text-xs text-muted-foreground">{row.testing}</td>
                  <td className="py-3 px-4 text-center text-xs text-muted-foreground">{row.frontend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <EnquiryDialog courseName="Learning Path Counselling">
            <Button id="path-counselling-btn" size="lg" className="rounded-xl">
              Get Free Personalised Recommendation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </EnquiryDialog>
        </div>
      </Section>

      <CtaBand />
    </div>
  );
}
