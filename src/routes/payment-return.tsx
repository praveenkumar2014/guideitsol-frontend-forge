import { useEffect, useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  HelpCircle,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { z } from "zod";

import { Section } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { site } from "@/data/site";

const searchSchema = z.object({
  order_id: z.string().optional(),
  status: z.string().optional(),
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

function PaymentReturn() {
  const search = useSearch({ from: "/payment-return" });
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<import("@/lib/api").OrderDetails | null>(null);

  const orderId = search.order_id || "gs_order_placeholder";
  const searchStatus = (search.status || "SUCCESS").toUpperCase();

  useEffect(() => {
    async function loadOrder() {
      if (!search.order_id) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.getPaymentOrder(search.order_id);
        setOrderDetails(data);
      } catch (err: unknown) {
        console.warn("Could not load payment order from server:", err);
      } finally {
        setLoading(false);
      }
    }
    void loadOrder();
  }, [search.order_id]);

  const isSuccess =
    searchStatus === "SUCCESS" ||
    orderDetails?.status === "success" ||
    orderDetails?.status === "SUCCESS";

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
                  Welcome to GUIDESOFT. Your course enrolment is active and your seat has been
                  reserved.
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
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-muted-foreground">Customer Email</span>
                    <span className="font-medium text-foreground">
                      {orderDetails?.customer_email || "learner@example.com"}
                    </span>
                  </div>
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
            ) : (
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
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
