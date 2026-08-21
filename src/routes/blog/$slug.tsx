import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Clock, User } from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { Badge } from "@/components/ui/badge";
import { articles } from "@/data/blog";
import { site } from "@/data/site";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    return {
      meta: [
        { title: article ? `${article.title} | ${site.name}` : `Article | ${site.name}` },
        {
          name: "description",
          content: article?.excerpt || site.tagline,
        },
        { property: "og:title", content: article?.title || site.name },
        { property: "og:description", content: article?.excerpt || site.tagline },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: BlogArticlePage,
});

function BlogArticlePage() {
  const { slug } = Route.useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-surface/30 pb-20">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
          </Link>
          <div className="rounded-2xl border border-border bg-background p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <h1 className="font-display text-xl font-bold text-foreground mb-2">
              Article Not Found
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Browse all articles <ArrowLeft className="h-3 w-3 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface/30 pb-20">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatedSection direction="up">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
          </Link>

          <article className="rounded-2xl border border-border bg-background p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                {article.category}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {article.readTime}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-8 pb-6 border-b border-border">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> {article.author}
              </span>
              <span>{article.date}</span>
            </div>

            <div className="prose prose-sm max-w-none space-y-5">
              {article.content.map((paragraph, idx) => (
                <p key={idx} className="text-sm text-foreground/80 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {article.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{article.author}</p>
                  <p className="text-[10px] text-muted-foreground">GUIDESOFT Faculty</p>
                </div>
              </div>
              <Link
                to="/courses"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Explore our courses <ArrowLeft className="h-3 w-3 rotate-180" />
              </Link>
            </div>
          </article>
        </AnimatedSection>
      </div>
    </div>
  );
}
