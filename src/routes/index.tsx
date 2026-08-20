import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, GraduationCap, Laptop, Radio, Sparkles } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { CourseCard, Section, SectionHeading, TrainingHero } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { batches, courseCategories, courses, roadmaps } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.name} | Learn real technology. Build real skills.` },
      {
        name: "description",
        content:
          "Industry-focused online and classroom IT training designed around practical projects, modern technologies and career preparation.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="hero-surface relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="grid-lines absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-32">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              GUIDESOFT · IT Solutions & Trainings
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.05] sm:text-6xl">
              Learn real technology. Build real skills. Launch your career.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Industry-focused online and classroom training designed around practical projects,
              modern technologies, expert instruction and career preparation.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/courses">
                  Explore courses <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="subtle" size="xl">
                <Link to="/contact">Talk to a career advisor</Link>
              </Button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Online · Live instructor-led · Classroom · Hybrid
            </p>
          </div>
          <div className="surface-panel self-end rounded-2xl p-6 lg:mb-4">
            <p className="text-sm font-semibold text-primary">
              A learning loop that stays practical
            </p>
            <p className="mt-5 text-2xl font-semibold leading-tight">
              Learn the concept. Work the lab. Explain the decision.
            </p>
            <div className="mt-8 space-y-4 text-sm text-muted-foreground">
              {[
                "Weekly project work",
                "Instructor feedback and live Q&A",
                "Interview and portfolio preparation",
              ].map((item) => (
                <p key={item} className="flex gap-3">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="surface-panel rounded-2xl p-6">
            <Laptop className="h-6 w-6 text-primary" />
            <h2 className="mt-6 text-xl font-semibold">Learn in your mode</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Live online, classroom, hybrid and self-paced options around your schedule.
            </p>
          </div>
          <div className="surface-panel rounded-2xl p-6">
            <Radio className="h-6 w-6 text-primary" />
            <h2 className="mt-6 text-xl font-semibold">Join a real cohort</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Upcoming schedules show the days, time, instructor and available seats clearly.
            </p>
          </div>
          <div className="surface-panel rounded-2xl p-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="mt-6 text-xl font-semibold">Build evidence</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Projects, assignments, reviews and interview practice turn learning into a portfolio.
            </p>
          </div>
        </div>
      </Section>
      <Section muted>
        <SectionHeading
          eyebrow="Popular directions"
          title="Start with a course that matches your next step."
          description="Explore a focused catalogue across development, data, cloud, design, testing and enterprise technology."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 6).map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
        <Button asChild variant="subtle" size="lg" className="mt-8">
          <Link to="/courses">
            View all courses <ArrowRight />
          </Link>
        </Button>
      </Section>
      <Section>
        <SectionHeading eyebrow="Learning paths" title="See the skills as a sequence." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roadmaps.slice(0, 3).map((roadmap) => (
            <Link
              key={roadmap.slug}
              to="/learning-paths"
              className="surface-panel group rounded-2xl p-6"
            >
              <GraduationCap className="h-6 w-6 text-primary" />
              <h2 className="mt-6 text-xl font-semibold">{roadmap.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{roadmap.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                View roadmap{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <Section muted>
        <SectionHeading eyebrow="Upcoming" title="Live learning starts with a calendar." />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {batches.slice(0, 4).map((batch) => (
            <div key={batch.id} className="surface-panel rounded-xl p-5">
              <p className="text-sm font-semibold text-primary">{batch.status}</p>
              <h2 className="mt-3 font-semibold">{batch.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {batch.start} · {batch.days} · {batch.time}
              </p>
            </div>
          ))}
        </div>
        <Button asChild variant="subtle" className="mt-8">
          <Link to="/live-batches">
            Compare all batches <ArrowRight />
          </Link>
        </Button>
      </Section>
      <Section>
        <SectionHeading eyebrow="Learning areas" title="A broad start, a focused plan." />
        <div className="mt-8 flex flex-wrap gap-3">
          {courseCategories.map((category) => (
            <Link
              key={category.name}
              to="/courses"
              className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </Section>
      <CtaBand
        title="Not sure where to begin?"
        description="Tell us your background, goal and preferred format. We will help you compare a sensible starting point."
      />
    </>
  );
}
