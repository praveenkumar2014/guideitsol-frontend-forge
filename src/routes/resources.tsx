import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked, Download, FileText, PlayCircle } from "lucide-react";

import { AnimatedCard, StaggerContainer } from "@/components/animated-card";
import { AnimatedSection } from "@/components/animated-section";
import { CtaBand } from "@/components/cta-band";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: `Free Resources & Guides | ${site.name}` },
      {
        name: "description",
        content:
          "Free tech resources, interview preparation guides, cheat sheets, and webinar recordings from GuideSoft IT.",
      },
    ],
  }),
  component: Resources,
});

const resources = [
  {
    title: "Java Full Stack Interview Guide 2025",
    type: "PDF Guide",
    icon: FileText,
    desc: "150+ frequently asked interview questions for Spring Boot and React roles, complete with optimal answers and code snippets.",
    pages: "48 pages",
  },
  {
    title: "System Design for Beginners",
    type: "Video Series",
    icon: PlayCircle,
    desc: "A 4-part masterclass on designing scalable systems (Load Balancers, Caching, Databases) explained simply.",
    pages: "4 videos · 3.5 hrs",
  },
  {
    title: "AWS Certified Solutions Architect Cheat Sheet",
    type: "Cheat Sheet",
    icon: BookMarked,
    desc: "A concise 10-page cheat sheet mapping all core AWS services needed to clear the SAA-C03 exam.",
    pages: "10 pages",
  },
  {
    title: "Data Science Project Portfolio Template",
    type: "Template",
    icon: Download,
    desc: "A Notion template designed specifically for data scientists to showcase notebooks, findings, and business impact.",
    pages: "Notion template",
  },
  {
    title: "React & Next.js Best Practices",
    type: "PDF Guide",
    icon: FileText,
    desc: "A practical reference covering Server Components, streaming SSR, and state management patterns for production apps.",
    pages: "32 pages",
  },
  {
    title: "DevOps Pipeline Workshop Recording",
    type: "Webinar",
    icon: PlayCircle,
    desc: "Recording of our live CI/CD workshop covering GitHub Actions, Docker, and Kubernetes deployment basics.",
    pages: "2 hrs recording",
  },
];

function Resources() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              Free Community Resources
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Learn, prepare, and <span className="text-gradient">succeed.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Curated free resources by our instructors to help you prep for interviews, pass
              certifications, and build better portfolios.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Free Downloads"
          title="Resources built by practitioners"
          description="Every guide is authored by active industry engineers, not content mills. Practical, up-to-date, and directly relevant to what companies ask in interviews."
          centered
        />
        <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((item) => {
            const Icon = item.icon;
            return (
              <AnimatedCard
                key={item.title}
                className="p-6 hover:border-primary/40 transition-colors flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="text-xs">
                      {item.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{item.pages}</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                  {item.desc}
                </p>
                <Button asChild variant="subtle" size="sm" className="mt-5 self-start">
                  <Link to="/auth">
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Download Free
                  </Link>
                </Button>
              </AnimatedCard>
            );
          })}
        </StaggerContainer>
      </Section>

      <CtaBand
        title="Want hands-on training?"
        description="Join a live cohort to go beyond cheat sheets and build production-ready skills with expert mentors."
      />
    </div>
  );
}
