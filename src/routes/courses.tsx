import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { CourseCard, Section, SectionHeading, TrainingHero } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { courseCategories, courses } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/courses")({
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
  const visible = courses.filter(
    (course) =>
      `${course.title} ${course.summary} ${course.category}`
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
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
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
              onClick={() => setCategory(category === item.name ? "All" : item.name)}
            >
              {item.name}
            </Button>
          ))}
        </div>
        {visible.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No courses match those filters. Try a broader search.
          </p>
        )}
      </Section>
    </>
  );
}
