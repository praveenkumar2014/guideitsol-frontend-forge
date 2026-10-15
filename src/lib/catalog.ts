/**
 * GUIDESOFT Dynamic Catalog Hydration
 *
 * Course, batch and blog cards across the site hydrate from the backend
 * database/CMS through these hooks. The static seed catalogue is used as an
 * instant fallback (and as the template for optional fields), so the site
 * renders immediately, works offline, and still reflects every edit made in
 * the admin panel within one refresh interval.
 *
 * Caching strategy: stale-while-revalidate. Cached rows render instantly, a
 * background refetch runs every 60s and on window focus.
 */
import { useMemo } from "react";
import { useQuery, type QueryObserverResult, type QueryFunction } from "@tanstack/react-query";

import {
  batches as seedBatches,
  courses as seedCourses,
  type Batch,
  type Course,
  type CourseLevel,
  type Lesson,
  type Module,
  type LearningMode,
} from "@/data/training";
import { articles as seedArticles, type Article } from "@/data/blog";
import { api, type BlogPostRow, type CatalogBatchRow, type CatalogCourseRow } from "@/lib/api";

const STALE_MS = 30_000;
const REFRESH_MS = 60_000;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Format a numeric/string price into the display format used by cards. */
export function formatPrice(value: number | string | null | undefined): string {
  const numeric = typeof value === "string" ? Number(value.replace(/[^0-9.]/g, "")) : Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return "Price on request";
  return `₹${numeric.toLocaleString("en-IN")}`;
}

/** "2026-08-24" -> "24 Aug 2026" */
export function formatCatalogDate(value: string | null | undefined): string {
  if (!value) return "To be announced";
  const iso = value.slice(0, 10);
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    const label = MONTHS[Number(month) - 1] ?? month;
    return `${Number(day)} ${label} ${year}`;
  }
  return value;
}

/** "2026-08-24" -> "Aug 15, 2026" (blog convention) */
function formatBlogDate(value: string | null | undefined): string {
  if (!value) return "";
  const match = value.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;
  const [, year, month, day] = match;
  return `${MONTHS[Number(month) - 1] ?? month} ${Number(day)}, ${year}`;
}

const LESSON_TYPES: Lesson["type"][] = ["Video", "Workshop", "Reading", "Quiz"];

function asLessonType(value: unknown): Lesson["type"] {
  return LESSON_TYPES.includes(value as Lesson["type"]) ? (value as Lesson["type"]) : "Video";
}

function mapCurriculum(rows: unknown): Module[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((raw) => {
    const row = (raw ?? {}) as Record<string, unknown>;
    const lessons = Array.isArray(row.lessons) ? row.lessons : [];
    return {
      title: String(row.title ?? "Module"),
      description: String(row.description ?? ""),
      duration: String(row.duration ?? "1 week"),
      lessons: lessons.map((lessonRaw) => {
        const lesson = (lessonRaw ?? {}) as Record<string, unknown>;
        return {
          title: String(lesson.title ?? "Lesson"),
          duration: String(lesson.duration ?? "30 min"),
          type: asLessonType(lesson.type),
        };
      }),
      assignment: String(row.assignment ?? ""),
      ...(row.project ? { project: String(row.project) } : {}),
    };
  });
}

/** Build a frontend Course from a database row, layered over the seed template. */
export function mapCourseRow(row: CatalogCourseRow): Course {
  const seed = seedCourses.find((item) => item.slug === row.slug);
  const modules = mapCurriculum(row.curriculum);
  const base: Course = seed ?? {
    slug: row.slug,
    title: row.title,
    shortTitle: row.title,
    category: row.category,
    level: (row.level as CourseLevel) ?? "Intermediate",
    duration: row.duration,
    format: (row.format as LearningMode) ?? "Live online",
    price: formatPrice(row.price),
    accent: "cyan",
    summary: row.summary,
    overview: row.overview,
    tools: [],
    prerequisites: [],
    outcomes: [],
    instructor: "GUIDESOFT Faculty",
    modules: [],
    project: "",
  };
  return {
    ...base,
    slug: row.slug,
    title: row.title,
    shortTitle: seed?.shortTitle ?? row.title,
    category: row.category,
    level: (row.level as CourseLevel) ?? base.level,
    duration: row.duration,
    format: (row.format as LearningMode) ?? base.format,
    price: formatPrice(row.price),
    summary: row.summary,
    overview: row.overview || base.overview,
    tools: Array.isArray(row.tools) && row.tools.length > 0 ? row.tools : base.tools,
    modules: modules.length > 0 ? modules : base.modules,
  };
}

/** Build a frontend Batch from a database row, layered over the seed template. */
export function mapBatchRow(row: CatalogBatchRow): Batch {
  const seed = seedBatches.find((item) => item.id === row.id);
  return {
    id: row.id,
    courseSlug: row.course_slug,
    name: row.name,
    start: formatCatalogDate(row.start_date),
    end: formatCatalogDate(row.end_date),
    days: row.days,
    time: row.time,
    seats: Number(row.seats ?? 0),
    available: Number(row.available ?? 0),
    mode: row.mode,
    instructor: row.instructor,
    status: row.status,
    price: formatPrice(row.price ?? seed?.price),
  };
}

/** Build a frontend Article from a CMS row, layered over the seed template. */
export function mapBlogRow(row: BlogPostRow): Article {
  const seed = seedArticles.find((item) => item.slug === row.slug);
  const content = Array.isArray(row.content)
    ? (row.content as unknown[]).map((item) => String(item))
    : typeof row.content === "string"
      ? [row.content]
      : (seed?.content ?? []);
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? seed?.excerpt ?? "",
    author: row.author ?? seed?.author ?? "GUIDESOFT Editorial",
    date: formatBlogDate(row.published_on) || (seed?.date ?? ""),
    readTime: row.read_time ?? seed?.readTime ?? "5 min read",
    category: row.category ?? seed?.category ?? "Industry Insights",
    image: row.image || seed?.image || "",
    content,
  };
}

/** Database rows win by slug/id; static-only entries stay as a fallback tail. */
export function mergeCourses(rows: CatalogCourseRow[]): Course[] {
  if (rows.length === 0) return seedCourses;
  const mapped = rows.map(mapCourseRow);
  const seen = new Set(mapped.map((course) => course.slug));
  return [...mapped, ...seedCourses.filter((course) => !seen.has(course.slug))];
}

export function mergeBatches(rows: CatalogBatchRow[]): Batch[] {
  if (rows.length === 0) return [...seedBatches];
  const mapped = rows.map(mapBatchRow);
  const seen = new Set(mapped.map((batch) => batch.id));
  return [...mapped, ...seedBatches.filter((batch) => !seen.has(batch.id))];
}

export function mergeArticles(rows: BlogPostRow[]): Article[] {
  if (rows.length === 0) return seedArticles;
  const mapped = rows.map(mapBlogRow);
  const seen = new Set(mapped.map((article) => article.slug));
  return [...mapped, ...seedArticles.filter((article) => !seen.has(article.slug))];
}

/** Hard ceiling for a catalogue fetch so page render never hangs on a dead API. */
const LOAD_TIMEOUT_MS = 4000;

async function resilient<T>(task: () => Promise<T[]>, label: string): Promise<T[]> {
  try {
    const rows = await Promise.race([
      task(),
      new Promise<T[]>((resolve) => setTimeout(() => resolve([]), LOAD_TIMEOUT_MS)),
    ]);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.warn(`[catalog] ${label} unavailable, using seed fallback`, error);
    return [];
  }
}

export interface CatalogQuery<T> {
  queryKey: readonly unknown[];
  queryFn: QueryFunction<T[]>;
  staleTime: number;
}

/** Shared queries so route loaders (SSR) and hooks read the same cache entry. */
export function coursesQuery(): CatalogQuery<CatalogCourseRow> {
  return {
    queryKey: ["catalog", "courses"],
    queryFn: () => resilient(api.getCourses, "courses"),
    staleTime: STALE_MS,
  };
}

export function batchesQuery(): CatalogQuery<CatalogBatchRow> {
  return {
    queryKey: ["catalog", "batches"],
    queryFn: () => resilient(api.getBatches, "batches"),
    staleTime: STALE_MS,
  };
}

export function blogQuery(): CatalogQuery<BlogPostRow> {
  return {
    queryKey: ["catalog", "blog"],
    queryFn: () => resilient(api.getBlogPosts, "blog"),
    staleTime: STALE_MS,
  };
}

interface CatalogResult<T> {
  items: T[];
  /** True when the last successful response came from the database/CMS. */
  isLive: boolean;
  isFetching: boolean;
  refetch: () => Promise<QueryObserverResult<unknown>>;
}

function useCatalogRows<T>(catalogQuery: CatalogQuery<T>): {
  rows: T[];
  isLive: boolean;
  isFetching: boolean;
  refetch: CatalogResult<T>["refetch"];
} {
  const query = useQuery<T[]>({
    ...catalogQuery,
    placeholderData: [],
    refetchInterval: REFRESH_MS,
    refetchOnWindowFocus: true,
    retry: 0,
  });
  const rows = (query.data as T[] | undefined) ?? [];
  return {
    rows,
    isLive: rows.length > 0 && !query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch as CatalogResult<T>["refetch"],
  };
}

/** Live course catalogue (database rows + static seed fallback). */
export function useCourses(): CatalogResult<Course> {
  const { rows, isLive, isFetching, refetch } = useCatalogRows<CatalogCourseRow>(coursesQuery());
  const items = useMemo(() => mergeCourses(rows), [rows]);
  return { items, isLive, isFetching, refetch };
}

/** Live batch/cohort catalogue. */
export function useBatches(): CatalogResult<Batch> {
  const { rows, isLive, isFetching, refetch } = useCatalogRows<CatalogBatchRow>(batchesQuery());
  const items = useMemo(() => mergeBatches(rows), [rows]);
  return { items, isLive, isFetching, refetch };
}

/** Live blog posts from the CMS collection. */
export function useBlogArticles(): CatalogResult<Article> {
  const { rows, isLive, isFetching, refetch } = useCatalogRows<BlogPostRow>(blogQuery());
  const items = useMemo(() => mergeArticles(rows), [rows]);
  return { items, isLive, isFetching, refetch };
}

/** Single course by slug, hydrated when available. */
export function useCourse(slug: string): {
  course: Course | undefined;
  isFetching: boolean;
  isLive: boolean;
} {
  const { items, isFetching, isLive } = useCourses();
  const course = useMemo(() => items.find((item) => item.slug === slug), [items, slug]);
  return { course, isFetching, isLive };
}

/** Batches belonging to one course. */
export function useCourseBatches(slug: string): Batch[] {
  const { items } = useBatches();
  return useMemo(() => items.filter((batch) => batch.courseSlug === slug), [items, slug]);
}

/** Category tiles derived from live data so counts stay accurate. */
export function useCourseCategories(): { name: string; count: number; tone: string }[] {
  const { items } = useCourses();
  return useMemo(() => {
    const counts = new Map<string, number>();
    for (const course of items) counts.set(course.category, (counts.get(course.category) ?? 0) + 1);
    const tones = ["cyan", "amber", "lime", "rose", "violet", "blue", "orange", "green"];
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], index) => ({ name, count, tone: tones[index % tones.length] }));
  }, [items]);
}
