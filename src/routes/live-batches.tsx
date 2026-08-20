import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock3, CreditCard, MessageSquare, Sparkles, Users } from "lucide-react";

import { Section, SectionHeading, TrainingHero } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { batches, courses, type Batch } from "@/data/training";
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
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedBatchForEnquiry, setSelectedBatchForEnquiry] = useState<Batch | null>(null);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedBatchForCheckout, setSelectedBatchForCheckout] = useState<Batch | null>(null);

  const handleEnquiry = (batch: Batch) => {
    setSelectedBatchForEnquiry(batch);
    setEnquiryOpen(true);
  };

  const handleCheckout = (batch: Batch) => {
    setSelectedBatchForCheckout(batch);
    setCheckoutOpen(true);
  };

  return (
    <>
      <TrainingHero
        eyebrow="Live batches"
        title="Learn with a calendar, a cohort and a real instructor."
        description="Compare upcoming schedules, learning modes and available seats. Enrol directly online or speak with an advisor."
      />
      <Section>
        <SectionHeading eyebrow="Upcoming schedules" title="Choose a rhythm that fits." />
        <div className="mt-10 space-y-4">
          {batches.map((batch) => {
            const course = courses.find((item) => item.slug === batch.courseSlug);
            const courseTitle = course?.title || "Technical Training";

            return (
              <article
                key={batch.id}
                className="surface-panel grid gap-6 rounded-3xl p-6 sm:p-8 lg:grid-cols-[1fr_0.8fr_auto] lg:items-center border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    <span>{course?.category}</span>
                    <span>•</span>
                    <span className="text-muted-foreground">{batch.mode}</span>
                  </div>
                  <h2 className="mt-2 text-2xl font-bold">{batch.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <Link
                      to="/courses/$slug"
                      params={{ slug: batch.courseSlug }}
                      className="hover:text-primary transition-colors underline-offset-4 hover:underline"
                    >
                      {courseTitle}
                    </Link>{" "}
                    · Instructor: {batch.instructor}
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3 lg:grid-cols-1">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary shrink-0" />
                    Starts <strong className="text-foreground">{batch.start}</strong>
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-primary shrink-0" />
                    {batch.days} · {batch.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {batch.available}
                    </span>{" "}
                    of {batch.seats} seats available
                  </span>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-end">
                  <div className="lg:text-right mb-1">
                    <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {batch.status}
                    </span>
                    <p className="mt-1 font-display text-2xl font-bold text-foreground">
                      {batch.price}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="hero" size="sm" onClick={() => handleCheckout(batch)}>
                      <CreditCard className="mr-1.5 h-3.5 w-3.5" /> Enrol Online
                    </Button>
                    <Button variant="subtle" size="sm" onClick={() => handleEnquiry(batch)}>
                      <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Ask Advisor
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Enquiry Modal */}
      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        defaultCourseSlug={selectedBatchForEnquiry?.courseSlug || ""}
        defaultBatchId={selectedBatchForEnquiry?.id || ""}
        title={
          selectedBatchForEnquiry
            ? `Inquiry for ${selectedBatchForEnquiry.name}`
            : "Ask About Live Batches"
        }
        description="Speak with our batch coordinator for timetable customization, weekend options, and curriculum walkthrough."
      />

      {/* Checkout Modal */}
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        batch={selectedBatchForCheckout}
        courseTitle={
          courses.find((c) => c.slug === selectedBatchForCheckout?.courseSlug)?.title ||
          "Technical Training"
        }
      />
    </>
  );
}
