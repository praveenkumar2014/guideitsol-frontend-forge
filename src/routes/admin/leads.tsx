import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Phone,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { site } from "@/data/site";
import {
  adminDeleteLead,
  adminListLeads,
  adminUpdateLead,
} from "@/lib/admin.server";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [{ title: `Leads | ${site.name} Admin` }] }),
  component: AdminLeads,
});

const LEAD_STATUSES = ["new", "contacted", "qualified", "closed_won", "closed_lost"] as const;

function AdminLeads() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  const leads = useQuery({
    queryKey: ["admin-leads", search, status, page],
    queryFn: () =>
      adminListLeads({
        data: {
          ...(search ? { search } : {}),
          ...(status !== "all" ? { lead_status: status } : {}),
          page,
          page_size: pageSize,
        },
      }),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-leads"] });

  const updateLead = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, string> }) =>
      adminUpdateLead({ data: { id, body } }),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Lead updated.");
    },
    onError: () => toast.error("Could not update lead."),
  });

  const deleteLead = useMutation({
    mutationFn: (id: string) => adminDeleteLead({ data: { id } }),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Lead deleted.");
    },
    onError: () => toast.error("Could not delete lead."),
  });

  const items = leads.data?.items ?? [];
  const total = leads.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Leads</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} enquiries from the website.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-56 pl-9"
              placeholder="Search name, email…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {LEAD_STATUSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="surface-panel mt-6 overflow-x-auto rounded-2xl">
        {leads.isLoading ? (
          <div className="flex items-center justify-center gap-3 p-16 text-muted-foreground">
            <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
            Loading leads…
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            No leads match this search. Try a different term or filter.
          </div>
        ) : (
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Lead</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Follow-up</th>
                <th className="px-5 py-3">Received</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((lead) => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  onUpdate={(body) => updateLead.mutate({ id: lead.id, body })}
                  onDelete={() => {
                    if (window.confirm(`Delete the lead from ${lead.name}?`)) {
                      deleteLead.mutate(lead.id);
                    }
                  }}
                  busy={updateLead.isPending || deleteLead.isPending}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="subtle"
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
          >
            <ChevronLeft />
            Previous
          </Button>
          <Button
            variant="subtle"
            disabled={page >= totalPages}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </AdminShell>
  );
}

function LeadRow({
  lead,
  onUpdate,
  onDelete,
  busy,
}: {
  lead: import("@/lib/api").LeadRecord;
  onUpdate: (body: Record<string, string>) => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const [notes, setNotes] = useState(lead["notes"] ?? "");
  const [counsellor, setCounsellor] = useState(lead["assigned_counsellor"] ?? "");
  const notesChanged = useMemo(() => notes !== (lead["notes"] ?? ""), [notes, lead]);
  const counsellorChanged = useMemo(
    () => counsellor !== (lead["assigned_counsellor"] ?? ""),
    [counsellor, lead],
  );

  return (
    <>
      <tr className="border-b border-border align-top last:border-0">
      <td className="px-5 py-4">
        <p className="font-semibold">{lead.name}</p>
        <p className="mt-1 break-all text-xs text-muted-foreground">{lead.email}</p>
        {lead.phone ? (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            {lead.phone}
          </p>
        ) : null}
        {lead.source ? (
          <span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            {lead.source}
          </span>
        ) : null}
      </td>
      <td className="px-5 py-4">
        <p className="font-medium capitalize">{lead.course_slug?.replace(/-/g, " ") ?? "General enquiry"}</p>
        {lead.batch_id ? (
          <p className="mt-1 text-xs text-muted-foreground">Batch {lead.batch_id}</p>
        ) : null}
      </td>
      <td className="px-5 py-4">
        <Select value={lead.status} onValueChange={(value) => onUpdate({ status: value })}>
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LEAD_STATUSES.map((item) => (
              <SelectItem key={item} value={item}>
                {item.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-5 py-4">
        <Input
          className="h-8 w-40 text-xs"
          type="date"
          value={lead.follow_up_at?.slice(0, 10) ?? ""}
          onChange={(event) => {
            if (event.target.value) onUpdate({ follow_up_at: event.target.value });
          }}
        />
      </td>
      <td className="px-5 py-4 text-xs text-muted-foreground">
        {lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-IN") : "—"}
      </td>
      <td className="px-5 py-4 text-right">
<Button variant="ghost" size="sm" onClick={onDelete} disabled={busy}>
          <Trash2 className="h-4 w-4 text-destructive" />
          <span className="sr-only">Delete</span>
        </Button>
      </td>
    </tr>
    <tr className="border-b border-border align-top last:border-0">
      <td className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Notes &amp; counsellor
      </td>
      <td colSpan={4} className="px-5 py-3">
        <div className="flex flex-col gap-2 lg:flex-row">
          <Input
            className="h-8 flex-1 text-xs"
            placeholder="Assigned counsellor"
            value={counsellor}
            onChange={(event) => setCounsellor(event.target.value)}
          />
          <textarea
            className="h-8 flex-1 min-w-0 rounded-md border border-input bg-transparent px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            rows={1}
            placeholder="Notes…"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          {(notesChanged || counsellorChanged) && !busy ? (
            <Button
              variant="subtle"
              size="sm"
              className="h-8"
              onClick={() => {
                const body: Record<string, string> = {};
                if (notesChanged) body["notes"] = notes;
                if (counsellorChanged) body["assigned_counsellor"] = counsellor;
                onUpdate(body);
              }}
            >
              Save
            </Button>
          ) : null}
        </div>
      </td>
    </tr>
  </>
);
}