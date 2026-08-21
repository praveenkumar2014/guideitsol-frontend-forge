import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Check, ChevronDown, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Module {
  title: string;
  lessons: string[];
}

interface CourseProgressTrackerProps {
  courseSlug: string;
  modules: Module[];
  completedLessons: string[];
  onToggleLesson: (moduleIndex: number, lessonIndex: number) => void;
}

export function CourseProgressTracker({
  modules,
  completedLessons,
  onToggleLesson,
}: CourseProgressTrackerProps) {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const toggleModule = (idx: number) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const isLessonCompleted = (mIdx: number, lIdx: number) =>
    completedLessons.includes(`${mIdx}:${lIdx}`);

  const getModuleProgress = (module: Module, moduleIdx: number) => {
    const done = module.lessons.filter((_, lIdx) => isLessonCompleted(moduleIdx, lIdx)).length;
    return { done, total: module.lessons.length };
  };

  return (
    <div className="space-y-5">
      {/* Overall Progress */}
      <div className="rounded-2xl border border-border bg-background p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-display text-sm font-bold text-foreground">Course Progress</h3>
          </div>
          <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {completedCount} of {totalLessons} lessons completed
        </p>
      </div>

      {/* Modules */}
      <div className="space-y-2">
        {modules.map((module, mIdx) => {
          const { done, total } = getModuleProgress(module, mIdx);
          const modulePercent = total > 0 ? Math.round((done / total) * 100) : 0;
          const isExpanded = expandedModules.has(mIdx);
          const isComplete = done === total && total > 0;

          return (
            <div
              key={mIdx}
              className={cn(
                "rounded-2xl border bg-background overflow-hidden transition-colors",
                isComplete ? "border-emerald-500/30" : "border-border",
              )}
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(mIdx)}
                className="flex items-center gap-3 w-full p-4 text-left hover:bg-surface/50 transition-colors"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    isComplete
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : mIdx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{module.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {done}/{total} lessons • {modulePercent}%
                  </p>
                </div>
                <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden shrink-0">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isComplete ? "bg-emerald-400" : "bg-primary",
                    )}
                    style={{ width: `${modulePercent}%` }}
                  />
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {/* Lessons */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border px-4 pb-3">
                      {module.lessons.map((lesson, lIdx) => {
                        const completed = isLessonCompleted(mIdx, lIdx);
                        return (
                          <button
                            key={lIdx}
                            onClick={() => onToggleLesson(mIdx, lIdx)}
                            className={cn(
                              "flex items-center gap-3 w-full py-2.5 px-2 rounded-lg text-left transition-all hover:bg-surface/60",
                              completed && "opacity-75",
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                completed
                                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                                  : "border-border text-transparent hover:border-primary/50",
                              )}
                            >
                              {completed && <Check className="h-3 w-3" />}
                            </div>
                            <span
                              className={cn(
                                "text-xs font-medium flex-1",
                                completed
                                  ? "text-muted-foreground line-through"
                                  : "text-foreground",
                              )}
                            >
                              {lesson}
                            </span>
                            {completed && (
                              <span className="text-[10px] text-emerald-400 font-semibold">
                                DONE
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
