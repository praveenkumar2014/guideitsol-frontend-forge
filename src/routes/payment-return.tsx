import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Hourglass,
  Loader2,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { z } from "zod";

import { Section } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { api, type OrderDetails } from "@/lib/api";
import { addLocalEnrolment } from "@/lib/lms";
import { site } from "@/data/site";

const searchSchema = z.object({
  order_id: z.string().optional(),
  status: z.string().optional(),
  ref: z.string().optional(),
});

export const Route = createFileRoute("/payment-return")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: `Payment Confirmation | ${site.name}` },
      {
        name: "description",
        content: "Payment and enrolment confirmation status for GUIDESOFT courses.",
      },
    ],
  }),
  component: PaymentReturn,
});

const PENDING_STATES = new Set([
  "pending",
  "upi_pending",
  "awaiting_verification",
  "awaiting",
  "initiated",
]);

function PaymentReturn() {
  const search = useSearch({ from: "/payment-return" });
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const pollRef = useRef<number | null>(null);

  const orderId = search.order_id;
  const searchStatus = (search.status || "").toUpperCase();

  const loadOrder = useCallback(async () => {
    if (!orderId) return null;
    try {
      const data = await api.getPaymentOrder(orderId);
      setOrderDetails(data);
      setLastChecked(new Date());
      return data;
    } catch {
      setLastChecked(new Date());
      return null;
    }
  }, [orderId]);

  useEffect(() => {
    let cancelled = false;
    async function initial() {
      await loadOrder();
      if (!cancelled) setLoading(false);
    }
    void initial();
    return () => {
      cancelled = true;
    };
  }, [loadOrder]);

  const status = (orderDetails?.status || "").toLowerCase();
  const isSuccess = status === "success" || searchStatus === "SUCCESS";

  // Verified payment unlocks the course immediately in the learner workspace.
  useEffect(() => {
    if (isSuccess && orderDetails?.course_slug) {
      addLocalEnrolment(orderDetails.course_slug);
    }
  }, [isSuccess, orderDetails?.course_slug]);
  const isFailure =
    status === "failed" || searchStatus === "FAILED" || searchStatus === "CANCELLED";
  const isPending =
    !isSuccess &&
    !isFailure &&
    (PENDING_STATES.has(status) ||
      PENDING_STATES.has(searchStatus.toLowerCase()) ||
      Boolean(searchStatus && !searchStatus.length) ||
      !orderDetails);

  // While the payment is awaiting verification, poll so the screen flips to
  // success the moment admissions verifies the credit (no page reload needed).
  useEffect(() => {
    if (!isPending || loading || !orderId) return;
    let attempts = 0;
    pollRef.current = window.setInterval(async () => {
      attempts += 1;
      const data = await loadOrder();
      if (data?.status === "success" || attempts >= 24) {
        if (pollRef.current) window.clearInterval(pollRef.current);
      }
    }, 5000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [isPending, loading, orderId, loadOrder]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await loadOrder();
    setRefreshing(false);
  };

  const reference = search.ref || orderDetails?.payment_session_id || orderId || "—";

  return (
    <div className="min-h-[70vh] bg-surface/30 py-12 sm:py-20">
      <Section>
        <div className="mx-auto max-w-2xl">
          <div className="surface-panel rounded-3xl p-8 sm:p-12 text-center shadow-lg border border-border">
            {loading ? (
              <div className="py-12">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <h2 className="mt-4 text-xl font-semibold">Verifying payment status...</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Communicating with payment gateway
                </p>
              </div>
            ) : isSuccess ? (
              <>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-primary">
                  Enrolment Confirmed
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Payment Successful!
                </h1>
                <p className="mt-3 text-base text-muted-foreground">
                  Your seat is allotted, your course modules are unlocked and your learner
                  notification is waiting in the dashboard.
                </p>

                <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-6 text-left text-sm space-y-3">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-muted-foreground">Order Reference</span>
                    <span className="font-mono font-semibold text-foreground">{orderId}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-muted-foreground">Transaction Status</span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-4 w-4" /> Paid & Verified
                    </span>
                  </div>
                  {orderDetails?.customer_email && (
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <span className="text-muted-foreground">Customer Email</span>
                      <span className="font-medium text-foreground">
                        {orderDetails.customer_email}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-muted-foreground">Receipt</span>
                    <span className="text-xs text-primary font-semibold">Sent to email inbox</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button asChild variant="hero" size="xl">
                    <Link to="/student-dashboard">
                      Go to Student Dashboard <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild variant="subtle" size="xl">
                    <Link to="/courses">Browse More Courses</Link>
                  </Button>
                </div>
              </>
            ) : isFailure ? (
              <>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <XCircle className="h-12 w-12" />
                </div>
                <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                  Payment Not Completed
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  The transaction could not be completed or was cancelled. If funds were debited,
                  they will be automatically refunded by your bank within 3–5 working days.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button asChild variant="hero" size="lg">
                    <Link to="/live-batches">Try Again</Link>
                  </Button>
                  <Button asChild variant="subtle" size="lg">
                    <Link to="/contact">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Hourglass className="h-12 w-12" />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  Awaiting Verification
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Payment verification in progress
                </h1>
                <p className="mt-3 text-base text-muted-foreground">
                  We have logged your UPI payment reference. Admissions verifies the bank credit and
                  confirms your seat — this screen updates automatically, and you will receive an
                  email receipt.
                </p>

                <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-6 text-left text-sm space-y-3">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-muted-foreground">Payment Reference</span>
                    <span className="font-mono font-semibold text-foreground">{reference}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-muted-foreground">Status</span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                      <Hourglass className="h-4 w-4" /> Awaiting bank confirmation
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium text-foreground">
                      {orderDetails?.amount
                        ? `₹${orderDetails.amount.toLocaleString("en-IN")}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-muted-foreground">Typical confirmation time</span>
                    <span className="text-xs text-primary font-semibold">Within a few hours</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={handleManualRefresh}
                    disabled={refreshing}
                  >
                    {refreshing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Check status again
                  </Button>
                  <Button asChild variant="subtle" size="xl">
                    <Link to="/contact">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Send the reference to admissions
                    </Link>
                  </Button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  {lastChecked
                    ? `Last checked ${lastChecked.toLocaleTimeString("en-IN")}. This page refreshes automatically.`
                    : "This page refreshes automatically while we verify."}
                </p>
              </>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
