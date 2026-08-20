import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Code2, Globe, Server, Star, Trophy } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { courses } from "@/data/training";

export const Route = createFileRoute("/browse/$category")({
  head: ({ params }) => {
    const title = params.category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${title} Courses | ${site.name}` },
        {
          name: "description",
          content: `Master ${title} with our expert-led courses and specializations.`,
        },
      ],
    };
  },
  component: CategoryBrowse,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

function formatCategoryName(slug: string) {
  // Convert slug to standard category names based on data
  const slugMap: Record<string, string> = {
    "software-development": "Software Development",
    "data-ai": "Data & AI",
    "data-science": "Data & AI",
    "cloud-devops": "Cloud & DevOps",
    testing: "Testing",
    "ui-ux-design": "UI/UX & Design",
    design: "UI/UX & Design",
    "sap-enterprise": "SAP & Enterprise",
    "mobile-development": "Mobile Development",
    "digital-business": "Digital & Business",
  };

  return (
    slugMap[slug] ||
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

function CategoryBrowse() {
  const { category: categorySlug } = Route.useParams();
  const categoryName = formatCategoryName(categorySlug);

  // Filter courses by category
  // Handle edge cases where category strings might have slightly different formatting
  const categoryCourses = courses.filter(
    (c) =>
      c.category.toLowerCase().includes(categoryName.toLowerCase()) ||
      categoryName.toLowerCase().includes(c.category.toLowerCase()) ||
      c.category.toLowerCase() === categorySlug.replace(/-/g, " ").toLowerCase(),
  );

  return (
    <div className="bg-background text-foreground">
      {/* Category Hero */}
      <section className="relative border-b border-border bg-surface/50 overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              Explore Top Courses
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Learn {categoryName}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Launch your new career in {categoryName}. Build your portfolio with hands-on projects,
              earn a certificate, and get job-ready with guidance from top instructors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Popular Courses in Category */}
      <Section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold">Popular {categoryName} Programs</h2>
          <span className="text-sm text-muted-foreground">{categoryCourses.length} results</span>
        </div>

        {categoryCourses.length === 0 ? (
          <div className="text-center py-24 bg-surface/50 rounded-2xl border border-border">
            <h3 className="text-lg font-semibold mb-2">No specific courses found yet.</h3>
            <p className="text-muted-foreground">
              We are constantly adding new programs. Check back soon!
            </p>
            <Button asChild className="mt-6">
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryCourses.map((course, i) => (
              <motion.article
                key={course.slug}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-surface/40 p-6 transition-all hover:border-primary/40 hover:shadow-elevated"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <Badge
                      variant="outline"
                      className={`border-${course.accent}-500/30 text-${course.accent}-500 bg-${course.accent}-500/10`}
                    >
                      {course.credentialType || "Professional Certificate"}
                    </Badge>
                    <span className="flex items-center text-xs font-semibold text-amber-500">
                      <Star className="mr-1 h-3.5 w-3.5 fill-current" />
                      {course.rating || 4.8}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Offered by{" "}
                    <span className="font-semibold text-foreground/80">{course.instructor}</span>
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-6">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3.5 w-3.5" /> {course.duration}
                    </span>
                    <span className="flex items-center">
                      <Trophy className="mr-1 h-3.5 w-3.5" /> {course.level}
                    </span>
                  </div>
                </div>

                <div className="pt-5 border-t border-border/60">
                  <Button asChild variant="default" className="w-full">
                    <Link to="/courses/$slug" params={{ slug: course.slug }}>
                      View Program Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </Section>

      <CtaBand
        title="Not sure where to start?"
        description="Chat with an admissions counselor to map out your career path."
      />
    </div>
  );
}
