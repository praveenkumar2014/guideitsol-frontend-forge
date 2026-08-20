// Generates backend/seed_data/*.json from the frontend course catalogue so the
// FastAPI seed command can populate Supabase without duplicating content.
// Run with: node scripts/export-seed.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { batches, courses } from "../src/data/training.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "backend", "seed_data");
mkdirSync(outDir, { recursive: true });

const toPrice = (price: string): number => Number(price.replace(/[^\d]/g, "")) || 0;

const parseDate = (value: string): string => {
  const match = value.match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
  if (!match) return "";
  const months: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };
  const [, day, mon, year] = match;
  return `${year}-${months[mon]}-${day.padStart(2, "0")}`;
};

const courseRows = courses.map((course) => ({
  slug: course.slug,
  title: course.title,
  category: course.category,
  level: course.level,
  duration: course.duration,
  format: course.format,
  price: toPrice(course.price),
  summary: course.summary,
  overview: course.overview,
  curriculum: course.modules.map((mod, mIndex) => ({
    title: mod.title,
    description: mod.description,
    duration: mod.duration,
    lessons: mod.lessons.map((lesson, lIndex) => ({
      key: `${mIndex}:${lIndex}`,
      title: lesson.title,
      duration: lesson.duration,
      type: lesson.type,
    })),
    assignment: mod.assignment,
    ...(mod.project ? { project: mod.project } : {}),
  })),
  tools: course.tools,
  published: true,
}));

const batchRows = batches.map((batch) => ({
  id: batch.id,
  course_slug: batch.courseSlug,
  name: batch.name,
  start_date: parseDate(batch.start),
  end_date: parseDate(batch.end),
  days: batch.days,
  time: batch.time,
  seats: batch.seats,
  available: batch.available,
  mode: batch.mode,
  instructor: batch.instructor,
  status: batch.status,
  price: toPrice(batch.price),
}));

const certificateRows = [
  {
    id: "GS-2026-0142",
    learner_name: "Priya Sharma",
    course_title: "Java Full Stack Development",
    course_slug: "java-full-stack-development",
    issued_on: "2026-06-18",
    status: "issued",
  },
  {
    id: "GS-2026-0157",
    learner_name: "Rahul Verma",
    course_title: "Data Science with Python",
    course_slug: "data-science-with-python",
    issued_on: "2026-07-02",
    status: "issued",
  },
  {
    id: "GS-2026-0163",
    learner_name: "Sneha Reddy",
    course_title: "UI/UX Product Design",
    course_slug: "ui-ux-design",
    issued_on: "2026-07-24",
    status: "issued",
  },
  {
    id: "GS-2026-0171",
    learner_name: "Arun Kumar",
    course_title: "AWS Cloud & DevOps",
    course_slug: "aws-cloud-devops",
    issued_on: "2026-08-05",
    status: "issued",
  },
];

writeFileSync(join(outDir, "courses.json"), JSON.stringify(courseRows, null, 2));
writeFileSync(join(outDir, "batches.json"), JSON.stringify(batchRows, null, 2));
writeFileSync(join(outDir, "certificates.json"), JSON.stringify(certificateRows, null, 2));
console.log(`Wrote ${courseRows.length} courses, ${batchRows.length} batches, ${certificateRows.length} certificates to ${outDir}`);