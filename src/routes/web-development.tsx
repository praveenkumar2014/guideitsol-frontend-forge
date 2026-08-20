import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Globe, LayoutTemplate, Server } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { courses } from "@/data/training";

export const Route = createFileRoute("/web-development")({
  head: () => ({
    meta: [
      { title: `Web Development Courses | ${site.name}` },
      {
        name: "description",
        content:
          "Master Full Stack Web Development with Java, Python, and React. Build production-ready web applications with GuideSoft IT.",
      },
    ],
  }),
  component: WebDevelopment,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

function WebDevelopment() {
  const webCourses = courses.filter((c) => c.category === "Software Development");

  return (
    <div className="bg-background text-foreground">
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              Specialization Track
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Web Development <span className="text-gradient">Engineering</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              From responsive frontend interfaces to scalable backend microservices, our web development tracks prepare you for the entire product lifecycle.
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          {webCourses.map((course, i) => (
            <motion.article
              key={course.slug}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="surface-panel rounded-2xl overflow-hidden hover:border-primary/40 transition-colors"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Code2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-1 text-xs">{course.level}</Badge>
                    <h2 className="text-2xl font-display font-semibold text-foreground">{course.title}</h2>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {course.summary}
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {course.tools.slice(0, 5).map((tool) => (
                    <Badge key={tool} variant="outline" className="text-xs">{tool}</Badge>
                  ))}
                </div>

                <Button asChild className="w-full rounded-xl">
                  <Link to="/courses/$slug" params={{ slug: course.slug }}>
                    View Course Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </Section>

      <CtaBand title="Need help choosing?" description="Talk to our career counsellors to find the right web development track for your background." />
    </div>
  );
}
