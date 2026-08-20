import { createFileRoute } from "@tanstack/react-router";

import { CtaBand } from "@/components/cta-band";
import { PageHero, Section } from "@/components/section";
import { caseStudies, site } from "@/data/site";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: `Work | ${site.name}` },
      {
        name: "description",
        content: "Selected product engineering work across logistics, finance and healthcare.",
      },
    ],
  }),
  component: Work,
});

function Work() {
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Useful software leaves a mark."
        description="The strongest proof is what changes after launch: fewer tickets, faster onboarding and teams that can move with confidence."
      />
      <Section>
        <div className="space-y-5">
          {caseStudies.map((study, index) => (
            <article
              key={study.slug}
              className="surface-panel grid gap-8 rounded-2xl p-7 md:grid-cols-[0.25fr_1fr_0.55fr] md:items-center"
            >
              <p className="text-5xl font-display font-semibold text-gradient">0{index + 1}</p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {study.client} · {study.sector}
                </p>
                <h2 className="mt-3 text-2xl font-semibold">{study.title}</h2>
                <p className="mt-3 text-muted-foreground">{study.body}</p>
              </div>
              <div className="md:border-l md:border-border md:pl-8">
                <p className="text-sm text-muted-foreground">Measured result</p>
                <p className="mt-2 font-display text-2xl font-semibold">{study.result}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
