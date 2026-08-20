import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  FileText,
  Menu,
  Play,
  PlayCircle,
  Save,
  Sparkles,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { Section } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { courses } from "@/data/training";
import { site } from "@/data/site";
import { api } from "@/lib/api";

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

function CoursePlayer() {
  const { slug } = Route.useParams();
  const course = courses.find((item) => item.slug === slug);
  if (!course) throw notFound();

  // All lessons flat array for easy sequential navigation
  const allLessons = course.modules.flatMap((m, mIdx) =>
    m.lessons.map((l, lIdx) => ({
      ...l,
      moduleIndex: mIdx,
      lessonIndex: lIdx,
      moduleTitle: m.title,
      key: `${mIdx}:${lIdx}`,
    })),
  );

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];

  // Completed lessons state (synced with localStorage & backend API)
  const [completedKeys, setCompletedKeys] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`guidesoft_progress_${slug}`);
        return saved ? JSON.parse(saved) : { "0:0": true, "0:1": true, "0:2": true };
      } catch {
        return { "0:0": true, "0:1": true, "0:2": true };
      }
    }
    return { "0:0": true, "0:1": true, "0:2": true };
  });

  // Notes state
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`guidesoft_notes_${slug}_${currentLesson?.key}`) || "";
    }
    return "";
  });

  useEffect(() => {
    const saved = localStorage.getItem(`guidesoft_notes_${slug}_${currentLesson?.key}`);
    setNotes(saved || "");
  }, [currentLesson?.key, slug]);

  const handleSaveNotes = () => {
    if (currentLesson) {
      localStorage.setItem(`guidesoft_notes_${slug}_${currentLesson.key}`, notes);
      toast.success("Lesson notes saved.");
    }
  };

  const isCurrentCompleted = Boolean(completedKeys[currentLesson?.key]);

  const handleToggleComplete = async () => {
    if (!currentLesson) return;
    const newCompleted = !isCurrentCompleted;
    const updated = { ...completedKeys, [currentLesson.key]: newCompleted };
    setCompletedKeys(updated);
    localStorage.setItem(`guidesoft_progress_${slug}`, JSON.stringify(updated));

    // Calculate progress percentage
    const total = allLessons.length;
    const completedCount = Object.values(updated).filter(Boolean).length;
    const pct = Math.round((completedCount / total) * 100);
    localStorage.setItem("guidesoft_overall_progress", String(pct));

    // Fire non-blocking save to backend
    try {
      await api.saveLearnerProgress({
        course_slug: slug,
        module_index: currentLesson.moduleIndex,
        lesson_index: currentLesson.lessonIndex,
        completed: newCompleted,
      });
    } catch {
      // Ignored for graceful offline support
    }

    if (newCompleted) {
      toast.success(`Marked '${currentLesson.title}' as completed! (${pct}% total progress)`);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex((idx) => idx + 1);
    }
  };

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((idx) => idx - 1);
    }
  };

  const progressPercentage = Math.round(
    (Object.values(completedKeys).filter(Boolean).length / Math.max(allLessons.length, 1)) * 100,
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface/30">
      {/* Top Navbar */}
      <div className="border-b border-border bg-background sticky top-16 z-40">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/student-dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <span className="hidden md:inline text-xs text-muted-foreground">•</span>
            <p className="hidden md:block text-sm font-bold truncate max-w-md">{course.title}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span>{progressPercentage}% Complete</span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>

            <Button
              id="notes-toggle-btn"
              variant={notesOpen ? "hero" : "subtle"}
              size="sm"
              onClick={() => setNotesOpen((o) => !o)}
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Notes
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[320px_1fr]">
        {/* Left Sidebar Course Outline */}
        <aside className="border-b border-border bg-background p-5 lg:min-h-[calc(100vh-8rem)] lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Course Curriculum
            </p>
            <span className="text-xs font-mono text-muted-foreground">
              {Object.values(completedKeys).filter(Boolean).length}/{allLessons.length}
            </span>
          </div>

          <div className="mt-6 space-y-6">
            {course.modules.map((mod, mIdx) => (
              <div key={mod.title} className="space-y-2">
                <p className="text-xs font-bold text-foreground">
                  Module {mIdx + 1}: {mod.title}
                </p>
                <div className="space-y-1">
                  {mod.lessons.map((lesson, lIdx) => {
                    const key = `${mIdx}:${lIdx}`;
                    const isSelected = currentLesson?.key === key;
                    const isDone = Boolean(completedKeys[key]);
                    const globalIdx = allLessons.findIndex((item) => item.key === key);

                    return (
                      <button
                        key={lesson.title}
                        type="button"
                        onClick={() => setCurrentLessonIndex(globalIdx)}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                          isSelected
                            ? "bg-primary/10 text-primary font-semibold border border-primary/30"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          {isDone ? (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          ) : (
                            <PlayCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="p-4 sm:p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Simulated Interactive Video / Lab Player */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-slate-950 text-white shadow-2xl aspect-video flex flex-col justify-between p-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5 font-semibold bg-primary/20 text-primary px-2.5 py-1 rounded-full">
                  <Video className="h-3.5 w-3.5" /> High-Definition Stream
                </span>
                <span>Instructor: {course.instructor}</span>
              </div>

              <div className="text-center my-auto">
                <button
                  type="button"
                  onClick={() => toast.info("Streaming video preview playback...")}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg hover:scale-110 transition-transform"
                >
                  <Play className="h-8 w-8 ml-1" />
                </button>
                <h2 className="mt-4 font-display text-2xl font-bold">{currentLesson?.title}</h2>
                <p className="mt-1 text-xs text-slate-400">
                  {currentLesson?.moduleTitle} · {currentLesson?.duration}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                <span>GUIDESOFT Virtual Lab Environment</span>
                <span className="text-emerald-400">● Live Connection Active</span>
              </div>
            </div>

            {/* Lesson Info and Action Controls */}
            <div className="surface-panel rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {currentLesson?.moduleTitle}
                  </span>
                  <h1 className="mt-1 text-2xl sm:text-3xl font-bold">{currentLesson?.title}</h1>
                </div>

                <Button
                  variant={isCurrentCompleted ? "subtle" : "hero"}
                  size="lg"
                  onClick={handleToggleComplete}
                  className="shrink-0"
                >
                  <CheckCircle2
                    className={`mr-2 h-4 w-4 ${isCurrentCompleted ? "text-emerald-500" : ""}`}
                  />
                  {isCurrentCompleted ? "Completed" : "Mark as Complete"}
                </Button>
              </div>

              <div className="border-t border-border pt-6 text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  In this session, explore the core patterns, architectural trade-offs, and
                  practical code structures. Ensure your local workspace repository is configured
                  before following the lab exercises.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success("Lab starter files and cheatsheet downloaded.")}
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download Starter Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Opening GitHub assignment repository in new tab...")}
                >
                  <Code2 className="mr-1.5 h-3.5 w-3.5" /> Open Lab Repository
                </Button>
              </div>
            </div>

            {/* Notes Section Drawer */}
            {notesOpen && (
              <div className="surface-panel rounded-3xl p-6 sm:p-8 border border-primary/30 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-base">Your Notes for this Lesson</h3>
                  </div>
                  <Button variant="hero" size="sm" onClick={handleSaveNotes}>
                    <Save className="mr-1.5 h-3.5 w-3.5" /> Save Notes
                  </Button>
                </div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Jot down code snippets, questions for live session, or key takeaways..."
                  rows={6}
                />
              </div>
            )}

            {/* Bottom Lesson Navigation */}
            <div className="flex items-center justify-between border-t border-border pt-6">
              <Button variant="subtle" onClick={handlePrev} disabled={currentLessonIndex === 0}>
                <ChevronLeft className="mr-1.5 h-4 w-4" /> Previous Lesson
              </Button>

              <Button
                variant="hero"
                onClick={handleNext}
                disabled={currentLessonIndex >= allLessons.length - 1}
              >
                Next Lesson <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
