import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Download,
  Loader2,
  Printer,
  QrCode,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";

import { Section, TrainingHero } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { certificates } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/verify/$certificateId")({
  head: ({ params }) => ({
    meta: [
      { title: `Certificate Verification ${params.certificateId} | ${site.name}` },
      {
        name: "description",
        content: `Official verification record for certificate ${params.certificateId}.`,
      },
    ],
  }),
  component: VerifyCertificate,
});

function VerifyCertificate() {
  const { certificateId } = Route.useParams();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<{
    id: string;
    student: string;
    course: string;
    issued: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    async function checkCert() {
      setLoading(true);
      // First check local catalogue
      const localMatch = certificates.find(
        (c) => c.id.toLowerCase() === certificateId.toLowerCase(),
      );
      if (localMatch) {
        setRecord(localMatch);
        setLoading(false);
        return;
      }

      // Then check FastAPI backend
      try {
        const apiCert = await api.verifyCertificate(certificateId);
        if (apiCert) {
          setRecord({
            id: apiCert.id,
            student: apiCert.learner_name,
            course: apiCert.course_title,
            issued: apiCert.issued_on,
            status: "Verified & Issued by GuideSoft IT Academic Council",
          });
        } else {
          setRecord(null);
        }
      } catch (err) {
        console.warn("Certificate lookup failed:", err);
        setRecord(null);
      } finally {
        setLoading(false);
      }
    }
    checkCert();
  }, [certificateId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <TrainingHero
        eyebrow="Official Credential Verification"
        title={record ? "Credential Verified." : "Certificate Record Status"}
        description={
          record
            ? `Verified academic credential issued by ${site.legalName}.`
            : "Verification inquiry results for the requested identifier."
        }
      >
        <Button asChild variant="subtle" size="sm">
          <Link to="/verify">
            <ChevronLeft className="mr-1 h-4 w-4" /> Look up another ID
          </Link>
        </Button>
      </TrainingHero>

      <Section>
        <div className="mx-auto max-w-3xl">
          {loading ? (
            <div className="surface-panel rounded-3xl p-12 text-center border border-border">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Validating record with ledger...</h3>
            </div>
          ) : record ? (
            <div className="surface-panel relative overflow-hidden rounded-3xl p-8 sm:p-12 shadow-2xl border border-primary/30 print:border-none print:shadow-none">
              {/* Top verification banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <BadgeCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-4 w-4" /> Verified Authenticity
                    </span>
                    <p className="font-mono text-sm font-semibold text-foreground">{record.id}</p>
                  </div>
                </div>

                <div className="flex gap-2 print:hidden">
                  <Button variant="subtle" size="sm" onClick={handlePrint}>
                    <Printer className="mr-1.5 h-4 w-4" /> Print / PDF
                  </Button>
                </div>
              </div>

              {/* Certificate content view */}
              <div className="mt-8 text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Certificate of Completion & Professional Mastery
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl text-foreground">
                  {record.course}
                </h2>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 rounded-2xl bg-muted/40 p-6 border border-border">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">
                      Recipient Learner
                    </span>
                    <p className="mt-1 text-lg font-bold text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" /> {record.student}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">
                      Issue Date
                    </span>
                    <p className="mt-1 text-base font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" /> {record.issued}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">
                      Issuing Authority
                    </span>
                    <p className="mt-1 text-sm font-semibold text-foreground">{site.legalName}</p>
                    <p className="text-xs text-muted-foreground">{site.domain}</p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">
                      Credential Status
                    </span>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="h-3.5 w-3.5" /> ACTIVE & REGISTERED
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
                  <p>
                    This document certifies that the candidate has satisfactorily completed all
                    required lectures, coding assignments, lab examinations, and capstone project
                    requirements.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="surface-panel rounded-3xl p-10 text-center border border-border shadow-lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <XCircle className="h-10 w-10" />
              </div>
              <h2 className="mt-5 text-2xl font-bold">No Certificate Found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We could not find any active certificate record registered under identifier{" "}
                <code className="font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                  {certificateId}
                </code>
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Please verify that the certificate ID was entered accurately or contact our
                verification office at {site.email}.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Button asChild variant="hero">
                  <Link to="/verify">Try Another ID</Link>
                </Button>
                <Button asChild variant="subtle">
                  <Link to="/contact">Contact Academic Support</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
