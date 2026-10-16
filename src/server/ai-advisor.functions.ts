/**
 * GUIDESOFT AI Course & Batch Advisor — server function.
 *
 * Secure, server-only bridge to the Lovable AI Gateway
 * (https://ai.gateway.lovable.dev/v1/responses, model `openai/gpt-6-astra`).
 *
 * The learner's intake answers plus the live course/batch catalogue travel to
 * the model as domain knowledge; the model answers with strict structured JSON
 * (course slugs, batch picks, match scores, reasons, readiness timeline and a
 * career trajectory). Every returned slug is validated against the catalogue
 * that was sent, so the model can never invent courses.
 *
 * The gateway key (`LOVABLE_API_KEY`) never reaches the browser — this module
 * is compiled as a server function via TanStack Start's `createServerFn` and
 * called over an RPC stub from the client.
 *
 * Resilience: if the gateway is unreachable, unconfigured, slow or answers with
 * unparseable JSON, the function reports `ok: false` and the client keeps the
 * deterministic catalogue scorer from `src/lib/advisor.ts` — the advisor UI
 * always produces matches.
 */
import { createServerFn } from "@tanstack/react-start";

import {
  type AdvisorAnswers,
  type AdvisorCatalogBatch,
  type AdvisorCatalogCourse,
  type AiAdvisorMatch,
  type AiAdvisorResult,
} from "@/lib/advisor";

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const AI_GATEWAY_MODEL = "openai/gpt-6-astra";
const GATEWAY_TIMEOUT_MS = 20_000;

export type AiAdvisorRequest = {
  answers: AdvisorAnswers;
  courses: AdvisorCatalogCourse[];
  batches: AdvisorCatalogBatch[];
};

/** Structured-output schema enforced on the model when the gateway supports it. */
const RECOMMENDATION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["matches", "trajectory", "readiness"],
  properties: {
    matches: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["courseSlug", "matchScore", "reasons", "timeline", "batchId"],
        properties: {
          courseSlug: { type: "string" },
          matchScore: { type: "integer", minimum: 0, maximum: 100 },
          reasons: { type: "array", items: { type: "string" } },
          timeline: { type: "string" },
          batchId: { type: ["string", "null"] },
        },
      },
    },
    trajectory: { type: "array", items: { type: "string" } },
    readiness: { type: "string" },
  },
} as const;

function gatewayKey(): string | undefined {
  const fromNode = typeof process !== "undefined" ? process.env?.LOVABLE_API_KEY : undefined;
  const fromVite = (import.meta as { env?: Record<string, string | undefined> }).env
    ?.LOVABLE_API_KEY;
  return fromNode || fromVite || undefined;
}

function buildPrompt(request: AiAdvisorRequest): string {
  const { answers, courses, batches } = request;
  return [
    "You are the GUIDESOFT admissions advisor (IT training institute, Hyderabad, India).",
    "Recommend the best-fitting courses and the next batches for a prospective student.",
    "",
    "STUDENT PROFILE",
    `- Career goal: ${answers.goal}`,
    `- Experience level: ${answers.level}`,
    `- Weekly time commitment: ${answers.commitment}`,
    `- Preferred delivery mode: ${answers.mode}`,
    "",
    "COURSE CATALOGUE (JSON)",
    JSON.stringify(courses),
    "",
    "UPCOMING BATCHES (JSON)",
    JSON.stringify(batches),
    "",
    "RULES",
    "- Only recommend courseSlug values that exist in the catalogue; never invent slugs.",
    "- Only recommend batchId values whose courseSlug matches the recommended course, prefer batches with available seats and the earliest start date; use null if nothing fits.",
    "- matchScore is an integer 0-100 for how well the course fits THIS student.",
    "- Give 2-4 concrete reasons per match referencing real facts (duration, format, price, skills, seats, start date).",
    "- timeline: estimated time to job readiness for this student (e.g. '≈ 5 months to job readiness (part-time)').",
    "- trajectory: 3-5 short career milestones this student can expect after completing the top match.",
    "- readiness: one honest sentence about where the student stands today.",
    "- Return between 1 and 3 matches, best first.",
    "",
    "Respond with JSON only, matching exactly this shape:",
    JSON.stringify({
      matches: [
        {
          courseSlug: "string",
          matchScore: 0,
          reasons: ["string"],
          timeline: "string",
          batchId: "string-or-null",
        },
      ],
      trajectory: ["string"],
      readiness: "string",
    }),
  ].join("\n");
}

function unavailable(error: string): AiAdvisorResult {
  return {
    ok: false,
    source: "unavailable",
    model: null,
    matches: [],
    trajectory: [],
    readiness: "",
    error,
  };
}

function extractResponseText(payload: unknown): string {
  const data = payload as {
    output_text?: unknown;
    output?: Array<{ content?: Array<{ text?: unknown; type?: unknown }> }>;
  };
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text;
  }
  const parts: string[] = [];
  for (const item of data?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === "string") parts.push(content.text);
    }
  }
  return parts.join("\n");
}

/** Tolerates ```json fences and prose around the object. */
function parseJsonLoose(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(candidate.slice(start, end + 1));
    }
    throw new Error("gateway_response_not_json");
  }
}

type RawMatch = {
  courseSlug?: unknown;
  matchScore?: unknown;
  reasons?: unknown;
  timeline?: unknown;
  batchId?: unknown;
};

function sanitizeMatches(raw: unknown, request: AiAdvisorRequest): AiAdvisorMatch[] {
  const rawMatches = (raw as { matches?: unknown })?.matches;
  if (!Array.isArray(rawMatches)) return [];

  const courseSlugs = new Set(request.courses.map((course) => course.slug));
  const batchIds = new Set(request.batches.map((batch) => batch.id));
  const seen = new Set<string>();
  const matches: AiAdvisorMatch[] = [];

  for (const item of rawMatches as RawMatch[]) {
    const slug = typeof item?.courseSlug === "string" ? item.courseSlug : "";
    if (!slug || seen.has(slug) || !courseSlugs.has(slug)) continue;
    seen.add(slug);

    const score = Number(item?.matchScore);
    const reasons = Array.isArray(item?.reasons)
      ? (item.reasons as unknown[])
          .filter(
            (reason): reason is string => typeof reason === "string" && reason.trim().length > 0,
          )
          .slice(0, 4)
      : [];
    const timeline = typeof item?.timeline === "string" ? item.timeline.slice(0, 160) : "";
    const batchId =
      typeof item?.batchId === "string" && batchIds.has(item.batchId) ? item.batchId : null;

    matches.push({
      courseSlug: slug,
      matchScore: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 50,
      reasons: reasons.length > 0 ? reasons : ["Strong fit against your stated goal"],
      timeline,
      batchId,
    });
    if (matches.length >= 5) break;
  }
  return matches;
}

async function callGateway(
  prompt: string,
  format: "json_schema" | "json_object" | "plain",
): Promise<unknown> {
  const key = gatewayKey();
  if (!key) throw new Error("lovable_api_key_missing");

  const body: Record<string, unknown> = {
    model: AI_GATEWAY_MODEL,
    input: format === "plain" ? `${prompt}\n\nJSON only. No prose.` : prompt,
  };
  if (format === "json_schema") {
    body.text = {
      format: {
        type: "json_schema",
        name: "guidesoft_advisor_recommendation",
        strict: true,
        schema: RECOMMENDATION_SCHEMA,
      },
    };
  } else if (format === "json_object") {
    body.text = { format: { type: "json_object" } };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GATEWAY_TIMEOUT_MS);
  try {
    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`gateway_http_${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Ask the Lovable AI Gateway for structured course + batch recommendations.
 * Never throws: degraded gateway behaviour returns `ok: false` so the client
 * can fall back to the instant deterministic scorer.
 */
export const recommendWithAi = createServerFn({ method: "POST" })
  .validator((input: AiAdvisorRequest): AiAdvisorRequest => input)
  .handler(async ({ data }): Promise<AiAdvisorResult> => {
    if (!data || !Array.isArray(data.courses) || !Array.isArray(data.batches)) {
      return unavailable("malformed_request");
    }

    const prompt = buildPrompt(data);
    const attempts: Array<"json_schema" | "json_object" | "plain"> = [
      "json_schema",
      "json_object",
      "plain",
    ];

    for (const format of attempts) {
      try {
        const payload = await callGateway(prompt, format);
        const raw = parseJsonLoose(extractResponseText(payload));
        const matches = sanitizeMatches(raw, data);
        if (matches.length === 0) continue;

        const rawResult = raw as { trajectory?: unknown; readiness?: unknown };
        return {
          ok: true,
          source: "ai",
          model: AI_GATEWAY_MODEL,
          matches,
          trajectory: Array.isArray(rawResult?.trajectory)
            ? (rawResult.trajectory as unknown[])
                .filter((step): step is string => typeof step === "string")
                .slice(0, 6)
            : [],
          readiness:
            typeof rawResult?.readiness === "string" ? rawResult.readiness.slice(0, 240) : "",
          error: null,
        };
      } catch {
        // Try the next output format, then fall through to the deterministic scorer.
      }
    }

    // Gateway unreachable / unconfigured / unparseable — the client keeps the
    // instant deterministic scorer from src/lib/advisor.ts.
    return unavailable("gateway_unavailable");
  });
