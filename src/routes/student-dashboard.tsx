import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  CircleUserRound,
  ClipboardCheck,
  ExternalLink,
  GraduationCap,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { api, type LearnerProfile, type LearnerProgressRecord } from "@/lib/api";
import { CertificateDownload } from "@/components/certificate-download";
import { CourseProgressTracker } from "@/components/course-progress-tracker";
import { Skeleton, TableSkeleton } from "@/components/skeleton";
import { Section, SectionHeading } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { courses, learnerDashboard } from "@/data/training";
import { site } from "@/data/site";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/student-dashboard")({
  head: () => ({
    meta: [
      { title: `Learner Dashboard | ${site.name}` },
      {
        name: "description",
        content:
          "Manage your GUIDESOFT course progress, live sessions, assignments, notes and certificates.",
      },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "courses" | "assignments" | "certificates" | "profile"
  >("overview");

  // Read saved progress from localStorage if available
  const [savedProgress, setSavedProgress] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const val = localStorage.getItem("guidesoft_overall_progress");
      return val ? parseInt(val, 10) : learnerDashboard.overallProgress;
    }
    return learnerDashboard.overallProgress;
  });

  const [apiProfile, setApiProfile] = useState<LearnerProfile | null>(null);
  const [apiProgress, setApiProgress] = useState<LearnerProgressRecord[]>([]);
  const [dataMode, setDataMode] = useState<"live" | "demo">("demo");
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const val = localStorage.getItem("guidesoft_completed_lessons");
      return val ? JSON.parse(val) : [];
    }
    return [];
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const profile = await api.getLearnerProfile();
        if (cancelled) return;
        setApiProfile(profile);
        setDataMode("live");

        const firstEnrolment = profile.enrolments?.[0] as Record<string, unknown> | undefined;
        const courseSlug =
          (firstEnrolment?.course_slug as string) || learnerDashboard.currentCourse;
        try {
          const progress = await api.getLearnerProgress(courseSlug);
          if (!cancelled) setApiProgress(progress);
        } catch {
          // progress fetch is non-critical
        }
      } catch {
        // API unavailable — stay in demo mode
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const liveCourseSlug = (apiProfile?.enrolments?.[0] as Record<string, unknown> | undefined)
    ?.course_slug as string | undefined;
  const currentCourseSlug = liveCourseSlug || learnerDashboard.currentCourse;
  const course = courses.find((item) => item.slug === currentCourseSlug) || courses[0];
  const learnerDisplayName = apiProfile?.name || user?.name || learnerDashboard.learner;

  const assignmentsList = [
    {
      id: "asg-1",
      title: "Spring Boot REST API with JWT Auth",
      course: "Java Full Stack Development",
      dueDate: "Tomorrow, 11:59 PM",
      status: "In Progress",
      score: null,
    },
    {
      id: "asg-2",
      title: "React Data Grid with TanStack Table & Sorting",
      course: "Java Full Stack Development",
      dueDate: "26 Aug 2026",
      status: "Submitted",
      score: "94/100",
    },
    {
      id: "asg-3",
      title: "Database Indexing & PostgreSQL Optimizations",
      course: "Java Full Stack Development",
      dueDate: "19 Aug 2026",
      status: "Graded",
      score: "98/100",
    },
  ];

  const handleAssignmentSubmit = (title: string) => {
    toast.success(`Assignment '${title}' workspace opened. Upload your GitHub repository.`);
  };

  const toggleLesson = (moduleIndex: number, lessonIndex: number) => {
    const key = `${moduleIndex}:${lessonIndex}`;
    setCompletedLessons((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  useEffect(() => {
    localStorage.setItem("guidesoft_completed_lessons", JSON.stringify(completedLessons));
  }, [completedLessons]);

  return (
    <div className="min-h-screen bg-surface/30 pb-20">
      {/* Header Banner */}
      <section className="hero-surface border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Learner Workspace</span>
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal ${
                    dataMode === "live"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {dataMode === "live" ? "Live Data" : "Demo Data"}
                </span>
              </div>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
                Welcome back, {learnerDisplayName}!
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enrolled Program: <strong className="text-foreground">{course.title}</strong> ·
                Batch 2026-A
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="hero">
                <Link to="/course-player/$slug" params={{ slug: course.slug }}>
                  <PlayCircle className="mr-1.5 h-4 w-4" /> Resume Player
                </Link>
              </Button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-4">
            {[
              { id: "overview", label: "Dashboard Overview", icon: Sparkles },
              { id: "courses", label: "Enrolled Courses", icon: BookOpen },
              { id: "assignments", label: "Assignments & Labs", icon: ClipboardCheck },
              { id: "certificates", label: "Certificates & Badges", icon: Award },
              { id: "profile", label: "Learner Profile", icon: CircleUserRound },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`tab-${id}`}
                data-tab={id}
                type="button"
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                  activeTab === id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Section>
        {loading && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="surface-panel rounded-3xl p-7 border border-border shadow-md space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full mt-4" />
                <Skeleton className="h-3 w-full" />
              </div>
              <div className="space-y-5">
                <div className="surface-panel rounded-3xl p-6 border border-border space-y-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <div className="surface-panel rounded-3xl p-6 border border-border space-y-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
            <TableSkeleton rows={3} cols={5} />
          </div>
        )}

        {!loading && activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              {/* Active Course Card */}
              <article className="surface-panel rounded-3xl p-7 border border-border shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      Current Milestone
                    </span>
                    <h2 className="mt-2 text-2xl font-bold">{course.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Module:{" "}
                      <strong className="text-foreground">
                        {course.modules[1]?.title || "Full Stack Architecture"}
                      </strong>
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <PlayCircle className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Course Completion</span>
                    <span className="text-primary">{savedProgress}% Completed</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${savedProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>
                      {Math.round(
                        (savedProgress / 100) *
                          course.modules.reduce((acc, m) => acc + m.lessons.length, 0),
                      )}{" "}
                      lessons finished
                    </span>
                    <span>
                      {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} total lessons
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
                  <div className="text-xs text-muted-foreground">
                    Next Lesson:{" "}
                    <strong className="text-foreground">{learnerDashboard.currentLesson}</strong>
                  </div>
                  <Button asChild variant="hero">
                    <Link to="/course-player/$slug" params={{ slug: course.slug }}>
                      Open Course Player <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>

              {/* Sidebar Quick Info */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div className="surface-panel rounded-3xl p-6 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Upcoming Live Lab
                      </p>
                      <p className="font-semibold text-sm">{learnerDashboard.nextClass}</p>
                    </div>
                  </div>
                  <Button
                    variant="subtle"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() =>
                      toast.info("Zoom link will be active 15 minutes before the session.")
                    }
                  >
                    <Video className="mr-1.5 h-3.5 w-3.5" /> Join Live Room
                  </Button>
                </div>

                <div className="surface-panel rounded-3xl p-6 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Pending Assignments
                      </p>
                      <p className="font-display text-2xl font-bold">
                        {assignmentsList.filter((a) => a.status === "In Progress").length} Task Due
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setActiveTab("assignments")}
                  >
                    View Submission Queue
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button
                type="button"
                onClick={() => setActiveTab("courses")}
                className="surface-panel rounded-2xl p-5 text-left border border-border hover:border-primary transition-colors group"
              >
                <BookOpen className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <p className="mt-3 font-semibold text-sm">Course Syllabus</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Access module code samples & repositories.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("assignments")}
                className="surface-panel rounded-2xl p-5 text-left border border-border hover:border-primary transition-colors group"
              >
                <ClipboardCheck className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <p className="mt-3 font-semibold text-sm">Lab Exercises</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Submit homework and coding challenges.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("certificates")}
                className="surface-panel rounded-2xl p-5 text-left border border-border hover:border-primary transition-colors group"
              >
                <Award className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <p className="mt-3 font-semibold text-sm">Issued Credentials</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Verify and export verifiable certificates.
                </p>
              </button>

              <Link
                to="/contact"
                className="surface-panel rounded-2xl p-5 text-left border border-border hover:border-primary transition-colors group"
              >
                <GraduationCap className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <p className="mt-3 font-semibold text-sm">1-on-1 Mentorship</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Book doubt clearance with your instructor.
                </p>
              </Link>
            </div>
          </div>
        )}

        {!loading && activeTab === "courses" && (
          <div className="space-y-6">
            <SectionHeading eyebrow="Enrolled Catalogue" title="Your Active Learning Programs" />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="surface-panel rounded-3xl p-6 border border-border shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase">
                      {course.category}
                    </span>
                    <h3 className="text-xl font-bold mt-1">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Instructor: {course.instructor}
                    </p>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Active Cohort
                  </span>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{savedProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${savedProgress}%` }} />
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button asChild variant="hero" size="sm">
                    <Link to="/course-player/$slug" params={{ slug: course.slug }}>
                      <PlayCircle className="mr-1.5 h-4 w-4" /> Open Player
                    </Link>
                  </Button>
                  <Button asChild variant="subtle" size="sm">
                    <Link to="/courses/$slug" params={{ slug: course.slug }}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Browse More Card */}
              <div className="surface-panel rounded-3xl p-6 border border-dashed border-border flex flex-col justify-center items-center text-center">
                <GraduationCap className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-bold mt-3">Enrol in Another Specialization</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Expand your skills with DevOps, Cloud Architecture, or Data Science tracks.
                </p>
                <Button asChild variant="subtle" size="sm" className="mt-4">
                  <Link to="/courses">Browse Catalogue</Link>
                </Button>
              </div>
            </div>

            {/* Interactive Progress Tracker */}
            <div className="surface-panel rounded-3xl p-6 border border-border shadow-sm">
              <h3 className="font-display text-sm font-bold mb-4">Interactive Lesson Tracker</h3>
              <CourseProgressTracker
                courseSlug={course.slug}
                modules={course.modules}
                completedLessons={completedLessons}
                onToggleLesson={toggleLesson}
              />
            </div>
          </div>
        )}

        {!loading && activeTab === "assignments" && (
          <div className="space-y-6">
            <SectionHeading eyebrow="Lab Evaluations" title="Project Submissions & Code Reviews" />
            <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Assignment Topic</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {assignmentsList.map((asg) => (
                    <tr key={asg.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">{asg.title}</p>
                        <p className="text-xs text-muted-foreground">{asg.course}</p>
                      </td>
                      <td className="px-6 py-4 text-xs">{asg.dueDate}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            asg.status === "Graded"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : asg.status === "Submitted"
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {asg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono">{asg.score || "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="subtle"
                          size="sm"
                          onClick={() => handleAssignmentSubmit(asg.title)}
                        >
                          {asg.status === "In Progress" ? "Submit Lab" : "View Feedback"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && activeTab === "certificates" && (
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Academic Records"
              title="Verified Certificates of Completion"
            />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="surface-panel rounded-3xl p-6 border border-border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{course.title}</h3>
                    <p className="text-xs text-muted-foreground">ID: GS-2026-0142</p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                  Issued upon 100% completion of lectures, lab assignments, and the capstone
                  portfolio project.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Button asChild variant="hero" size="sm">
                    <Link to="/verify/$certificateId" params={{ certificateId: "GS-2026-0142" }}>
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View Public Credential
                    </Link>
                  </Button>
                  <CertificateDownload
                    learnerName={learnerDisplayName}
                    courseTitle={course.title}
                    issuedDate={new Date().toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    certificateId="GS-2026-0142"
                    instructorName={course.instructor}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === "profile" && (
          <div className="space-y-6">
            <SectionHeading eyebrow="Account Settings" title="Learner Profile & Security" />
            <div className="surface-panel rounded-3xl p-8 border border-border max-w-2xl shadow-sm">
              <div className="flex items-center gap-4 border-b border-border pb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl font-bold">
                  {apiProfile?.name
                    ? apiProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "PS"}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{learnerDisplayName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {apiProfile ? "Learner" : learnerDashboard.role} · Member since June 2026
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">
                    {apiProfile?.email || "priya.sharma@example.com"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">+91 98765 43210</span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-muted-foreground">Student ID</span>
                  <span className="font-mono">GS-STU-8842</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted-foreground">Authentication</span>
                  <span className="text-xs text-emerald-600 font-semibold">Active Session</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
