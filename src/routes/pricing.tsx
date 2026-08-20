import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { PageHero, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { plans, site } from "@/data/site";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: `Pricing | ${site.name}` },
      {
        name: "description",
        content:
          "Straightforward engagement models for product launches, dedicated pods and enterprise programmes.",
      },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Engagement models"
        title="A clear price for a clear next step."
        description="Start with a fixed-scope launch, add a dedicated pod or bring us into a larger programme. Every option begins with a useful conversation."
      />
      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`surface-panel rounded-2xl p-7 ${plan.featured ? "border-primary glow-elevated" : ""}`}
            >
              <p className="text-sm font-semibold text-primary">{plan.name}</p>
              <p className="mt-7 font-display text-4xl font-semibold">{plan.price}</p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.cadence}</p>
              <p className="mt-7 min-h-12 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={plan.featured ? "hero" : "subtle"}
                size="lg"
                className="mt-9 w-full"
              >
                <Link to="/contact">{plan.cta}</Link>
              </Button>
            </article>
          ))}
        </div>
      </Section>
      <CtaBand
        title="Not sure which model fits?"
        description="We will help you choose the smallest engagement that can produce a meaningful result."
      />
    </>
  );
}
