const fs = require('fs');
const path = require('path');

const trainingTsPath = path.join(__dirname, '../src/data/training.ts');
const coursesJsonPath = path.join(__dirname, 'scraped_courses.json');

const coursesData = JSON.parse(fs.readFileSync(coursesJsonPath, 'utf8'));

// Format courses data into TS string
let coursesTsString = 'export const courses: Course[] = [\n';

for (const course of coursesData) {
  coursesTsString += `  {
    slug: "${course.slug}",
    title: "${course.title.replace(/"/g, '\\"')}",
    shortTitle: "${course.shortTitle.replace(/"/g, '\\"')}",
    category: "${course.category}",
    level: "${course.level}",
    duration: "${course.duration}",
    format: "${course.format}",
    price: "${course.price}",
    accent: "${course.accent}",
    summary: "${course.summary.replace(/"/g, '\\"')}",
    overview: "${course.overview.replace(/"/g, '\\"')}",
    tools: ${JSON.stringify(course.tools)},
    prerequisites: ${JSON.stringify(course.prerequisites || [])},
    outcomes: ${JSON.stringify(course.outcomes || [])},
    instructor: "${course.instructor || 'Rajesh Kumar'}",
    rating: ${course.rating || 4.8},
    reviewsCount: ${course.reviewsCount || 1024},
    enrolledCount: "${course.enrolledCount || '10,000+'}",
    modules: [
      module("Foundation & Core Concepts", "Understanding the basic principles and environment setup.", "Setup local environment and run first program."),
      module("Deep Dive & Best Practices", "Advanced techniques and industry standard patterns.", "Refactor previous code to use advanced patterns."),
      module("Architecture & Scale", "Building for production, performance and security.", "Deploy the application to a cloud provider.")
    ],
    project: "Comprehensive capstone project involving all skills learned, deployed to production."
  },\n`;
}

coursesTsString += '];';

let currentTs = fs.readFileSync(trainingTsPath, 'utf8');

// Replace the export const courses: Course[] = [ ... ];
const regex = /export const courses: Course\[\] = \[[\s\S]*?\];/;
currentTs = currentTs.replace(regex, coursesTsString);

fs.writeFileSync(trainingTsPath, currentTs);
console.log('Successfully updated src/data/training.ts with scraped data.');
