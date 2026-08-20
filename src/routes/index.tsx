import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Code2,
  Cpu,
  GraduationCap,
  Laptop,
  Radio,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { AnimatedBackground } from "@/components/animated-background";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { CtaBand } from "@/components/cta-band";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { HeroSlider } from "@/components/hero-slider";
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
  return (
    <div className="relative min-h-screen bg-background">
      {/* Ambient background particle glows */}
      <AnimatedBackground />

      {/* 100% Full-Viewport 8-Slide Hero Section */}
      <HeroSlider />

      {/* Trust & Placement Metrics Strip */}
      <section className="border-b border-border/80 bg-surface/50 py-10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                4,200+
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Engineers Trained & Placed
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                ₹12.4 LPA
              </p>
              <p className="text-xs font-medium text-muted-foreground">Average Placement Package</p>
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
                <Award className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                120+
              </p>
              <p className="text-xs font-medium text-muted-foreground">Hiring Partner Companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Pillar Learning Methodology */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary mb-3">
            Why GUIDESOFT
          </Badge>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            An Engineering Crucible That Bridges The Industry Gap
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            We don't teach passive syntax. Our intensive curriculum replicates real sprint cycles,
            production codebases, and architectural design reviews.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="surface-panel group rounded-2xl border border-border/80 bg-surface/70 p-7 backdrop-blur-xl transition-all duration-300 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Laptop className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
              Live Production Sandbox
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Deploy microservices to real AWS ECS clusters, configure CI/CD GitHub Actions
              pipelines, and handle real database failovers.
            </p>
          </div>

          <div className="surface-panel group rounded-2xl border border-border/80 bg-surface/70 p-7 backdrop-blur-xl transition-all duration-300 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Radio className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
              Daily Live Mentorship
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Small cohorts capped at 25 learners. Daily interactive sessions with Principal
              Architects and Lead Engineers from top tier tech firms.
            </p>
          </div>

          <div className="surface-panel group rounded-2xl border border-border/80 bg-surface/70 p-7 backdrop-blur-xl transition-all duration-300 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
              Career Forge & Placements
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Resume optimization, system design interview drills, technical portfolio hosting, and
              direct referrals to hiring partner networks.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section className="border-t border-border/80 bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Curated Catalog
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
                Flagship Career Programs
              </h2>
            </div>
            <Button asChild variant="subtle" size="lg" className="border border-border">
              <Link to="/courses">
                Explore all courses <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 6).map((course) => (
              <div
                key={course.slug}
                className="surface-panel flex flex-col justify-between rounded-2xl border border-border/80 bg-surface/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="border-primary/30 bg-primary/10 text-primary text-xs"
                    >
                      {course.category}
                    </Badge>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold text-foreground hover:text-primary transition-colors">
                    <Link to="/courses/$slug" params={{ slug: course.slug }}>
                      {course.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {course.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(course.tools || []).slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border/60 bg-background/60 px-2 py-0.5 text-[11px] font-medium text-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-border/60 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Fee</span>
                    <p className="text-lg font-bold text-foreground">{course.price}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="hero">
                      <Link to="/courses/$slug" params={{ slug: course.slug }}>
                        View Track
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Live Cohorts Quick Table */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge
              variant="outline"
              className="border-highlight/40 bg-highlight/10 text-highlight mb-2"
            >
              Seats Filling Fast
            </Badge>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Upcoming Live Batches
            </h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/live-batches">View all scheduled batches</Link>
          </Button>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-border/80 bg-surface/70 backdrop-blur-xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface/90 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Course & Track</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {batches.slice(0, 4).map((b) => (
                <tr key={b.id} className="hover:bg-accent/40 transition-colors">
                  <td className="px-6 py-4 font-semibold">{b.courseTitle}</td>
                  <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {b.startDate}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{b.timing}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{b.instructor}</td>
                  <td className="px-6 py-4 text-right">
                    <Button asChild size="sm" variant="hero">
                      <Link to="/live-batches">
                        Reserve Seat
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Global CTA Band */}
      <CtaBand />
    </div>
  );
}
