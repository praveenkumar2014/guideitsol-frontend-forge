import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { PageHero, Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { services, site } from "@/data/site";

export const Route = createFileRoute("/web-development")({
  head: () => ({
    meta: [
      { title: `Web Development | ${site.name}` },
      {
        name: "description",
        content:
          "Fast, accessible web platforms built with React, TypeScript and SEO-first architecture.",
      },
    ],
  }),
  component: WebDevelopment,
});

function WebDevelopment() {
  const service = services[0];
  return (
    <>
      <PageHero
        eyebrow="Web platforms"
        title="Web products that feel effortless at scale."
        description={service.summary}
      >
        <Button asChild variant="hero" size="xl">
          <Link to="/contact">
            Plan a web build <ArrowRight />
          </Link>
        </Button>
      </PageHero>
      <Section>
        <SectionHeading eyebrow="What is included" title="A platform, not a pile of pages." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {service.points.map((point) => (
            <div key={point} className="surface-panel rounded-xl p-5">
              <Check className="h-5 w-5 text-primary" />
              <h2 className="mt-6 text-lg font-semibold">{point}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Designed into the delivery plan, tested in the real workflow.
              </p>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand title="Have a web platform in mind?" />
    </>
  );
}
