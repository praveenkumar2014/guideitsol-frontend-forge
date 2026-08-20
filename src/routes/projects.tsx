import { createFileRoute } from "@tanstack/react-router";
import { Code2, Check } from "lucide-react";

import { Section, SectionHeading, TrainingHero } from "@/components/training-ui";
import { projects } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: `Projects | ${site.name}` },
      {
        name: "description",
        content:
          "Practical GUIDESOFT project briefs for building a portfolio with evidence and reflection.",
      },
    ],
  }),
  component: Projects,
});
function Projects() {
  return (
    <>
      <TrainingHero
        eyebrow="Project library"
        title="A portfolio is a record of decisions."
        description="Use these briefs to practise a technology, document your assumptions and get ready to explain the work in an interview."
      />
      <Section>
        <SectionHeading eyebrow="Project briefs" title="Build something you can defend." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.title} className="surface-panel rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <Code2 className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {project.difficulty}
                </span>
              </div>
              <h2 className="mt-8 text-xl font-semibold">{project.title}</h2>
              <p className="mt-2 text-sm text-primary">
                {project.category} · {project.technology}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {project.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-2">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
