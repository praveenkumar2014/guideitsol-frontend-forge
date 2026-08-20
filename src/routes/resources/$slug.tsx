import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Section } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { articles } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/resources/$slug")({
  head: ({ params }) => {
    const article = articles.find((item) => item.slug === params.slug);
    return {
      meta: [
        {
          title: article ? `${article.title} | ${site.name}` : `Article | ${site.name}`,
        },
        ...(article
          ? [
              {
                name: "description",
                content: article.excerpt,
              },
            ]
          : []),
      ],
    };
  },
  component: ResourceArticle,
});

function ResourceArticle() {
  const { slug } = Route.useParams();
  const article = articles.find((item) => item.slug === slug);
  if (!article) throw notFound();

  return (
    <>
      <Section>
        <div className="mx-auto max-w-3xl">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All resources
          </Link>
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            {article.category} · {article.date}
          </p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{article.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{article.excerpt}</p>
          <div className="mt-10 space-y-6">
            {article.body.map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
            <Button asChild variant="subtle">
              <Link to="/courses">Explore courses</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/contact">Ask a question</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}