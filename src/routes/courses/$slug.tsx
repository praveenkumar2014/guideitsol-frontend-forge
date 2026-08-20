import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, PlayCircle } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { CourseMeta, Section, SectionHeading, TrainingHero } from "@/components/training-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { batches, courses } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/courses/$slug")({
  head: ({ params }) => {
    const course = courses.find((item) => item.slug === params.slug);
    return {
      meta: [
        { title: course ? `${course.title} | ${site.name}` : `Course | ${site.name}` },
        { name: "description", content: course?.summary ?? "Explore a GUIDESOFT training course." },
      ],
    };
  },
  component: CourseDetail,
});

function CourseDetail() {
  const { slug } = Route.useParams();
  const course = courses.find((item) => item.slug === slug);
  if (!course) throw notFound();
  const courseBatches = batches.filter((batch) => batch.courseSlug === course.slug);
  return (
    <>
      <TrainingHero
        eyebrow={`${course.category} · ${course.level}`}
        title={course.title}
        description={course.overview}
      >
        <Button asChild variant="hero" size="xl">
          <Link to="/contact" search={{ course: course.slug }}>
            Talk to a course advisor <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="subtle" size="xl">
          <Link to="/live-batches">See upcoming batches</Link>
        </Button>
      </TrainingHero>
      <Section>
        <CourseMeta course={course} />
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_0.42fr]">
          <div>
            <SectionHeading eyebrow="Curriculum" title="A week-by-week path to useful work." />
            <Accordion type="multiple" className="mt-8">
              {course.modules.map((item, index) => (
                <AccordionItem key={item.title} value={`module-${index}`}>
                  <AccordionTrigger className="text-left">
                    <span>
                      <span className="mr-3 text-sm font-semibold text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.description}</p>
                    <ul className="mt-5 space-y-3">
                      {item.lessons.map((lesson) => (
                        <li key={lesson.title} className="flex items-center gap-3 text-sm">
                          <PlayCircle className="h-4 w-4 text-primary" />
                          {lesson.title}
                          <span className="ml-auto text-xs text-muted-foreground">
                            {lesson.duration}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 rounded-lg bg-muted p-3 text-sm">
                      <strong>Assignment:</strong> {item.assignment}
                    </p>
                    {item.project ? (
                      <p className="mt-3 text-sm text-primary">
                        <strong>Project:</strong> {item.project}
                      </p>
                    ) : null}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <aside className="surface-panel h-fit rounded-2xl p-6 lg:sticky lg:top-24">
            <p className="text-sm font-semibold text-primary">Ready to start?</p>
            <p className="mt-4 font-display text-3xl font-semibold">{course.price}</p>
            <p className="mt-2 text-sm text-muted-foreground">Course fee · batch dates vary</p>
            <Button asChild variant="hero" size="xl" className="mt-7 w-full">
              <Link to="/contact" search={{ course: course.slug }}>
                Request enrolment details
              </Link>
            </Button>
            <ul className="mt-7 space-y-3 text-sm">
              {course.outcomes.slice(0, 5).map((outcome) => (
                <li key={outcome} className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {outcome}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
      <Section muted>
        <SectionHeading eyebrow="Tools & preparation" title="What you will work with" />
        <div className="mt-8 flex flex-wrap gap-3">
          {course.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
            >
              {tool}
            </span>
          ))}
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold">Prerequisites</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {course.prerequisites.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Portfolio project</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{course.project}</p>
          </div>
        </div>
      </Section>
      {courseBatches.length ? (
        <Section>
          <SectionHeading eyebrow="Next up" title="Upcoming batches" />
          <div className="mt-8 space-y-3">
            {courseBatches.map((batch) => (
              <div
                key={batch.id}
                className="surface-panel flex flex-col gap-4 rounded-xl p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{batch.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {batch.start} · {batch.days} · {batch.time}
                  </p>
                </div>
                <Button asChild variant="subtle">
                  <Link to="/contact" search={{ course: course.slug, batch: batch.id }}>
                    Ask about this batch <ChevronDown className="rotate-[-90deg]" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </Section>
      ) : null}
      <CtaBand
        title="Want help choosing the right starting point?"
        description="Share your background and career goal. A GUIDESOFT advisor can help you compare courses and formats."
      />
    </>
  );
}
