import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { site } from "@/data/site";
import {
  adminDeleteCertificate,
  adminIssueCertificate,
  adminListCertificates,
} from "@/lib/admin.server";

export const Route = createFileRoute("/admin/certificates")({
  head: () => ({ meta: [{ title: `Certificates | ${site.name} Admin` }] }),
  component: AdminCertificates,
});

function AdminCertificates() {
  const queryClient = useQueryClient();
  const certificates = useQuery({
    queryKey: ["admin-certificates"],
    queryFn: () => adminListCertificates({ data: {} }),
  });

  const issue = useMutation({
    mutationFn: (payload: {
      learner_name: string;
      course_title: string;
      issued_on: string;
    }) => adminIssueCertificate({ data: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      toast.success("Certificate issued.");
    },
    onError: () => toast.error("Could not issue certificate."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminDeleteCertificate({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      toast.success("Certificate deleted.");
    },
    onError: () => toast.error("Could not delete certificate."),
  });

  const items = certificates.data ?? [];

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Certificates</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Issue and revoke completion certificates. Certificates are publicly verifiable at the
            verification link.
          </p>
        </div>
      </div>

      <IssueForm
        busy={issue.isPending}
        onIssue={(values) => issue.mutate(values)}
      />

      <div className="surface-panel mt-8 overflow-x-auto rounded-2xl">
        {certificates.isLoading ? (
          <div className="flex items-center justify-center gap-3 p-16 text-muted-foreground">
            <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
            Loading certificates…
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            No certificates issued yet. Use the form above to issue the first one.
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Certificate ID</th>
                <th className="px-5 py-3">Learner</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Issued</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((certificate) => (
                <tr key={certificate.id} className="border-b border-border align-top last:border-0">
                  <td className="px-5 py-4 font-mono text-xs">{certificate.id}</td>
                  <td className="px-5 py-4 font-semibold">{certificate.learner_name}</td>
                  <td className="px-5 py-4 text-xs">{certificate.course_title}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    {certificate.issued_on}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                        certificate.status === "issued"
                          ? "border border-primary/50 text-primary"
                          : "border border-muted-foreground/50 text-muted-foreground"
                      }`}
                    >
                      {certificate.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link to="/verify/$certificateId" params={{ certificateId: certificate.id }}>
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Revoke certificate ${certificate.id} for ${certificate.learner_name}?`,
                            )
                          ) {
                            remove.mutate(certificate.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Revoke</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}

function IssueForm({
  busy,
  onIssue,
}: {
  busy: boolean;
  onIssue: (values: { learner_name: string; course_title: string; issued_on: string }) => void;
}) {
  const [learnerName, setLearnerName] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  return (
    <div className="surface-panel mt-6 rounded-2xl p-6">
      <div className="flex items-center gap-2">
        <BadgeCheck className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Issue a certificate</h3>
      </div>
      <form
        className="mt-4 grid gap-3 md:grid-cols-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!learnerName.trim() || !courseTitle.trim()) {
            toast.error("Learner name and course are required.");
            return;
          }
          onIssue({
            learner_name: learnerName.trim(),
            course_title: courseTitle.trim(),
            issued_on: new Date().toISOString().slice(0, 10),
          });
          setLearnerName("");
          setCourseTitle("");
        }}
      >
        <Input
          placeholder="Learner name"
          value={learnerName}
          onChange={(event) => setLearnerName(event.target.value)}
        />
        <Input
          placeholder="Course title"
          value={courseTitle}
          onChange={(event) => setCourseTitle(event.target.value)}
        />
        <Button type="submit" variant="hero" disabled={busy}>
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          Issue certificate
        </Button>
      </form>
    </div>
  );
}