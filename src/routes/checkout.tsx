import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Section, TrainingHero } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { batches, courses } from "@/data/training";
import { site } from "@/data/site";
import { ApiError, publicApi } from "@/lib/api";

const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Please enter your name."),
  customer_email: z.string().email("Enter a valid email."),
  customer_phone: z
    .string()
    .min(8, "Enter a valid phone number.")
    .regex(/^[0-9+\-\s()]{8,20}$/, "Enter a valid phone number."),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const searchSchema = z.object({
  batch: z.string().min(1),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: `Checkout | ${site.name}` }] }),
  component: Checkout,
});

function Checkout() {
  const { batch: batchId } = Route.useSearch();
  const batch = batches.find((item) => item.id === batchId);
  const course = batch ? courses.find((item) => item.slug === batch.courseSlug) : undefined;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customer_name: "", customer_email: "", customer_phone: "" },
  });

  const onSubmit = async (values: CheckoutValues) => {
    if (!batch) return;
    setError(null);
    setLoading(true);
    try {
      const order = await publicApi.createOrder({
        batch_id: batch.id,
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_phone: values.customer_phone,
      });
      const base =
        order.cashfree_mode === "production"
          ? "https://payments.cashfree.com/order"
          : "https://payments-test.cashfree.com/order";
      window.location.href = `${base}/${order.payment_session_id}`;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.detail ?? err.message
          : "Unable to start the payment. Please try again.",
      );
      setLoading(false);
    }
  };

  if (!batch || !course) {
    return (
      <Section>
        <div className="surface-panel mx-auto max-w-md rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold">Batch not found</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            The batch you are trying to enrol in is unavailable. Browse the catalogue and pick an
            upcoming batch.
          </p>
          <Button asChild variant="hero" className="mt-6">
            <Link to="/live-batches">See live batches</Link>
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <>
      <TrainingHero
        eyebrow="Secure checkout"
        title="Enrol in this batch."
        description="Your payment is processed securely by Cashfree. You will receive a receipt and enrolment confirmation by email."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr]">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="surface-panel rounded-2xl p-6 sm:p-8"
          >
            <h2 className="text-lg font-semibold">Billing details</h2>
            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="checkout-name">
                  Full name
                </label>
                <Input
                  id="checkout-name"
                  {...form.register("customer_name")}
                  autoComplete="name"
                  placeholder="Your full name"
                  aria-invalid={Boolean(form.formState.errors.customer_name)}
                />
                {form.formState.errors.customer_name ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.customer_name.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="checkout-email">
                  Email
                </label>
                <Input
                  id="checkout-email"
                  {...form.register("customer_email")}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(form.formState.errors.customer_email)}
                />
                {form.formState.errors.customer_email ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.customer_email.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="checkout-phone">
                  Phone
                </label>
                <Input
                  id="checkout-phone"
                  {...form.register("customer_phone")}
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  aria-invalid={Boolean(form.formState.errors.customer_phone)}
                />
                {form.formState.errors.customer_phone ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.customer_phone.message}
                  </p>
                ) : null}
              </div>
            </div>
            {error ? (
              <p className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" variant="hero" size="xl" className="mt-7 w-full" disabled={loading}>
              {loading ? "Connecting to secure payment…" : `Pay ${batch.price}`}
            </Button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Powered by Cashfree · UPI, cards and net banking supported.
            </p>
          </form>

          <aside className="surface-panel h-fit rounded-2xl p-6">
            <p className="text-sm font-semibold text-primary">Order summary</p>
            <h2 className="mt-4 text-xl font-semibold">{course.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{batch.name}</p>
            <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Starts</dt>
                <dd>{batch.start}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Schedule</dt>
                <dd>
                  {batch.days} · {batch.time}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Mode</dt>
                <dd>{batch.mode}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Instructor</dt>
                <dd>{batch.instructor}</dd>
              </div>
            </dl>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-2xl font-semibold">{batch.price}</span>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}