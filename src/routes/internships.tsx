import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Laptop,
  MapPin,
  Star,
  Users,
  Zap,
} from "lucide-react";

import { AnimatedSection } from "@/components/animated-section";
import { StaggerContainer, staggerItem } from "@/components/stagger-container";
import { CtaBand } from "@/components/cta-band";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

export const Route = createFileRoute("/internships")({
  head: () => ({
    meta: [
      { title: `Internships | ${site.name}` },
      {
        name: "description",
        content:
          "GuideSoft IT Internship Programme — 4–8 week guided project internships in Web Development, Data Science, QA Automation, and UI/UX Design with real industry mentors.",
      },
    ],
  }),
  component: Internships,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const internships = [
  {
    slug: "web-platform-internship",
    category: "Software Development",
    title: "Full Stack Web Platform Internship",
    duration: "8 weeks",
    mode: "Online (Live Mentor Sessions)",
    stipend: "Completion Bonus ₹5,000",
    seats: "20 seats per cohort",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    description:
      "Build a production-ready multi-feature web platform using React, Node.js, and PostgreSQL under the guidance of senior engineers. Weekly code reviews, peer collaboration, and a final project demo to an industry panel.",
    deliverables: [
      "Production-deployed web application",
      "GitHub portfolio entry with documentation",
      "Code review-based learning journal",
      "Recommendation letter upon completion",
    ],
    skills: ["React", "Node.js", "PostgreSQL", "Git", "REST APIs", "Deployment"],
    mentor: "Rajesh Kumar Sharma (Amazon & Infosys)",
    eligibility:
      "Completed GuideSoft Java Full Stack or React course, OR 6+ months of self-taught experience",
    nextBatch: "September 2, 2025",
    accent: "cyan",
  },
  {
    slug: "data-insights-internship",
    category: "Data & AI",
    title: "Data Science & Analytics Internship",
    duration: "6 weeks",
    mode: "Online (Live Mentor Sessions)",
    stipend: "Completion Bonus ₹4,000",
    seats: "15 seats per cohort",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    description:
      "Work on a real business dataset (retail or fintech sector) — clean, analyze, model, and visualize insights for a simulated stakeholder audience. Build your data portfolio with industry-mentored projects.",
    deliverables: [
      "End-to-end Jupyter Notebook analysis",
      "Interactive Streamlit or Power BI dashboard",
      "Written insight brief for business stakeholders",
      "Kaggle-ready project documentation",
    ],
    skills: ["Python", "Pandas", "Scikit-learn", "SQL", "Tableau", "Statistics"],
    mentor: "Pradeep Ganguly (Flipkart & HDFC Bank)",
    eligibility: "Completed GuideSoft Data Science course or equivalent Python/ML background",
    nextBatch: "September 8, 2025",
    accent: "amber",
  },
  {
    slug: "qa-automation-internship",
    category: "Testing & QA",
    title: "QA Automation Engineer Internship",
    duration: "4 weeks",
    mode: "Online (Live Mentor Sessions)",
    stipend: "Completion Bonus ₹3,000",
    seats: "18 seats per cohort",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&auto=format&fit=crop&q=80",
    description:
      "Build a complete Selenium + RestAssured automation framework for a real web application. Learn from India's most experienced SDET practitioners — write real test cases, fix real bugs, and integrate your framework with GitHub Actions.",
    deliverables: [
      "Functional Selenium automation framework (100+ test cases)",
      "API test collection with RestAssured",
      "GitHub Actions CI/CD integration",
      "Bug report with reproduction steps and root cause analysis",
    ],
    skills: ["Selenium 4", "Java", "TestNG", "RestAssured", "GitHub Actions", "Postman"],
    mentor: "Narasimha Rao Paluri (HCL Technologies)",
    eligibility: "Completed GuideSoft SDET course or basic Java + testing fundamentals",
    nextBatch: "September 15, 2025",
    accent: "rose",
  },
  {
    slug: "design-portfolio-internship",
    category: "UI/UX Design",
    title: "UI/UX Product Design Internship",
    duration: "6 weeks",
    mode: "Online (Live Mentor Sessions)",
    stipend: "Completion Bonus ₹3,500",
    seats: "12 seats per cohort",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop&q=80",
    description:
      "Redesign a real product's user experience end-to-end — from research and competitive analysis through wireframes, high-fidelity prototypes, and usability testing. Build the portfolio case study that hiring managers actually want to see.",
    deliverables: [
      "User research report (interviews + competitive analysis)",
      "Complete Figma prototype (mobile + desktop)",
      "Usability test report with 5 real users",
      "Portfolio case study ready for sharing",
    ],
    skills: [
      "Figma",
      "User Research",
      "Wireframing",
      "Prototyping",
      "Usability Testing",
      "Design Systems",
    ],
    mentor: "Swathi Rao Pulluru (Razorpay & Freshworks)",
    eligibility:
      "Completed GuideSoft UI/UX Design course or a strong portfolio of personal design projects",
    nextBatch: "September 22, 2025",
    accent: "violet",
  },
  {
    slug: "genai-builder-internship",
    category: "Generative AI",
    title: "Generative AI Builder Internship",
    duration: "6 weeks",
    mode: "Online (Live Mentor Sessions)",
    stipend: "Completion Bonus ₹6,000",
    seats: "10 seats per cohort",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80",
    description:
      "Build a real-world GenAI application from scratch — a RAG-powered knowledge assistant, an autonomous research agent, or a domain-specific LLM fine-tuning project. Mentored directly by Dr. Kavitha Subramaniam.",
    deliverables: [
      "Production-ready GenAI application (FastAPI + LangChain)",
      "Technical architecture document",
      "Evaluation report (RAGAs or custom metrics)",
      "Public GitHub repository with demo video",
    ],
    skills: ["Python", "LangChain", "LlamaIndex", "FastAPI", "Vector DBs", "LLM APIs"],
    mentor: "Dr. Kavitha Subramaniam (Google Brain & IIT Madras)",
    eligibility: "Completed GuideSoft Python & GenAI course or equivalent ML + Python experience",
    nextBatch: "October 1, 2025",
    accent: "blue",
  },
  {
    slug: "cloud-devops-internship",
    category: "Cloud & DevOps",
    title: "Cloud & DevOps Engineering Internship",
    duration: "6 weeks",
    mode: "Online (Live Mentor Sessions)",
    stipend: "Completion Bonus ₹5,500",
    seats: "12 seats per cohort",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    description:
      "Design and implement a production-quality cloud infrastructure on AWS using Terraform, deploy containerized applications to Kubernetes (EKS), and build a complete CI/CD pipeline with GitHub Actions — under direct AWS architect mentorship.",
    deliverables: [
      "Terraform modules for complete AWS infrastructure",
      "Kubernetes deployment (EKS) with monitoring",
      "CI/CD pipeline (GitHub Actions → Docker → EKS)",
      "Architecture runbook and cost estimation",
    ],
    skills: ["AWS", "Terraform", "Kubernetes", "Docker", "GitHub Actions", "Monitoring"],
    mentor: "Ramana Murthy Vangala (Amazon AWS & Cognizant)",
    eligibility: "Completed GuideSoft AWS DevOps course or hands-on AWS + Docker experience",
    nextBatch: "October 6, 2025",
    accent: "lime",
  },
];

const programBenefits = [
  {
    icon: Award,
    title: "GuideSoft Internship Certificate",
    desc: "Digitally verified certificate with QR code, shareable on LinkedIn",
  },
  {
    icon: BookOpen,
    title: "Real Project Portfolio",
    desc: "Production-quality deliverables you actually built — not textbook exercises",
  },
  {
    icon: Users,
    title: "Industry Mentor Access",
    desc: "Direct 1-on-1 guidance from practitioners who've built at scale",
  },
  {
    icon: Building2,
    title: "Hiring Partner Referrals",
    desc: "Top performers get direct referrals to our 250+ hiring partner companies",
  },
  {
    icon: Star,
    title: "Completion Bonus",
    desc: "Cash completion bonus (₹3,000–₹6,000) for students who finish on time",
  },
  {
    icon: Laptop,
    title: "Real Tools & Environments",
    desc: "AWS credits, GitHub Pro, Figma Pro — actual tools, not sandboxes",
  },
];

function Internships() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <div className="bg-background text-foreground">
      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        defaultCourseSlug=""
        title="Internship Enquiry"
      />
      {/* HERO */}
      <AnimatedSection direction="down">
        <section className="relative border-b border-border overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
                6 Programmes · Next Batch: September 2025
              </Badge>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Internships that build <span className="text-gradient">real portfolios</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                GuideSoft IT internships are 4–8 week guided project programmes with real industry
                mentors. You build production-quality deliverables, get a verified certificate, and
                earn a completion bonus — not a participation trophy.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {[
                  { icon: Clock, v: "4–8 weeks" },
                  { icon: Laptop, v: "100% Online" },
                  { icon: Zap, v: "Completion Bonus" },
                  { icon: GraduationCap, v: "Verified Certificate" },
                ].map((s) => (
                  <span key={s.v} className="flex items-center gap-1.5">
                    <s.icon className="h-4 w-4 text-primary" />
                    {s.v}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* BENEFITS */}
      <AnimatedSection direction="left">
        <Section className="bg-surface/30">
          <SectionHeading
            eyebrow="Programme Benefits"
            title="What you get from every internship"
            centered
          />
          <StaggerContainer className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programBenefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  variants={staggerItem}
                  className="surface-panel rounded-2xl p-5 flex gap-4"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{b.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </StaggerContainer>
        </Section>
      </AnimatedSection>

      {/* INTERNSHIP CARDS */}
      <AnimatedSection direction="up">
        <Section>
          <SectionHeading eyebrow="Open Programmes" title="Choose your internship track" />
          <StaggerContainer className="mt-10 grid gap-8 lg:grid-cols-2">
            {internships.map((item, i) => (
              <motion.article
                key={item.slug}
                variants={staggerItem}
                className="surface-panel rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-elevated"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex gap-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                      {item.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {item.duration}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Laptop className="h-3.5 w-3.5 text-primary" />
                      {item.mode}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      {item.seats}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      Next: {item.nextBatch}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Award className="h-3.5 w-3.5 text-primary" />
                      {item.stipend}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold text-foreground mb-2">You'll deliver</p>
                    <ul className="space-y-1.5">
                      {item.deliverables.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold text-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      <strong className="text-foreground">Mentor:</strong> {item.mentor}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground">Eligibility:</strong> {item.eligibility}
                    </p>
                  </div>

                  <div className="mt-5">
                    <Button
                      id={`internship-apply-${item.slug}`}
                      className="w-full rounded-xl"
                      onClick={() => setEnquiryOpen(true)}
                    >
                      Apply for This Internship
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </StaggerContainer>

          <div className="mt-12 surface-panel rounded-2xl p-8 text-center">
            <MapPin className="mx-auto h-8 w-8 text-primary mb-3" />
            <h2 className="font-display text-xl font-semibold">Batch limited to 10–20 students</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
              All internship cohorts are strictly capped to ensure mentors can give meaningful
              individual attention. Applications close 2 weeks before each batch start date.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-6 rounded-xl">
              <Link to="/contact">Contact Us for Custom Batches</Link>
            </Button>
          </div>
        </Section>
      </AnimatedSection>

      <CtaBand />
    </div>
  );
}
