import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Building, Code, Users } from "lucide-react";

import { AnimatedCard, StaggerContainer } from "@/components/animated-card";
import { AnimatedSection } from "@/components/animated-section";
import { CtaBand } from "@/components/cta-band";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { site } from "@/data/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: `Corporate Services & Training | ${site.name}` },
      {
        name: "description",
        content:
          "Corporate IT training, bespoke team upskilling, and hiring solutions provided by GuideSoft IT Solutions.",
      },
    ],
  }),
  component: Services,
});

const services = [
  {
    title: "Corporate Upskilling",
    icon: Building,
    desc: "Custom-designed training programs for your engineering teams. Whether transitioning to Cloud (AWS) or upgrading to React 18 & Next.js, we deliver intensive, hands-on workshops.",
  },
  {
    title: "Fresher Onboarding (HTD)",
    icon: Users,
    desc: "Hire-Train-Deploy model. We source top freshers, train them on your exact tech stack over 8-12 weeks, and deploy them to your projects on day one, fully productive.",
  },
  {
    title: "Bespoke Product Development",
    icon: Code,
    desc: "Need a product built? Our senior instructors lead elite pods of our top graduates to deliver high-quality MVPs and enterprise tools at competitive rates.",
  },
  {
    title: "Talent Acquisition / Direct Hiring",
    icon: Briefcase,
    desc: "Skip the generic job boards. Hire directly from our pool of rigorously trained and vetted engineers in Java, Data Science, DevOps, and Automation Testing.",
  },
];

function Services() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              For Enterprises & Startups
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Empower your <span className="text-gradient">engineering teams.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Partner with GuideSoft IT to train your existing workforce, onboard new hires
              effectively, or hire day-one ready talent from our rigorous programs.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <Section>
        <StaggerContainer className="grid gap-8 sm:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <AnimatedCard
                key={service.title}
                className="p-8 hover:border-primary/40 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
              </AnimatedCard>
            );
          })}
        </StaggerContainer>
      </Section>

      <CtaBand
        title="Discuss Your Requirements"
        description="Speak with our enterprise partnerships team to design a custom solution."
      />
    </div>
  );
}
