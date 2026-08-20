import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";

import { Section, SectionHeading, TrainingHero } from "@/components/training-ui";
import { instructors } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/instructors")({
  head: () => ({
    meta: [
      { title: `Instructors | ${site.name}` },
      {
        name: "description",
        content: "Meet GUIDESOFT instructors and the technology areas they teach.",
      },
    ],
  }),
  component: Instructors,
});
function Instructors() {
  return (
    <>
      <TrainingHero
        eyebrow="Instructors"
        title="Learn from people who make the work legible."
        description="Our instructors teach through examples, live labs, code reviews and the questions that come up when a project meets reality."
      />
      <Section>
        <SectionHeading eyebrow="Teaching team" title="Find your kind of guidance." />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <article key={instructor.name} className="surface-panel rounded-2xl p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
                <UserRound />
              </div>
              <h2 className="mt-7 text-xl font-semibold">{instructor.name}</h2>
              <p className="mt-2 text-sm font-medium text-primary">{instructor.role}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Focus: {instructor.focus}
              </p>
              <p className="mt-5 text-xs text-muted-foreground">
                Available for {instructor.availability.toLowerCase()}.
              </p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
