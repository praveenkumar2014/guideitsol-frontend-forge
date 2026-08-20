import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock3, Users } from "lucide-react";

import { Section, SectionHeading, TrainingHero } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { batches, courses } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/live-batches")({
  head: () => ({
    meta: [
      { title: `Live Batches | ${site.name}` },
      {
        name: "description",
        content: "Review upcoming GUIDESOFT live online, hybrid and classroom training cohorts.",
      },
    ],
  }),
  component: LiveBatches,
});
function LiveBatches() {
  return (
    <>
      <TrainingHero
        eyebrow="Live batches"
        title="Learn with a calendar, a cohort and a real instructor."
        description="Compare upcoming schedules, learning modes and available seats. Enrolment is confirmed after an advisor conversation."
      />
      <Section>
        <SectionHeading eyebrow="Upcoming schedules" title="Choose a rhythm that fits." />
        <div className="mt-10 space-y-4">
          {batches.map((batch) => {
            const course = courses.find((item) => item.slug === batch.courseSlug);
            return (
              <article
                key={batch.id}
                className="surface-panel grid gap-6 rounded-2xl p-6 lg:grid-cols-[1fr_0.8fr_auto] lg:items-center"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    {course?.category}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold">{batch.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {course?.title} · {batch.instructor}
                  </p>
                </div>
                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3 lg:grid-cols-1">
                  <span className="flex gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Starts {batch.start}
                  </span>
                  <span className="flex gap-2">
                    <Clock3 className="h-4 w-4 text-primary" />
                    {batch.days} · {batch.time}
                  </span>
                  <span className="flex gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    {batch.available} of {batch.seats} seats available
                  </span>
                </div>
                <div className="lg:text-right">
                  <p className="text-sm font-semibold text-primary">{batch.status}</p>
                  <p className="mt-1 font-display text-xl font-semibold">{batch.price}</p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-end">
                    <Button asChild variant="hero">
                      <Link to="/checkout" search={{ batch: batch.id }}>
                        Enrol online
                      </Link>
                    </Button>
                    <Button asChild variant="subtle">
                      <Link to="/contact" search={{ course: batch.courseSlug, batch: batch.id }}>
                        Ask about batch
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}
