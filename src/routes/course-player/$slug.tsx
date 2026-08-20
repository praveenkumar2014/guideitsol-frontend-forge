import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, ChevronLeft, ChevronRight, FileText, Menu, PlayCircle } from "lucide-react";
import { useState } from "react";

import { Section } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/course-player/$slug")({
  head: ({ params }) => {
    const course = courses.find((item) => item.slug === params.slug);
    return {
      meta: [
        {
          title: course
            ? `${course.shortTitle} Player | ${site.name}`
            : `Course Player | ${site.name}`,
        },
      ],
    };
  },
  component: CoursePlayer,
});

function CoursePlayer() {
  const { slug } = Route.useParams();
  const course = courses.find((item) => item.slug === slug);
  if (!course) throw notFound();
  const [active, setActive] = useState(course.modules[0]?.lessons[0]?.title ?? "Welcome");
  const [completed, setCompleted] = useState(false);
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface/30">
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            to="/student-dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <p className="hidden text-sm font-semibold sm:block">{course.title}</p>
          <Button variant="subtle" size="sm">
            <Menu className="h-4 w-4" />
            Notes
          </Button>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-border bg-background p-5 lg:min-h-[calc(100vh-8rem)] lg:border-b-0 lg:border-r">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Course contents
          </p>
          <div className="mt-6 space-y-5">
            {course.modules.map((module) => (
              <div key={module.title}>
                <p className="text-sm font-semibold">{module.title}</p>
                <div className="mt-2 space-y-1">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.title}
                      type="button"
                      onClick={() => {
                        setActive(lesson.title);
                        setCompleted(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs ${active === lesson.title ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60"}`}
                    >
                      <PlayCircle className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {lesson.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <main>
          <Section>
            <div className="mx-auto max-w-3xl">
              <div className="flex aspect-video items-center justify-center rounded-2xl border border-border bg-background shadow-inner">
                <div className="text-center">
                  <PlayCircle className="mx-auto h-14 w-14 text-primary" />
                  <p className="mt-4 font-display text-xl font-semibold">{active}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Lesson content area · instructor-led material
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-primary">Current lesson</p>
                  <h1 className="mt-2 text-3xl font-semibold">{active}</h1>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    Review the lesson material, complete the practice exercise and capture one
                    question for the next live session.
                  </p>
                </div>
                {completed ? <CheckCircle2 className="h-7 w-7 shrink-0 text-primary" /> : null}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant={completed ? "subtle" : "hero"} onClick={() => setCompleted(true)}>
                  {completed ? "Lesson complete" : "Mark complete"}
                  <CheckCircle2 />
                </Button>
                <Button variant="subtle">
                  <FileText />
                  Download resources
                </Button>
              </div>
              <div className="mt-10 flex justify-between border-t border-border pt-6">
                <Button variant="subtle">
                  <ChevronLeft />
                  Previous
                </Button>
                <Button variant="subtle">
                  Next lesson
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
