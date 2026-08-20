import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, LogOut, Mail, UserRound } from "lucide-react";
import { useState } from "react";

import { Section, SectionHeading } from "@/components/training-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { site } from "@/data/site";
import { useAuth } from "@/lib/auth";
import { signOut } from "@/lib/supabase";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: `My account | ${site.name}` }] }),
  component: Account,
});

function Account() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Section>
        <div className="surface-panel mx-auto max-w-md rounded-2xl p-8 text-center text-muted-foreground">
          Loading your account…
        </div>
      </Section>
    );
  }

  if (!user) {
    return <SignedOut />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <>
      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold text-primary">My account</p>
          <h1 className="mt-3 text-3xl font-semibold">Welcome, {displayName(user)}.</h1>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="surface-panel rounded-2xl p-6">
              <UserRound className="h-5 w-5 text-primary" />
              <p className="mt-4 text-xs text-muted-foreground">Name</p>
              <p className="mt-1 font-semibold">{displayName(user)}</p>
            </div>
            <div className="surface-panel rounded-2xl p-6">
              <Mail className="h-5 w-5 text-primary" />
              <p className="mt-4 text-xs text-muted-foreground">Email</p>
              <p className="mt-1 font-semibold break-all">{user.email}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="hero">
              <Link to="/student-dashboard">
                Open learner dashboard <ArrowRight />
              </Link>
            </Button>
            <Button variant="subtle" onClick={handleSignOut}>
              <LogOut />
              Sign out
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

function displayName(user: { email?: string; user_metadata?: Record<string, unknown> }): string {
  const metaName = user.user_metadata?.["name"];
  if (typeof metaName === "string" && metaName.trim()) return metaName;
  if (user.email) return user.email.split("@")[0] ?? "Learner";
  return "Learner";
}

function SignedOut() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestReset = async () => {
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    try {
      const { sendPasswordReset } = await import("@/lib/supabase");
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send a reset link.");
    }
  };

  return (
    <Section>
      <div className="mx-auto max-w-md">
        <SectionHeading
          eyebrow="My account"
          title={sent ? "Check your inbox." : "Sign in to manage your account."}
          description={
            sent
              ? `We sent a password reset link to ${email}.`
              : "Sign in to view your courses, progress and enrolment details."
          }
        />
        {!sent ? (
          <div className="surface-panel mt-8 rounded-2xl p-6">
            <label className="text-sm font-medium" htmlFor="reset-email">
              Email
            </label>
            <Input
              id="reset-email"
              type="email"
              className="mt-2"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
            {error ? (
              <p className="mt-3 text-sm text-destructive">{error}</p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="hero" onClick={requestReset}>
                Send reset link
              </Button>
              <Button asChild variant="subtle">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero">
              <Link to="/login">Back to sign in</Link>
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
}