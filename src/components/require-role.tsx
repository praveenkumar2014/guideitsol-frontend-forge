import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { KeyRound, Lock, ShieldAlert, ShieldCheck } from "lucide-react";

import { AuthModal } from "@/components/auth-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  hasLegacyAdminSession,
  hasPermission,
  hasRole,
  ROLE_PERMISSIONS,
  useAuth,
  useLegacyAdminSession,
  type UserRole,
} from "@/lib/auth";

interface RequireRoleProps {
  children: ReactNode;
  /** Roles allowed to view the wrapped content. */
  roles: UserRole[];
  /** Optional fine-grained permission required in addition to the role. */
  permission?: string;
  /** Also honour the legacy shared-key admin session (used by /admin). */
  allowAdminKeySession?: boolean;
  title?: string;
  description?: string;
}

export function RoleBadge({ role }: { role: UserRole }) {
  const label = role.charAt(0).toUpperCase() + role.slice(1);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
      <ShieldCheck className="h-3 w-3" /> {label}
    </span>
  );
}

function AccessDeniedPanel({
  title,
  description,
  roles,
  onSignIn,
}: {
  title: string;
  description: string;
  roles: UserRole[];
  onSignIn: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="surface-panel w-full max-w-lg rounded-3xl border border-border p-8 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {roles.map((role) => (
            <RoleBadge key={role} role={role} />
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Permissions granted to this area:{" "}
          {(ROLE_PERMISSIONS[roles[0]] ?? []).slice(0, 4).join(", ")}…
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="hero" onClick={onSignIn}>
            <KeyRound className="mr-2 h-4 w-4" /> Sign in
          </Button>
          <Button asChild variant="subtle">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function WrongRolePanel({
  userRole,
  roles,
  onSignIn,
}: {
  userRole: UserRole;
  roles: UserRole[];
  onSignIn: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="surface-panel w-full max-w-lg rounded-3xl border border-border p-8 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
          This area needs a different role
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You are signed in as <RoleBadge role={userRole} />. This surface is limited to{" "}
          {roles.join(", ")} accounts.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="hero" onClick={onSignIn}>
            Switch account
          </Button>
          <Button asChild variant="subtle">
            <Link to="/student-dashboard">Go to my dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Legacy shared-key gate for the admin console (Cloud logins optional). */
function AdminKeyGate({ onUnlock }: { onUnlock: (key: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-surface/30 px-4 py-16">
      <div className="surface-panel w-full max-w-md rounded-3xl border border-border p-8 shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div className="mt-5 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Sign in with your administrator role, or use the service key for local operations.
          </p>
        </div>
        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onUnlock(value.trim());
          }}
        >
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Enter secret key..."
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="hero" className="w-full" size="lg">
            Unlock Console
          </Button>
        </form>
      </div>
    </div>
  );
}

/**
 * Universal route guard. Enforces the role/permission matrix on the client and
 * (through the API's own RoleChecker dependencies) on the server.
 */
export function RequireRole({
  children,
  roles,
  permission,
  allowAdminKeySession = false,
  title = "Sign in to continue",
  description = "This area is protected. Sign in with an account that has the required role.",
}: RequireRoleProps) {
  const { user, isAuthenticated } = useAuth();
  const hasKeySession = useLegacyAdminSession();
  const [authOpen, setAuthOpen] = useState(false);

  if (allowAdminKeySession && hasKeySession && !isAuthenticated) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    if (allowAdminKeySession) {
      return (
        <AdminKeyGate
          onUnlock={() => {
            // The key itself is validated against the API by the admin console.
            window.location.reload();
          }}
        />
      );
    }
    return (
      <>
        <AccessDeniedPanel
          title={title}
          description={description}
          roles={roles}
          onSignIn={() => setAuthOpen(true)}
        />
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      </>
    );
  }

  const roleOk = hasRole(user, roles);
  const permissionOk = !permission || hasPermission(user, permission);

  if (!roleOk || !permissionOk) {
    return (
      <>
        <WrongRolePanel userRole={user!.role} roles={roles} onSignIn={() => setAuthOpen(true)} />
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      </>
    );
  }

  return <>{children}</>;
}

export { hasLegacyAdminSession };
