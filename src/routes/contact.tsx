import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PageHero, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { site } from "@/data/site";
import { courses } from "@/data/training";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(8, "Please enter a valid phone number."),
  course_slug: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Please share a few details about your training goals or query."),
});

type ContactValues = z.infer<typeof contactSchema>;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact | ${site.name}` },
      {
        name: "description",
        content:
          "Connect with GuideSoft IT Solutions. Reach our course counsellors and technical delivery leads.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      course_slug: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactValues) => {
    setIsSubmitting(true);
    try {
      const res = await api.submitLead({
        name: values.name,
        email: values.email,
        phone: values.phone,
        course_slug: values.course_slug || undefined,
        source: "contact_page",
        message: `${values.company ? `[Organization: ${values.company}] ` : ""}${values.message}`,
      });
      setSubmittedLeadId(res.id);
      toast.success("Enquiry received! We have sent a confirmation to your email.");
      form.reset();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit enquiry. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Start a conversation"
        title="Connect with our advisors & tech leads."
        description="Tell us about your learning goals, current background or project requirements. We will connect you with a tailored roadmap and next steps."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <h2 className="text-2xl font-semibold">We make learning concrete.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              You can expect a direct conversation with a technical instructor or career advisor,
              not a generic sales queue.
            </p>
            <dl className="mt-10 space-y-6 text-sm">
              <div className="flex gap-3.5">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <dt className="font-semibold text-foreground">Email Support</dt>
                  <dd className="mt-1 text-muted-foreground">
                    <a
                      href={`mailto:${site.email}`}
                      className="hover:text-primary transition-colors font-medium"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="surface-panel rounded-3xl p-6 sm:p-10 border border-border shadow-lg">
            {!submittedLeadId ? (
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <div className="mb-6">
                  <h3 className="text-xl font-bold">Send an Enquiry</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fill out the form below to receive syllabus brochures, fee details, and batch
                    timings.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name *" error={form.formState.errors.name?.message}>
                    <Input
                      {...form.register("name")}
                      placeholder="e.g. Priya Sharma"
                      aria-invalid={Boolean(form.formState.errors.name)}
                    />
                  </Field>
                  <Field label="Email Address *" error={form.formState.errors.email?.message}>
                    <Input
                      {...form.register("email")}
                      type="email"
                      placeholder="priya@example.com"
                      aria-invalid={Boolean(form.formState.errors.email)}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 mt-5">
                  <Field label="Mobile / WhatsApp *" error={form.formState.errors.phone?.message}>
                    <Input
                      {...form.register("phone")}
                      placeholder="+91 9876543210"
                      aria-invalid={Boolean(form.formState.errors.phone)}
                    />
                  </Field>
                  <Field label="Interested Course">
                    <select
                      {...form.register("course_slug")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">General Guidance (All Courses)</option>
                      {courses.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="mt-5">
                  <Field label="Company / College / Background">
                    <Input
                      {...form.register("company")}
                      placeholder="e.g. Final Year B.Tech / Working Software Engineer"
                    />
                  </Field>
                </div>

                <div className="mt-5">
                  <Field label="How can we help? *" error={form.formState.errors.message?.message}>
                    <Textarea
                      {...form.register("message")}
                      placeholder="Tell us about your learning background, preferred batch timing (morning/evening/weekend), or any specific goals..."
                      rows={5}
                      aria-invalid={Boolean(form.formState.errors.message)}
                    />
                  </Field>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="mt-8 w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Enquiry...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Enquiry
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-foreground">Enquiry Dispatched</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Thank you! Your enquiry has been received and routed to our technical admissions
                  desk.
                </p>
                <div className="mt-6 rounded-xl bg-muted p-4 max-w-sm mx-auto text-left text-xs text-muted-foreground space-y-2">
                  <p className="font-mono">Reference: {submittedLeadId}</p>
                  <p>• An automated receipt has been sent to your email.</p>
                  <p>• Our senior counsellor will get in touch within 24 hours.</p>
                </div>
                <div className="mt-8 flex justify-center gap-3">
                  <Button variant="subtle" onClick={() => setSubmittedLeadId(null)}>
                    Submit Another Enquiry
                  </Button>
                  <Button asChild variant="hero">
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
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
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
