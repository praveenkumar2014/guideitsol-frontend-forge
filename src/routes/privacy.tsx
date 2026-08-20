import { createFileRoute } from "@tanstack/react-router";

import { CtaBand } from "@/components/cta-band";
import { site } from "@/data/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy | ${site.name}` },
      {
        name: "description",
        content: `Privacy Policy for ${site.legalName}. Learn how we collect, use, and protect your personal information.`,
      },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

      <div className="prose prose-sm mt-8 space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-display text-lg font-bold text-foreground">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly, such as your name, email address, phone
            number, and payment details when you enroll in a course. We also collect usage data
            including browsing activity, course progress, and interaction with our platform.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">
            2. How We Use Your Information
          </h2>
          <p>
            Your information is used to provide and improve our educational services, process
            payments, communicate about courses and updates, and personalize your learning
            experience.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">3. Data Protection</h2>
          <p>
            We implement industry-standard security measures to protect your personal data. Your
            payment information is encrypted and processed through secure, PCI-compliant payment
            gateways.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">4. Cookies</h2>
          <p>
            We use cookies and similar technologies to maintain your session, remember your
            preferences, and analyze platform usage. You can control cookie settings in your
            browser.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">5. Contact Us</h2>
          <p>
            For privacy-related inquiries, contact us at{" "}
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
