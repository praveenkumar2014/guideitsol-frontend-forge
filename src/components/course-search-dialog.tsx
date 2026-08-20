import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock, Search, Sparkles, Star, Trophy, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { courses } from "@/data/training";

interface CourseSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseSearchDialog({ open, onOpenChange }: CourseSearchDialogProps) {
  const [query, setQuery] = useState("");

  const filteredCourses = courses.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.tools.some((t) => t.toLowerCase().includes(q)) ||
      c.instructor.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q)
    );
  });

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden border-border bg-background shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Courses & Certifications</DialogTitle>
        </DialogHeader>

        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5 bg-surface/50">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            id="course-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search degrees, certificates, technologies (e.g. Java, GenAI, DevOps, React)..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-surface px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {filteredCourses.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No matching programs or specializations found for "{query}".
            </div>
          ) : (
            filteredCourses.map((course) => (
              <Link
                key={course.slug}
                to="/courses/$slug"
                params={{ slug: course.slug }}
                onClick={() => onOpenChange(false)}
                className="group flex items-center justify-between rounded-xl border border-transparent p-3 transition-all hover:border-border hover:bg-surface/80"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {course.title}
                      </p>
                      <Badge variant="outline" className="text-[10px] py-0">
                        {course.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {course.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    4.9
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer Quick Links */}
        <div className="flex items-center justify-between border-t border-border bg-surface/40 px-4 py-2.5 text-xs text-muted-foreground">
          <span>Popular: Java Full Stack · GenAI · AWS DevOps · Data Science</span>
          <Link
            to="/courses"
            onClick={() => onOpenChange(false)}
            className="font-semibold text-primary hover:underline"
          >
            Browse All ({courses.length}) →
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
