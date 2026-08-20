import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Download,
  FileCode,
  FileText,
  GraduationCap,
  HelpCircle,
  Laptop,
  Layers,
  MessageSquare,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { AnimatedSection } from "@/components/animated-section";
import { StaggerContainer, staggerItem } from "@/components/stagger-container";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { CtaBand } from "@/components/cta-band";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { Section, SectionHeading } from "@/components/training-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { batches, courses, type Batch } from "@/data/training";

export const Route = createFileRoute("/courses/$slug")({
  head: ({ params }) => {
    const course = courses.find((item) => item.slug === params.slug);
    return {
      meta: [
        {
          title: course
            ? `${course.title} Professional Certificate | ${site.name}`
            : `Course | ${site.name}`,
        },
        { name: "description", content: course?.summary ?? "Explore a GUIDESOFT training course." },
      ],
    };
  },
  component: CourseDetail,
});

function CourseDetail() {
  const { slug } = Route.useParams();
  const course = courses.find((item) => item.slug === slug);
  if (!course) throw notFound();

  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const courseBatches = batches.filter((batch) => batch.courseSlug === course.slug);
  const rating = course.rating || 4.9;
  const enrolledCount = course.enrolledCount || "14,800+ learners";
  const reviewsCount = course.reviewsCount || 2480;

  const handleDownloadSyllabus = () => {
    toast.success(`Complete syllabus for '${course.title}' has been downloaded.`);
  };

  const handleOpenCheckout = (batch: Batch) => {
    setSelectedBatch(batch);
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        defaultCourseSlug={course.slug}
        title={`Enquire about ${course.title}`}
      />
      {selectedBatch && (
        <CheckoutDialog
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          batch={selectedBatch}
          courseTitle={course.title}
        />
      )}

      {/* ========================================================================= */}
      {/* COURSERA-STYLE HERO BANNER                                                */}
      {/* ========================================================================= */}
      <AnimatedSection direction="down">
        <section className="border-b border-border/80 bg-surface/50 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Bar */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-muted-foreground mb-6"
            >
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link to="/courses" className="hover:text-foreground">
                Courses
              </Link>
              <span>/</span>
              <span className="text-primary font-medium">{course.category}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
              <div className="space-y-6">
                {/* Partner Badge & Credential Tag */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                    <Award className="h-3.5 w-3.5" />
                    Professional Certificate
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Accredited by{" "}
                    <strong className="text-foreground">
                      {course.partnerName || "GuideSoft IT Academic Council"}
                    </strong>
                  </span>
                </div>

                {/* Title & Headline */}
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                  {course.title}
                </h1>

                <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-3xl">
                  {course.overview}
                </p>

                {/* Social Proof & Metrics */}
                <div className="flex flex-wrap items-center gap-5 pt-2 border-y border-border/60 py-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{rating}</span>
                    <span className="text-muted-foreground font-normal">
                      ({reviewsCount.toLocaleString()} ratings)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span>
                      <strong className="text-foreground">{enrolledCount}</strong> already enrolled
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4 text-sky-400" />
                    <span>
                      {course.duration} · {course.format}
                    </span>
                  </div>
                </div>

                {/* Primary Call to Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button
                    variant="hero"
                    size="xl"
                    id="course-enroll-primary-btn"
                    onClick={() => {
                      const firstBatch = courseBatches[0];
                      if (firstBatch) {
                        handleOpenCheckout(firstBatch);
                      } else {
                        setEnquiryOpen(true);
                      }
                    }}
                    className="font-bold shadow-xl shadow-primary/20"
                  >
                    {courseBatches.length > 0 ? "Enroll in Next Batch" : "Enquire for Admission"}{" "}
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>

                  <Button
                    variant="subtle"
                    size="xl"
                    onClick={() => setEnquiryOpen(true)}
                    className="border border-border font-semibold"
                  >
                    <MessageSquare className="h-4 w-4 mr-2 text-primary" /> Ask Counsellor Questions
                  </Button>

                  <Button
                    variant="outline"
                    size="xl"
                    id="download-syllabus-btn"
                    onClick={handleDownloadSyllabus}
                    className="border-border text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-4 w-4 mr-2" /> Download Syllabus
                  </Button>
                </div>
              </div>

              {/* Sticky Pricing & Enrolment Box */}
              <aside className="rounded-3xl border border-border bg-card p-7 shadow-xl backdrop-blur-xl lg:sticky lg:top-24">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Total Tuition Fee
                    </span>
                    <p className="font-display text-3xl font-extrabold text-foreground mt-0.5">
                      {course.price}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-bold"
                  >
                    EMI Available
                  </Badge>
                </div>

                <div className="mt-5 space-y-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Next Live Cohort:</span>
                    <strong className="text-foreground font-semibold">26 Aug 2026</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Schedule:</span>
                    <strong className="text-foreground font-semibold">
                      Mon - Fri · 7:30 PM IST
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Credentials:</span>
                    <strong className="text-foreground font-semibold">
                      Verified Digital Certificate
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Prerequisites:</span>
                    <strong className="text-foreground font-semibold">{course.level}</strong>
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full font-bold shadow-lg shadow-primary/25"
                    onClick={() => {
                      const firstBatch = courseBatches[0];
                      if (firstBatch) {
                        handleOpenCheckout(firstBatch);
                      } else {
                        setEnquiryOpen(true);
                      }
                    }}
                  >
                    {courseBatches.length > 0
                      ? "Enroll Online & Reserve Seat"
                      : "Request Admission"}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-border font-medium"
                    onClick={() => setEnquiryOpen(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 text-primary" /> Ask Counsellor Questions
                  </Button>
                </div>

                <div className="mt-6 border-t border-border pt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>100% Money-Back & Placement Support Guarantee</span>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ========================================================================= */}
      {/* WHAT YOU WILL LEARN & SKILLS GAINED                                      */}
      {/* ========================================================================= */}
      <AnimatedSection direction="left">
        <section className="py-14 border-b border-border/80 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Course Outcomes" title="What You Will Learn & Master" />

            {/* Core Outcomes Checklist */}
            <StaggerContainer className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {course.outcomes.map((outcome, idx) => (
                <motion.div
                  key={outcome}
                  variants={staggerItem}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-surface/60 p-4 transition-all hover:border-primary/40 hover:bg-surface"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                    {outcome}
                  </p>
                </motion.div>
              ))}
            </StaggerContainer>

            {/* Tools & Frameworks */}
            <div className="mt-10 rounded-3xl border border-border bg-surface/40 p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Skills & Tools You Will Gain
              </p>
              <div className="flex flex-wrap gap-2">
                {course.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ========================================================================= */}
      {/* INTERACTIVE WEEK-BY-WEEK SYLLABUS                                        */}
      {/* ========================================================================= */}
      <AnimatedSection direction="right">
        <section className="py-14 border-b border-border/80 bg-surface/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <SectionHeading
                eyebrow="Comprehensive Curriculum"
                title="Detailed Syllabus Breakdown"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadSyllabus}
                className="self-start border-border"
              >
                <Download className="mr-1.5 h-4 w-4" /> Download PDF Syllabus
              </Button>
            </div>

            <Accordion type="multiple" className="mt-8 space-y-3">
              {course.modules.map((item, index) => (
                <AccordionItem
                  key={item.title}
                  value={`module-${index}`}
                  className="rounded-2xl border border-border bg-card px-5 py-1 transition-all hover:border-primary/40 shadow-sm"
                >
                  <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
                        0{index + 1}
                      </span>
                      <div>
                        <p className="text-sm sm:text-base font-bold text-foreground">
                          {item.title}
                        </p>
                        <p className="text-xs font-normal text-muted-foreground mt-0.5">
                          {item.duration} · {item.lessons.length} Modules
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pt-2 pb-5 space-y-4 border-t border-border/60">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>

                    <div className="space-y-2">
                      {item.lessons.map((lesson) => (
                        <div
                          key={lesson.title}
                          className="flex items-center justify-between rounded-xl bg-surface/60 px-3.5 py-2.5 text-xs text-foreground"
                        >
                          <div className="flex items-center gap-2.5">
                            <PlayCircle className="h-4 w-4 text-primary shrink-0" />
                            <span className="font-medium">{lesson.title}</span>
                          </div>
                          <span className="text-muted-foreground font-mono">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-foreground">
                      <strong className="text-primary font-bold">Practical Lab Assignment:</strong>{" "}
                      {item.assignment}
                    </div>

                    {item.project && (
                      <div className="rounded-xl border border-highlight/20 bg-highlight/5 p-3.5 text-xs text-foreground">
                        <strong className="text-highlight font-bold">Capstone Deliverable:</strong>{" "}
                        {item.project}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </AnimatedSection>

      {/* ========================================================================= */}
      {/* INSTRUCTOR SPOTLIGHT                                                     */}
      {/* ========================================================================= */}
      <AnimatedSection direction="left">
        <section className="py-14 border-b border-border/80 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Faculty & Mentors" title="Learn from Industry Practitioners" />

            <div className="mt-8 rounded-3xl border border-border bg-surface/50 p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/20 font-display text-2xl font-extrabold text-primary border border-primary/30 shadow-lg">
                  {course.instructor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {course.instructor}
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-primary/40 bg-primary/10 text-primary text-[10px]"
                    >
                      Verified Lead Instructor
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-primary font-medium">
                    Principal Architect & Technical Mentor · GuideSoft IT Academic Council
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    12+ years of enterprise engineering leadership across Tier-1 tech firms. Guided
                    over 8,500+ professionals into high-impact software engineering roles.
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3 pt-2 sm:pt-0 shrink-0 border-t sm:border-t-0 sm:border-l border-border/80 sm:pl-6 w-full sm:w-auto justify-between">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">Instructor Rating</p>
                    <p className="font-display text-lg font-bold text-foreground flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9 / 5.0
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Students Taught</p>
                    <p className="font-display text-base font-bold text-foreground">8,500+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ========================================================================= */}
      {/* CAPSTONE PROJECT & REVIEWS                                               */}
      {/* ========================================================================= */}
      <AnimatedSection direction="up">
        <section className="py-14 border-b border-border/80 bg-surface/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Hands-on Project" title="Enterprise Capstone Experience" />

            <div className="mt-8 rounded-3xl border-2 border-primary/30 bg-card p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" /> Production Portfolio Deliverable
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">{course.project}</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Design, test, and deploy a complete production-grade system with full CI/CD
                deployment, code reviews, and live architectural walkthroughs that you can showcase
                to hiring recruiters.
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Bottom CTA Band */}
      <CtaBand
        title={`Ready to Master ${course.title}?`}
        description="Join the next live cohort with hands-on lab sandbox access and dedicated 1-on-1 mentor guidance."
      />
    </div>
  );
}
