import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FolderKanban, Star } from "lucide-react";

import { AnimatedCard, StaggerContainer } from "@/components/animated-card";
import { AnimatedSection } from "@/components/animated-section";
import { CtaBand } from "@/components/cta-band";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { projects } from "@/data/training";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: `Projects Portfolio | ${site.name}` },
      {
        name: "description",
        content:
          "Real-world capstone projects built by GuideSoft IT students. See production-ready applications in Java, Python, React, and Cloud technologies.",
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  return (
    <div className="bg-background text-foreground">
      {/* HERO */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              Student Project Portfolio
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Don't just write code. <span className="text-gradient">Build products.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              At GuideSoft IT, we believe a strong portfolio is your best resume. Explore the
              production-ready applications our students build to land roles at top tech companies.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Capstone Projects"
          title="What our students build"
          description="Each project mirrors real-world production systems, combining full-stack development with DevOps, testing, and deployment practices."
          centered
        />

        <StaggerContainer className="mt-12 grid gap-8 lg:grid-cols-2">
          {projects.map((project) => (
            <AnimatedCard
              key={project.title}
              className="overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-elevated flex flex-col"
            >
              <div className="p-6 border-b border-border bg-surface/50">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FolderKanban className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                        {project.difficulty}
                      </p>
                      <h2 className="text-xl font-display font-semibold text-foreground mt-0.5">
                        {project.title}
                      </h2>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {project.technology}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {project.description}
                </p>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-primary" />
                  Key Outcomes & Deliverables
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {project.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      {outcome}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-3 pt-6 border-t border-border">
                  <Button className="w-full rounded-xl" size="sm" asChild>
                    <Link to="/courses">
                      Explore Course
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </StaggerContainer>
      </Section>

      <CtaBand />
    </div>
  );
}
