import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PageHero, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { batches, courses } from "@/data/training";
import { site } from "@/data/site";
import { ApiError, publicApi } from "@/lib/api";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || /^[0-9+\-\s()]{8,20}$/.test(value), {
      message: "Enter a valid phone number.",
    }),
  message: z.string().min(10, "Tell us a little more so we can prepare."),
});

type ContactValues = z.infer<typeof contactSchema>;

const routeSearchSchema = z.object({
  course: z.string().optional(),
  batch: z.string().optional(),
  source: z.string().optional(),
});

export const Route = createFileRoute("/contact")({
  validateSearch: routeSearchSchema,
  head: () => ({
    meta: [
      { title: `Contact | ${site.name}` },
      {
        name: "description",
        content:
          "Tell Guide IT Solutions what you are building and get a useful next step within three working days.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const search = Route.useSearch();
  const course = courses.find((item) => item.slug === search.course);
  const batch = batches.find((item) => item.id === search.batch);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const onSubmit = async (values: ContactValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await publicApi.createLead({
        name: values.name,
        email: values.email,
        ...(values.phone ? { phone: values.phone } : {}),
        ...(course ? { course_slug: course.slug } : {}),
        ...(batch ? { batch_id: batch.id } : {}),
        ...(search.source ? { source: search.source } : {}),
        message: values.message,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.detail ?? error.message
          : "Something went wrong. Please try again in a moment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Start a conversation"
        title="Bring us the hard brief."
        description="Tell us what you are building, where it is stuck and what a good outcome looks like. We will come back with a useful next step."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <h2 className="text-2xl font-semibold">Let’s make it concrete.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              You can expect a reply from a senior delivery lead, not a sales queue.
            </p>
            <dl className="mt-10 space-y-6 text-sm">
              <div>
                <dt className="font-semibold text-primary">Email</dt>
                <dd className="mt-1 text-muted-foreground">{site.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-primary">Phone</dt>
                <dd className="mt-1 text-muted-foreground">{site.phone}</dd>
              </div>
              <div>
                <dt className="font-semibold text-primary">Hours</dt>
                <dd className="mt-1 text-muted-foreground">{site.hours}</dd>
              </div>
            </dl>
          </div>

          {submitted ? (
            <div className="surface-panel rounded-2xl p-8 text-center sm:p-10">
              <p className="text-5xl" aria-hidden="true">
                ✓
              </p>
              <h2 className="mt-6 text-2xl font-semibold">Thanks, {form.getValues("name").split(" ")[0]}.</h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                We received your enquiry and a career advisor will get back to you within three
                working days with a useful next step.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild variant="hero">
                  <Link to="/courses">Browse courses</Link>
                </Button>
                <Button
                  variant="subtle"
                  onClick={() => {
                    form.reset();
                    setSubmitted(false);
                  }}
                >
                  Send another enquiry
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="surface-panel rounded-2xl p-6 sm:p-8"
            >
              {course || batch ? (
                <div className="mb-6 rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm">
                  {course ? (
                    <p>
                      <strong>Course:</strong> {course.title}
                    </p>
                  ) : null}
                  {batch ? (
                    <p className="mt-1">
                      <strong>Batch:</strong> {batch.name} · {batch.start}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Name" error={form.formState.errors.name?.message}>
                  <Input
                    {...form.register("name")}
                    placeholder="Your name"
                    aria-invalid={Boolean(form.formState.errors.name)}
                  />
                </Field>
                <Field label="Work email" error={form.formState.errors.email?.message}>
                  <Input
                    {...form.register("email")}
                    type="email"
                    placeholder="you@company.com"
                    aria-invalid={Boolean(form.formState.errors.email)}
                  />
                </Field>
              </div>
              <div className="mt-6">
                <Field label="Phone (optional)" error={form.formState.errors.phone?.message}>
                  <Input
                    {...form.register("phone")}
                    type="tel"
                    placeholder="+91 98765 43210"
                    aria-invalid={Boolean(form.formState.errors.phone)}
                  />
                </Field>
              </div>
              <div className="mt-6">
                <Field label="How can we help?" error={form.formState.errors.message?.message}>
                  <Textarea
                    {...form.register("message")}
                    placeholder="A few lines about what you want to learn, your background or the challenge..."
                    rows={6}
                    aria-invalid={Boolean(form.formState.errors.message)}
                  />
                </Field>
              </div>
              {submitError ? (
                <p className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {submitError}
                </p>
              ) : null}
              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="mt-7 w-full sm:w-auto"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send enquiry"}
              </Button>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}