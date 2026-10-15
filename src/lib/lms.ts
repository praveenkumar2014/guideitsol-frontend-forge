/**
 * GUIDESOFT LMS access layer.
 *
 * Tracks which courses a learner may open. Live enrolments come from the
 * backend (`/api/learner/me`, created automatically once a payment is
 * verified); a local mirror keeps access working instantly after checkout and
 * while the backend is offline.
 */
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

export const ENROLMENT_STORAGE_KEY = "guidesoft_enrolments";
export const ENROLMENT_EVENT = "guidesoft_enrolments_change";

export interface EnrolmentRecord {
  course_slug: string;
  status: string;
  source: "local" | "cloud";
}

function readLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ENROLMENT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

/** Grant course access immediately after a verified payment. */
export function addLocalEnrolment(courseSlug: string): void {
  if (typeof window === "undefined" || !courseSlug) return;
  const current = new Set(readLocal());
  if (current.has(courseSlug)) return;
  current.add(courseSlug);
  localStorage.setItem(ENROLMENT_STORAGE_KEY, JSON.stringify([...current]));
  window.dispatchEvent(new CustomEvent(ENROLMENT_EVENT, { detail: [...current] }));
}

export function clearLocalEnrolments(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ENROLMENT_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(ENROLMENT_EVENT, { detail: [] }));
}

/**
 * Enrolments for the current visitor: local mirror plus any Cloud enrolments
 * returned for an authenticated learner session.
 */
export function useEnrolments(): {
  enrolments: EnrolmentRecord[];
  isEnrolled: (courseSlug: string) => boolean;
  hasAnyAccess: boolean;
  refresh: () => void;
} {
  const [local, setLocal] = useState<string[]>(() => readLocal());
  const [cloud, setCloud] = useState<string[]>([]);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const handler = () => setLocal(readLocal());
    window.addEventListener(ENROLMENT_EVENT, handler);
    return () => window.removeEventListener(ENROLMENT_EVENT, handler);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const token = await getAuthToken();
      if (!token) {
        if (!cancelled) setCloud([]);
        return;
      }
      try {
        const profile = await api.getLearnerProfile(token);
        const slugs = (profile.enrolments ?? [])
          .map((row) => (row as Record<string, unknown>).course_slug)
          .filter((slug): slug is string => typeof slug === "string");
        if (!cancelled) setCloud(slugs);
      } catch {
        if (!cancelled) setCloud([]);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const enrolments = useMemo<EnrolmentRecord[]>(
    () => [
      ...cloud.map((slug) => ({ course_slug: slug, status: "active", source: "cloud" as const })),
      ...local
        .filter((slug) => !cloud.includes(slug))
        .map((slug) => ({ course_slug: slug, status: "active", source: "local" as const })),
    ],
    [cloud, local],
  );

  const slugs = useMemo(() => new Set(enrolments.map((entry) => entry.course_slug)), [enrolments]);

  return {
    enrolments,
    isEnrolled: (courseSlug: string) => slugs.has(courseSlug),
    hasAnyAccess: enrolments.length > 0,
    refresh: () => setNonce((value) => value + 1),
  };
}
