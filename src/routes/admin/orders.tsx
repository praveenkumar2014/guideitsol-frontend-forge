import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, LoaderCircle, Search } from "lucide-react";
import { useState } from "react";

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
import { adminListOrders } from "@/lib/admin.server";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: `Orders | ${site.name} Admin` }] }),
  component: AdminOrders,
});

const ORDER_STATUSES = ["created", "paid", "failed", "cancelled"] as const;

function AdminOrders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  const orders = useQuery({
    queryKey: ["admin-orders", search, status, page],
    queryFn: () =>
      adminListOrders({
        data: {
          ...(search ? { search } : {}),
          ...(status !== "all" ? { order_status: status } : {}),
          page,
          page_size: pageSize,
        },
      }),
  });

  const items = orders.data?.items ?? [];
  const total = orders.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="mt-1 text-sm text-muted-foreground">{total} payment orders.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-56 pl-9"
              placeholder="Search order, email…"
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
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ORDER_STATUSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="surface-panel mt-6 overflow-x-auto rounded-2xl">
        {orders.isLoading ? (
          <div className="flex items-center justify-center gap-3 p-16 text-muted-foreground">
            <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
            Loading orders…
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">No orders found.</div>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((order) => (
                <tr key={order.order_id} className="border-b border-border align-top last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-mono text-xs">{order.order_id}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Batch {order.batch_id}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold">{order.customer_name}</p>
                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      {order.customer_email}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-xs capitalize">
                    {order.course_slug.replace(/-/g, " ")}
                  </td>
                  <td className="px-5 py-4">₹{Number(order.amount).toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                        order.status === "paid" || order.status === "success"
                          ? "border border-primary/50 text-primary"
                          : order.status === "failed" || order.status === "cancelled"
                            ? "border border-destructive/50 text-destructive"
                            : "border border-muted-foreground/50 text-muted-foreground"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString("en-IN")
                      : "—"}
                  </td>
                </tr>
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