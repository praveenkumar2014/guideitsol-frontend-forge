import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { courses } from "@/data/training";

const enquirySchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(8, "Please enter a valid phone number."),
  course_slug: z.string().optional(),
  batch_id: z.string().optional(),
  message: z.string().min(10, "Please share a brief note or questions you have."),
});

type EnquiryValues = z.infer<typeof enquirySchema>;

interface EnquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCourseSlug?: string;
  defaultBatchId?: string;
  title?: string;
  description?: string;
}

export function EnquiryDialog({
  open,
  onOpenChange,
  defaultCourseSlug = "",
  defaultBatchId = "",
  title = "Talk to a Career Advisor",
  description = "Get syllabus details, fee structure, batch schedules and personalized guidance.",
}: EnquiryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      course_slug: defaultCourseSlug,
      batch_id: defaultBatchId,
      message: defaultBatchId
        ? `I am interested in batch ${defaultBatchId}. Please share enrolment steps.`
        : defaultCourseSlug
          ? `I would like more information about the ${defaultCourseSlug} program.`
          : "I would like guidance on choosing the right tech course for my background.",
    },
  });

  const onSubmit = async (values: EnquiryValues) => {
    setIsSubmitting(true);
    try {
      const res = await api.submitLead({
        name: values.name,
        email: values.email,
        phone: values.phone,
        course_slug: values.course_slug || defaultCourseSlug || undefined,
        batch_id: values.batch_id || defaultBatchId || undefined,
        source: "enquiry_modal",
        message: values.message,
      });
      setSubmittedLeadId(res.id);
      setIsSubmitted(true);
      toast.success("Enquiry received! An advisor will reach out shortly.");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit enquiry. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      setIsSubmitted(false);
      setSubmittedLeadId(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[540px]">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>GUIDESOFT Advisory</span>
              </div>
              <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2" noValidate>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register("name")}
                  placeholder="e.g. Priya Sharma"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone / WhatsApp <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register("phone")}
                    placeholder="+91 9876543210"
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Target Course
                </label>
                <select
                  {...register("course_slug")}
                  defaultValue={defaultCourseSlug}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">General Consultation (Help me choose)</option>
                  {courses.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.title} ({c.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Questions / Requirements <span className="text-destructive">*</span>
                </label>
                <Textarea
                  {...register("message")}
                  placeholder="Tell us your background (e.g. beginner, working professional), preferred timings, or specific questions..."
                  rows={3}
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">{errors.message.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="subtle"
                  onClick={() => handleClose(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="hero" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Enquiry"
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <DialogTitle className="mt-4 text-2xl font-bold">Enquiry Registered</DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              Thank you for reaching out to GUIDESOFT. A senior academic advisor has been assigned
              to your request.
            </DialogDescription>
            {submittedLeadId && (
              <p className="mt-3 text-xs font-mono text-muted-foreground bg-muted p-2 rounded">
                Reference ID: {submittedLeadId}
              </p>
            )}
            <div className="mt-6 border-t border-border pt-4 text-left text-xs text-muted-foreground space-y-1.5">
              <p>✓ Confirmation email dispatched to your inbox.</p>
              <p>✓ Our counsellor will call or WhatsApp within 1 business day.</p>
              <p>✓ Free curriculum roadmap & trial access included.</p>
            </div>
            <Button className="mt-6 w-full" variant="hero" onClick={() => handleClose(false)}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
