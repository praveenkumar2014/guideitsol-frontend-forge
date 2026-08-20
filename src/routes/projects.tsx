import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Code2,
  FileCode2,
  FolderKanban,
  Github,
  LayoutTemplate,
  MonitorPlay,
  Server,
  Star,
  TerminalSquare,
} from "lucide-react";

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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const projectCategories = [
  { id: "fullstack", label: "Full Stack", icon: LayoutTemplate },
  { id: "backend", label: "Backend Systems", icon: Server },
  { id: "data", label: "Data & ML", icon: MonitorPlay },
  { id: "devops", label: "Cloud & DevOps", icon: TerminalSquare },
];

function Projects() {
  return (
    <div className="bg-background text-foreground">
      {/* HERO */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              Student Project Portfolio
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Don't just write code.{" "}
              <span className="text-gradient">Build products.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              At GuideSoft IT, we believe a strong portfolio is your best resume. Explore the production-ready applications our students build to land roles at top tech companies.
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {projectCategories.map((cat) => (
            <Badge key={cat.id} variant="outline" className="px-4 py-2 text-sm flex items-center gap-2 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </Badge>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="surface-panel rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-elevated flex flex-col"
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
                      <h2 className="text-xl font-display font-semibold text-foreground mt-0.5">{project.title}</h2>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">{project.technology}</Badge>
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
                    <li key={outcome} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      {outcome}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-3 pt-6 border-t border-border">
                  <Button variant="outline" className="w-full rounded-xl" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    View Sample Repo
                  </Button>
                  <Button className="w-full rounded-xl" size="sm" asChild>
                    <Link to="/courses">Explore Course</Link>
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Section>

      <CtaBand />
    </div>
  );
}
