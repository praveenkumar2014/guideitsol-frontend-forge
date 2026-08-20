import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { PageHero, Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { services, site } from "@/data/site";

export const Route = createFileRoute("/mobile-apps")({
  head: () => ({
    meta: [
      { title: `Mobile Apps | ${site.name}` },
      {
        name: "description",
        content:
          "Reliable iOS and Android apps with offline-first data, thoughtful UX and release support.",
      },
    ],
  }),
  component: MobileApps,
});

function MobileApps() {
  const service = services[1];
  return (
    <>
      <PageHero
        eyebrow="Mobile apps"
        title="Mobile experiences people keep coming back to."
        description={service.summary}
      >
        <Button asChild variant="hero" size="xl">
          <Link to="/contact">
            Plan a mobile build <ArrowRight />
          </Link>
        </Button>
      </PageHero>
      <Section>
        <SectionHeading
          eyebrow="Built for the real world"
          title="From first tap to store release."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {service.points.map((point) => (
            <div key={point} className="surface-panel rounded-xl p-5">
              <Check className="h-5 w-5 text-primary" />
              <h2 className="mt-6 text-lg font-semibold">{point}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A polished, observable experience across the devices your customers use.
              </p>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand title="Ready to make mobile a growth channel?" />
    </>
  );
}
