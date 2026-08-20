import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  MessageSquare,
  Route as RouteIcon,
} from "lucide-react";

import { Section, SectionHeading, TrainingHero } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

export const Route = createFileRoute("/career-center")({
  head: () => ({
    meta: [
      { title: `Career Center | ${site.name}` },
      {
        name: "description",
        content:
          "Career preparation, roadmaps, interview practice, portfolio guidance and placement assistance from GUIDESOFT.",
      },
    ],
  }),
  component: CareerCenter,
});

function CareerCenter() {
  const items = [
    {
      title: "Career roadmaps",
      body: "Compare the skills behind frontend, full-stack, data, DevOps and design roles.",
      icon: RouteIcon,
    },
    {
      title: "Resume & portfolio review",
      body: "Turn learning work into clear evidence with structured feedback.",
      icon: FileText,
    },
    {
      title: "Interview preparation",
      body: "Practise technical, HR, aptitude and communication conversations.",
      icon: MessageSquare,
    },
    {
      title: "Placement assistance",
      body: "Receive guidance on applications, preparation and follow-up. Outcomes depend on your profile and the opportunities available.",
      icon: BriefcaseBusiness,
    },
  ];
  return (
    <>
      <TrainingHero
        eyebrow="Career center"
        title="Learn with the next conversation in mind."
        description="Career preparation is part of the learning loop: clarify a direction, build evidence, practise explaining it and keep improving."
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {items.map(({ title, body, icon: Icon }) => (
            <article key={title} className="surface-panel rounded-2xl p-7">
              <Icon className="h-6 w-6 text-primary" />
              <h2 className="mt-7 text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <Button asChild variant="subtle" className="mt-7">
                <Link to="/contact">
                  Talk to an advisor <ArrowRight />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </Section>
      <Section muted>
        <SectionHeading
          eyebrow="Learner workspace"
          title="Keep your next step visible."
          description="A learner dashboard brings progress, assignments, classes and career activity into one place."
        />
        <Button asChild variant="hero" className="mt-8">
          <Link to="/student-dashboard">Open learner dashboard</Link>
        </Button>
      </Section>
    </>
  );
}
