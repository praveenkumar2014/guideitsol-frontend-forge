import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  LoaderCircle,
  Menu,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { RequireAuth } from "@/components/require-auth";
import { Section } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/training";
import { site } from "@/data/site";
import { learnerApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/course-player/$slug")({
  head: ({ params }) => {
    const course = courses.find((item) => item.slug === params.slug);
    return {
      meta: [
        {
          title: course
            ? `${course.shortTitle} Player | ${site.name}`
            : `Course Player | ${site.name}`,
        },
      ],
    };
  },
  component: CoursePlayer,
});

type LessonPos = { module: number; lesson: number };

function CoursePlayer() {
  const { slug } = Route.useParams();
  const course = courses.find((item) => item.slug === slug);
  if (!course) throw notFound();

  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const [pos, setPos] = useState<LessonPos>({ module: 0, lesson: 0 });
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const activeModule = course.modules[pos.module];
  const activeLesson = activeModule?.lessons[pos.lesson];
  if (!activeModule || !activeLesson) throw notFound();

  const progressQuery = useQuery({
    queryKey: ["progress", slug],
    queryFn: () => learnerApi.progress(slug, accessToken() ?? ""),
    enabled: Boolean(accessToken()),
  });

  const completedLessons = new Set(
    (progressQuery.data ?? []).filter((item) => item.completed).map((item) => item.lesson_key),
  );
  const isComplete = completedLessons.has(`${pos.module}:${pos.lesson}`);

  const saveProgress = useMutation({
    mutationFn: (completed: boolean) =>
      learnerApi.saveProgress(
        {
          course_slug: slug,
          module_index: pos.module,
          lesson_index: pos.lesson,
          completed,
        },
        accessToken() ?? "",
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress", slug] });
      toast.success("Progress saved.");
    },
    onError: () => {
      toast.error("Could not save progress. Please try again.");
    },
  });

  const lessons = course.modules.flatMap((module, mIndex) =>
    module.lessons.map((lesson, lIndex) => ({ module: mIndex, lesson: lIndex, title: lesson.title })),
  );
  const currentIndex = lessons.findIndex((item) => item.module === pos.module && item.lesson === pos.lesson);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : undefined;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : undefined;

  const totalLessons = lessons.length;
  const completedCount = course.modules.reduce(
    (sum, module, mIndex) =>
      sum + module.lessons.filter((_, lIndex) => completedLessons.has(`${mIndex}:${lIndex}`)).length,
    0,
  );
  const percent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <RequireAuth fallbackTo={`/course-player/${slug}`}>
      <div className="min-h-[calc(100vh-4rem)] bg-surface/30">
        <div className="border-b border-border bg-background">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link
              to="/student-dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <p className="hidden text-sm font-semibold sm:block">{course.title}</p>
            <Button variant="subtle" size="sm" onClick={() => setNotesOpen((v) => !v)}>
              <Menu className="h-4 w-4" />
              Notes
            </Button>
          </div>
          <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 pb-4 sm:px-6">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalLessons} lessons · {percent}%
            </span>
          </div>
        </div>
        <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[280px_1fr]">
          <aside className="border-b border-border bg-background p-5 lg:min-h-[calc(100vh-8rem)] lg:border-b-0 lg:border-r">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Course contents
            </p>
            <div className="mt-6 space-y-5">
              {course.modules.map((module, mIndex) => (
                <div key={module.title}>
                  <p className="text-sm font-semibold">{module.title}</p>
                  <div className="mt-2 space-y-1">
                    {module.lessons.map((lesson, lIndex) => {
                      const done = completedLessons.has(`${mIndex}:${lIndex}`);
                      const isActive = pos.module === mIndex && pos.lesson === lIndex;
                      return (
                        <button
                          key={lesson.title}
                          type="button"
                          onClick={() => setPos({ module: mIndex, lesson: lIndex })}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs ${isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60"}`}
                        >
                          {done ? (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                          ) : (
                            <PlayCircle className="h-3.5 w-3.5 shrink-0 text-primary" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
          <main>
            <Section>
              <div className="mx-auto max-w-3xl">
                <div className="flex aspect-video items-center justify-center rounded-2xl border border-border bg-background shadow-inner">
                  <div className="text-center">
                    <PlayCircle className="mx-auto h-14 w-14 text-primary" />
                    <p className="mt-4 font-display text-xl font-semibold">{activeLesson.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {activeModule.title} · {activeLesson.duration} · {activeLesson.type}
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-primary">
                      Lesson {pos.module + 1}.{pos.lesson + 1} of {course.modules.length} modules
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold">{activeLesson.title}</h1>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                      Review the {activeLesson.type.toLowerCase()} material, complete the practice
                      exercise and capture one question for the next live session.
                    </p>
                    <p className="mt-4 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                      <strong className="text-foreground">Assignment:</strong>{" "}
                      {activeModule.assignment}
                    </p>
                  </div>
                  {isComplete ? (
                    <CheckCircle2 className="h-7 w-7 shrink-0 text-primary" aria-label="Completed" />
                  ) : null}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    variant={isComplete ? "subtle" : "hero"}
                    onClick={() => saveProgress.mutate(!isComplete)}
                    disabled={saveProgress.isPending}
                  >
                    {saveProgress.isPending ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {isComplete ? "Mark as incomplete" : "Mark complete"}
                  </Button>
                  <Button variant="subtle" onClick={() => setNotesOpen((v) => !v)}>
                    <FileText />
                    Lesson notes
                  </Button>
                </div>
                {notesOpen ? (
                  <div className="mt-6 rounded-xl border border-border bg-background p-4">
                    <label className="text-sm font-medium" htmlFor="lesson-notes">
                      Notes for this lesson
                    </label>
                    <textarea
                      id="lesson-notes"
                      rows={4}
                      className="mt-2 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Capture questions and ideas for the next live session…"
                      value={noteText}
                      onChange={(event) => setNoteText(event.target.value)}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Notes are stored locally in this browser for now.
                    </p>
                  </div>
                ) : null}
                <div className="mt-10 flex justify-between border-t border-border pt-6">
                  <Button
                    variant="subtle"
                    disabled={!prevLesson}
                    onClick={() => prevLesson && setPos({ module: prevLesson.module, lesson: prevLesson.lesson })}
                  >
                    <ChevronLeft />
                    Previous
                  </Button>
                  <Button
                    variant="subtle"
                    disabled={!nextLesson}
                    onClick={() => nextLesson && setPos({ module: nextLesson.module, lesson: nextLesson.lesson })}
                  >
                    Next lesson
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </Section>
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}