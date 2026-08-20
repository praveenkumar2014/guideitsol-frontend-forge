import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Handshake,
  Lightbulb,
  MapPin,
  MessageCircle,
  Rocket,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

export const Route = createFileRoute("/career-center")({
  head: () => ({
    meta: [
      { title: `Career Center | ${site.name}` },
      {
        name: "description",
        content:
          "GuideSoft IT Career Center — placement support, resume reviews, mock interviews, DSA prep, and direct referrals to 250+ hiring partners across India.",
      },
    ],
  }),
  component: CareerCenter,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.5, ease: "easeOut" },
  }),
};

const placementStats = [
  { value: "12,400+", label: "Total Placements", icon: GraduationCap },
  { value: "₹8.4 LPA", label: "Avg. First CTC", icon: TrendingUp },
  { value: "180%", label: "Avg. Salary Hike", icon: Rocket },
  { value: "250+", label: "Hiring Partners", icon: Building2 },
  { value: "₹38 LPA", label: "Highest Offer 2024", icon: Star },
  { value: "6 months", label: "Avg. Time to Offer", icon: Clock },
];

const placementProcess = [
  {
    step: "01",
    icon: FileText,
    title: "Resume & LinkedIn Revamp",
    desc: "Our career coaches perform a line-by-line review of your resume and LinkedIn profile — rewriting it to align with how ATS systems and hiring managers actually shortlist candidates in 2025.",
  },
  {
    step: "02",
    icon: Target,
    title: "Portfolio & GitHub Polish",
    desc: "We help you structure your GitHub portfolio so capstone projects stand out. Recruiters at top companies spend less than 90 seconds per candidate — your profile needs to pass at a glance.",
  },
  {
    step: "03",
    icon: MessageCircle,
    title: "6 Mock Technical Interviews",
    desc: "6 rounds of live technical mock interviews with practicing engineers — covering data structures, system design, language-specific topics, and live coding. Detailed feedback after each round.",
  },
  {
    step: "04",
    icon: Users,
    title: "HR & Behavioral Prep",
    desc: "STAR method coaching for behavioral interviews. We cover common situations, salary negotiation, and how to professionally handle offer timelines and counter-offers.",
  },
  {
    step: "05",
    icon: Handshake,
    title: "Direct Referrals & Job Drives",
    desc: "Our placement team sends your profile directly to HR contacts at 250+ companies. Monthly Job Drives bring 20–30 companies to hire from our active batch — these are not job fairs, they are curated hiring events.",
  },
  {
    step: "06",
    icon: CheckCircle2,
    title: "Post-Offer Support",
    desc: "We support you even after receiving an offer — negotiation coaching, offer comparison advice, and a 30-day onboarding check-in to ensure a smooth transition into your new role.",
  },
];

const hiringPartners = [
  { name: "TCS", sector: "IT Services", type: "MNC" },
  { name: "Infosys", sector: "IT Services", type: "MNC" },
  { name: "Wipro", sector: "IT Services", type: "MNC" },
  { name: "Cognizant", sector: "IT Services", type: "MNC" },
  { name: "Capgemini", sector: "IT Services", type: "MNC" },
  { name: "HCL Technologies", sector: "IT Services", type: "MNC" },
  { name: "Accenture", sector: "Consulting", type: "MNC" },
  { name: "Tech Mahindra", sector: "IT Services", type: "MNC" },
  { name: "Amazon India", sector: "E-Commerce & Cloud", type: "Product" },
  { name: "Microsoft India", sector: "Cloud & Software", type: "Product" },
  { name: "Flipkart", sector: "E-Commerce", type: "Product" },
  { name: "Swiggy", sector: "FoodTech", type: "Product" },
  { name: "Razorpay", sector: "FinTech", type: "Product" },
  { name: "Freshworks", sector: "SaaS", type: "Product" },
  { name: "Ola", sector: "MobilityTech", type: "Product" },
  { name: "PhonePe", sector: "FinTech", type: "Product" },
  { name: "Mphasis", sector: "IT Services", type: "MNC" },
  { name: "Hexaware", sector: "IT Services", type: "MNC" },
  { name: "Infoview Technologies", sector: "IT Services", type: "Regional" },
  { name: "Virtusa", sector: "IT Services", type: "MNC" },
  { name: "EPAM Systems", sector: "Product Engineering", type: "MNC" },
  { name: "Mindtree", sector: "IT Services", type: "MNC" },
  { name: "L&T Infotech", sector: "IT Services", type: "MNC" },
  { name: "Cyient", sector: "Engineering", type: "MNC" },
];

const successStories = [
  {
    name: "Kiran Babu Nelluri",
    role: "Software Engineer",
    company: "Amazon India",
    package: "₹22 LPA",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    course: "Java Full Stack Development",
    prev: "Bank Teller (₹3.2 LPA)",
    quote:
      "The placement team at GuideSoft is genuinely invested. After 4 mock interviews, I walked into Amazon's loop feeling prepared — not scared. Cleared all 4 rounds first attempt.",
    gap: "8 months",
  },
  {
    name: "Lalitha Devi Kompella",
    role: "Data Analyst",
    company: "Flipkart",
    package: "₹14 LPA",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    course: "Data Science & Machine Learning",
    prev: "Schoolteacher (₹2.8 LPA)",
    quote:
      "I was a Mathematics teacher for 6 years. GuideSoft helped me pivot to data science in 8 months. The career counselling sessions helped me position my math background as a strength, not a gap.",
    gap: "8 months",
  },
  {
    name: "Venkatesh Rao Pentakota",
    role: "Cloud Engineer",
    company: "Microsoft India",
    package: "₹19 LPA",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    course: "AWS Cloud & DevOps Engineering",
    prev: "Network Admin (₹5.5 LPA)",
    quote:
      "My existing networking background combined with the DevOps skills from GuideSoft made me a unique candidate. Got 3 offers simultaneously — GuideSoft's negotiation coaching helped me choose the best one.",
    gap: "5 months",
  },
  {
    name: "Priyanka Vasireddy",
    role: "Frontend Developer",
    company: "Razorpay",
    package: "₹11 LPA",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    course: "React & Next.js Frontend Development",
    prev: "Fresher — B.Tech 2024",
    quote:
      "I graduated in June 2024 with average grades and was struggling to get interviews. GuideSoft's portfolio review transformed my GitHub — Razorpay's recruiter reached out because they saw my capstone project on LinkedIn.",
    gap: "4 months",
  },
];

const assessmentServices = [
  {
    title: "Career Aptitude Assessment",
    desc: "Identify which tech role (Backend, Frontend, Data, Cloud, Testing) aligns best with your strengths and long-term goals.",
    free: true,
  },
  {
    title: "Salary Benchmarking Report",
    desc: "Get a personalised report showing current market salaries for your target role in your target city — based on live hiring data.",
    free: true,
  },
  {
    title: "Resume Review",
    desc: "Expert review of your current resume with line-by-line feedback and a revised version — completely free for course enrollees.",
    free: true,
  },
  {
    title: "Technical Skills Gap Analysis",
    desc: "30-minute conversation with a technical mentor to identify exactly what skills you need to close before interviewing at your target companies.",
    free: false,
  },
];

function CareerCenter() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <div className="bg-background text-foreground">
      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        defaultCourseSlug="Career Counselling Session"
        title="Career Counselling"
      />
      {/* HERO */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              12,400+ Placements & Counting
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your Career Launch <span className="text-gradient">Command Center</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              GuideSoft's Career Center doesn't just hand you a resume template. We run a
              structured, 6-stage placement preparation program with dedicated career coaches,
              industry mentors, and direct referrals to 250+ hiring companies — until you get hired.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                id="career-centre-cta-btn"
                size="lg"
                className="rounded-xl"
                onClick={() => setEnquiryOpen(true)}
              >
                Book Free Career Counselling
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link to="/courses">Explore Courses</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <Section className="bg-surface/30">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {placementStats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="surface-panel rounded-2xl p-5 text-center"
              >
                <Icon className="mx-auto h-5 w-5 text-primary mb-2" />
                <p className="font-display text-2xl font-bold text-gradient">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* PLACEMENT PROCESS */}
      <Section>
        <SectionHeading
          eyebrow="Placement Process"
          title="6-stage placement program — until you're hired"
          centered
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placementProcess.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="surface-panel rounded-2xl p-6 relative overflow-hidden hover:border-primary/40 transition-colors duration-300"
              >
                <span className="absolute top-3 right-4 font-display text-5xl font-bold text-border/60 select-none">
                  {step.step}
                </span>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* SUCCESS STORIES */}
      <Section className="bg-surface/30">
        <SectionHeading
          eyebrow="Success Stories"
          title="From all walks of life to top tech companies"
          centered
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {successStories.map((s, i) => (
            <motion.div
              key={s.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="surface-panel rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={s.photo}
                  alt={s.name}
                  className="h-14 w-14 rounded-xl object-cover shrink-0"
                />
                <div>
                  <p className="font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-primary font-medium">
                    {s.role} — {s.company}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary text-xs border-primary/20">
                      {s.package}
                    </Badge>
                    <span className="text-xs text-muted-foreground">in {s.gap}</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground italic leading-relaxed">
                "{s.quote}"
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Course Completed</p>
                  <p>{s.course}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Previous Role</p>
                  <p>{s.prev}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* HIRING PARTNERS */}
      <Section>
        <SectionHeading
          eyebrow="Hiring Partners"
          title="250+ companies actively hiring our graduates"
          centered
        />
        <div className="mt-8 flex flex-wrap gap-2 justify-center mb-8">
          {["MNC", "Product", "Regional"].map((t) => (
            <Badge key={t} variant="outline" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {hiringPartners.map((p, i) => (
            <motion.div
              key={p.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="surface-panel rounded-xl p-3 text-center hover:border-primary/30 transition-colors"
            >
              <p className="text-xs font-medium text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{p.sector}</p>
              <Badge variant="secondary" className="text-xs mt-1.5 px-1.5 py-0">
                {p.type}
              </Badge>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          +200 more companies across AP, Telangana, Maharashtra, and Karnataka.
        </p>
      </Section>

      {/* FREE SERVICES */}
      <Section className="bg-surface/30">
        <SectionHeading
          eyebrow="Free Career Services"
          title="Start your career journey — no commitment needed"
          centered
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {assessmentServices.map((s, i) => (
            <motion.div
              key={s.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="surface-panel rounded-2xl p-5 flex gap-4"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-sm">{s.title}</h3>
                  {s.free && (
                    <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                      Free
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button
            id="free-assessment-btn"
            size="lg"
            className="rounded-xl"
            onClick={() => setEnquiryOpen(true)}
          >
            Book Free Career Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            <MapPin className="inline h-3 w-3 mr-1" />
            Available online for students across India · Mon–Sat, 10 AM – 6 PM IST
          </p>
        </div>
      </Section>

      <CtaBand />
    </div>
  );
}
