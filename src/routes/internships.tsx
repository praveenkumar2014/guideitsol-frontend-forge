import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { Section, SectionHeading, TrainingHero } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { internships } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/internships")({
  head: () => ({
    meta: [
      { title: `Internships | ${site.name}` },
      {
        name: "description",
        content: "Guided project internships in web, data, testing, design and technology skills.",
      },
    ],
  }),
  component: Internships,
});
function Internships() {
  return (
    <>
      <TrainingHero
        eyebrow="Project internships"
        title="Practice the work before you apply for it."
        description="Guided project cohorts with a mentor, weekly tasks and a final review. These are learning experiences, not employment guarantees."
      />
      <Section>
        <SectionHeading eyebrow="Available projects" title="Choose a project brief." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {internships.map((item) => (
            <article key={item.slug} className="surface-panel rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                {item.category} · {item.duration}
              </p>
              <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <p className="mt-5 text-sm">
                <strong>Mentor:</strong> {item.mentor} · {item.mode}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <Button asChild variant="subtle" className="mt-7">
                <Link to="/contact" search={{ source: `internship:${item.slug}` }}>
                  Ask about eligibility <ArrowRight />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </Section>
      <Section muted>
        <SectionHeading eyebrow="What you receive" title="A clear practice loop." />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "A scoped project brief",
            "Weekly mentor checkpoints",
            "A reviewable final submission",
          ].map((item) => (
            <div key={item} className="flex gap-3 text-sm">
              <Check className="h-5 w-5 shrink-0 text-primary" />
              {item}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
