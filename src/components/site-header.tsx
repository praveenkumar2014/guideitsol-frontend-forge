import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Shield,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { AuthModal, GoogleLogoIcon } from "@/components/auth-modal";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { nav, site } from "@/data/site";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import logoLight from "../logolight.svg?url";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-2xl">
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <EnquiryDialog open={enquiryOpen} onOpenChange={setEnquiryOpen} />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Main Navigation & Left Quick Auth Badge */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
            <img
              src={logoLight}
              alt={site.legalName}
              className="h-9 w-auto max-w-[150px] object-contain"
            />
          </Link>

          <nav aria-label="Primary Navigation" className="hidden items-center gap-1 xl:flex">
            {nav.slice(0, 6).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-foreground bg-accent/70 font-semibold" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Left/Right Google Authorization, Quick Enquire, Role Switcher & Workspace */}
        <div className="flex items-center gap-2.5">
          {/* Quick Google Sign In Trigger (Right side) */}
          {!isAuthenticated && (
            <button
              type="button"
              id="header-google-auth-btn"
              onClick={() => setAuthOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-lg border border-border/80 bg-surface/80 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-surface shadow-sm"
              aria-label="Sign in with Google"
            >
              <GoogleLogoIcon className="h-4 w-4" />
              <span>Google Sign-In</span>
            </button>
          )}

          {/* Quick Enquire CTA */}
          <div className="hidden sm:block">
            <Button
              variant="subtle"
              size="sm"
              onClick={() => setEnquiryOpen(true)}
              className="gap-1.5 border border-border"
            >
              <MessageSquare className="h-4 w-4 text-primary" />
              <span>Enquire</span>
            </Button>
          </div>

          {/* Role-Based Auth Profile Trigger */}
          <button
            type="button"
            id="auth-role-btn"
            onClick={() => setAuthOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium transition-all hover:border-primary/60 hover:bg-accent"
            aria-label="User account and role menu"
          >
            {isAuthenticated && user ? (
              <>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-5 w-5 rounded-full border border-primary object-cover"
                />
                <span className="font-semibold text-foreground hidden md:inline">
                  {user.name.split(" ")[0]}
                </span>
                <Badge
                  variant="default"
                  className="bg-primary/20 text-primary border-primary/40 text-[10px] py-0 px-1.5"
                >
                  {user.role}
                </Badge>
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground hidden md:inline">Sign In / Role</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  Demo
                </span>
              </>
            )}
          </button>

          {/* Student Dashboard Direct Button */}
          <div className="hidden lg:block">
            <Button asChild variant="hero" size="sm" className="gap-1.5 shadow-sm">
              <Link to="/student-dashboard">
                <GraduationCap className="h-4 w-4" />
                <span>Workspace</span>
              </Link>
            </Button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-t border-border bg-background/95 backdrop-blur-2xl xl:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav
          aria-label="Mobile Navigation"
          className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:px-6"
        >
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-foreground bg-accent/70 font-semibold" }}
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-border">
            <Button
              variant="subtle"
              size="sm"
              onClick={() => {
                setOpen(false);
                setEnquiryOpen(true);
              }}
              className="w-full"
            >
              Quick Enquire
            </Button>

            <Button asChild variant="hero" size="sm" className="w-full">
              <Link to="/student-dashboard" onClick={() => setOpen(false)}>
                Workspace
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
