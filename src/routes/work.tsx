import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";

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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const caseStudies = [
  {
    title: "Upskilling 200+ Engineers in AWS & Microservices",
    client: "Leading Fintech MNC, Hyderabad",
    metric: "40% faster deployment cycles",
    desc: "We designed a bespoke 12-week weekend program for a major fintech client moving from monolithic architecture to AWS-hosted microservices. Resulted in seamless transition and zero downtime during the architecture shift.",
  },
  {
    title: "Hire-Train-Deploy for Quality Assurance",
    client: "Global E-Commerce Player",
    metric: "100% Day-one readiness",
    desc: "Sourced and trained a dedicated batch of 45 freshers in Selenium, API Testing, and CI/CD pipelines. The cohort was deployed directly into the client's testing teams, saving them 6 months of internal training time.",
  },
  {
    title: "Building an Internal LMS Platform",
    client: "State Education Board",
    metric: "10,000+ daily active users",
    desc: "A pod of our senior instructors and top alumni built a highly scalable React + Node.js Learning Management System for a state education body, serving video content seamlessly to rural areas.",
  },
];

function Work() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              Impact & Case Studies
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Proven results at <span className="text-gradient">enterprise scale.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              We don't just teach individuals; we solve complex talent and technology challenges for modern organizations.
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-1 max-w-4xl mx-auto">
          {caseStudies.map((study, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="surface-panel rounded-2xl p-8 md:p-10 hover:border-primary/40 transition-colors"
            >
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
                Client: {study.client}
              </Badge>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-4">{study.title}</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">{study.desc}</p>
              
              <div className="flex items-center gap-3 py-4 border-t border-border">
                <Trophy className="h-5 w-5 text-amber-500" />
                <span className="font-medium text-foreground">Impact:</span>
                <span className="text-muted-foreground">{study.metric}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <CtaBand title="Partner With Us" description="Ready to transform your team or build your next product?" />
    </div>
  );
}
