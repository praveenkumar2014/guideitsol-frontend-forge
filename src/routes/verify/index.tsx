import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ShieldCheck } from "lucide-react";

import { AnimatedSection } from "@/components/animated-section";
import { Section, TrainingHero } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { certificates } from "@/data/training";
import { site } from "@/data/site";

export const Route = createFileRoute("/verify/")({
  head: () => ({
    meta: [
      { title: `Verify Certificate | ${site.name}` },
      {
        name: "description",
        content: "Verify official GUIDESOFT training and internship credentials.",
      },
    ],
  }),
  component: VerifyIndex,
});

function VerifyIndex() {
  const [certInput, setCertInput] = useState("");
  const navigate = Route.useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = certInput.trim();
    if (!cleanId) return;
    void navigate({ to: "/verify/$certificateId", params: { certificateId: cleanId } });
  };

  return (
    <>
      <TrainingHero
        eyebrow="Credential Verification"
        title="Verify GUIDESOFT Credentials & Certificates"
        description="Every certificate issued by GuideSoft IT Solutions carries a cryptographically verifiable identifier registered in our central records."
      />

      <Section>
        <AnimatedSection className="mx-auto max-w-2xl">
          <div className="surface-panel rounded-3xl p-8 sm:p-10 shadow-lg border border-border">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-center text-2xl font-bold">Certificate Lookup</h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Enter the Certificate ID located at the bottom of the digital credential.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="e.g. GS-2026-JAVA-001"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch(e);
                    }
                  }}
                  className="pl-10 h-11 text-base font-mono uppercase"
                />
              </div>
              <Button
                type="button"
                onClick={handleSearch}
                variant="hero"
                size="lg"
                className="h-11"
              >
                Verify Now
              </Button>
            </form>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sample Verified Records
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {certificates.map((c) => (
                  <Link
                    key={c.id}
                    to="/verify/$certificateId"
                    params={{ certificateId: c.id }}
                    className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {c.id} · {c.student}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </Section>
    </>
  );
}
