import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Copy, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const VPA = import.meta.env["VITE_UPI_VPA"] as string | undefined;
const PAYEE = (import.meta.env["VITE_UPI_PAYEE_NAME"] as string | undefined) ?? "GuideSoft IT Solutions";
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
}

export function UpiPayPanel({ amount, reference, note }: Props) {
  const link = useMemo(() => buildUpiLink(amount, reference, note), [amount, reference, note]);
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(link, { width: 240, margin: 1 }).then(setQr).catch(() => setQr(""));
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
      <p className="text-sm text-muted-foreground">
        Scan with GPay, PhonePe, Paytm or any UPI app
      </p>
      {qr && (
        <img
          src={qr}
          alt={`UPI QR code to pay ₹${amount}`}
          className="mx-auto h-56 w-56 rounded-xl bg-card p-2"
        />
      )}
      <div className="font-display text-2xl font-bold text-foreground">₹{amount.toLocaleString("en-IN")}</div>
      <Button asChild className="h-12 w-full rounded-xl font-bold md:hidden">
        <a href={link}>
          <Smartphone className="mr-2 h-4 w-4" /> Pay with GPay / UPI app
        </a>
      </Button>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(VPA);
          toast.success("UPI ID copied");
        }}
        className="mx-auto flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <Copy className="h-3.5 w-3.5" /> {VPA}
      </button>
      <p className="text-xs text-muted-foreground">
        Reference: <span className="font-mono text-foreground">{reference}</span>. Your seat is
        confirmed once admissions verifies the payment.
      </p>
    </div>
  );
}
