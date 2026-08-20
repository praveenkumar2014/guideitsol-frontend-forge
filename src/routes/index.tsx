import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  Compass,
  Cpu,
  GraduationCap,
  Laptop,
  Radio,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

import { AnimatedBackground } from "@/components/animated-background";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { CtaBand } from "@/components/cta-band";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { HeroSection } from "@/components/hero-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { batches, courses, roadmaps } from "@/data/training";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.name} | India's Premier IT Training & Career Forge` },
      {
        name: "description",
        content:
          "Master in-demand software engineering skills: Java Full Stack, Generative AI, Cloud DevOps, Data Science, and SDET with live instructor-led cohorts.",
      },
      {
        name: "keywords",
        content:
          "IT training Guntur, Java Full Stack, GenAI training, Cloud DevOps course, AWS training, Software testing, Data Science bootcamp, guideitsol.in",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Software Development",
    "Data & AI",
    "Cloud & DevOps",
    "Testing",
    "UI/UX & Design",
  ];

  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Ambient background particle glows */}
      <AnimatedBackground />

      {/* ========================================================================= */}
      {/* COURSERA STYLE HERO SECTION                                                */}
      {/* ========================================================================= */}
      <HeroSection />

      {/* ========================================================================= */}
      {/* TRUST & ACCREDITATION METRICS STRIP                                       */}
      {/* ========================================================================= */}
      <section className="border-b border-border/80 bg-surface/50 py-10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                18,400+
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Engineers Trained & Certified
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                ₹12.5 LPA
              </p>
              <p className="text-xs font-medium text-muted-foreground">Average Graduate Salary</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                100%
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Verified Credential Ledger
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                150+
              </p>
              <p className="text-xs font-medium text-muted-foreground">Global Hiring Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* COURSERA-STYLE EXPLORE SPECIALIZATIONS & CERTIFICATES                     */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary mb-2 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Professional Certifications
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
              Explore Enterprise Degrees & Career Tracks
            </h2>
          </div>

          <Button asChild variant="subtle" size="lg" className="border border-border font-semibold">
            <Link to="/courses">
              Explore All Tracks ({courses.length}) <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border border-border bg-surface/80 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtered Courses Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.slice(0, 6).map((course) => (
            <div
              key={course.slug}
              className="group flex flex-col justify-between overflow-hidden rounded-md border border-border bg-card shadow-sm hover:shadow-md transition-shadow h-full"
            >
              <div>
                {course.image && (
                  <div className="h-40 w-full overflow-hidden border-b border-border">
                    <img src={course.image} alt={course.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80" alt="Provider Logo" className="w-5 h-5 rounded-sm object-cover" />
                    <span className="text-[11px] font-bold text-foreground">{course.instructor || "Coursera Partner"}</span>
                  </div>

                  <h3 className="font-bold text-lg text-foreground line-clamp-2 min-h-[56px]">
                    <Link to="/courses/$slug" params={{ slug: course.slug }} className="hover:underline">
                      {course.title}
                    </Link>
                  </h3>
                  
                  <p className="mt-1 text-sm text-muted-foreground">Professional Certificate</p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {(course.tools || []).slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-sm bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-foreground/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 mt-auto">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-4">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {course.rating || "4.8"}
                  </span>
                  <span className="text-muted-foreground font-normal">({course.reviews || "10k"} reviews)</span>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Tuition</p>
                  <p className="font-bold text-foreground">{course.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4-PILLAR LEARNING METHODOLOGY                                             */}
      {/* ========================================================================= */}
      <section className="border-t border-border/80 bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary mb-3">
              Why GuideSoft IT Solutions
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
              An Engineering Crucible That Bridges The Industry Gap
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              We replicate real enterprise sprint cycles, production codebases, architecture reviews, and 1-on-1 code reviews with Principal Engineers.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Laptop className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-lg font-bold text-foreground">
                Live Production Cloud Labs
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Deploy microservices to real AWS ECS clusters, configure CI/CD GitHub Actions pipelines, and handle real database failovers.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Radio className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-lg font-bold text-foreground">
                Daily Live Mentorship & Code Reviews
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Small cohorts capped at 25 learners. Daily interactive sessions with Principal Architects from top tier tech firms.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-lg font-bold text-foreground">
                Placement Network & Career Forge
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Resume optimization, system design mock interviews, verified credential ledgers, and direct referrals to 150+ hiring partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HIRING PARTNERS RECRUITER STRIP                                          */}
      {/* ========================================================================= */}
      <section className="border-t border-border/80 bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-8">
            Our Alumni Work At Leading Global Technology Companies
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">GOOGLE</span>
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">AMAZON</span>
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">MICROSOFT</span>
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">TCS</span>
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">INFOSYS</span>
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">ACCENTURE</span>
          </div>
        </div>
      </section>
    </div>
  );
}
