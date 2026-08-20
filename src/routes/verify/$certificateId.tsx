import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, ShieldCheck } from "lucide-react";

import { Section, TrainingHero } from "@/components/training-ui";
import { certificate } from "@/data/training";
import { site } from "@/data/site";

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
  const matches = certificateId === certificate.id;
  return (
    <>
      <TrainingHero
        eyebrow="Certificate verification"
        title={matches ? "Certificate record found." : "Certificate record not found."}
        description={
          matches
            ? "This page shows the current status of a GUIDESOFT certificate record."
            : "Check the certificate ID and try again."
        }
      />
      <Section>
        <div className="surface-panel mx-auto max-w-2xl rounded-2xl p-8">
          {matches ? (
            <>
              <BadgeCheck className="h-10 w-10 text-primary" />
              <h2 className="mt-6 text-2xl font-semibold">{certificate.course}</h2>
              <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Learner</dt>
                  <dd className="mt-1 font-semibold">{certificate.student}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Certificate ID</dt>
                  <dd className="mt-1 font-semibold">{certificate.id}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Status</dt>
                  <dd className="mt-1 font-semibold">{certificate.issued}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Issuer</dt>
                  <dd className="mt-1 font-semibold">{site.legalName}</dd>
                </div>
              </dl>
              <p className="mt-8 flex gap-2 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                {certificate.status}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">
              No public certificate record matches <strong>{certificateId}</strong>.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
