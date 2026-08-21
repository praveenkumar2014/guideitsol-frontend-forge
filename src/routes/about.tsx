import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  Building2,
  CheckCircle2,
  Globe,
  GraduationCap,
  Heart,
  Lightbulb,
  MapPin,
  Rocket,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { AnimatedCard, StaggerContainer } from "@/components/animated-card";
import { AnimatedSection } from "@/components/animated-section";
import { CtaBand } from "@/components/cta-band";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About | ${site.name} — GuideSoft IT Solutions & Trainings` },
      {
        name: "description",
        content:
          "GuideSoft IT Solutions is Guntur's premier IT training institute. Learn about our mission, values, leadership team, and why 18,000+ students chose us to launch their tech careers.",
      },
    ],
  }),
  component: About,
});

const milestones = [
  {
    year: "2016",
    title: "Founded in Guntur",
    desc: "Started with 12 students, 1 classroom, and a mission: make world-class IT education accessible to every engineer in Andhra Pradesh.",
  },
  {
    year: "2018",
    title: "First 500 Placements",
    desc: "Crossed 500 successful placements in top MNCs — TCS, Infosys, Wipro, and Capgemini. Expanded to 3 training tracks.",
  },
  {
    year: "2020",
    title: "Online-First Pivot",
    desc: "Launched live online classes during COVID-19 and reached students across 12 Indian states. Zero fee hike, zero compromise on quality.",
  },
  {
    year: "2022",
    title: "GenAI Lab Launched",
    desc: "Opened India's first GenAI Training Lab for students, covering LLM fine-tuning, RAG systems, and agentic AI — before it was mainstream.",
  },
  {
    year: "2023",
    title: "10,000 Placed",
    desc: "Celebrated 10,000+ successful career transitions with an average salary hike of 180% for career switchers.",
  },
  {
    year: "2025",
    title: "Premier Training Destination",
    desc: "Ranked #1 IT Training Institute in Andhra Pradesh by 3 independent student review platforms. 18,500+ alumni worldwide.",
  },
];

const values = [
  {
    icon: Target,
    title: "Industry Relevance",
    desc: "Every course is designed with active practitioners — not textbook theory. Our curriculum is updated quarterly based on hiring trends from 200+ partner companies.",
  },
  {
    icon: Heart,
    title: "Student First",
    desc: "Every decision we make starts with one question: does this help our students get hired faster? From batch sizes to mentorship to fees, students come first.",
  },
  {
    icon: Shield,
    title: "Zero Shortcut Culture",
    desc: "We don't sell certifications — we build engineers. Our students earn every credential through rigorous projects, live code reviews, and industry evaluations.",
  },
  {
    icon: Lightbulb,
    title: "Lifelong Learning",
    desc: "Alumni get free access to curriculum updates, community events, and mentorship sessions — even years after completing their course.",
  },
  {
    icon: Globe,
    title: "Accessible Education",
    desc: "We offer EMI options, merit scholarships, and free preparatory courses so financial constraints never stop a determined learner.",
  },
  {
    icon: Zap,
    title: "Placement Obsession",
    desc: "Our dedicated placement team works with each student individually — mock interviews, resume reviews, and direct intros to hiring managers.",
  },
];

const leadership = [
  {
    name: "Praveen Kumar Reddy",
    role: "Founder & CEO",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&auto=format&fit=crop&q=80",
    bio: "18 years in software engineering and education. Former Principal Engineer at a Hyderabad-based fintech. Founder of 3 ed-tech initiatives in AP. Passionate about bridging the gap between college education and industry reality.",
    linkedin: "#",
    badges: ["IIT Kharagpur", "18 yrs exp", "3 Startups"],
  },
  {
    name: "Anusha Devi Konapalli",
    role: "Chief Academic Officer",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    bio: "PhD in Computer Science (JNTU Hyderabad). 14 years designing IT curricula for both academia and industry training. Previously Head of Learning Design at a Bangalore ed-tech unicorn. Ensures every GuideSoft course meets global standards.",
    linkedin: "#",
    badges: ["PhD CS", "14 yrs exp", "JNTU"],
  },
  {
    name: "Satish Kumar Bangaru",
    role: "Head of Placements",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    bio: "12 years in IT recruitment and talent acquisition at TCS, Wipro, and Hyderabad-based MNCs. Has personally facilitated 5,000+ successful placements. Maintains active relationships with HR heads at 250+ companies nationwide.",
    linkedin: "#",
    badges: ["12 yrs exp", "5000+ placements", "250+ Partners"],
  },
  {
    name: "Meghana Rao Pullela",
    role: "Head of Student Success",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    bio: "Former career counsellor at two AP state universities. Specialist in career transition psychology and professional skills development. Built GuideSoft's industry-leading mentorship matching system that pairs students with the right industry mentor.",
    linkedin: "#",
    badges: ["Career Coach", "10 yrs exp", "AP University"],
  },
];

const partners = [
  "Tata Consultancy Services",
  "Infosys",
  "Wipro Technologies",
  "Cognizant",
  "Capgemini India",
  "HCL Technologies",
  "Accenture India",
  "Tech Mahindra",
  "Mphasis",
  "Hexaware",
  "Infoview Technologies",
  "Virtusa",
];

const extendedStats = [
  { value: "18,500+", label: "Students Trained", icon: GraduationCap },
  { value: "12,400+", label: "Placements Done", icon: TrendingUp },
  { value: "98.2%", label: "Satisfaction Rate", icon: Star },
  { value: "250+", label: "Hiring Partners", icon: Building2 },
  { value: "₹8.4 LPA", label: "Avg. First Salary", icon: Award },
  { value: "9 yrs", label: "Training Excellence", icon: Rocket },
  { value: "180%", label: "Avg. Salary Hike", icon: Zap },
  { value: "35+", label: "Expert Instructors", icon: Users },
];

function About() {
  return (
    <div className="bg-background text-foreground">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl">
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              Since 2016 · Guntur, Andhra Pradesh
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              We don't just train engineers.{" "}
              <span className="text-gradient">We build careers.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              GuideSoft IT Solutions & Trainings is Andhra Pradesh's most trusted IT training
              institute — founded in 2016 with a single mission: give every motivated learner the
              skills, mentorship, and placement support to thrive in the global technology industry.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-xl bg-primary text-primary-foreground">
                <Link to="/courses">Explore Courses</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link to="/contact">Talk to Us</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── STATS GRID ───────────────────────────────────────────────── */}
      <Section>
        <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {extendedStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <AnimatedCard
                key={stat.label}
                className="p-5 flex flex-col items-center text-center col-span-2 sm:col-span-2"
              >
                <Icon className="h-5 w-5 text-primary mb-2" />
                <p className="font-display text-2xl font-bold text-gradient">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </AnimatedCard>
            );
          })}
        </StaggerContainer>
      </Section>

      {/* ── OUR STORY ────────────────────────────────────────────────── */}
      <Section className="bg-surface/30">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Our Story"
              title="From a single room in Guntur to 18,500+ placed engineers"
            />
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                In 2016, Praveen Kumar Reddy walked away from a senior engineering role to answer a
                question that kept him awake:{" "}
                <em>
                  "Why do thousands of brilliant young engineers in AP struggle to find quality
                  jobs, despite working incredibly hard?"
                </em>
              </p>
              <p>
                The answer wasn't their intelligence or work ethic — it was the gap between what
                colleges taught and what industry needed. GuideSoft IT Solutions was born to close
                that gap permanently.
              </p>
              <p>
                We started with 12 students in a rented room in Guntur, teaching Java with a
                borrowed projector. Nine years later, we've trained 18,500+ engineers, facilitated
                12,400+ placements, and built a faculty of 35 industry practitioners — many who left
                well-paying MNC jobs because they believed in the mission.
              </p>
              <p>
                We've never taken venture funding or compromised our teaching quality for scale.
                Every rupee of revenue goes back into better labs, better mentors, and better
                placement support.
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="space-y-4">
            {milestones.map((m) => (
              <AnimatedCard key={m.year} className="p-4 flex gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="font-display text-sm font-bold text-primary">{m.year}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{m.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{m.desc}</p>
                </div>
              </AnimatedCard>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* ── VALUES ───────────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow="What We Stand For"
          title="Values that drive every decision"
          centered
        />
        <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <AnimatedCard
                key={v.title}
                className="p-6 hover:border-primary/40 transition-colors duration-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </AnimatedCard>
            );
          })}
        </StaggerContainer>
      </Section>

      {/* ── LEADERSHIP ───────────────────────────────────────────────── */}
      <Section className="bg-surface/30">
        <SectionHeading eyebrow="Leadership" title="People who've been in your shoes" centered />
        <StaggerContainer className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {leadership.map((l) => (
            <AnimatedCard
              key={l.name}
              className="overflow-hidden hover:border-primary/40 transition-colors duration-300"
            >
              <div className="relative">
                <img src={l.image} alt={l.name} className="w-full h-52 object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-foreground">{l.name}</h3>
                <p className="text-xs text-primary font-medium mt-0.5">{l.role}</p>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{l.bio}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {l.badges.map((b) => (
                    <Badge key={b} variant="secondary" className="text-xs px-2 py-0.5">
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          ))}
        </StaggerContainer>
      </Section>

      {/* ── HIRING PARTNERS ──────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow="Hiring Partners"
          title="200+ companies trust GuideSoft graduates"
          centered
        />
        <p className="text-center text-muted-foreground mt-2 mb-10">
          Our placement team has active relationships with HR teams at these companies and more.
        </p>
        <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((p) => (
            <AnimatedCard
              key={p}
              className="px-4 py-3 flex items-center justify-center text-center"
            >
              <p className="text-xs font-medium text-muted-foreground">{p}</p>
            </AnimatedCard>
          ))}
        </StaggerContainer>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <MapPin className="inline h-3.5 w-3.5 mr-1" />
            Registered Office: Guntur, Andhra Pradesh — serving students across India &amp;
            internationally.
          </p>
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <CtaBand />
    </div>
  );
}
