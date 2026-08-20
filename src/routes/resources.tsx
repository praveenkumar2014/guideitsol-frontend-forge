import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookMarked, Download, FileText, PlayCircle } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const resources = [
  {
    title: "Java Full Stack Interview Guide 2025",
    type: "PDF Guide",
    icon: FileText,
    desc: "150+ frequently asked interview questions for Spring Boot and React roles, complete with optimal answers and code snippets.",
  },
  {
    title: "System Design for Beginners",
    type: "Video Series",
    icon: PlayCircle,
    desc: "A 4-part masterclass on designing scalable systems (Load Balancers, Caching, Databases) explained simply.",
  },
  {
    title: "AWS Certified Solutions Architect Cheat Sheet",
    type: "Cheat Sheet",
    icon: BookMarked,
    desc: "A concise 10-page cheat sheet mapping all core AWS services needed to clear the SAA-C03 exam.",
  },
  {
    title: "Data Science Project Portfolio Template",
    type: "Template",
    icon: Download,
    desc: "A Notion template designed specifically for data scientists to showcase notebooks, findings, and business impact.",
  },
];

function Resources() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              Free Community Resources
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Learn, prepare, and <span className="text-gradient">succeed.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Curated free resources by our instructors to help you prep for interviews, pass certifications, and build better portfolios.
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {resources.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="surface-panel rounded-2xl p-6 hover:border-primary/40 transition-colors flex gap-4"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <Badge variant="secondary" className="mb-2 text-xs">{item.type}</Badge>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  <Link to="/auth" className="inline-block mt-4 text-sm font-medium text-primary hover:underline">
                    Download Resource →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      <CtaBand />
    </div>
  );
}
