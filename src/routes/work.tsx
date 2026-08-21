import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Quote, Trophy } from "lucide-react";

import { AnimatedCard, StaggerContainer } from "@/components/animated-card";
import { AnimatedSection } from "@/components/animated-section";
import { CtaBand } from "@/components/cta-band";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: `Our Work & Case Studies | ${site.name}` },
      {
        name: "description",
        content:
          "Explore the success stories, enterprise transformations, and impact created by GuideSoft IT Solutions.",
      },
    ],
  }),
  component: Work,
});

const caseStudies = [
  {
    title: "Upskilling 200+ Engineers in AWS & Microservices",
    client: "Leading Fintech MNC, Hyderabad",
    metric: "40% faster deployment cycles",
    desc: "We designed a bespoke 12-week weekend program for a major fintech client moving from monolithic architecture to AWS-hosted microservices. Resulted in seamless transition and zero downtime during the architecture shift.",
    outcomes: [
      "Reduced deployment time from 45 min to 8 min",
      "Zero production incidents during migration",
      "12 engineers promoted to senior roles within 6 months",
    ],
  },
  {
    title: "Hire-Train-Deploy for Quality Assurance",
    client: "Global E-Commerce Player",
    metric: "100% Day-one readiness",
    desc: "Sourced and trained a dedicated batch of 45 freshers in Selenium, API Testing, and CI/CD pipelines. The cohort was deployed directly into the client's testing teams, saving them 6 months of internal training time.",
    outcomes: [
      "45 freshers deployed in 12 weeks",
      "Client saved ₹1.2 Cr in internal training costs",
      "92% retention rate after 1 year",
    ],
  },
  {
    title: "Building an Internal LMS Platform",
    client: "State Education Board",
    metric: "10,000+ daily active users",
    desc: "A pod of our senior instructors and top alumni built a highly scalable React + Node.js Learning Management System for a state education body, serving video content seamlessly to rural areas.",
    outcomes: [
      "Served 50,000+ students in first semester",
      "99.9% uptime during peak exam hours",
      "Low-bandwidth mode for rural connectivity",
    ],
  },
];

const testimonials = [
  {
    quote:
      "GuideSoft didn't just teach me Java — they taught me how to think like an engineer. I walked into my TCS interview with confidence I never had before.",
    name: "Rahul Verma",
    role: "SDE-2 at TCS",
    batch: "Java Full Stack · 2023",
  },
  {
    quote:
      "The placement team's mock interviews were harder than the real ones. By the time I sat for Capgemini, the actual interview felt easy.",
    name: "Sneha Reddy",
    role: "QA Engineer at Capgemini",
    batch: "Automation Testing · 2024",
  },
  {
    quote:
      "I switched from mechanical engineering to cloud engineering at 28. GuideSoft's career transition program made it possible — ₹4.2 LPA to ₹11 LPA in 8 months.",
    name: "Karthik Chowdary",
    role: "Cloud Engineer at Wipro",
    batch: "AWS Solutions Architect · 2023",
  },
];

function Work() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              Impact & Case Studies
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Proven results at <span className="text-gradient">enterprise scale.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              We don't just teach individuals; we solve complex talent and technology challenges for
              modern organizations.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* CASE STUDIES */}
      <Section>
        <SectionHeading
          eyebrow="Case Studies"
          title="Enterprise transformation stories"
          description="Real engagements with measurable outcomes. Every case study represents a partnership where we delivered tangible business impact."
          centered
        />
        <StaggerContainer className="mt-12 grid gap-12 lg:grid-cols-1 max-w-4xl mx-auto">
          {caseStudies.map((study) => (
            <AnimatedCard
              key={study.title}
              className="p-8 md:p-10 hover:border-primary/40 transition-colors"
            >
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
                Client: {study.client}
              </Badge>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                {study.title}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">{study.desc}</p>

              <div className="mb-6">
                <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-amber-500" />
                  Key Outcomes
                </p>
                <ul className="space-y-2">
                  {study.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3 py-4 border-t border-border">
                <Trophy className="h-5 w-5 text-amber-500" />
                <span className="font-medium text-foreground">Impact:</span>
                <span className="text-muted-foreground">{study.metric}</span>
              </div>
            </AnimatedCard>
          ))}
        </StaggerContainer>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="bg-surface/30">
        <SectionHeading eyebrow="Student Voices" title="What our graduates say" centered />
        <StaggerContainer className="mt-12 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <AnimatedCard key={t.name} className="p-6 flex flex-col">
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                "{t.quote}"
              </p>
              <div className="mt-6 pt-4 border-t border-border">
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-primary mt-0.5">{t.role}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.batch}</p>
              </div>
            </AnimatedCard>
          ))}
        </StaggerContainer>
      </Section>

      <CtaBand
        title="Partner With Us"
        description="Ready to transform your team or build your next product?"
      />
    </div>
  );
}
