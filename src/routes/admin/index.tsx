import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, Receipt, TrendingUp, Users } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { adminGetStats } from "@/lib/admin.server";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: `Admin dashboard | ${site.name}` }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminGetStats({ data: {} }),
  });

  return (
    <AdminShell>
      {stats.isLoading ? (
        <div className="text-muted-foreground">Loading dashboard…</div>
      ) : stats.isError ? (
        <div className="surface-panel rounded-2xl p-8 text-center text-muted-foreground">
          Could not load dashboard statistics.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total leads",
                value: stats.data?.total_leads ?? 0,
                icon: Users,
                to: "/admin/leads",
              },
              {
                label: "Total orders",
                value: stats.data?.total_orders ?? 0,
                icon: Receipt,
                to: "/admin/orders",
              },
              {
                label: "Paid revenue",
                value: `₹${(stats.data?.paid_revenue ?? 0).toLocaleString("en-IN")}`,
                icon: IndianRupee,
                to: "/admin/orders",
              },
              {
                label: "Open leads",
                value: (stats.data?.leads_by_status ?? {})["new"] ?? 0,
                icon: TrendingUp,
                to: "/admin/leads",
              },
            ].map(({ label, value, icon: Icon, to }) => (
              <Link key={label} to={to} className="surface-panel rounded-2xl p-5">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-5 text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
              </Link>
            ))}
          </div>

          {stats.data?.top_courses?.length ? (
            <div className="surface-panel mt-8 rounded-2xl p-6">
              <h2 className="text-lg font-semibold">Most enquired courses</h2>
              <div className="mt-5 space-y-3">
                {stats.data.top_courses.map((course, index) => (
                  <div key={course.course_slug} className="flex items-center gap-4">
                    <span className="w-6 text-sm font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">{course.course_slug.replace(/-/g, " ")}</p>
                    </div>
                    <span className="rounded-full border border-primary/50 px-3 py-1 text-xs font-semibold text-primary">
                      {course.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="surface-panel mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
            <div>
              <h2 className="text-lg font-semibold">Shortcuts</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Process leads, review orders, manage batches and issue certificates.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="subtle">
                <Link to="/admin/leads">Manage leads</Link>
              </Button>
              <Button asChild variant="subtle">
                <Link to="/admin/certificates">Issue certificates</Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}