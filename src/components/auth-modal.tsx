import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TEST_ACCOUNTS, useAuth, type UserRole } from "@/lib/auth";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoogleLogoIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
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
    onOpenChange(false);
  };

  const handleGoogleLogin = async () => {
    const loggedUser = await loginWithGoogle();
    toast.success(`Signed in with Google as ${loggedUser.name}!`, {
      description: `Verified Google Account linked (${loggedUser.email})`,
    });
    onOpenChange(false);
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
    onOpenChange(false);
  };

  const handleLogout = async () => {
    await logout();
    toast.info("You have been signed out.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="auth-modal-dialog"
        className="max-w-4xl border-border/80 bg-background/98 p-0 backdrop-blur-2xl sm:rounded-2xl overflow-hidden max-h-[92vh]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/80">
          {/* ============================================================ */}
          {/* LEFT COLUMN: Google One-Tap, Brand Showcase & 1-Click Roles   */}
          {/* ============================================================ */}
          <div className="flex flex-col justify-between bg-surface/60 p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="font-display text-lg font-bold text-foreground">
                    GUIDESOFT Access & Role Portal
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground">
                    Secure Single Sign-On & Role Management
                  </p>
                </div>
              </div>

              {/* Google Fast Sign-In */}
              <button
                type="button"
                id="google-auth-btn"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border/80 bg-surface px-4 py-3 text-xs font-bold text-foreground shadow-sm transition-all hover:border-primary/60 hover:bg-accent hover:shadow-md"
              >
                <GoogleLogoIcon className="h-4 w-4" />
                <span>Continue with Google</span>
                <Badge
                  variant="outline"
                  className="ml-auto text-[9px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                >
                  Instant
                </Badge>
              </button>

              <div className="relative my-3 flex items-center justify-center">
                <div className="w-full border-t border-border/60" />
                <span className="absolute bg-surface px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  1-Click Role Testing
                </span>
              </div>

              {/* 1-Click Role Cards */}
              <div className="space-y-2">
                {(["learner", "instructor", "admin", "partner"] as UserRole[]).map((r) => {
                  const account = TEST_ACCOUNTS[r];
                  const isActive = user?.role === r;
                  return (
                    <div
                      key={r}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-2.5 transition-all ${
                        isActive
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border/70 bg-background/50 hover:border-primary/50 hover:bg-surface"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={account.avatar}
                          alt={account.name}
                          className="h-8 w-8 rounded-full border border-border object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-foreground truncate">
                              {account.name}
                            </span>
                            <Badge variant="outline" className="text-[9px] uppercase px-1 py-0">
                              {r}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {account.title}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={r === "learner" ? "hero" : "subtle"}
                        onClick={() => handleRoleLogin(r)}
                        className="h-7 text-xs px-2.5 whitespace-nowrap"
                      >
                        <UserCheck className="h-3 w-3 mr-1" /> Sign in as {r}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Left Footer Trust Badges */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 256-Bit SSL Secured
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-primary" /> Role-Based Access
              </span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Custom Credentials Login & Profile Status      */}
          {/* ============================================================ */}
          <div className="flex flex-col justify-between p-6 sm:p-8 space-y-6">
            {isAuthenticated && user ? (
              <div className="space-y-5">
                <div>
                  <DialogTitle className="font-display text-lg font-bold text-foreground">
                    User Account & Role Management
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Currently authenticated session details and capabilities.
                  </DialogDescription>
                </div>

                {/* Active User Card */}
                <div className="flex items-start gap-3.5 rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-12 w-12 rounded-full border-2 border-primary object-cover shadow"
                  />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">{user.name}</h4>
                      <Badge
                        variant="default"
                        className="bg-primary text-primary-foreground text-[10px]"
                      >
                        {user.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs font-semibold text-primary">{user.title}</p>
                    {user.enrolledTrack && (
                      <p className="text-[11px] text-muted-foreground">
                        Track: <span className="text-foreground">{user.enrolledTrack}</span> (
                        {user.progress}% complete)
                      </p>
                    )}
                  </div>
                </div>

                {/* Permissions List */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Active Permissions & Capabilities
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {user.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-foreground"
                      >
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        {perm.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-1.5"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex rounded-lg border border-border bg-surface p-1">
                    <button
                      type="button"
                      onClick={() => setAuthMode("signin")}
                      className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-colors ${
                        authMode === "signin"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("register")}
                      className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-colors ${
                        authMode === "register"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Create Account
                    </button>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-3.5">
                  {authMode === "register" && (
                    <div>
                      <label className="text-xs font-semibold text-foreground">Full Name *</label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="e.g. Rahul Verma"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          className="pl-9 text-xs"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-foreground">Email Address *</label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="rahul@example.com"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="pl-9 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Password *</label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        value={customPassword}
                        onChange={(e) => setCustomPassword(e.target.value)}
                        className="pl-9 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Assigned Role</label>
                    <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                      {(["learner", "instructor", "admin", "partner"] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setCustomRole(r)}
                          className={`rounded-lg border py-1.5 text-xs font-bold capitalize transition-colors ${
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
                    className="w-full mt-2 gap-2 text-xs font-bold"
                  >
                    <Sparkles className="h-4 w-4" />
                    {authMode === "signin" ? "Sign In to Portal" : "Create My Account"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
