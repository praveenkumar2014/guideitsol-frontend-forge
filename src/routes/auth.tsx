import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { GoogleLogoIcon } from "@/components/auth-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TEST_ACCOUNTS, useAuth, type UserRole } from "@/lib/auth";
import logoLight from "../logolight.svg?url";

export const Route = createFileRoute("/auth")({
  component: AuthPageComponent,
});

function AuthPageComponent() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginAs, loginWithCredentials, loginWithGoogle, logout } =
    useAuth();
  const [authMode, setAuthMode] = useState<"signin" | "register">("signin");
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [customPassword, setCustomPassword] = useState("");
  const [customRole, setCustomRole] = useState<UserRole>("learner");

  const handleRoleLogin = (role: UserRole) => {
    const loggedUser = loginAs(role);
    toast.success(`Welcome back, ${loggedUser.name}!`, {
      description: `Authenticated as ${loggedUser.badge} (${loggedUser.title})`,
    });
    navigate({ to: "/student-dashboard" });
  };

  const handleGoogleLogin = async () => {
    const loggedUser = await loginWithGoogle();
    toast.success(`Signed in with Google as ${loggedUser.name}!`, {
      description: `Verified Google Account linked (${loggedUser.email})`,
    });
    navigate({ to: "/student-dashboard" });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const loggedUser = loginWithCredentials(customEmail, customName, customRole);
    toast.success(
      authMode === "register"
        ? `Account created successfully for ${loggedUser.name}!`
        : `Welcome back, ${loggedUser.name}!`,
      {
        description: `Role assigned: ${customRole.toUpperCase()}`,
      },
    );
    navigate({ to: "/student-dashboard" });
  };

  const handleLogout = async () => {
    await logout();
    toast.info("You have been signed out.");
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-highlight/10 blur-[140px]" />
      </div>

      <div className="w-full max-w-5xl rounded-3xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/80 min-h-[640px]">
          {/* ============================================================ */}
          {/* LEFT SIDE: Brand Showcase, Google Auth & 1-Click Role Matrix */}
          {/* ============================================================ */}
          <div className="flex flex-col justify-between bg-surface/50 p-8 sm:p-12 space-y-8">
            <div className="space-y-6">
              <Link to="/" className="inline-block">
                <img
                  src={logoLight}
                  alt="GUIDESOFT IT Solutions"
                  className="h-10 w-auto max-w-[170px] object-contain"
                />
              </Link>

              <div>
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/10 text-primary text-xs mb-3"
                >
                  <Sparkles className="h-3 w-3 mr-1.5" /> Single Sign-On & Access Hub
                </Badge>
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Enterprise-Grade Learning Portal
                </h1>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Sign in with Google OAuth or test platform capabilities across all 4 operational
                  roles with instant preset access.
                </p>
              </div>

              {/* Google Fast Sign-In */}
              <button
                type="button"
                id="page-google-auth-btn"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border/80 bg-surface px-5 py-3.5 text-sm font-bold text-foreground shadow-sm transition-all hover:border-primary/60 hover:bg-accent hover:shadow-md"
              >
                <GoogleLogoIcon className="h-5 w-5" />
                <span>Sign In with Google</span>
                <Badge
                  variant="outline"
                  className="ml-auto text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                >
                  1-Click Fast Auth
                </Badge>
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="w-full border-t border-border/60" />
                <span className="absolute bg-surface px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Or Test Role Profiles
                </span>
              </div>

              {/* 1-Click Role Presets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(["learner", "instructor", "admin", "partner"] as UserRole[]).map((r, idx) => {
                  const account = TEST_ACCOUNTS[r];
                  const isActive = user?.role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      id={idx === 0 ? "auth-role-btn" : `auth-role-btn-${r}`}
                      onClick={() => handleRoleLogin(r)}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                        isActive
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border/70 bg-background/50 hover:border-primary/50 hover:bg-surface"
                      }`}
                    >
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="h-10 w-10 rounded-full border border-border object-cover shrink-0 mt-0.5"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-foreground truncate">
                            {account.name.split(" ")[0]}
                          </span>
                          <Badge variant="outline" className="text-[9px] uppercase px-1 py-0">
                            {r}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {account.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust Footer */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> 256-Bit SSL Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-primary" /> Role-Based Access Control
              </span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT SIDE: Credentials Form / Live Account Dashboard        */}
          {/* ============================================================ */}
          <div className="flex flex-col justify-between p-8 sm:p-12 space-y-6">
            {isAuthenticated && user ? (
              <div className="space-y-6 my-auto">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Active Platform Session
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    You are currently authenticated as an active user.
                  </p>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-16 w-16 rounded-full border-2 border-primary object-cover shadow-lg"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-foreground">{user.name}</h3>
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        {user.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs font-semibold text-primary">{user.title}</p>
                    {user.enrolledTrack && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Track: <span className="text-foreground">{user.enrolledTrack}</span> (
                        {user.progress}% complete)
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Granted Permissions
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {user.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground font-medium"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        {perm.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-border">
                  <Button asChild variant="hero" className="flex-1 gap-2">
                    <Link to="/student-dashboard">
                      <GraduationCap className="h-4 w-4" /> Open Student Workspace
                    </Link>
                  </Button>
                  <Button variant="destructive" onClick={handleLogout} className="gap-1.5">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 my-auto">
                <div className="flex rounded-xl border border-border bg-surface p-1.5">
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all ${
                      authMode === "signin"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sign In to Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("register")}
                    className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all ${
                      authMode === "register"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Create New Account
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {authMode === "register" && (
                    <div>
                      <label className="text-xs font-semibold text-foreground">
                        Full Legal Name *
                      </label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="e.g. Rahul Sharma"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          className="pl-10 text-xs py-2.5"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-foreground">Email Address *</label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="rahul@example.com"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="pl-10 text-xs py-2.5"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Password *</label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        value={customPassword}
                        onChange={(e) => setCustomPassword(e.target.value)}
                        className="pl-10 text-xs py-2.5"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Select Platform Role
                    </label>
                    <div className="mt-1.5 grid grid-cols-4 gap-2">
                      {(["learner", "instructor", "admin", "partner"] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setCustomRole(r)}
                          className={`rounded-xl border py-2 text-xs font-bold capitalize transition-colors ${
                            customRole === r
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-surface text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full mt-2 gap-2 text-sm font-bold"
                  >
                    <Sparkles className="h-4 w-4" />
                    {authMode === "signin"
                      ? "Sign In & Enter Dashboard"
                      : "Register & Start Learning"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
