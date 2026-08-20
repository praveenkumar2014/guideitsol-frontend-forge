import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Linkedin,
  Mail,
  Star,
  Users,
} from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

export const Route = createFileRoute("/instructors")({
  head: () => ({
    meta: [
      { title: `Instructors | ${site.name}` },
      {
        name: "description",
        content:
          "Meet GuideSoft IT's expert instructors — industry practitioners with 8–18 years of real-world experience at companies like Infosys, Amazon, Google Brain, and Razorpay.",
      },
    ],
  }),
  component: Instructors,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const instructors = [
  {
    name: "Rajesh Kumar Sharma",
    role: "Java Full Stack & Spring Boot",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    exp: "15 years",
    prevOrg: "Amazon & Infosys",
    rating: 4.9,
    students: "5,200+",
    courses: ["Java Full Stack Development", "Spring Boot Microservices", "AWS Cloud & DevOps"],
    tags: ["Java 21", "Spring Boot 3", "AWS ECS", "Microservices", "Kafka", "Docker"],
    bio: "Principal Software Architect with 15 years at Infosys (Bengaluru) and Amazon India. Designed scalable payment processing systems handling ₹500Cr+ daily transaction volume. Expert in microservices, event-driven architecture, and cloud-native patterns. Mentored 5,200+ students placed at TCS, Capgemini, Amazon, and startups.",
    achievements: [
      "Built Infosys's internal API gateway serving 2M+ requests/day",
      "AWS Certified Solutions Architect Professional",
      "Spoke at 8 national tech conferences",
    ],
    education: "B.Tech Computer Science — NIT Warangal",
    languages: "Telugu, English, Hindi",
  },
  {
    name: "Dr. Kavitha Subramaniam",
    role: "Python, GenAI & Machine Learning",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    exp: "12 years",
    prevOrg: "Google Brain & IIT Madras",
    rating: 4.9,
    students: "3,800+",
    courses: [
      "Python Full Stack & GenAI Engineering",
      "Data Science & ML",
      "Generative AI Engineering",
    ],
    tags: ["Python", "LangChain", "PyTorch", "LLM Fine-tuning", "RAG Systems", "MLOps"],
    bio: "PhD in Machine Learning from IIT Madras. 12 years of research and applied engineering at Google Brain and Meta AI Research India. Published 40+ papers on large language models; contributed to Google's PaLM architecture. Teaching philosophy: build real intuition before writing a line of code. Every concept grounded in production use cases.",
    achievements: [
      "40+ research publications in top ML conferences (NeurIPS, ICML)",
      "Contributed to Google PaLM language model architecture",
      "TED-style talk on 'AI for Bharat' viewed 800K+ times on YouTube",
    ],
    education: "PhD Machine Learning — IIT Madras",
    languages: "Tamil, Telugu, English",
  },
  {
    name: "Ramana Murthy Vangala",
    role: "AWS Cloud & DevOps Engineering",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    exp: "10 years",
    prevOrg: "Amazon AWS & Cognizant",
    rating: 4.8,
    students: "4,100+",
    courses: ["AWS Cloud & DevOps Engineering", "Terraform & IaC Masterclass", "Kubernetes & EKS"],
    tags: ["AWS", "Terraform", "Kubernetes", "GitHub Actions", "EKS", "Security"],
    bio: "AWS Principal Architect with 10 years designing cloud infrastructure at Amazon AWS Professional Services and Cognizant. AWS Certified in 8 specializations including Solutions Architect Professional, Security Specialty, and DevOps Engineer Professional. Saved enterprise clients $2M+ annually through cloud cost optimization. Teaches AWS the way real architects think — with cost, security, and reliability at the center.",
    achievements: [
      "AWS Certified in 8 specializations (Pro + Specialty level)",
      "Designed AWS infrastructure for 3 NSE-listed companies",
      "Saved clients $2M+ in annual cloud costs through right-sizing",
    ],
    education: "B.E. Electronics — Andhra University",
    languages: "Telugu, English",
  },
  {
    name: "Pradeep Ganguly",
    role: "Data Science & Business Analytics",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    exp: "12 years",
    prevOrg: "Flipkart & HDFC Bank",
    rating: 4.8,
    students: "6,200+",
    courses: [
      "Data Science & Machine Learning",
      "Power BI & Data Analytics",
      "Business Intelligence",
    ],
    tags: ["Python", "Pandas", "SQL", "Tableau", "Spark", "Statistics", "A/B Testing"],
    bio: "Chief Data Scientist with 12 years building recommendation systems at Flipkart and fraud detection models at HDFC Bank. IIT Kharagpur alumni. His recommendation engine improvements increased Flipkart GMV by ₹200Cr+. Teaches data science the way data teams work — messy real datasets, business constraints, and stakeholder communication. Over 6,200 students trained.",
    achievements: [
      "Built Flipkart's recommendation engine (₹200Cr+ GMV impact)",
      "HDFC Bank fraud detection: reduced false positives by 40%",
      "IIT Kharagpur Young Alumni Award 2022",
    ],
    education: "B.Tech Computer Science — IIT Kharagpur",
    languages: "Bengali, Hindi, English",
  },
  {
    name: "Narasimha Rao Paluri",
    role: "SDET & Test Automation",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    exp: "18 years",
    prevOrg: "HCL Technologies & Tata Steel",
    rating: 4.8,
    students: "3,600+",
    courses: [
      "Selenium & API Testing Automation",
      "SDET Bootcamp",
      "Performance Testing with JMeter",
    ],
    tags: ["Selenium 4", "Playwright", "RestAssured", "JMeter", "Cucumber", "BDD", "TestNG"],
    bio: "18-year veteran of software quality engineering at HCL Technologies and Tata Steel Digital. ISTQB Certified Test Manager and Expert. Built QA frameworks used across 10,000+ developer codebases. Pioneered DevSecQA practices at HCL — integrating security testing into CI/CD pipelines at scale. Teaches testing as a craft, not just a checklist activity.",
    achievements: [
      "ISTQB Certified Test Manager & Expert (Level 3)",
      "Built HCL's enterprise QA framework adopted by 10,000+ developers",
      "Keynote speaker: India Testing Conference 2019, 2022, 2024",
    ],
    education: "M.Tech Software Engineering — JNTU Hyderabad",
    languages: "Telugu, English, Hindi",
  },
  {
    name: "Swathi Rao Pulluru",
    role: "React, Next.js & Frontend Architecture",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    exp: "8 years",
    prevOrg: "Razorpay & Freshworks",
    rating: 4.9,
    students: "4,800+",
    courses: [
      "React & Next.js Frontend Development",
      "TypeScript Masterclass",
      "UI/UX Product Design",
    ],
    tags: ["React 18", "Next.js 14", "TypeScript", "Tailwind CSS", "Performance", "Accessibility"],
    bio: "Senior Frontend Architect with 8 years building design systems and payment UIs at Razorpay and CRM dashboards at Freshworks. Conference speaker at ReactConf India and JSConf Asia. Obsessed with accessibility, performance, and the craft of component API design. Her Razorpay checkout redesign increased mobile conversion by 23%.",
    achievements: [
      "Razorpay mobile checkout redesign: +23% conversion improvement",
      "Speaker: ReactConf India 2022, JSConf Asia 2023",
      "Creator of popular open-source React hooks library (2.1k GitHub stars)",
    ],
    education: "B.Tech IT — IIIT Hyderabad",
    languages: "Telugu, English",
  },
  {
    name: "Vikram Babu Dasari",
    role: "SAP FICO & Enterprise ERP",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    exp: "16 years",
    prevOrg: "Deloitte & SAP SE Germany",
    rating: 4.7,
    students: "2,900+",
    courses: ["SAP FICO Foundations", "SAP S/4HANA Finance", "SAP Business Analytics"],
    tags: ["SAP FICO", "SAP S/4HANA", "FI", "CO", "Asset Accounting", "ABAP Basics"],
    bio: "SAP Certified Application Associate and Professional with 16 years implementing SAP Finance modules at Deloitte India and SAP SE Germany. Worked on SAP S/4HANA transformations for 30+ Fortune 500 companies across BFSI, Manufacturing, and Pharma sectors. Brings real project war stories into every classroom session.",
    achievements: [
      "Led SAP FICO implementations for 30+ Fortune 500 companies",
      "SAP Certified Professional (FI, CO, S/4HANA Finance)",
      "Deloitte India Outstanding Performer Award 2019",
    ],
    education: "MBA Finance & MCA — Osmania University",
    languages: "Telugu, Hindi, English, German (basic)",
  },
  {
    name: "Chandra Sekhar Reddy Maddi",
    role: "Flutter & Mobile Development",
    avatar:
      "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=400&auto=format&fit=crop&q=80",
    exp: "9 years",
    prevOrg: "Ola Electric & Byju's",
    rating: 4.7,
    students: "2,400+",
    courses: ["Flutter & Dart Mobile Development", "React Native Advanced", "App Store Deployment"],
    tags: ["Flutter", "Dart", "React Native", "Firebase", "iOS", "Android", "App Store"],
    bio: "Senior Mobile Engineer with 9 years building consumer apps at Ola Electric (EV companion app, 1.5M+ downloads) and Byju's Learning App (30M+ users). Expert in Flutter performance optimization, native integrations, and App Store submission workflows. Helped 3 early-stage startups launch their MVP apps.",
    achievements: [
      "Ola Electric app: 1.5M+ downloads, 4.7★ App Store rating",
      "Led mobile engineering for Byju's offline learning feature (30M users)",
      "Flutter contributor: 3 accepted PRs to the main repository",
    ],
    education: "B.Tech Computer Science — VIT Vellore",
    languages: "Telugu, English, Hindi",
  },
];

function Instructors() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <div className="bg-background text-foreground">
      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        defaultCourseSlug="Instructor Session Enquiry"
        title="Instructor Session Enquiry"
      />
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative border-b border-border">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              {instructors.length} Expert Instructors
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Learn from practitioners, <span className="text-gradient">not textbooks</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-lg leading-relaxed">
              Every GuideSoft instructor has built production systems at India's top tech companies.
              They left senior roles because they believe in mission-driven teaching — and they
              bring real industry context to every class.
            </p>
            <div className="mt-6 flex justify-center gap-8">
              {[
                { icon: Users, v: "35+", l: "Instructors" },
                { icon: Star, v: "4.8", l: "Avg. Rating" },
                { icon: Briefcase, v: "8–18 yrs", l: "Avg. Experience" },
                { icon: Award, v: "12,400+", l: "Placements" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <s.icon className="mx-auto h-5 w-5 text-primary mb-1" />
                  <p className="font-display text-xl font-bold text-gradient">{s.v}</p>
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── INSTRUCTOR CARDS ─────────────────────────────────────── */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          {instructors.map((inst, i) => (
            <motion.div
              key={inst.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="surface-panel rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-elevated"
            >
              <div className="flex gap-6 p-6">
                <div className="flex-shrink-0">
                  <img
                    src={inst.avatar}
                    alt={inst.name}
                    className="h-24 w-24 rounded-2xl object-cover object-top ring-2 ring-border"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-display text-lg font-semibold text-foreground">
                        {inst.name}
                      </h2>
                      <p className="text-sm text-primary font-medium">{inst.role}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {inst.exp} · {inst.prevOrg}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold">{inst.rating}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {inst.students} students
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {inst.courses.length} courses
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{inst.bio}</p>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-foreground mb-2">Key Achievements</p>
                  <ul className="space-y-1.5">
                    {inst.achievements.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Award className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-foreground mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {inst.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{inst.education}</p>
                    <p className="text-xs text-muted-foreground">Languages: {inst.languages}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Courses taught */}
              <div className="px-6 pb-6">
                <p className="text-xs font-semibold text-foreground mb-2">Teaches</p>
                <div className="space-y-1">
                  {inst.courses.map((c) => (
                    <div key={c} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 pb-6">
                <Button
                  size="sm"
                  className="w-full rounded-xl"
                  id={`enquire-${inst.name.replace(/\s/g, "-").toLowerCase()}`}
                  onClick={() => setEnquiryOpen(true)}
                >
                  Enquire About This Instructor
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <CtaBand />
    </div>
  );
}
