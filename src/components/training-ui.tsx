import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock3, Layers3, Users } from "lucide-react";

import { AnimatedCard } from "@/components/animated-card";
import { PageHero, Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import type { Course } from "@/data/training";

export function TrainingHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <PageHero eyebrow={eyebrow} title={title} description={description}>
      {children}
    </PageHero>
  );
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <AnimatedCard className="group flex h-full flex-col p-6 transition-transform hover:-translate-y-1">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        <span>{course.category}</span>
        <span>{course.level}</span>
      </div>
      <h2 className="mt-7 text-2xl font-semibold">{course.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{course.summary}</p>
      <div className="mt-7 grid grid-cols-2 gap-3 border-y border-border py-4 text-xs text-muted-foreground">
        <span className="flex gap-2">
          <Clock3 className="h-4 w-4 text-primary" />
          {course.duration}
        </span>
        <span className="flex gap-2">
          <Users className="h-4 w-4 text-primary" />
          {course.format}
        </span>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="font-display text-xl font-semibold">{course.price}</span>
        <Button asChild variant="subtle" size="sm">
          <Link to="/courses/$slug" params={{ slug: course.slug }}>
            View course <ArrowRight />
          </Link>
        </Button>
      </div>
    </AnimatedCard>
  );
}

export function CourseMeta({ course }: { course: Course }) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      <div className="surface-panel rounded-xl p-4">
        <Clock3 className="h-4 w-4 text-primary" />
        <p className="mt-3 text-xs text-muted-foreground">Duration</p>
        <p className="mt-1 text-sm font-semibold">{course.duration}</p>
      </div>
      <div className="surface-panel rounded-xl p-4">
        <BookOpen className="h-4 w-4 text-primary" />
        <p className="mt-3 text-xs text-muted-foreground">Format</p>
        <p className="mt-1 text-sm font-semibold">{course.format}</p>
      </div>
      <div className="surface-panel rounded-xl p-4">
        <Layers3 className="h-4 w-4 text-primary" />
        <p className="mt-3 text-xs text-muted-foreground">Modules</p>
        <p className="mt-1 text-sm font-semibold">{course.modules.length} modules</p>
      </div>
      <div className="surface-panel rounded-xl p-4">
        <Users className="h-4 w-4 text-primary" />
        <p className="mt-3 text-xs text-muted-foreground">Instructor</p>
        <p className="mt-1 text-sm font-semibold">{course.instructor}</p>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  cta = "Browse courses",
}: {
  title: string;
  body: string;
  cta?: string;
}) {
  return (
    <Section>
      <div className="surface-panel mx-auto max-w-2xl rounded-2xl p-10 text-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-3 text-muted-foreground">{body}</p>
        <Button asChild variant="hero" className="mt-7">
          <Link to="/courses">{cta}</Link>
        </Button>
      </div>
    </Section>
  );
}

export { Section, SectionHeading };
