import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { PageHero, Section, SectionHeading } from "@/components/section";
import { services, site } from "@/data/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: `Services | ${site.name}` },
      {
        name: "description",
        content:
          "Product strategy, design, engineering and managed delivery for teams that need to ship.",
      },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="The right team for the next hard thing."
        description="Bring us the messy brief, the aging platform or the ambitious roadmap. We will turn it into a delivery plan your team can believe in."
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <article id={service.slug} key={service.slug} className="surface-panel rounded-2xl p-7">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold text-primary">0{index + 1}</p>
                <Check className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mt-8 text-2xl font-semibold">{service.title}</h2>
              <p className="mt-3 max-w-xl text-muted-foreground">{service.summary}</p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {service.points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
