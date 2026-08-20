import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CreditCard, Loader2, Lock, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Batch } from "@/data/training";
import { api } from "@/lib/api";

const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Please enter your full name."),
  customer_email: z.string().email("Please enter a valid email address."),
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

  const onSubmit = async (values: CheckoutValues) => {
    if (!batch) return;
    setIsProcessing(true);
    try {
      const order = await api.createPaymentOrder({
        batch_id: batch.id,
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_phone: values.customer_phone,
      });

      toast.success(`Payment order created! Amount: ₹${order.amount}`, {
        description: `Order ID: ${order.order_id}`,
      });

      onOpenChange(false);
      reset();
      navigate({
        to: "/payment-return",
        search: { order_id: order.order_id, status: "PENDING" },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment initiation failed";
      toast.error(msg);
      toast.info("You can also pay via bank transfer. Contact info@guideitsol.in", {
        duration: 8000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  if (!batch) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-border/80 bg-background/95 p-6 backdrop-blur-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary text-xs"
            >
              Live Checkout
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-emerald-500" /> Secure Payment
            </span>
          </div>

          <DialogTitle className="mt-4 font-display text-2xl font-bold text-foreground">
            Enrollment Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2 border-b border-border/50 pb-4">
            <span className="block font-semibold text-foreground mb-1">{courseTitle}</span>
            {batch.mode} Cohort starts {batch.start}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center bg-surface/50 p-4 rounded-xl mb-6 border border-border/50">
            <span className="text-sm text-muted-foreground">Total Fee</span>
            <span className="font-display text-2xl font-bold text-foreground">{batch.price}</span>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="customer_name" className="text-xs font-semibold text-foreground">
                Student Name
              </label>
              <Input
                id="customer_name"
                placeholder="John Doe"
                {...register("customer_name")}
                className="bg-surface/50 focus-visible:ring-primary"
              />
              {errors.customer_name && (
                <p className="text-[10px] text-destructive">{errors.customer_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="customer_email" className="text-xs font-semibold text-foreground">
                Email Address
              </label>
              <Input
                id="customer_email"
                type="email"
                placeholder="you@example.com"
                {...register("customer_email")}
                className="bg-surface/50 focus-visible:ring-primary"
              />
              {errors.customer_email && (
                <p className="text-[10px] text-destructive">{errors.customer_email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="customer_phone" className="text-xs font-semibold text-foreground">
                WhatsApp Number
              </label>
              <Input
                id="customer_phone"
                type="tel"
                placeholder="+91 98765 43210"
                {...register("customer_phone")}
                className="bg-surface/50 focus-visible:ring-primary"
              />
              {errors.customer_phone && (
                <p className="text-[10px] text-destructive">{errors.customer_phone.message}</p>
              )}
            </div>
          </form>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            form="checkout-form"
            className="w-full h-12 text-sm font-bold shadow-elevated rounded-xl"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing Payment...
              </>
            ) : (
              <>
                Pay securely <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <div className="mt-4 flex items-center justify-center gap-4 text-muted-foreground opacity-60">
            <CreditCard className="h-5 w-5" />
            <Zap className="h-5 w-5" />
            <Smartphone className="h-5 w-5" />
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
