import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function RequireAuth({
  children,
  fallbackTo = "/student-dashboard",
}: {
  children: ReactNode;
  fallbackTo?: string;
}) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login", search: { redirect: fallbackTo }, replace: true });
    }
  }, [isLoading, user, navigate, fallbackTo]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        Checking your session…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="surface-panel max-w-md rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold">Sign in required</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            This area is part of the learner workspace. Sign in to continue.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}