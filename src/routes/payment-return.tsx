import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  XCircle,
} from "lucide-react";
import { z } from "zod";

import { Section, TrainingHero } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/training";
import { site } from "@/data/site";
import { ApiError, publicApi } from "@/lib/api";

const searchSchema = z.object({
  order_id: z.string().min(1),
});

export const Route = createFileRoute("/payment-return")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: `Payment status | ${site.name}` }] }),
  component: PaymentReturn,
});

function PaymentReturn() {
  const { order_id } = Route.useSearch();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["payment-order", order_id],
    queryFn: () => publicApi.order(order_id),
    retry: 1,
    refetchInterval: (query) =>
      query.state.data?.status === "success" || query.state.data?.status?.toLowerCase() === "failed"
        ? false
        : 5000,
  });

  const status = data?.status?.toLowerCase();

  return (
    <>
      <TrainingHero
        eyebrow="Payment status"
        title={
          isLoading
            ? "Checking your payment…"
            : status === "success"
              ? "Payment successful."
              : status === "failed" || status === "cancelled"
                ? "Payment was not completed."
                : "Payment pending confirmation."
        }
        description={
          isLoading
            ? "Please wait while we confirm your payment with the payment provider."
            : "Your enrolment status is shown below. A receipt is sent by email."
        }
      />
      <Section>
        <div className="surface-panel mx-auto max-w-2xl rounded-2xl p-8">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-10 text-muted-foreground">
              <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
              Checking payment status…
            </div>
          ) : isError ? (
            <div className="py-6 text-center">
              <XCircle className="mx-auto h-10 w-10 text-destructive" />
              <h2 className="mt-5 text-xl font-semibold">Could not load your payment status</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {error instanceof ApiError ? error.detail ?? error.message : "Please try again."}
              </p>
              <Button variant="hero" className="mt-6" onClick={() => refetch()}>
                Check again
              </Button>
            </div>
          ) : data ? (
            <OrderStatus order={data} />
          ) : null}
        </div>
      </Section>
    </>
  );
}

function OrderStatus({ order }: { order: import("@/lib/api").PaymentOrder }) {
  const course = courses.find((item) => item.slug === order.course_slug);
  const status = order.status.toLowerCase();
  const success = status === "success";
  const failed = status === "failed" || status === "cancelled";

  return (
    <div>
      {success ? (
        <CheckCircle2 className="h-10 w-10 text-primary" />
      ) : failed ? (
        <XCircle className="h-10 w-10 text-destructive" />
      ) : (
        <Clock3 className="h-10 w-10 text-primary" />
      )}
      <h2 className="mt-6 text-2xl font-semibold">{course?.title ?? order.course_slug}</h2>
      <p className="mt-2 text-sm text-muted-foreground">Order ID: {order.order_id}</p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">Customer</dt>
          <dd className="mt-1 font-semibold">{order.customer_name}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Email</dt>
          <dd className="mt-1 font-semibold break-all">{order.customer_email}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Amount</dt>
          <dd className="mt-1 font-semibold">₹{Number(order.amount).toLocaleString("en-IN")}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Status</dt>
          <dd className="mt-1 font-semibold capitalize">{order.status}</dd>
        </div>
      </dl>

      <div className="mt-8">
        {success ? (
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            Your enrolment is active. Your batch coordinator will email the class link before the
            first session. You can also track it from the learner dashboard.
          </div>
        ) : failed ? (
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            No charge was made for this order. You can try again with another payment method or ask
            an advisor for help.
          </div>
        ) : (
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            We are waiting for confirmation from the payment provider. This page refreshes
            automatically until the payment is confirmed.
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          {success ? (
            <Button asChild variant="hero">
              <Link to="/student-dashboard">
                Go to learner dashboard <ArrowRight />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="hero">
              <Link to="/live-batches">Browse batches</Link>
            </Button>
          )}
          <Button asChild variant="subtle">
            <Link to="/contact" search={{ source: `payment:${order.order_id}` }}>
              Get help with this order
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}