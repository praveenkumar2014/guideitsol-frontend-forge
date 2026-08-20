import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { PageHero, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { site } from "@/data/site";
import { signIn } from "@/lib/supabase";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: `Sign in | ${site.name}` }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Please check your details.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      navigate({ to: search.redirect ?? "/student-dashboard", replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? "Invalid email or password. Please try again." : "Unable to sign in.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Learner sign in"
        title="Welcome back."
        description="Sign in to continue your courses, assignments and progress."
      />
      <Section>
        <form
          onSubmit={onSubmit}
          noValidate
          className="surface-panel mx-auto max-w-md rounded-2xl p-6 sm:p-8"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="login-email">
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mt-5 space-y-2">
            <label className="text-sm font-medium" htmlFor="login-password">
              Password
            </label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error ? (
            <p className="mt-5 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button type="submit" variant="hero" size="xl" className="mt-6 w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            New to GUIDESOFT?{" "}
            <Link
              to="/signup"
              search={search.redirect ? { redirect: search.redirect } : {}}
              className="font-semibold text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            <Link to="/account" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </p>
        </form>
      </Section>
    </>
  );
}