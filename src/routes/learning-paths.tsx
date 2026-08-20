import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { Section, SectionHeading, TrainingHero } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { roadmaps } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/learning-paths")({
  head: () => ({
    meta: [
      { title: `Learning Paths | ${site.name}` },
      {
        name: "description",
        content:
          "Visual learning roadmaps for frontend, full-stack, data, DevOps and UI/UX careers.",
      },
    ],
  }),
  component: LearningPaths,
});
function LearningPaths() {
  return (
    <>
      <TrainingHero
        eyebrow="Learning paths"
        title="A map is useful when it helps you move."
        description="Choose a role, see the skills in sequence and pair the next step with a course, project or mentor conversation."
      />
      <Section>
        <div className="grid gap-5 lg:grid-cols-2">
          {roadmaps.map((roadmap) => (
            <article key={roadmap.slug} className="surface-panel rounded-2xl p-7">
              <p className="text-sm font-semibold text-primary">Role roadmap</p>
              <h2 className="mt-4 text-2xl font-semibold">{roadmap.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{roadmap.description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-2">
                {roadmap.steps.map((step, index) => (
                  <span key={step} className="inline-flex items-center gap-2">
                    <span className="rounded-full border border-primary/50 px-3 py-2 text-sm">
                      {step}
                    </span>
                    {index < roadmap.steps.length - 1 ? (
                      <ArrowRight className="h-4 w-4 text-primary" />
                    ) : null}
                  </span>
                ))}
              </div>
              <Button asChild variant="subtle" className="mt-8">
                <Link to="/courses">
                  Find matching courses <ArrowRight />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </Section>
      <Section muted>
        <SectionHeading eyebrow="How to use a roadmap" title="Start with the next credible step." />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "Choose a role you want to explore",
            "Build one project that proves a skill",
            "Review your next step with an instructor",
          ].map((item, index) => (
            <div key={item} className="border-t border-primary pt-5">
              <p className="text-sm font-semibold text-primary">0{index + 1}</p>
              <p className="mt-4 font-semibold">{item}</p>
              <Check className="mt-5 h-5 w-5 text-primary" />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
