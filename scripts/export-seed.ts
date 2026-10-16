// Generates backend/seed_data/*.json from the frontend course catalogue so the
// FastAPI seed command can populate Supabase without duplicating content.
// Run with: node scripts/export-seed.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { batches, courses } from "../src/data/training.ts";
import { articles } from "../src/data/blog.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "backend", "seed_data");
mkdirSync(outDir, { recursive: true });

const toPrice = (price: string): number => Number(price.replace(/[^\d]/g, "")) || 0;

const parseDate = (value: string): string => {
  const match = value.match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
  if (!match) return "";
  const months: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
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

const toIsoDate = (value: string): string => {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  const parsedWithDay = new Date(`${value} 1`);
  return Number.isNaN(parsedWithDay.getTime())
    ? new Date().toISOString().slice(0, 10)
    : parsedWithDay.toISOString().slice(0, 10);
};

const blogRows = articles.map((article) => ({
  slug: article.slug,
  title: article.title,
  excerpt: article.excerpt,
  author: article.author,
  published_on: toIsoDate(article.date),
  read_time: article.readTime,
  category: article.category,
  image: article.image,
  content: article.content,
  published: true,
}));

// Universal role matrix seed: one demo account per role so RBAC can be tested
// end to end before Cloud logins are connected.
const roleRows = [
  {
    user_id: "usr_admin_01",
    email: "admin@guideitsol.in",
    name: "Admin Operations",
    role: "admin",
  },
  {
    user_id: "usr_instructor_01",
    email: "aarav.menon@guideitsol.in",
    name: "Aarav Menon",
    role: "instructor",
  },
  {
    user_id: "usr_learner_01",
    email: "priya.sharma@example.com",
    name: "Priya Sharma",
    role: "learner",
  },
  {
    user_id: "usr_partner_01",
    email: "rohan.verma@techcorp.in",
    name: "Rohan Verma",
    role: "partner",
  },
];

writeFileSync(join(outDir, "courses.json"), JSON.stringify(courseRows, null, 2));
writeFileSync(join(outDir, "batches.json"), JSON.stringify(batchRows, null, 2));
writeFileSync(join(outDir, "certificates.json"), JSON.stringify(certificateRows, null, 2));
writeFileSync(join(outDir, "blog.json"), JSON.stringify(blogRows, null, 2));
writeFileSync(join(outDir, "roles.json"), JSON.stringify(roleRows, null, 2));
console.log(
  `Wrote ${courseRows.length} courses, ${batchRows.length} batches, ${certificateRows.length} certificates, ` +
    `${blogRows.length} blog posts, ${roleRows.length} role profiles to ${outDir}`,
);
