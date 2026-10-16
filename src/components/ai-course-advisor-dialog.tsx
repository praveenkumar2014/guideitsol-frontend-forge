/**
 * GUIDESOFT AI Course & Batch Advisor — dialog + trigger.
 *
 * Step-by-step intake (goal → experience → time & mode → matches). The results
 * step paints instantly from the deterministic catalogue scorer, then enhances
 * in place when the Lovable AI Gateway server function
 * (`src/server/ai-advisor.functions.ts`, model `openai/gpt-6-astra`) answers
 * with structured matches, readiness timelines and a career trajectory. If the
 * gateway is offline the instant matches simply stay on screen.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { CheckoutDialog } from "@/components/checkout-dialog";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Batch, Course } from "@/data/training";
import {
  COMMITMENT_OPTIONS,
  describeProfile,
  GOAL_OPTIONS,
  hydrateAiMatches,
  LEVEL_OPTIONS,
  MODE_OPTIONS,
  recommendCourses,
  toAdvisorCatalogBatch,
  toAdvisorCatalogCourse,
  type AdvisorAnswers,
  type AdvisorCommitment,
  type AdvisorGoal,
  type AiAdvisorResult,
} from "@/lib/advisor";
import { useBatches, useCourses } from "@/lib/catalog";
import { recommendWithAi } from "@/server/ai-advisor.functions";

const DEFAULT_ANSWERS: AdvisorAnswers = {
  goal: "unsure",
  level: "Beginner",
  commitment: "steady",
  mode: "Any",
};

const STEP_TITLES = ["Your goal", "Your experience", "Time & mode", "Your matches"];

type AiState =
  { status: "idle" } | { status: "loading" } | { status: "done"; result: AiAdvisorResult };

const AI_OFFLINE: AiAdvisorResult = {
  ok: false,
  source: "unavailable",
  model: null,
  matches: [],
  trajectory: [],
  readiness: "",
  error: "advisor_unreachable",
};

export function AiCourseAdvisorDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { items: courses, isLive } = useCourses();
  const { items: batches } = useBatches();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AdvisorAnswers>(DEFAULT_ANSWERS);
  const [aiState, setAiState] = useState<AiState>({ status: "idle" });
  const [checkoutBatch, setCheckoutBatch] = useState<Batch | null>(null);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryCourse, setEnquiryCourse] = useState<string>("");
  const aiRequestedFor = useRef<string | null>(null);

  /** Instant deterministic matches; AI matches replace them when they arrive. */
  const recommendations = useMemo(() => {
    if (aiState.status === "done" && aiState.result.ok) {
      return hydrateAiMatches(aiState.result, answers, courses, batches, 3);
    }
    return recommendCourses(answers, courses, batches, 3);
  }, [aiState, answers, courses, batches]);

  /** Ask the Lovable AI Gateway the first time the results step is shown. */
  useEffect(() => {
    if (step !== 3 || !open) return;
    const key = JSON.stringify(answers);
    if (aiRequestedFor.current === key) return;
    aiRequestedFor.current = key;

    let cancelled = false;
    setAiState({ status: "loading" });
    recommendWithAi({
      data: {
        answers,
        courses: courses.map(toAdvisorCatalogCourse),
        batches: batches.map(toAdvisorCatalogBatch),
      },
    })
      .then((result) => {
        if (cancelled) return;
        setAiState({ status: "done", result });
      })
      .catch(() => {
        if (cancelled) return;
        setAiState({ status: "done", result: AI_OFFLINE });
      });

    return () => {
      cancelled = true;
    };
  }, [step, open, answers, courses, batches]);

  const reset = () => {
    setStep(0);
    setAnswers(DEFAULT_ANSWERS);
  };

  const handleClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const patch = (updates: Partial<AdvisorAnswers>) =>
    setAnswers((prev) => ({ ...prev, ...updates }));

  const aiResult = aiState.status === "done" && aiState.result.ok ? aiState.result : null;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto border-border/80 bg-background/98 p-0 backdrop-blur-2xl sm:rounded-2xl">
          {/* Header */}
          <DialogHeader className="border-b border-border/70 bg-surface/50 px-6 py-5 text-left sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                <BrainCircuit className="mr-1.5 h-3.5 w-3.5" /> AI Course & Batch Advisor
              </Badge>
              <span className="text-[11px] text-muted-foreground">
                {isLive ? "Scoring the live catalogue" : "Scoring the catalogue"}
              </span>
            </div>
            <DialogTitle className="mt-3 font-display text-2xl font-bold text-foreground">
              Find the right course and cohort in under a minute
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              Answer four quick questions. The advisor scores every course and upcoming batch
              against your goal, experience and schedule — and explains why it picked each match.
            </DialogDescription>
            {/* Step indicator */}
            <div className="mt-4 flex items-center gap-2">
              {STEP_TITLES.map((label, index) => (
                <div key={label} className="flex flex-1 items-center gap-2">
                  <div
                    className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-primary" : "bg-border"}`}
                  />
                  <span
                    className={`hidden text-[10px] font-semibold uppercase tracking-wide sm:block ${
                      index <= step ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </DialogHeader>

          <div className="px-6 py-6 sm:px-8">
            {step === 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">What are you aiming for?</p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {GOAL_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => patch({ goal: option.id as AdvisorGoal })}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        answers.goal === option.id
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border bg-surface/40 hover:border-primary/40"
                      }`}
                    >
                      <p className="text-sm font-semibold text-foreground">{option.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{option.hint}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Where are you today, experience-wise?
                </p>
                <div className="grid gap-2.5">
                  {LEVEL_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => patch({ level: option.id })}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        answers.level === option.id
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border bg-surface/40 hover:border-primary/40"
                      }`}
                    >
                      <p className="text-sm font-semibold text-foreground">{option.id}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">
                    How much time can you commit each week?
                  </p>
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    {COMMITMENT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => patch({ commitment: option.id as AdvisorCommitment })}
                        className={`rounded-xl border p-4 text-left transition-all ${
                          answers.commitment === option.id
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border bg-surface/40 hover:border-primary/40"
                        }`}
                      >
                        <p className="text-sm font-semibold text-foreground">{option.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{option.hint}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">Preferred learning mode?</p>
                  <div className="flex flex-wrap gap-2">
                    {MODE_OPTIONS.map((mode) => (
                      <Button
                        key={mode}
                        type="button"
                        size="sm"
                        variant={answers.mode === mode ? "hero" : "subtle"}
                        onClick={() => patch({ mode })}
                      >
                        {mode}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface/40 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Target className="h-4 w-4 text-primary" />
                    {describeProfile(answers)}
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Start over
                  </button>
                </div>

                {/* AI reasoning status */}
                <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-primary/5 px-4 py-2.5 text-xs">
                  {aiState.status === "loading" && (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">AI Gateway</span> is
                        reasoning across every course, fee and open seat…
                      </span>
                    </>
                  )}
                  {aiResult && (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">AI-verified</span>{" "}
                        recommendations · {aiResult.model}
                      </span>
                    </>
                  )}
                  {aiState.status === "done" && !aiState.result.ok && (
                    <>
                      <BrainCircuit className="h-3.5 w-3.5 text-primary" />
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">Instant catalogue</span>{" "}
                        matches (AI enhancement offline — scores computed on your device)
                      </span>
                    </>
                  )}
                </div>

                {recommendations.map((recommendation, index) => (
                  <div
                    key={recommendation.course.slug}
                    className="rounded-2xl border border-border bg-surface/40 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {index === 0 && (
                            <Badge className="bg-primary/15 text-primary">Best match</Badge>
                          )}
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {recommendation.course.category}
                          </span>
                        </div>
                        <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                          {recommendation.course.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {recommendation.course.duration} · {recommendation.course.level} ·{" "}
                          {recommendation.course.format} · {recommendation.course.price}
                        </p>
                        {recommendation.timeline && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                            <Clock className="h-3.5 w-3.5" /> {recommendation.timeline}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-display text-2xl font-bold text-primary">
                          {recommendation.score}%
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          match
                        </p>
                      </div>
                    </div>

                    <ul className="mt-3 space-y-1.5">
                      {recommendation.reasons.slice(0, 3).map((reason) => (
                        <li
                          key={reason}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          {reason}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {recommendation.batch && (
                        <div className="mr-auto flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {recommendation.batch.name} · starts {recommendation.batch.start}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            {recommendation.batch.available} seats left
                          </span>
                          <span className="flex items-center gap-1.5">
                            <BrainCircuit className="h-3.5 w-3.5" />
                            {recommendation.batch.instructor}
                          </span>
                        </div>
                      )}
                      {recommendation.batch && (
                        <Button
                          size="sm"
                          variant="hero"
                          onClick={() => {
                            setCheckoutBatch(recommendation.batch ?? null);
                            setCheckoutCourse(recommendation.course);
                          }}
                        >
                          <CreditCard className="mr-1.5 h-3.5 w-3.5" /> Enrol in this cohort
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="subtle"
                        onClick={() => {
                          setEnquiryCourse(recommendation.course.slug);
                          setEnquiryOpen(true);
                        }}
                      >
                        <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Ask an advisor
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link to="/courses/$slug" params={{ slug: recommendation.course.slug }}>
                          View syllabus <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Career trajectory from the AI Gateway */}
                {aiResult && (aiResult.trajectory.length > 0 || aiResult.readiness) && (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      <TrendingUp className="h-3.5 w-3.5" /> Your career trajectory
                    </p>
                    {aiResult.readiness && (
                      <p className="mt-2 text-sm text-muted-foreground">{aiResult.readiness}</p>
                    )}
                    {aiResult.trajectory.length > 0 && (
                      <ol className="mt-3 flex flex-wrap gap-2">
                        {aiResult.trajectory.map((milestone, index) => (
                          <li
                            key={milestone}
                            className="flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-foreground"
                          >
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                              {index + 1}
                            </span>
                            {milestone}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}

                <p className="text-center text-[11px] text-muted-foreground">
                  <Sparkles className="mr-1 inline h-3 w-3 text-primary" />
                  Recommendations update automatically whenever courses, fees or batches change in
                  the admin panel.
                </p>
              </div>
            )}
          </div>

          {/* Footer controls */}
          {step < 3 && (
            <div className="flex items-center justify-between border-t border-border/70 bg-surface/40 px-6 py-4 sm:px-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep((value) => Math.max(0, value - 1))}
                disabled={step === 0}
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
              </Button>
              <Button variant="hero" size="sm" onClick={() => setStep((value) => value + 1)}>
                {step === 2 ? "Show my matches" : "Next"} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CheckoutDialog
        open={Boolean(checkoutBatch)}
        onOpenChange={(next) => {
          if (!next) setCheckoutBatch(null);
        }}
        batch={checkoutBatch}
        courseTitle={checkoutCourse?.title ?? ""}
      />

      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        defaultCourseSlug={enquiryCourse}
        title="Talk to a career advisor"
        description="Share the recommendation you liked and an advisor will confirm fees, seats and the next steps."
      />
    </>
  );
}

/** Back-compat alias — older imports use `CourseAdvisor`. */
export const CourseAdvisor = AiCourseAdvisorDialog;

/** Ready-made trigger button for any surface. */
export function CourseAdvisorButton({
  variant = "hero",
  size = "lg",
  label = "AI Course Advisor",
  className,
}: {
  variant?: "hero" | "subtle" | "outline";
  size?: "sm" | "lg" | "xl";
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setOpen(true)}>
        <Sparkles className="mr-2 h-4 w-4" /> {label}
      </Button>
      <AiCourseAdvisorDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
