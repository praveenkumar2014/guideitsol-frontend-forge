import { createFileRoute } from "@tanstack/react-router";

import { CtaBand } from "@/components/cta-band";
import { site } from "@/data/site";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: `Refund Policy | ${site.name}` },
      {
        name: "description",
        content: `Refund Policy for ${site.legalName}. Learn about our course refund and cancellation terms.`,
      },
    ],
  }),
  component: RefundPolicy,
});

function RefundPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
        Refund Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

      <div className="prose prose-sm mt-8 space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-display text-lg font-bold text-foreground">
            1. Eligibility for Refund
          </h2>
          <p>
            You may request a full refund within 7 days of enrollment if you have not accessed more
            than 10% of the course content. Refund requests made after 7 days or after accessing
            significant content may not be eligible.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">
            2. How to Request a Refund
          </h2>
          <p>
            Submit your refund request by emailing{" "}
            <a href={`mailto:${site.email}`} className="text-primary hover:underline">
              {site.email}
            </a>{" "}
            with your enrollment details and reason for the refund request.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">3. Processing Time</h2>
          <p>
            Approved refunds are processed within 5-7 business days to the original payment method.
            You will receive a confirmation email once the refund has been initiated.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">4. Exceptions</h2>
          <p>
            Refunds may not be available for live cohort batches once the batch has commenced, or
            for courses where a certificate has already been issued. Placement assurance program
            fees are non-refundable after the first week.
          </p>
        </section>
      </div>

      <CtaBand />
    </div>
  );
}
