import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Calendar,
  ChevronDown,
  Compass,
  Cpu,
  Database,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Moon,
  Search,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";

import { AuthModal, GoogleLogoIcon } from "@/components/auth-modal";
import { CourseSearchDialog } from "@/components/course-search-dialog";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { nav, site } from "@/data/site";
import { courses } from "@/data/training";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import logoLight from "../logolight.svg?url";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const exploreCategories = [
    {
      name: "Software & Cloud",
      icon: Cpu,
      courses: courses.filter((c) => c.category === "Software Development" || c.category === "Cloud & DevOps"),
    },
    {
      name: "Data, AI & ML",
      icon: Database,
      courses: courses.filter((c) => c.category === "Data & AI"),
    },
    {
      name: "Testing & Quality",
      icon: ShieldCheck,
      courses: courses.filter((c) => c.category === "Testing"),
    },
    {
      name: "Design & Product",
      icon: Compass,
      courses: courses.filter((c) => c.category === "UI/UX & Design"),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-2xl transition-colors duration-200">
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <EnquiryDialog open={enquiryOpen} onOpenChange={setEnquiryOpen} />
      <CourseSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Coursera-Style Explore Dropdown */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
            <img
              src={logoLight}
              alt={site.legalName}
              className="h-9 w-auto max-w-[140px] object-contain"
            />
          </Link>

          {/* Coursera-Style Explore Mega Dropdown */}
          <div className="relative hidden md:block">
            <button
              type="button"
              id="header-explore-btn"
              onClick={() => setExploreOpen(!exploreOpen)}
              onBlur={() => setTimeout(() => setExploreOpen(false), 200)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface/80 px-3 py-1.5 text-xs font-bold text-foreground transition-all hover:border-primary/50 hover:bg-surface"
            >
              <Compass className="h-4 w-4 text-primary" />
              <span>Explore</span>
              <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", exploreOpen && "rotate-180")} />
            </button>

            {exploreOpen && (
              <div className="absolute left-0 top-full mt-2 w-[520px] rounded-2xl border border-border bg-popover p-4 shadow-2xl backdrop-blur-2xl z-50 grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95">
                {exploreCategories.map((cat) => (
                  <div key={cat.name} className="space-y-1.5">
                    <Link to="/browse/$category" params={{ category: cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') }} className="flex items-center gap-1.5 text-xs font-extrabold text-primary border-b border-border/60 pb-1 hover:underline">
                      <cat.icon className="h-3.5 w-3.5" />
                      <span>{cat.name}</span>
                    </Link>
                    <ul className="space-y-1">
                      {cat.courses.slice(0, 3).map((c) => (
                        <li key={c.slug}>
                          <Link
                            to="/courses/$slug"
                            params={{ slug: c.slug }}
                            className="block rounded-md px-2 py-1 text-xs text-foreground/80 hover:bg-accent hover:text-foreground font-medium truncate"
                          >
                            {c.shortTitle || c.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="col-span-2 border-t border-border pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Accredited Career Programs</span>
                  <Link to="/courses" className="font-bold text-primary hover:underline">
                    View All Tracks ({courses.length}) →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Search Trigger Button */}
          <button
            type="button"
            id="header-search-btn"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all max-w-[200px]"
          >
            <Search className="h-3.5 w-3.5 text-primary" />
            <span className="truncate">Search courses...</span>
            <kbd className="ml-auto text-[10px] font-mono opacity-60">⌘K</kbd>
          </button>

          {/* Main Navigation Links */}
          <nav aria-label="Primary Navigation" className="hidden items-center gap-1 xl:flex">
            <Link
              to="/courses"
              className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Courses
            </Link>
            <Link
              to="/live-batches"
              className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Live batches
            </Link>
            <Link
              to="/verify"
              className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Verify
            </Link>
          </nav>
        </div>

        {/* Right: Theme Toggle, Google Sign-In, Enquire, Role Matrix */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${mounted && theme === "dark" ? "light" : "dark"} mode`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-all hover:border-primary/50 hover:bg-accent"
          >
            {mounted && theme === "light" ? (
              <Moon className="h-4 w-4 text-sky-600 animate-in spin-in-180 duration-300" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400 animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* Quick Google Fast Sign In Trigger */}
          {!isAuthenticated && (
            <button
              type="button"
              id="header-google-auth-btn"
              onClick={() => setAuthOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-xl border border-border bg-surface/80 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-surface shadow-sm"
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
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium transition-all hover:border-primary/60 hover:bg-accent"
            aria-label="User account and role menu"
          >
            {isAuthenticated && user ? (
              <>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-foreground truncate max-w-[90px]">
                  {user.name.split(" ")[0]}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] uppercase font-mono px-1.5 py-0",
                    user.role === "admin" && "border-amber-400/60 text-amber-400",
                    user.role === "instructor" && "border-sky-400/60 text-sky-400",
                    user.role === "student" && "border-primary/60 text-primary",
                  )}
                >
                  {user.role}
                </Badge>
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline font-semibold">Sign In / Roles</span>
              </>
            )}
          </button>

          {/* Student Dashboard link for logged-in users */}
          {isAuthenticated && (
            <Button asChild variant="hero" size="sm" className="hidden lg:flex gap-1.5 text-xs font-bold">
              <Link to="/student-dashboard">
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>
            </Button>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-b border-border bg-background px-4 py-4 lg:hidden space-y-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setSearchOpen(true);
              }}
              className="flex-1 flex items-center gap-2 rounded-xl border border-border bg-surface p-2.5 text-xs text-muted-foreground"
            >
              <Search className="h-4 w-4 text-primary" />
              <span>Search all courses & specializations...</span>
            </button>
          </div>

          <nav className="grid grid-cols-2 gap-1.5">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
