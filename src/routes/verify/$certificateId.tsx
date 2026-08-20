import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, LoaderCircle, SearchX, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Section, TrainingHero } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { ApiError, publicApi } from "@/lib/api";

export const Route = createFileRoute("/verify/$certificateId")({
  head: () => ({
    meta: [
      { title: `Certificate Verification | ${site.name}` },
      { name: "description", content: "Verify a GUIDESOFT certificate record." },
    ],
  }),
  component: VerifyCertificate,
});

function VerifyCertificate() {
  const { certificateId } = Route.useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["certificate", certificateId],
    queryFn: () => publicApi.certificate(certificateId),
    retry: 1,
  });

  const notFound = isError && error instanceof ApiError && error.status === 404;

  return (
    <>
      <TrainingHero
        eyebrow="Certificate verification"
        title={isLoading ? "Checking certificate record…" : data ? "Certificate record found." : "Certificate record not found."}
        description={
          isLoading
            ? "Please wait while we look up the certificate record."
            : data
              ? "This page shows the current status of a GUIDESOFT certificate record."
              : "Check the certificate ID and try again."
        }
      />
      <Section>
        <div className="surface-panel mx-auto max-w-2xl rounded-2xl p-8">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-10 text-muted-foreground">
              <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
              Verifying certificate…
            </div>
          ) : data ? (
            <>
              <BadgeCheck className="h-10 w-10 text-primary" />
              <h2 className="mt-6 text-2xl font-semibold">{data.course_title}</h2>
              <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Learner</dt>
                  <dd className="mt-1 font-semibold">{data.learner_name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Certificate ID</dt>
                  <dd className="mt-1 font-semibold">{data.id}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Status</dt>
                  <dd className="mt-1 font-semibold capitalize">{data.status}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Issued on</dt>
                  <dd className="mt-1 font-semibold">{formatDate(data.issued_on)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Issuer</dt>
                  <dd className="mt-1 font-semibold">{site.legalName}</dd>
                </div>
              </dl>
              <p className="mt-8 flex gap-2 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                This record was issued by GUIDESOFT and can be verified publicly by this link.
              </p>
            </>
          ) : notFound ? (
            <div className="py-8 text-center">
              <SearchX className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-5 text-muted-foreground">
                No public certificate record matches{" "}
                <strong className="text-foreground">{certificateId}</strong>. Check the ID on the
                certificate and try again.
              </p>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-destructive">
                {error instanceof ApiError
                  ? error.detail ?? error.message
                  : "Unable to verify this certificate right now."}
              </p>
              <Button variant="subtle" className="mt-6" onClick={() => window.location.reload()}>
                Try again
              </Button>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}