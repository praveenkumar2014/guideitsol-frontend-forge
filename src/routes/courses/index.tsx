import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { StaggerContainer } from "@/components/animated-card";
import { CourseCard, Section, SectionHeading, TrainingHero } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { CourseAdvisorButton } from "@/components/course-advisor";
import { coursesQuery, useCourseCategories, useCourses } from "@/lib/catalog";
import { site } from "@/data/site";

export const Route = createFileRoute("/courses/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(coursesQuery());
  },
  head: () => ({
    meta: [
      { title: `Courses | ${site.name}` },
      {
        name: "description",
        content:
          "Explore GUIDESOFT job-oriented courses across software development, data, cloud, design, testing and enterprise technology.",
      },
    ],
  }),
  component: Courses,
});

function Courses() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const { items: courses, isLive } = useCourses();
  const courseCategories = useCourseCategories();

  const filtered = courses.filter(
    (course) =>
      (course.title + course.summary + course.tools.join(" "))
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (category === "All" || course.category === category),
  );
  return (
    <>
      <TrainingHero
        eyebrow="Course catalogue"
        title="Choose a direction. Build evidence."
        description="Structured courses, live instruction and practical projects for learners preparing for real technology work."
      />
      <Section>
        <div className="flex flex-col gap-4 border-b border-border pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <SectionHeading eyebrow="Learn by doing" title="Find your next course" />
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  isLive ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {isLive
                ? `Catalogue synced from the admin panel · ${courses.length} courses`
                : "Showing the built-in catalogue — it will sync automatically once the server is online"}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <CourseAdvisorButton size="sm" label="Not sure? Ask the advisor" className="sm:mr-2" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses"
              aria-label="Search courses"
              className="h-11 rounded-lg border border-input bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by course category"
              className="h-11 rounded-lg border border-input bg-background px-4 text-sm"
            >
              <option>All</option>
              {courseCategories.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          {courseCategories.map((item) => (
            <Button
              key={item.name}
              variant={category === item.name ? "hero" : "subtle"}
              size="sm"
              onClick={() => setCategory(item.name)}
            >
              {item.name}
            </Button>
          ))}
          {category !== "All" && (
            <Button variant="ghost" size="sm" onClick={() => setCategory("All")}>
              Reset filter
            </Button>
          )}
        </div>
        <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </StaggerContainer>
      </Section>
    </>
  );
}
