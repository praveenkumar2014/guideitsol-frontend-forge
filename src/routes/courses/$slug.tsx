import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  MessageSquare,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { CtaBand } from "@/components/cta-band";
import { CourseMeta, Section, SectionHeading, TrainingHero } from "@/components/training-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { batches, courses, type Batch } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/courses/$slug")({
  head: ({ params }) => {
    const course = courses.find((item) => item.slug === params.slug);
    return {
      meta: [
        { title: course ? `${course.title} | ${site.name}` : `Course | ${site.name}` },
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

  const handleDownloadSyllabus = () => {
    toast.success(`Syllabus for ${course.title} has been downloaded.`);
  };

  const handleOpenCheckout = (batch: Batch) => {
    setSelectedBatch(batch);
    setCheckoutOpen(true);
  };

  return (
    <>
      <TrainingHero
        eyebrow={`${course.category} · ${course.level}`}
        title={course.title}
        description={course.overview}
      >
        <Button variant="hero" size="xl" onClick={() => setEnquiryOpen(true)}>
          Talk to a course advisor <ArrowRight />
        </Button>
        <Button asChild variant="subtle" size="xl">
          <Link to="/live-batches">See upcoming batches</Link>
        </Button>
      </TrainingHero>

      <Section>
        <CourseMeta course={course} />
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_0.42fr]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <SectionHeading eyebrow="Curriculum" title="A week-by-week path to useful work." />
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadSyllabus}
                className="self-start"
              >
                <Download className="mr-1.5 h-4 w-4" /> Download Full Syllabus PDF
              </Button>
            </div>

            <Accordion type="multiple" className="mt-8">
              {course.modules.map((item, index) => (
                <AccordionItem key={item.title} value={`module-${index}`}>
                  <AccordionTrigger className="text-left">
                    <span>
                      <span className="mr-3 text-sm font-semibold text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.description}</p>
                    <ul className="mt-5 space-y-3">
                      {item.lessons.map((lesson) => (
                        <li key={lesson.title} className="flex items-center gap-3 text-sm">
                          <PlayCircle className="h-4 w-4 text-primary" />
                          {lesson.title}
                          <span className="ml-auto text-xs text-muted-foreground">
                            {lesson.duration}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 rounded-lg bg-muted p-3 text-sm">
                      <strong>Assignment:</strong> {item.assignment}
                    </p>
                    {item.project ? (
                      <p className="mt-3 text-sm text-primary">
                        <strong>Project:</strong> {item.project}
                      </p>
                    ) : null}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <aside className="surface-panel h-fit rounded-3xl p-7 lg:sticky lg:top-24 border border-border shadow-md">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Program Enrolment</span>
            </div>
            <p className="mt-4 font-display text-3xl font-bold">{course.price}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Live instructor classes + lab access
            </p>

            <div className="mt-6 space-y-2.5">
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={() => {
                  if (courseBatches.length > 0) {
                    handleOpenCheckout(courseBatches[0]);
                  } else {
                    setEnquiryOpen(true);
                  }
                }}
              >
                {courseBatches.length > 0 ? "Enrol in Next Batch" : "Request Enrolment"}
              </Button>

              <Button
                variant="subtle"
                size="lg"
                className="w-full"
                onClick={() => setEnquiryOpen(true)}
              >
                <MessageSquare className="mr-1.5 h-4 w-4" /> Ask Counsellor Questions
              </Button>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Key Takeaways
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {course.outcomes.slice(0, 5).map((outcome) => (
                  <li key={outcome} className="flex gap-2">
                    <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span className="text-muted-foreground text-xs leading-relaxed">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="Tools & preparation" title="What you will work with" />
        <div className="mt-8 flex flex-wrap gap-3">
          {course.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm"
            >
              {tool}
            </span>
          ))}
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="surface-panel rounded-2xl p-6">
            <h3 className="text-lg font-semibold">Prerequisites</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {course.prerequisites.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-panel rounded-2xl p-6">
            <h3 className="text-lg font-semibold">Capstone Portfolio Project</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{course.project}</p>
          </div>
        </div>
      </Section>

      {courseBatches.length ? (
        <Section>
          <SectionHeading eyebrow="Next up" title="Upcoming batches for this course" />
          <div className="mt-8 space-y-4">
            {courseBatches.map((batch) => (
              <div
                key={batch.id}
                className="surface-panel flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between border border-border"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    <p className="font-semibold text-foreground text-lg">{batch.name}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Starts <strong className="text-foreground">{batch.start}</strong> · {batch.days}{" "}
                    · {batch.time}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Instructor: {batch.instructor} · {batch.available} of {batch.seats} seats
                    available
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display font-bold text-lg text-primary">{batch.price}</span>
                  <Button variant="hero" onClick={() => handleOpenCheckout(batch)}>
                    <CreditCard className="mr-1.5 h-4 w-4" /> Enrol Now
                  </Button>
                  <Button variant="subtle" onClick={() => setEnquiryOpen(true)}>
                    Ask Questions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand
        title="Want help choosing the right starting point?"
        description="Share your background and career goal. A GUIDESOFT advisor can help you compare courses and formats."
      />

      {/* Enquiry Modal */}
      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        defaultCourseSlug={course.slug}
        title={`Enquire about ${course.title}`}
        description="Connect with our academic advisor to discuss course syllabus, lab access, and placement support."
      />

      {/* Checkout Modal */}
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        batch={selectedBatch}
        courseTitle={course.title}
      />
    </>
  );
}
