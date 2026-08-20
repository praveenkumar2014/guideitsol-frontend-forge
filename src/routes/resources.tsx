import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Section, SectionHeading, TrainingHero } from "@/components/training-ui";
import { articles } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: `Resources | ${site.name}` },
      {
        name: "description",
        content:
          "Learning resources, career notes and technology articles from GUIDESOFT instructors.",
      },
    ],
  }),
  component: Resources,
});

function Resources() {
  return (
    <>
      <TrainingHero
        eyebrow="Resources"
        title="Useful notes for the road ahead."
        description="Short, practical reading on learning technology, building projects and preparing for interviews."
      />
      <Section>
        <SectionHeading eyebrow="Latest notes" title="Read, try, reflect." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {articles.map((article) => (
            <article key={article.slug} className="surface-panel rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                {article.category} · {article.date}
              </p>
              <h2 className="mt-7 text-xl font-semibold">{article.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">
                Read article <ArrowUpRight className="h-4 w-4" />
              </span>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
