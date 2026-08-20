import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { PageHero, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { site } from "@/data/site";
import { signUp } from "@/lib/supabase";

const signupSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirm: z.string(),
});

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/signup")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: `Create account | ${site.name}` }] }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const parsed = signupSchema.safeParse({ name, email, password, confirm });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Please check your details.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const data = await signUp(email, password, name);
      setPending(Boolean(data.session === null));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  if (pending) {
    return (
      <>
        <PageHero
          eyebrow="Check your inbox"
          title="Almost there."
          description="We sent a confirmation link to your email. Click it to activate your account, then sign in."
        />
        <Section>
          <div className="surface-panel mx-auto max-w-md rounded-2xl p-8 text-center">
            <p className="text-muted-foreground">
              Confirmation email sent to <strong className="text-foreground">{email}</strong>.
            </p>
            <Button asChild variant="hero" className="mt-6">
              <Link to="/login">Go to sign in</Link>
            </Button>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Create account"
        title="Start your learning workspace."
        description="Create an account to track progress, access your courses and manage your enrolment."
      />
      <Section>
        <form
          onSubmit={onSubmit}
          noValidate
          className="surface-panel mx-auto max-w-md rounded-2xl p-6 sm:p-8"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="signup-name">
              Full name
            </label>
            <Input
              id="signup-name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
          <div className="mt-5 space-y-2">
            <label className="text-sm font-medium" htmlFor="signup-email">
              Email
            </label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mt-5 space-y-2">
            <label className="text-sm font-medium" htmlFor="signup-password">
              Password
            </label>
            <Input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              required
            />
          </div>
          <div className="mt-5 space-y-2">
            <label className="text-sm font-medium" htmlFor="signup-confirm">
              Confirm password
            </label>
            <Input
              id="signup-confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder="Repeat your password"
              required
            />
          </div>
          {error ? (
            <p className="mt-5 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button type="submit" variant="hero" size="xl" className="mt-6 w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              search={search.redirect ? { redirect: search.redirect } : {}}
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </Section>
    </>
  );
}