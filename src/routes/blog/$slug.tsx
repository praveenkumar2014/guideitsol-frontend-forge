import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Clock, User } from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { Badge } from "@/components/ui/badge";
import { site } from "@/data/site";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: `Article | ${site.name}` },
    ],
  }),
  component: BlogArticlePage,
});

function BlogArticlePage() {
  const { slug } = Route.useParams();

  return (
    <div className="min-h-screen bg-surface/30 pb-20">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatedSection direction="up">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
          </Link>

          <article className="rounded-2xl border border-border bg-background p-6 sm:p-8">
            <Badge variant="outline" className="text-xs mb-4">Article</Badge>
            <h1 className="font-display text-2xl font-bold text-foreground mb-4 capitalize">
              {slug.replace(/-/g, " ")}
            </h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><User className="h-3 w-3" /> GUIDESOFT Faculty</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 5 min read</span>
            </div>

            <div className="prose prose-sm max-w-none text-foreground/80 space-y-4">
              <p>This article is coming soon. Our team is working on comprehensive content for this topic.</p>
              <p>In the meantime, explore our courses for hands-on learning:</p>
              <Link to="/courses" className="inline-flex items-center gap-1 text-primary font-semibold hover:underline">
                Browse All Courses <ArrowLeft className="h-3 w-3 rotate-180" />
              </Link>
            </div>
          </article>
        </AnimatedSection>
      </div>
    </div>
  );
}
