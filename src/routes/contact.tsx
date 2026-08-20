import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PageHero, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/data/site";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  company: z.string().min(2, "Please enter your company name."),
  message: z.string().min(20, "Tell us a little more so we can prepare."),
});

type ContactValues = z.infer<typeof contactSchema>;

export const Route = createFileRoute("/contact")({
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
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", company: "", message: "" },
  });
  const onSubmit = (_values: ContactValues) => {
    toast.success("Thanks. We will be in touch within three working days.");
    form.reset();
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="surface-panel rounded-2xl p-6 sm:p-8"
          >
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
              <Field label="Company" error={form.formState.errors.company?.message}>
                <Input
                  {...form.register("company")}
                  placeholder="Company name"
                  aria-invalid={Boolean(form.formState.errors.company)}
                />
              </Field>
            </div>
            <div className="mt-6">
              <Field label="What are you building?" error={form.formState.errors.message?.message}>
                <Textarea
                  {...form.register("message")}
                  placeholder="A few lines about the product, timeline or challenge..."
                  rows={6}
                  aria-invalid={Boolean(form.formState.errors.message)}
                />
              </Field>
            </div>
            <Button type="submit" variant="hero" size="xl" className="mt-7 w-full sm:w-auto">
              Send enquiry
            </Button>
          </form>
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
