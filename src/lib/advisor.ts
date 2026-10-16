/**
 * GUIDESOFT AI Course & Batch Advisor
 *
 * In-app recommendation engine. Scores the live course catalogue and upcoming
 * cohorts against a learner's goal, experience level, weekly commitment and
 * preferred learning mode, then explains every recommendation in plain words.
 *
 * Deterministic and dependency-free: it runs instantly in the browser, works
 * offline against the seed catalogue, and reflects CMS edits automatically
 * because it scores whatever the hydrated catalogue currently holds.
 */
import type { Batch, Course, CourseLevel, LearningMode } from "@/data/training";

export type AdvisorGoal =
  | "software"
  | "data"
  | "cloud"
  | "testing"
  | "design"
  | "enterprise"
  | "mobile"
  | "business"
  | "unsure";

export type AdvisorCommitment = "light" | "steady" | "intensive";

export interface AdvisorAnswers {
  goal: AdvisorGoal;
  level: CourseLevel;
  commitment: AdvisorCommitment;
  mode: LearningMode | "Any";
}

/**
 * Compact catalogue projection sent to the AI Gateway server function
 * (`src/server/ai-advisor.functions.ts`). Everything is required and
 * JSON-serializable so TanStack Start's strict server-fn validation passes.
 */
export type AdvisorCatalogCourse = {
  slug: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  format: string;
  price: string;
  summary: string;
  prerequisites: string[];
  skills: string[];
  rating: number | null;
};

export type AdvisorCatalogBatch = {
  id: string;
  courseSlug: string;
  name: string;
  start: string;
  end: string;
  days: string;
  time: string;
  mode: string;
  instructor: string;
  available: number;
  price: string;
};

export type AiAdvisorMatch = {
  courseSlug: string;
  matchScore: number;
  reasons: string[];
  timeline: string;
  batchId: string | null;
};

export type AiAdvisorResult = {
  ok: boolean;
  source: "ai" | "unavailable";
  model: string | null;
  matches: AiAdvisorMatch[];
  trajectory: string[];
  readiness: string;
  error: string | null;
};

export interface Recommendation {
  course: Course;
  batch?: Batch;
  /** 0–100 match score. */
  score: number;
  reasons: string[];
  /** Estimated time to job readiness (AI-enhanced results only). */
  timeline?: string;
}

export const GOAL_OPTIONS: { id: AdvisorGoal; label: string; hint: string }[] = [
  { id: "software", label: "Software / Backend Developer", hint: "Java, Python, full stack, APIs" },
  { id: "data", label: "Data & AI", hint: "Analytics, data science, machine learning" },
  { id: "cloud", label: "Cloud & DevOps", hint: "AWS, Docker, CI/CD, SRE" },
  { id: "testing", label: "Testing / QA Automation", hint: "Selenium, API and mobile testing" },
  { id: "design", label: "UI/UX & Product Design", hint: "Figma, design systems, research" },
  { id: "enterprise", label: "SAP & Enterprise Systems", hint: "SAP modules, ERP, integration" },
  { id: "mobile", label: "Mobile App Development", hint: "Android, iOS, Flutter, React Native" },
  { id: "business", label: "Digital & Business", hint: "Marketing, analytics, operations" },
  { id: "unsure", label: "Not sure yet — show my best matches", hint: "Let the advisor decide" },
];

const GOAL_CATEGORIES: Record<AdvisorGoal, string[]> = {
  software: ["Software Development", "Mobile Development"],
  data: ["Data & AI"],
  cloud: ["Cloud & DevOps"],
  testing: ["Testing"],
  design: ["UI/UX & Design"],
  enterprise: ["SAP & Enterprise"],
  mobile: ["Mobile Development"],
  business: ["Digital & Business"],
  unsure: [],
};

const GOAL_KEYWORDS: Record<AdvisorGoal, string[]> = {
  software: ["developer", "full stack", "backend", "java", "python", "api"],
  data: ["data", "analyst", "science", "ai", "machine learning", "bi"],
  cloud: ["cloud", "devops", "aws", "azure", "kubernetes"],
  testing: ["test", "qa", "automation", "selenium"],
  design: ["design", "ux", "ui", "figma", "product"],
  enterprise: ["sap", "enterprise", "erp", "abap"],
  mobile: ["mobile", "android", "ios", "flutter", "react native"],
  business: ["marketing", "business", "digital", "salesforce", "commerce"],
  unsure: [],
};

export const LEVEL_OPTIONS: { id: CourseLevel; label: string }[] = [
  { id: "Beginner", label: "New to technology" },
  { id: "Intermediate", label: "Some experience / projects" },
  { id: "Advanced", label: "Working professional, upskilling" },
];

export const COMMITMENT_OPTIONS: { id: AdvisorCommitment; label: string; hint: string }[] = [
  { id: "light", label: "5–8 hrs / week", hint: "Alongside college or a job" },
  { id: "steady", label: "8–12 hrs / week", hint: "Live evening cohorts" },
  { id: "intensive", label: "15+ hrs / week", hint: "Career switch, full focus" },
];

export const MODE_OPTIONS: (LearningMode | "Any")[] = [
  "Any",
  "Live online",
  "Classroom",
  "Hybrid",
  "Self-paced",
];

function parseWeeks(duration: string): number {
  const match = duration.match(/(\d+)\s*week/i);
  if (match) return Number(match[1]);
  const months = duration.match(/(\d+)\s*month/i);
  if (months) return Number(months[1]) * 4;
  return 12;
}

/** Next batch with open seats (earliest first), else the earliest batch. */
export function nextOpenBatch(courseSlug: string, batches: Batch[]): Batch | undefined {
  const candidates = batches
    .filter((batch) => batch.courseSlug === courseSlug && batch.available > 0)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  return candidates[0] ?? batches.find((batch) => batch.courseSlug === courseSlug);
}

/**
 * Score every course in the catalogue and return the strongest matches with
 * human-readable reasons.
 */
export function recommendCourses(
  answers: AdvisorAnswers,
  courses: Course[],
  batches: Batch[],
  limit = 3,
): Recommendation[] {
  const targetCategories = GOAL_CATEGORIES[answers.goal];
  const keywords = GOAL_KEYWORDS[answers.goal];

  const scored = courses.map((course) => {
    let score = 40;
    const reasons: string[] = [];

    // Goal / category alignment
    if (answers.goal === "unsure") {
      score += 12;
      reasons.push("Broad match while you explore directions");
    } else if (targetCategories.includes(course.category)) {
      score += 30;
      reasons.push(`Matches your goal: ${course.category}`);
    } else {
      score -= 8;
    }

    // Keyword reinforcement from title, summary and skills
    const haystack =
      `${course.title} ${course.summary} ${(course.skillsLearned ?? []).join(" ")}`.toLowerCase();
    const hits = keywords.filter((keyword) => haystack.includes(keyword)).length;
    if (hits > 0 && answers.goal !== "unsure") {
      score += Math.min(hits * 4, 10);
    }

    // Experience alignment
    if (course.level === answers.level) {
      score += 18;
      reasons.push(`${course.level} level suits your experience`);
    } else if (
      (answers.level === "Beginner" && course.level === "Advanced") ||
      (answers.level === "Advanced" && course.level === "Beginner")
    ) {
      score -= 14;
    } else {
      score += 4;
    }

    // Weekly commitment vs programme length
    const weeks = parseWeeks(course.duration);
    if (answers.commitment === "light") {
      if (weeks <= 12) {
        score += 12;
        reasons.push(`Compact ${course.duration} fits 5–8 hrs/week`);
      } else score -= 6;
    } else if (answers.commitment === "steady") {
      if (weeks >= 8 && weeks <= 20) score += 10;
    } else {
      if (weeks >= 16) {
        score += 12;
        reasons.push(`${course.duration} deep-dive suited to a career switch`);
      } else score -= 4;
    }

    // Mode preference
    if (answers.mode === "Any") {
      score += 4;
    } else if (course.format === answers.mode) {
      score += 14;
      reasons.push(`${course.format} delivery matches your schedule`);
    } else if (answers.mode === "Hybrid" && course.format === "Classroom") {
      score += 6;
    } else {
      score -= 6;
    }

    // Quality signal & funded seat availability
    if ((course.rating ?? 0) >= 4.7) {
      score += 6;
      reasons.push(`Rated ${course.rating} by past learners`);
    }
    const batch = nextOpenBatch(course.slug, batches);
    if (batch && batch.available > 0) {
      score += 12;
      reasons.push(`${batch.available} seats open for the ${batch.start} cohort`);
    } else if (batch) {
      reasons.push("Next cohort is waitlisted — advisor can help");
    }

    return { course, batch, score: Math.max(5, Math.min(99, Math.round(score))), reasons };
  });

  return scored
    .sort((a, b) => b.score - a.score || (b.course.rating ?? 0) - (a.course.rating ?? 0))
    .slice(0, limit);
}

/** One-line summary of the learner's profile used above the results. */
export function describeProfile(answers: AdvisorAnswers): string {
  const goal = GOAL_OPTIONS.find((option) => option.id === answers.goal)?.label ?? "your goal";
  return `${goal} · ${answers.level} · ${answers.commitment} · ${answers.mode}`;
}

/** Project a catalogue course onto the compact shape sent to the AI Gateway. */
export function toAdvisorCatalogCourse(course: Course): AdvisorCatalogCourse {
  return {
    slug: course.slug,
    title: course.title,
    category: course.category,
    level: course.level,
    duration: course.duration,
    format: course.format,
    price: course.price,
    summary: course.summary,
    prerequisites: course.prerequisites ?? [],
    skills: course.skillsLearned ?? [],
    rating: course.rating ?? null,
  };
}

/** Project a batch onto the compact shape sent to the AI Gateway. */
export function toAdvisorCatalogBatch(batch: Batch): AdvisorCatalogBatch {
  return {
    id: batch.id,
    courseSlug: batch.courseSlug,
    name: batch.name,
    start: batch.start,
    end: batch.end,
    days: batch.days,
    time: batch.time,
    mode: batch.mode,
    instructor: batch.instructor,
    available: batch.available,
    price: batch.price,
  };
}

/**
 * Join AI Gateway matches back onto live catalogue objects. Unknown slugs are
 * dropped; missing batches fall back to the next open cohort; any leftover
 * slots are topped up with deterministic matches so the learner always sees a
 * full set of actionable cards.
 */
export function hydrateAiMatches(
  result: AiAdvisorResult,
  answers: AdvisorAnswers,
  courses: Course[],
  batches: Batch[],
  limit = 3,
): Recommendation[] {
  const out: Recommendation[] = [];
  const seen = new Set<string>();

  for (const match of result.matches) {
    if (out.length >= limit) break;
    const course = courses.find((item) => item.slug === match.courseSlug);
    if (!course || seen.has(course.slug)) continue;
    seen.add(course.slug);

    const requested =
      match.batchId !== null
        ? batches.find((item) => item.id === match.batchId && item.courseSlug === course.slug)
        : undefined;
    const batch = requested ?? nextOpenBatch(course.slug, batches);

    out.push({
      course,
      ...(batch ? { batch } : {}),
      score: Math.max(0, Math.min(100, Math.round(match.matchScore))),
      reasons: match.reasons.slice(0, 4),
      ...(match.timeline ? { timeline: match.timeline } : {}),
    });
  }

  for (const fallback of recommendCourses(answers, courses, batches, limit)) {
    if (out.length >= limit) break;
    if (seen.has(fallback.course.slug)) continue;
    seen.add(fallback.course.slug);
    out.push(fallback);
  }

  return out;
}
