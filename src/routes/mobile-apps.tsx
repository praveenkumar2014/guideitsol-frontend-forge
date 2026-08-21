import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Smartphone } from "lucide-react";

import { AnimatedCard, StaggerContainer } from "@/components/animated-card";
import { AnimatedSection } from "@/components/animated-section";
import { CtaBand } from "@/components/cta-band";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { courses } from "@/data/training";

export const Route = createFileRoute("/mobile-apps")({
  head: () => ({
    meta: [
      { title: `Mobile App Development | ${site.name}` },
      {
        name: "description",
        content:
          "Learn Mobile App Development with Flutter and React Native. Build cross-platform apps for iOS and Android with GuideSoft IT.",
      },
    ],
  }),
  component: MobileApps,
});

function MobileApps() {
  const mobileCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes("mobile") ||
      c.title.toLowerCase().includes("flutter") ||
      c.title.toLowerCase().includes("react"),
  );

  return (
    <div className="bg-background text-foreground">
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              Specialization Track
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Mobile App <span className="text-gradient">Development</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Build fast, beautiful cross-platform applications for iOS and Android using modern
              frameworks like Flutter and React Native.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Mobile Dev Tracks"
          title="Ship apps to both app stores"
          description="From UI design to CI/CD pipeline setup, our mobile tracks cover the full release lifecycle — not just code."
          centered
        />
        <StaggerContainer className="mt-12 grid gap-8 lg:grid-cols-2">
          {mobileCourses.slice(0, 4).map((course) => (
            <AnimatedCard
              key={course.slug}
              className="overflow-hidden hover:border-primary/40 transition-colors"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-1 text-xs">
                      {course.level}
                    </Badge>
                    <h2 className="text-2xl font-display font-semibold text-foreground">
                      {course.title}
                    </h2>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">{course.summary}</p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {course.tools.slice(0, 5).map((tool) => (
                    <Badge key={tool} variant="outline" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>

                <Button asChild className="w-full rounded-xl">
                  <Link to="/courses/$slug" params={{ slug: course.slug }}>
                    View Course Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </AnimatedCard>
          ))}
        </StaggerContainer>
      </Section>

      <CtaBand
        title="Start Building Apps"
        description="Join our next cohort and launch your first app to the App Store and Google Play."
      />
    </div>
  );
}
