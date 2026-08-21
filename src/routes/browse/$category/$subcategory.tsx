import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Clock, Star, Trophy } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { courses } from "@/data/training";

function formatSlug(slug: string) {
  if (slug === "software-development") return "Software Development";
  if (slug === "data-science") return "Data & AI";
  if (slug === "cloud-devops") return "Cloud & DevOps";
  if (slug === "ui-ux") return "UI/UX & Design";

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const Route = createFileRoute("/browse/$category/$subcategory")({
  head: ({ params }) => {
    const subTitle = formatSlug(params.subcategory);
    const catTitle = formatSlug(params.category);
    return {
      meta: [
        { title: `${subTitle} Courses | ${catTitle} | ${site.name}` },
        {
          name: "description",
          content: `Deep dive into ${subTitle} within the ${catTitle} domain. Find the best courses for your career goals.`,
        },
      ],
    };
  },
  component: SubCategoryBrowse,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

function SubCategoryBrowse() {
  const { category: categorySlug, subcategory: subcategorySlug } = Route.useParams();

  const categoryName = formatSlug(categorySlug);
  const subcategoryName = formatSlug(subcategorySlug);

  // Filter courses by searching for the subcategory term in title, summary, or outcomes
  const term = subcategoryName.toLowerCase().replace(/ & /g, " ").split(" ")[0];

  const subcategoryCourses = courses.filter((c) => {
    const str = `${c.title} ${c.summary} ${c.tools.join(" ")}`.toLowerCase();
    return (
      str.includes(term) &&
      (c.category.toLowerCase().includes(categoryName.toLowerCase()) ||
        categoryName.toLowerCase().includes(c.category.toLowerCase()))
    );
  });

  return (
    <div className="bg-background text-foreground">
      {/* Breadcrumbs */}
      <div className="border-b border-border bg-surface/30 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Link to="/courses" className="hover:text-primary transition-colors">
            Explore
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            to="/browse/$category"
            params={{ category: categorySlug }}
            className="hover:text-primary transition-colors"
          >
            {categoryName}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{subcategoryName}</span>
        </div>
      </div>

      <section className="relative border-b border-border bg-surface/50 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {subcategoryName} Courses
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Master the specific skills needed for {subcategoryName}. Compare top-rated
              certificates and specializations.
            </p>
          </motion.div>
        </div>
      </section>

      <Section className="py-16">
        {subcategoryCourses.length === 0 ? (
          <div className="text-center py-20 bg-surface/30 rounded-2xl border border-dashed border-border/60">
            <h3 className="text-lg font-semibold mb-2">
              No courses specifically for "{subcategoryName}" yet.
            </h3>
            <p className="text-muted-foreground">
              Try broadening your search to the parent category.
            </p>
            <Button asChild className="mt-6">
              <Link to="/browse/$category" params={{ category: categorySlug }}>
                Back to {categoryName}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subcategoryCourses.map((course, i) => (
              <motion.article
                key={course.slug}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-background p-6 transition-all hover:border-primary/40 hover:shadow-elevated"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <Badge
                      variant="outline"
                      className={`border-${course.accent}-500/30 text-${course.accent}-500 bg-${course.accent}-500/10`}
                    >
                      {course.credentialType || "Professional Certificate"}
                    </Badge>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.summary}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-6">
                    <span className="flex items-center">
                      <Star className="mr-1 h-3.5 w-3.5 text-amber-500 fill-current" />{" "}
                      {course.rating || 4.8}
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3.5 w-3.5" /> {course.duration}
                    </span>
                  </div>
                </div>

                <div className="pt-5 border-t border-border/60">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/courses/$slug" params={{ slug: course.slug }}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </Section>

      <CtaBand />
    </div>
  );
}
