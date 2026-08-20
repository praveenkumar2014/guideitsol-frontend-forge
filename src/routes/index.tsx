import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Atom,
  Award,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Code2,
  Compass,
  Cpu,
  GraduationCap,
  HeartPulse,
  Languages,
  Laptop,
  Megaphone,
  Monitor,
  MonitorCheck,
  Paintbrush,
  Palette,
  PieChart,
  Radio,
  Rocket,
  Server,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

import { AnimatedBackground } from "@/components/animated-background";
import { CtaBand } from "@/components/cta-band";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { HeroSlider } from "@/components/hero-slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import {
  batches,
  certificationExams,
  courses,
  degreePrograms,
  exploreCategories,
  professionalCertificates,
  roles,
  roadmaps,
  trendingSkills,
} from "@/data/training";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.name} | India's Premier IT Training & Career Forge` },
      {
        name: "description",
        content:
          "Master in-demand software engineering skills: Java Full Stack, Generative AI, Cloud DevOps, Data Science, and SDET with live instructor-led cohorts.",
      },
      {
        name: "keywords",
        content:
          "IT training Guntur, Java Full Stack, GenAI training, Cloud DevOps course, AWS training, Software testing, Data Science bootcamp, guideitsol.in",
      },
    ],
  }),
  component: Home,
});

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3,
  ClipboardList,
  ShieldCheck,
  BrainCircuit,
  PieChart,
  Megaphone,
  Palette,
  Cpu,
  Share2,
  MonitorCheck,
  Briefcase,
  Server,
  HeartPulse,
  Atom,
  Rocket,
  Users,
  Languages,
  Paintbrush,
  Monitor,
  Code2,
};

function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCertCategory, setSelectedCertCategory] = useState<string>(
    professionalCertificates[0].name,
  );

  const categories = [
    "All",
    "Software Development",
    "Data & AI",
    "Cloud & DevOps",
    "Testing",
    "UI/UX & Design",
  ];

  const filteredCourses =
    selectedCategory === "All" ? courses : courses.filter((c) => c.category === selectedCategory);

  const activeCertCategory = professionalCertificates.find((c) => c.name === selectedCertCategory);

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-200">
      <AnimatedBackground />

      {/* ========================================================================= */}
      {/* FULL-SCREEN HERO SLIDER                                                    */}
      {/* ========================================================================= */}
      <HeroSlider />

      {/* ========================================================================= */}
      {/* TRUST & ACCREDITATION METRICS STRIP                                       */}
      {/* ========================================================================= */}
      <section className="border-b border-border/80 bg-surface/50 py-10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                18,400+
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Engineers Trained & Certified
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                ₹12.5 LPA
              </p>
              <p className="text-xs font-medium text-muted-foreground">Average Graduate Salary</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                100%
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Verified Credential Ledger
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                150+
              </p>
              <p className="text-xs font-medium text-muted-foreground">Global Hiring Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* EXPLORE COURSES                                                           */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary mb-2 text-xs font-bold"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Professional Certifications
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
              Explore Enterprise Degrees & Career Tracks
            </h2>
          </div>

          <Button asChild variant="subtle" size="lg" className="border border-border font-semibold">
            <Link to="/courses">
              Explore All Tracks ({courses.length}) <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border border-border bg-surface/80 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtered Courses Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.slice(0, 6).map((course) => (
            <div
              key={course.slug}
              className="group flex flex-col justify-between overflow-hidden rounded-md border border-border bg-card shadow-sm hover:shadow-md transition-shadow h-full"
            >
              <div>
                {course.image && (
                  <div className="h-40 w-full overflow-hidden border-b border-border">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80"
                      alt="Provider Logo"
                      className="w-5 h-5 rounded-sm object-cover"
                    />
                    <span className="text-[11px] font-bold text-foreground">
                      {course.instructor || "GuideSoft Partner"}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-foreground line-clamp-2 min-h-[56px]">
                    <Link
                      to="/courses/$slug"
                      params={{ slug: course.slug }}
                      className="hover:underline"
                    >
                      {course.title}
                    </Link>
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">Professional Certificate</p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {(course.tools || []).slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-sm bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-foreground/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 mt-auto">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-4">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {course.rating || "4.8"}
                  </span>
                  <span className="text-muted-foreground font-normal">
                    ({course.reviewsCount || "10k"} reviews)
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                    Tuition
                  </p>
                  <p className="font-bold text-foreground">{course.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* EXPLORE ROLES                                                             */}
      {/* ========================================================================= */}
      <section className="border-t border-border/80 bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary mb-3">
              <Target className="h-3.5 w-3.5 mr-1" /> Career Roles
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
              Explore Roles
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Discover courses tailored for the career path you want to pursue.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {roles.map((role) => {
              const Icon = iconMap[role.icon] || Compass;
              return (
                <Link
                  key={role.name}
                  to="/courses"
                  className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-foreground">{role.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{role.courseCount} courses</p>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg" className="font-semibold">
              <Link to="/courses">
                View all <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* EXPLORE CATEGORIES                                                        */}
      {/* ========================================================================= */}
      <section className="border-t border-border/80 bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary mb-3">
              <Compass className="h-3.5 w-3.5 mr-1" /> Categories
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
              Explore Categories
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Browse our full catalog organized by subject area.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {exploreCategories.map((cat) => {
              const Icon = iconMap[cat.icon] || Compass;
              return (
                <Link
                  key={cat.name}
                  to="/browse/$category"
                  params={{ category: cat.name.toLowerCase().replace(/ /g, "-") }}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{cat.courseCount} courses</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg" className="font-semibold">
              <Link to="/courses">
                View all <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* EARN A PROFESSIONAL CERTIFICATE                                           */}
      {/* ========================================================================= */}
      <section className="border-t border-border/80 bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary mb-3">
              <Award className="h-3.5 w-3.5 mr-1" /> Certificates
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
              Earn a Professional Certificate
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Industry-recognized credentials to advance your career.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {professionalCertificates.map((cat) => {
              const Icon = iconMap[cat.icon] || Award;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCertCategory(cat.name)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shrink-0 ${
                    selectedCertCategory === cat.name
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border border-border bg-surface/80 text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Certificate List */}
          {activeCertCategory && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {activeCertCategory.certificates.map((cert) => (
                <Link
                  key={cert}
                  to="/courses"
                  className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-foreground">{cert}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Professional Certificate</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                    Explore <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* EARN AN ONLINE DEGREE                                                     */}
      {/* ========================================================================= */}
      <section className="border-t border-border/80 bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary mb-3">
              <GraduationCap className="h-3.5 w-3.5 mr-1" /> Degrees
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
              Earn an Online Degree
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Accredited degree programs from top university partners.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {degreePrograms.map((group) => (
              <div
                key={group.category}
                className="rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-foreground">
                  {group.category}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.degrees.map((deg) => (
                    <li key={deg}>
                      <Link
                        to="/courses"
                        className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary/60 group-hover:text-primary" />
                        {deg}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* EXPLORE TRENDING SKILLS                                                   */}
      {/* ========================================================================= */}
      <section className="border-t border-border/80 bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary mb-3">
              <TrendingUp className="h-3.5 w-3.5 mr-1" /> Skills
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
              Explore Trending Skills
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              The most in-demand skills employers are hiring for right now.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {trendingSkills.map((skill) => (
              <Link
                key={skill.name}
                to="/courses"
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground shadow-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:-translate-y-0.5"
              >
                <Sparkles className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                {skill.name}
                <span className="ml-1 text-xs font-normal text-muted-foreground group-hover:text-primary-foreground/80">
                  ({skill.courseCount})
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PREPARE FOR CERTIFICATION EXAM                                            */}
      {/* ========================================================================= */}
      <section className="border-t border-border/80 bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary mb-3">
              <Target className="h-3.5 w-3.5 mr-1" /> Certifications
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
              Prepare for a Certification Exam
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Structured prep paths for globally recognized certifications.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certificationExams.map((exam) => (
              <Link
                key={exam.code}
                to="/courses"
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                    {exam.code}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {exam.provider}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-bold text-foreground">{exam.name}</h3>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                  View prep courses <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg" className="font-semibold">
              <Link to="/courses">
                View all <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4-PILLAR LEARNING METHODOLOGY                                             */}
      {/* ========================================================================= */}
      <section className="border-t border-border/80 bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary mb-3">
              Why GuideSoft IT Solutions
            </Badge>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
              An Engineering Crucible That Bridges The Industry Gap
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              We replicate real enterprise sprint cycles, production codebases, architecture
              reviews, and 1-on-1 code reviews with Principal Engineers.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Laptop className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-lg font-bold text-foreground">
                Live Production Cloud Labs
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Deploy microservices to real AWS ECS clusters, configure CI/CD GitHub Actions
                pipelines, and handle real database failovers.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Radio className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-lg font-bold text-foreground">
                Daily Live Mentorship & Code Reviews
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Small cohorts capped at 25 learners. Daily interactive sessions with Principal
                Architects from top tier tech firms.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-lg font-bold text-foreground">
                Placement Network & Career Forge
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Resume optimization, system design mock interviews, verified credential ledgers, and
                direct referrals to 150+ hiring partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HIRING PARTNERS RECRUITER STRIP                                          */}
      {/* ========================================================================= */}
      <section className="border-t border-border/80 bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-8">
            Our Alumni Work At Leading Global Technology Companies
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">
              GOOGLE
            </span>
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">
              AMAZON
            </span>
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">
              MICROSOFT
            </span>
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">
              TCS
            </span>
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">
              INFOSYS
            </span>
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">
              ACCENTURE
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
