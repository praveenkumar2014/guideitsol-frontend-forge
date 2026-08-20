import { useState } from "react";
import {
  CheckCircle2,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Shield,
  Sparkles,
  User,
  UserCheck,
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

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { user, isAuthenticated, loginAs, loginWithCredentials, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"roles" | "custom">("roles");
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [customRole, setCustomRole] = useState<UserRole>("learner");

  const handleRoleLogin = (role: UserRole) => {
    const loggedUser = loginAs(role);
    toast.success(`Welcome back, ${loggedUser.name}!`, {
      description: `Authenticated as ${loggedUser.badge} (${loggedUser.title})`,
    });
    onOpenChange(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const loggedUser = loginWithCredentials(customEmail, customName, customRole);
    toast.success(`Logged in successfully as ${loggedUser.name}!`, {
      description: `Role assigned: ${customRole.toUpperCase()}`,
    });
    onOpenChange(false);
  };

  const handleLogout = () => {
    logout();
    toast.info("You have been signed out.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="auth-modal-dialog"
        className="max-w-xl border-border/80 bg-background/95 p-6 backdrop-blur-2xl sm:rounded-2xl"
      >
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <KeyRound className="h-4 w-4" />
            </div>
            <DialogTitle className="font-display text-xl font-semibold">
              {isAuthenticated ? "User Account & Role Management" : "GUIDESOFT Access & Role Portal"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {isAuthenticated
              ? "You are currently authenticated. Switch roles instantly to test different platform permissions."
              : "Sign in with test accounts or customize your role to explore the full interactive ecosystem."}
          </DialogDescription>
        </DialogHeader>

        {isAuthenticated && user ? (
          <div className="mt-4 space-y-5">
            {/* Active User Card */}
            <div className="flex items-start gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-14 w-14 rounded-full border-2 border-primary object-cover shadow-md"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{user.name}</h3>
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    {user.badge}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs font-medium text-primary">{user.title}</p>
                {user.enrolledTrack && (
                  <p className="text-xs text-muted-foreground">
                    Enrolled: <span className="text-foreground">{user.enrolledTrack}</span> ({user.progress}% complete)
                  </p>
                )}
              </div>
            </div>

            {/* Permissions list */}
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

            {/* Switch role section */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Switch Test Role (1-Click)
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(["learner", "instructor", "admin", "partner"] as UserRole[]).map((r) => {
                  const account = TEST_ACCOUNTS[r];
                  const isActive = user.role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleLogin(r)}
                      className={`flex flex-col items-center rounded-lg border p-2.5 text-center transition-all ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border bg-surface hover:border-primary/50 hover:bg-accent"
                      }`}
                    >
                      <span className="text-xs font-semibold capitalize">{r}</span>
                      <span className="mt-0.5 text-[10px] text-muted-foreground truncate w-full">
                        {account.name.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-1.5">
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="flex rounded-lg border border-border bg-surface p-1">
              <button
                type="button"
                onClick={() => setActiveTab("roles")}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === "roles" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                1-Click Test Roles
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("custom")}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === "custom" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Custom Credentials
              </button>
            </div>

            {activeTab === "roles" ? (
              <div className="space-y-2.5">
                {(["learner", "instructor", "admin", "partner"] as UserRole[]).map((r) => {
                  const account = TEST_ACCOUNTS[r];
                  return (
                    <div
                      key={r}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-surface/60 p-3 transition-all hover:border-primary/60 hover:bg-surface"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={account.avatar}
                          alt={account.name}
                          className="h-10 w-10 rounded-full border border-border object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">{account.name}</p>
                            <Badge variant="outline" className="text-[10px] uppercase">
                              {r}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{account.title}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={r === "learner" ? "hero" : "subtle"}
                        onClick={() => handleRoleLogin(r)}
                        className="gap-1.5"
                      >
                        <UserCheck className="h-3.5 w-3.5" /> Sign in as {r}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. Anand Kumar"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="anand@example.com"
                      required
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Select Role</label>
                  <div className="mt-1 grid grid-cols-4 gap-2">
                    {(["learner", "instructor", "admin", "partner"] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setCustomRole(r)}
                        className={`rounded-lg border py-2 text-xs font-semibold capitalize transition-colors ${
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

                <Button type="submit" variant="hero" className="w-full mt-2">
                  <Sparkles className="h-4 w-4 mr-2" /> Sign In & Explore
                </Button>
              </form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
