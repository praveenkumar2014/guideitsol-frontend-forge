import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, LoaderCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Section } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { site } from "@/data/site";
import { loginAdmin } from "@/lib/admin.server";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: `Admin sign in | ${site.name}` }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [key, setKey] = useState("");

  const login = useMutation({
    mutationFn: (accessKey: string) => loginAdmin({ data: { key: accessKey } }),
    onSuccess: () => {
      toast.success("Welcome back, admin.");
      navigate({ to: "/admin", replace: true });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Unable to sign in.");
    },
  });

  return (
    <Section>
      <div className="mx-auto max-w-md">
        <div className="surface-panel rounded-2xl p-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Admin access</h1>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Enter the admin access key to open the GUIDESOFT operations console.
          </p>
          <form
            className="mt-6 space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (key.trim()) login.mutate(key.trim());
            }}
          >
            <label className="text-sm font-medium" htmlFor="admin-key">
              Access key
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-key"
                type="password"
                autoComplete="current-password"
                className="pl-9"
                value={key}
                onChange={(event) => setKey(event.target.value)}
                placeholder="Enter the admin access key"
              />
            </div>
            {login.isError ? (
              <p className="text-sm text-destructive">
                {login.error instanceof Error ? login.error.message : "Invalid access key."}
              </p>
            ) : null}
            <Button type="submit" variant="hero" className="w-full" disabled={login.isPending}>
              {login.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {login.isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </Section>
  );
}