import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { CheckCircle2, Copy, Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const VPA = import.meta.env["VITE_UPI_VPA"] as string | undefined;
const PAYEE =
  (import.meta.env["VITE_UPI_PAYEE_NAME"] as string | undefined) ?? "GuideSoft IT Solutions";
const MC = import.meta.env["VITE_UPI_MERCHANT_CODE"] as string | undefined;

export function parseAmount(price: string): number {
  const n = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function buildUpiLink(amount: number, ref: string, note: string) {
  const p = new URLSearchParams({
    pa: VPA ?? "",
    pn: PAYEE,
    am: amount.toFixed(2),
    cu: "INR",
    tr: ref,
    tn: note.slice(0, 50),
  });
  if (MC) p.set("mc", MC);
  return `upi://pay?${p.toString()}`;
}

interface Props {
  amount: number;
  reference: string;
  note: string;
  /** Called once the learner confirms the UPI transfer is done. */
  onConfirm?: () => void | Promise<void>;
  confirmLabel?: string;
  confirming?: boolean;
  /** Set when the intent could not be stored server-side. */
  offline?: boolean;
}

export function UpiPayPanel({
  amount,
  reference,
  note,
  onConfirm,
  confirmLabel = "Verify & Confirm Payment",
  confirming = false,
  offline = false,
}: Props) {
  const link = useMemo(() => buildUpiLink(amount, reference, note), [amount, reference, note]);
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(link, { width: 240, margin: 1 })
      .then(setQr)
      .catch(() => setQr(""));
  }, [link]);

  if (!VPA) {
    return (
      <p className="text-sm text-destructive">
        UPI payments are not configured yet. Please contact admissions.
      </p>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <p className="font-display text-lg font-bold text-foreground">Scan with any UPI App to Pay</p>
      <p className="text-xs text-muted-foreground">
        GPay, PhonePe, Paytm, BHIM or any bank UPI app. Pay the exact amount below.
      </p>
      {qr && (
        <img
          src={qr}
          alt={`UPI QR code to pay ₹${amount}`}
          className="mx-auto h-56 w-56 rounded-xl bg-card p-2"
        />
      )}
      <div className="font-display text-2xl font-bold text-foreground">
        ₹{amount.toLocaleString("en-IN")}
      </div>
      <Button asChild className="h-12 w-full rounded-xl font-bold md:hidden">
        <a href={link}>
          <Smartphone className="mr-2 h-4 w-4" /> Pay with GPay / UPI app
        </a>
      </Button>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard.writeText(VPA);
          toast.success("UPI ID copied");
        }}
        className="mx-auto flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <Copy className="h-3.5 w-3.5" /> {VPA}
      </button>
      <div className="rounded-xl border border-border/70 bg-surface/50 px-4 py-3 text-left text-xs text-muted-foreground">
        <p>
          Payment reference: <span className="font-mono text-foreground">{reference}</span>
        </p>
        <p className="mt-1">
          Keep this reference handy. Admissions matches it against the bank credit before confirming
          your seat — usually within a few working hours.
        </p>
        {offline && (
          <p className="mt-2 text-amber-600 dark:text-amber-400">
            We could not reach the server to log this payment automatically. Please share the
            reference with admissions so your seat can be confirmed.
          </p>
        )}
      </div>

      {onConfirm && (
        <Button
          onClick={() => void onConfirm()}
          disabled={confirming}
          className="h-12 w-full rounded-xl font-bold"
        >
          {confirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting reference…
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" /> {confirmLabel}
            </>
          )}
        </Button>
      )}
      <p className="text-[11px] text-muted-foreground">
        UPI apps do not notify websites automatically, so a human verifies the credit before seats
        are allotted. You will get an email receipt the moment it is confirmed.
      </p>
    </div>
  );
}
