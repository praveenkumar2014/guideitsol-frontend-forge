import { createFileRoute } from "@tanstack/react-router";

import { CtaBand } from "@/components/cta-band";
import { site } from "@/data/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: `Terms of Service | ${site.name}` },
      {
        name: "description",
        content: `Terms of Service for ${site.legalName}. Read our terms and conditions for using our platform and services.`,
      },
    ],
  }),
  component: TermsOfService,
});

function TermsOfService() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

      <div className="prose prose-sm mt-8 space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-display text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the {site.legalName} platform, you agree to be bound by these
            Terms of Service. If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">2. Enrollment & Access</h2>
          <p>
            Course enrollment grants you access to the specified course materials for the duration
            stated at the time of purchase. Access is non-transferable and intended for individual
            use only.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">3. Payment Terms</h2>
          <p>
            All fees are quoted in Indian Rupees (INR) and are inclusive of applicable taxes unless
            stated otherwise. Payment must be completed before access to course materials is
            granted.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">
            4. Intellectual Property
          </h2>
          <p>
            All course content, materials, and resources are the intellectual property of{" "}
            {site.legalName}. You may not reproduce, distribute, or share course materials without
            prior written consent.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">5. Contact</h2>
          <p>
            For questions about these terms, contact us at{" "}
            <a href={`mailto:${site.email}`} className="text-primary hover:underline">
              {site.email}
            </a>
            .
          </p>
        </section>
      </div>

      <CtaBand />
    </div>
  );
}
