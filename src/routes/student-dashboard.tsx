import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  ClipboardCheck,
  PlayCircle,
} from "lucide-react";

import { Section, SectionHeading } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { courses, learnerDashboard } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/student-dashboard")({
  head: () => ({
    meta: [
      { title: `Learner Dashboard | ${site.name}` },
      {
        name: "description",
        content:
          "A GUIDESOFT learner dashboard for progress, classes, assignments and career preparation.",
      },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const course = courses.find((item) => item.slug === learnerDashboard.currentCourse)!;
  return (
    <>
      <section className="hero-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm text-primary">Learner workspace</p>
          <h1 className="mt-4 text-4xl font-semibold">
            Good morning, {learnerDashboard.learner.split(" ")[0]}.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Your next session and next piece of evidence are both visible here.
          </p>
        </div>
      </section>
      <Section>
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
          <article className="surface-panel rounded-2xl p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">Continue learning</p>
                <h2 className="mt-3 text-2xl font-semibold">{course.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Next: {learnerDashboard.currentLesson}
                </p>
              </div>
              <PlayCircle className="h-7 w-7 text-primary" />
            </div>
            <div className="mt-8 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${learnerDashboard.overallProgress}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-sm text-muted-foreground">
              <span>{learnerDashboard.overallProgress}% complete</span>
              <span>
                {learnerDashboard.completedLessons}/{learnerDashboard.totalLessons} lessons
              </span>
            </div>
            <Button asChild variant="hero" className="mt-8">
              <Link to="/course-player/$slug" params={{ slug: course.slug }}>
                Open course player <ArrowRight />
              </Link>
            </Button>
          </article>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div className="surface-panel rounded-2xl p-5">
              <CalendarDays className="h-5 w-5 text-primary" />
              <p className="mt-4 text-xs text-muted-foreground">Next live class</p>
              <p className="mt-2 font-semibold">{learnerDashboard.nextClass}</p>
            </div>
            <div className="surface-panel rounded-2xl p-5">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <p className="mt-4 text-xs text-muted-foreground">Open assignments</p>
              <p className="mt-2 font-display text-3xl font-semibold">
                {learnerDashboard.assignments}
              </p>
            </div>
          </div>
        </div>
      </Section>
      <Section muted>
        <SectionHeading eyebrow="Workspace" title="Keep your learning moving." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "My courses", icon: PlayCircle },
            { label: "Assignments", icon: ClipboardCheck },
            { label: "Certificates", icon: CheckCircle2 },
            { label: "Profile", icon: CircleUserRound },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className="surface-panel rounded-xl p-5 text-left transition-colors hover:border-primary"
            >
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-5 text-sm font-semibold">{label}</p>
              <p className="mt-2 text-xs text-muted-foreground">View your {label.toLowerCase()}.</p>
            </button>
          ))}
        </div>
      </Section>
    </>
  );
}
