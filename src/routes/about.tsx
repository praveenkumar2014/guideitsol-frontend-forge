import { createFileRoute } from "@tanstack/react-router";

import { CtaBand } from "@/components/cta-band";
import { PageHero, Section, SectionHeading } from "@/components/section";
import { site, stats } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About | ${site.name}` },
      {
        name: "description",
        content: "Meet the product engineering team behind Guide IT Solutions.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="About Guide IT"
        title="Small enough to care. Experienced enough to carry it."
        description="We are a product engineering studio for teams who want fewer handoffs, better decisions and software that stays useful after launch."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Our point of view"
              title="Good delivery is a product decision."
            />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              The best engineering teams do not just translate tickets into code. They ask what
              should exist, make the trade-offs visible and leave the client stronger than they
              found it. That is the standard we bring to every engagement.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {stats.map((stat) => (
              <div key={stat.label} className="surface-panel rounded-xl p-5">
                <p className="font-display text-3xl font-semibold text-gradient">{stat.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
