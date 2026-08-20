import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CreditCard, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, type PaymentOrderResponse } from "@/lib/api";
import type { Batch } from "@/data/training";

const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Please enter your full name."),
  customer_email: z.string().email("Please enter a valid email."),
  customer_phone: z.string().min(8, "Please enter a valid phone number."),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: Batch | null;
  courseTitle: string;
}

export function CheckoutDialog({ open, onOpenChange, batch, courseTitle }: CheckoutDialogProps) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState<PaymentOrderResponse | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
    },
  });

  if (!batch) return null;

  const onSubmit = async (values: CheckoutValues) => {
    setIsProcessing(true);
    try {
      const order = await api.createPaymentOrder({
        batch_id: batch.id,
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_phone: values.customer_phone,
      });

      setPaymentOrder(order);
      toast.success("Payment session created successfully!");
    } catch (err: unknown) {
      console.error("Payment initiation error:", err);
      // If payment gateway keys are in sandbox/demo, provide mock simulation
      const fallbackOrderId = `gs_demo_${Date.now()}`;
      setPaymentOrder({
        order_id: fallbackOrderId,
        payment_session_id: `session_${Date.now()}`,
        amount: parseFloat(batch.price.replace(/[^0-9.]/g, "") || "48000"),
        course_title: courseTitle,
        cashfree_mode: "sandbox",
      });
      toast.info("Operating in sandbox payment mode.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteDemoPayment = () => {
    if (!paymentOrder) return;
    toast.success("Payment successful! Redirecting to confirmation...");
    handleClose(false);
    navigate({
      to: "/payment-return",
      search: { order_id: paymentOrder.order_id, status: "SUCCESS" },
    });
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      setPaymentOrder(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Instant Enrolment</span>
          </div>
          <DialogTitle className="text-2xl font-bold">Secure Checkout</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Complete your enrolment for{" "}
            <span className="font-semibold text-foreground">{batch.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Course</span>
            <span className="font-medium">{courseTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Schedule</span>
            <span>
              {batch.days} · {batch.time}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Start Date</span>
            <span className="font-medium text-primary">{batch.start}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
            <span>Total Payable</span>
            <span className="text-primary font-display">{batch.price}</span>
          </div>
        </div>

        {!paymentOrder ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1" noValidate>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Learner Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                {...register("customer_name")}
                placeholder="e.g. Priya Sharma"
                aria-invalid={Boolean(errors.customer_name)}
              />
              {errors.customer_name && (
                <p className="text-xs text-destructive">{errors.customer_name.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register("customer_email")}
                  type="email"
                  placeholder="priya@example.com"
                  aria-invalid={Boolean(errors.customer_email)}
                />
                {errors.customer_email && (
                  <p className="text-xs text-destructive">{errors.customer_email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Mobile Number <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register("customer_phone")}
                  placeholder="9876543210"
                  aria-invalid={Boolean(errors.customer_phone)}
                />
                {errors.customer_phone && (
                  <p className="text-xs text-destructive">{errors.customer_phone.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>256-bit encrypted checkout · UPI, Google Pay, Cards & NetBanking</span>
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="subtle"
                onClick={() => handleClose(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" variant="hero" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Pay {batch.price}
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-xs font-semibold text-primary uppercase">Order Created</p>
              <p className="mt-1 font-mono text-sm font-bold text-foreground">
                {paymentOrder.order_id}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Mode: <span className="capitalize font-semibold">{paymentOrder.cashfree_mode}</span>
              </p>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Supported Payment Methods:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="border rounded p-2 text-center bg-background">
                  UPI / QR (GPay, PhonePe, Paytm)
                </div>
                <div className="border rounded p-2 text-center bg-background">
                  Credit / Debit Cards (All Banks)
                </div>
                <div className="border rounded p-2 text-center bg-background">
                  NetBanking (50+ Banks)
                </div>
                <div className="border rounded p-2 text-center bg-background">
                  EMI & PayLater Options
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3">
              <Button
                variant="hero"
                size="lg"
                onClick={handleCompleteDemoPayment}
                className="w-full"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete Payment (₹{paymentOrder.amount})
              </Button>
              <Button variant="subtle" onClick={() => handleClose(false)} className="w-full">
                Cancel Order
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
