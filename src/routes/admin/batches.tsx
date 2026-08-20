import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
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
import { courses } from "@/data/training";
import { site } from "@/data/site";
import { adminListBatches, adminUpdateBatch } from "@/lib/admin.server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/batches")({
  head: () => ({ meta: [{ title: `Batches | ${site.name} Admin` }] }),
  component: AdminBatches,
});

function AdminBatches() {
  const queryClient = useQueryClient();
  const batches = useQuery({
    queryKey: ["admin-batches"],
    queryFn: () => adminListBatches({ data: {} }),
  });

  const updateBatch = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, string | number> }) =>
      adminUpdateBatch({ data: { id, body } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-batches"] });
      toast.success("Batch updated.");
    },
    onError: () => toast.error("Could not update batch."),
  });

  const items = batches.data ?? [];

  return (
    <AdminShell>
      <div>
        <h2 className="text-xl font-semibold">Batches</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust seat availability and batch status. Course and schedule are managed in the
          catalogue.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {batches.isLoading ? (
          <div className="surface-panel flex items-center justify-center gap-3 rounded-2xl p-16 text-muted-foreground lg:col-span-2">
            <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
            Loading batches…
          </div>
        ) : items.length === 0 ? (
          <div className="surface-panel rounded-2xl p-16 text-center text-muted-foreground lg:col-span-2">
            No batches found.
          </div>
        ) : (
          items.map((batch) => {
            const course = courses.find((item) => item.slug === batch.course_slug);
            return (
              <BatchCard
                key={batch.id}
                batch={batch}
                courseTitle={course?.title ?? batch.course_slug}
                busy={updateBatch.isPending}
                onUpdate={(body) => updateBatch.mutate({ id: batch.id, body })}
              />
            );
          })
        )}
      </div>
    </AdminShell>
  );
}

function BatchCard({
  batch,
  courseTitle,
  busy,
  onUpdate,
}: {
  batch: import("@/lib/api").BackendBatch;
  courseTitle: string;
  busy: boolean;
  onUpdate: (body: Record<string, string | number>) => void;
}) {
  const [seats, setSeats] = useState(String(batch["seats"]));
  const [available, setAvailable] = useState(String(batch["available"]));

  return (
    <article className="surface-panel rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Batch {batch.id}
          </p>
          <h3 className="mt-2 text-lg font-semibold">{courseTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{batch.name}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            batch.status === "active"
              ? "border border-primary/50 text-primary"
              : "border border-muted-foreground/50 text-muted-foreground",
          )}
        >
          {batch.status}
        </span>
      </div>
      <dl className="mt-5 grid gap-3 border-t border-border pt-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">Starts</dt>
          <dd className="mt-1 font-medium">{batch.start_date}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Schedule</dt>
          <dd className="mt-1 font-medium">
            {batch.days} · {batch.time}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Instructor</dt>
          <dd className="mt-1 font-medium">{batch.instructor}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Price</dt>
          <dd className="mt-1 font-medium">₹{batch.price.toLocaleString("en-IN")}</dd>
        </div>
      </dl>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className="space-y-1.5 text-xs text-muted-foreground">
          Seats
          <Input
            className="h-9"
            type="number"
            min={0}
            value={seats}
            onChange={(event) => setSeats(event.target.value)}
          />
        </label>
        <label className="space-y-1.5 text-xs text-muted-foreground">
          Available
          <Input
            className="h-9"
            type="number"
            min={0}
            value={available}
            onChange={(event) => setAvailable(event.target.value)}
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Select
          value={batch.status}
          onValueChange={(value) => onUpdate({ status: value })}
        >
          <SelectTrigger className="h-9 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["active", "upcoming", "completed", "cancelled"].map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="subtle"
          size="sm"
          disabled={busy}
          onClick={() => {
            const body: Record<string, string | number> = {};
            const seatsNum = Number(seats);
            const availableNum = Number(available);
            if (!Number.isFinite(seatsNum) || !Number.isFinite(availableNum)) {
              toast.error("Seat values must be numbers.");
              return;
            }
            body["seats"] = seatsNum;
            body["available"] = availableNum;
            onUpdate(body);
          }}
        >
          Save seats
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link to="/live-batches">View on site</Link>
        </Button>
      </div>
    </article>
  );
}