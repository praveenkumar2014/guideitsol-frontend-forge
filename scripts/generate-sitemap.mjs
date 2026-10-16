#!/usr/bin/env node
/**
 * Generates public/sitemap.xml for the canonical production domain.
 *
 * Run after changing the catalogue or blog content:
 *   node scripts/generate-sitemap.mjs
 *
 * Course and batch slugs come from backend/seed_data/*.json (the same export the
 * database seeder uses), blog slugs are read from src/data/blog.ts, and static
 * marketing routes are listed below.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = (process.env.VITE_SITE_URL || "https://www.guideitsol.com").replace(/\/$/, "");

const readJson = (relative) => JSON.parse(readFileSync(join(root, relative), "utf8"));

const courses = readJson("backend/seed_data/courses.json");

// Blog slugs live in the TypeScript data module; extract them without a build step.
const blogSource = readFileSync(join(root, "src/data/blog.ts"), "utf8");
const blogSlugs = [...blogSource.matchAll(/slug:\s*"([a-z0-9-]+)"/gi)].map((match) => match[1]);

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/courses", priority: "0.9", changefreq: "daily" },
  { path: "/live-batches", priority: "0.9", changefreq: "daily" },
  { path: "/learning-paths", priority: "0.8", changefreq: "weekly" },
  { path: "/internships", priority: "0.7", changefreq: "weekly" },
  { path: "/career-center", priority: "0.7", changefreq: "weekly" },
  { path: "/blog", priority: "0.7", changefreq: "weekly" },
  { path: "/verify", priority: "0.5", changefreq: "monthly" },
  { path: "/about", priority: "0.6", changefreq: "monthly" },
  { path: "/services", priority: "0.6", changefreq: "monthly" },
  { path: "/projects", priority: "0.6", changefreq: "monthly" },
  { path: "/work", priority: "0.5", changefreq: "monthly" },
  { path: "/pricing", priority: "0.6", changefreq: "monthly" },
  { path: "/mobile-apps", priority: "0.5", changefreq: "monthly" },
  { path: "/web-development", priority: "0.5", changefreq: "monthly" },
  { path: "/resources", priority: "0.5", changefreq: "monthly" },
  { path: "/instructors", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/faq", priority: "0.5", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/refund", priority: "0.3", changefreq: "yearly" },
];

const urls = [
  ...staticRoutes.map((route) => ({
    loc: `${SITE_URL}${route.path}`,
    changefreq: route.changefreq,
    priority: route.priority,
  })),
  ...courses.map((course) => ({
    loc: `${SITE_URL}/courses/${course.slug}`,
    changefreq: "weekly",
    priority: "0.8",
  })),
  ...blogSlugs.map((slug) => ({
    loc: `${SITE_URL}/blog/${slug}`,
    changefreq: "monthly",
    priority: "0.6",
  })),
];

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`Wrote public/sitemap.xml with ${urls.length} URLs for ${SITE_URL}`);
