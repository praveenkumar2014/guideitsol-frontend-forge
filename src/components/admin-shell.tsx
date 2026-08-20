import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Receipt,
  Users,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { isAdminAuthenticated, logoutAdmin } from "@/lib/admin.server";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Leads", to: "/admin/leads", icon: Users },
  { label: "Orders", to: "/admin/orders", icon: Receipt },
  { label: "Batches", to: "/admin/batches", icon: CalendarDays },
  { label: "Certificates", to: "/admin/certificates", icon: BadgeCheck },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const auth = useQuery({
    queryKey: ["admin-auth"],
    queryFn: () => isAdminAuthenticated({ data: {} }),
  });

  useEffect(() => {
    if (auth.isFetched && !auth.data) {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [auth.isFetched, auth.data, navigate]);

  const handleLogout = async () => {
    await logoutAdmin({ data: {} });
    toast.success("Signed out of admin.");
    navigate({ to: "/admin/login", replace: true });
  };

  if (auth.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        Checking admin session…
      </div>
    );
  }

  if (!auth.data) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">GUIDESOFT Admin</p>
          <h1 className="mt-2 text-3xl font-semibold">Operations console</h1>
        </div>
        <Button variant="subtle" onClick={handleLogout}>
          <LogOut />
          Sign out
        </Button>
      </div>
      <nav aria-label="Admin" className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {items.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              // active styling is handled by activeProps below
            )}
            activeProps={{ className: "bg-accent text-foreground" }}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">{children}</div>
    </div>
  );
}