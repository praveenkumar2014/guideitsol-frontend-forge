import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  ClipboardCheck,
  LoaderCircle,
  PlayCircle,
  School,
} from "lucide-react";

import { RequireAuth } from "@/components/require-auth";
import { Section, SectionHeading } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/training";
import { site } from "@/data/site";
import { learnerApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/student-dashboard")({
  head: () => ({
    meta: [
      { title: `Learner Dashboard | ${site.name}` },
      {
        name: "description",
        content:
          "A GUIDESOFT learner dashboard for progress, classes, assignments and career preparation.",
      },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { accessToken } = useAuth();

  const profile = useQuery({
    queryKey: ["learner-me"],
    queryFn: () => learnerApi.me(accessToken() ?? ""),
    enabled: Boolean(accessToken()),
  });

  return (
    <RequireAuth>
      <section className="hero-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm text-primary">Learner workspace</p>
          <h1 className="mt-4 text-4xl font-semibold">
            {profile.isLoading
              ? "Loading your workspace…"
              : `Good day, ${firstName(profile.data?.name ?? "learner")}.`}
          </h1>
          <p className="mt-3 text-muted-foreground">
            Your next session, progress and notifications are all in one place.
          </p>
        </div>
      </section>

      {profile.isError ? (
        <Section>
          <div className="surface-panel rounded-2xl p-8 text-center">
            <p className="text-destructive">We couldn’t load your workspace right now.</p>
            <Button
              variant="subtle"
              className="mt-5"
              onClick={() => profile.refetch()}
            >
              Try again
            </Button>
          </div>
        </Section>
      ) : (
        <>
          <Section>
            <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
              {profile.isLoading ? (
                <div className="surface-panel flex items-center justify-center gap-3 rounded-2xl p-16 text-muted-foreground">
                  <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
                  Loading your courses…
                </div>
              ) : (
                <ContinueLearning enrolment={profile.data?.enrolments?.[0]} />
              )}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div className="surface-panel rounded-2xl p-5">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-xs text-muted-foreground">Enrolled courses</p>
                  <p className="mt-2 font-display text-3xl font-semibold">
                    {profile.data?.enrolments?.length ?? 0}
                  </p>
                </div>
                <div className="surface-panel rounded-2xl p-5">
                  <Bell className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-xs text-muted-foreground">Notifications</p>
                  <p className="mt-2 font-display text-3xl font-semibold">
                    {profile.data?.notifications?.length ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {profile.data?.enrolments?.length ? (
            <Section>
              <SectionHeading eyebrow="My courses" title="Your current enrolments." />
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {profile.data.enrolments.map((enrolment) => {
                  const course = courses.find((c) => c.slug === enrolment.course_slug);
                  return (
                    <article key={enrolment.id ?? enrolment.batch_id} className="surface-panel rounded-2xl p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                            {enrolment.courses?.title ?? course?.category ?? "Course"}
                          </p>
                          <h2 className="mt-3 text-xl font-semibold">
                            {course?.title ?? enrolment.course_slug}
                          </h2>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {enrolment.batches?.name ?? `Batch ${enrolment.batch_id}`} ·{" "}
                            {enrolment.batches?.start_date ?? "Dates TBC"}
                          </p>
                        </div>
                        <span className="rounded-full border border-primary/50 px-3 py-1 text-xs font-semibold text-primary">
                          {enrolment.status}
                        </span>
                      </div>
                      <Button asChild variant="subtle" className="mt-6">
                        <Link to="/course-player/$slug" params={{ slug: enrolment.course_slug }}>
                          Open course player <ArrowRight />
                        </Link>
                      </Button>
                    </article>
                  );
                })}
              </div>
            </Section>
          ) : profile.isLoading ? null : (
            <Section>
              <div className="surface-panel rounded-2xl p-10 text-center">
                <School className="mx-auto h-8 w-8 text-primary" />
                <h2 className="mt-5 text-xl font-semibold">You’re not enrolled yet</h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                  Browse the course catalogue and ask about an upcoming batch to begin your
                  learning journey.
                </p>
                <Button asChild variant="hero" className="mt-6">
                  <Link to="/courses">Explore courses</Link>
                </Button>
              </div>
            </Section>
          )}

          {profile.data?.notifications?.length ? (
            <Section muted>
              <SectionHeading eyebrow="Notifications" title="Recent activity." />
              <div className="mt-8 space-y-3">
                {profile.data.notifications.map((notification) => (
                  <div key={notification.id ?? notification.title} className="surface-panel rounded-xl p-5">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <p className="font-semibold">{notification.title}</p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{notification.body}</p>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          <Section>
            <SectionHeading eyebrow="Workspace" title="Keep your learning moving." />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "My courses", to: "/student-dashboard", icon: PlayCircle },
                { label: "Certificates", to: "/resources", icon: BadgeCheck },
                { label: "Profile", to: "/account", icon: CircleUserRound },
                { label: "Career center", to: "/career-center", icon: ClipboardCheck },
              ].map(({ label, to, icon: Icon }) => (
                <Link
                  key={label}
                  to={to}
                  className="surface-panel rounded-xl p-5 text-left transition-colors hover:border-primary"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-5 text-sm font-semibold">{label}</p>
                  <p className="mt-2 text-xs text-muted-foreground">View your {label.toLowerCase()}.</p>
                </Link>
              ))}
            </div>
          </Section>
        </>
      )}
    </RequireAuth>
  );
}

function ContinueLearning({ enrolment }: { enrolment: NonNullable<import("@/lib/api").LearnerProfile["enrolments"]>[number] | undefined }) {
  const course = enrolment ? courses.find((c) => c.slug === enrolment.course_slug) : undefined;
  if (!course || !enrolment) {
    return (
      <article className="surface-panel rounded-2xl p-7">
        <p className="text-sm font-semibold text-primary">Continue learning</p>
        <h2 className="mt-3 text-2xl font-semibold">Pick a course to begin</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse the catalogue and ask about an upcoming batch.
        </p>
        <Button asChild variant="hero" className="mt-8">
          <Link to="/courses">
            Explore courses <ArrowRight />
          </Link>
        </Button>
      </article>
    );
  }
  return (
    <article className="surface-panel rounded-2xl p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">Continue learning</p>
          <h2 className="mt-3 text-2xl font-semibold">{course.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {enrolment.batches?.name ?? `Batch ${enrolment.batch_id}`}
          </p>
        </div>
        <PlayCircle className="h-7 w-7 text-primary" />
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        Status: {enrolment.status}
      </div>
      <Button asChild variant="hero" className="mt-8">
        <Link to="/course-player/$slug" params={{ slug: course.slug }}>
          Open course player <ArrowRight />
        </Link>
      </Button>
    </article>
  );
}

function firstName(value: string): string {
  return value.split(" ")[0] ?? "learner";
}