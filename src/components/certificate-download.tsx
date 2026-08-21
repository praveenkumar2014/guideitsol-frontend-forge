import { useRef, useState } from "react";
import { Download, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CertificateDownloadProps {
  learnerName: string;
  courseTitle: string;
  issuedDate: string;
  certificateId: string;
  instructorName?: string;
}

export function CertificateDownload({
  learnerName,
  courseTitle,
  issuedDate,
  certificateId,
  instructorName = "GUIDESOFT Faculty",
}: CertificateDownloadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCertificate = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsGenerating(true);

    try {
      const ctx = canvas.getContext("2d")!;
      const W = 1122;
      const H = 794;
      canvas.width = W;
      canvas.height = H;

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, "#0f172a");
      bgGrad.addColorStop(1, "#1e293b");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Gold border
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, W - 60, H - 60);
      ctx.strokeStyle = "#f59e0b40";
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, W - 80, H - 80);

      // Corner decorations
      const corners = [
        [50, 50],
        [W - 50, 50],
        [50, H - 50],
        [W - 50, H - 50],
      ];
      corners.forEach(([x, y]) => {
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // GUIDESOFT branding
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("GUIDESOFT", W / 2, 100);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "13px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText("Learn real technology. Build real skills.", W / 2, 125);

      // Decorative line
      const lineGrad = ctx.createLinearGradient(W / 2 - 120, 0, W / 2 + 120, 0);
      lineGrad.addColorStop(0, "transparent");
      lineGrad.addColorStop(0.5, "#f59e0b");
      lineGrad.addColorStop(1, "transparent");
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 120, 145);
      ctx.lineTo(W / 2 + 120, 145);
      ctx.stroke();

      // Award icon circle
      ctx.fillStyle = "#f59e0b20";
      ctx.beginPath();
      ctx.arc(W / 2, 195, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f59e0b";
      ctx.font = "30px serif";
      ctx.fillText("★", W / 2, 205);

      // Certificate title
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText("Certificate of Completion", W / 2, 260);

      // "This is to certify that"
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText("This is to certify that", W / 2, 300);

      // Learner name
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px -apple-system, BlinkMacSystemFont, serif";
      const displayName = learnerName.length > 30 ? learnerName.slice(0, 28) + "…" : learnerName;
      ctx.fillText(displayName, W / 2, 355);

      // Underline for name
      const nameWidth = ctx.measureText(displayName).width;
      const nameGrad = ctx.createLinearGradient(W / 2 - nameWidth / 2, 0, W / 2 + nameWidth / 2, 0);
      nameGrad.addColorStop(0, "transparent");
      nameGrad.addColorStop(0.2, "#06b6d4");
      nameGrad.addColorStop(0.8, "#06b6d4");
      nameGrad.addColorStop(1, "transparent");
      ctx.strokeStyle = nameGrad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(W / 2 - nameWidth / 2, 365);
      ctx.lineTo(W / 2 + nameWidth / 2, 365);
      ctx.stroke();

      // "has successfully completed"
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText("has successfully completed the course", W / 2, 400);

      // Course title
      ctx.fillStyle = "#22d3ee";
      ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
      const displayCourse = courseTitle.length > 50 ? courseTitle.slice(0, 48) + "…" : courseTitle;
      ctx.fillText(displayCourse, W / 2, 440);

      // Date
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(`Issued on ${issuedDate}`, W / 2, 490);

      // Instructor
      ctx.fillStyle = "#64748b";
      ctx.font = "13px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(`Instructor: ${instructorName}`, W / 2, 520);

      // Certificate ID
      ctx.fillStyle = "#475569";
      ctx.font = "11px monospace";
      ctx.fillText(`ID: ${certificateId}`, W / 2, 560);

      // Footer line
      const footGrad = ctx.createLinearGradient(W / 2 - 100, 0, W / 2 + 100, 0);
      footGrad.addColorStop(0, "transparent");
      footGrad.addColorStop(0.5, "#334155");
      footGrad.addColorStop(1, "transparent");
      ctx.strokeStyle = footGrad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 100, 580);
      ctx.lineTo(W / 2 + 100, 580);
      ctx.stroke();

      // Verification footer
      ctx.fillStyle = "#475569";
      ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText("Verify this certificate at guideitsol.in/verify", W / 2, 610);
      ctx.fillText("This certificate is issued by GuideSoft IT Solutions", W / 2, 630);

      // Download
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png", 1.0);
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `GUIDESOFT-Certificate-${learnerName.replace(/\s+/g, "-")}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Certificate downloaded!");
    } catch (err) {
      toast.error("Failed to generate certificate");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="hidden" />
      <Button
        onClick={generateCertificate}
        disabled={isGenerating}
        variant="hero"
        className="gap-2"
      >
        {isGenerating ? (
          <>Generating...</>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download Certificate
          </>
        )}
      </Button>
    </div>
  );
}
