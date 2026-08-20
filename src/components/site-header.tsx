import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Menu, Moon, Sun, UserRound, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { nav, site } from "@/data/site";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import logoLight from "../logolight.svg?url";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
          <img
            src={logoLight}
            alt={site.legalName}
            className="h-9 w-auto max-w-[150px] object-contain"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-foreground bg-accent/60" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button asChild variant={user ? "subtle" : "hero"} size="lg">
            <Link to={user ? "/account" : "/login"}>
              <UserRound />
              {user ? "My account" : "Sign in"}
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-t border-border bg-background lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav aria-label="Mobile" className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:px-6">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-foreground bg-accent/60" }}
            >
              {item.label}
            </Link>
          ))}
          <Button
            asChild
            variant={user ? "subtle" : "hero"}
            size="lg"
            className="mt-2"
          >
            <Link to={user ? "/account" : "/login"} onClick={() => setOpen(false)}>
              <UserRound />
              {user ? "My account" : "Sign in"}
            </Link>
          </Button>
          <Button variant="ghost" size="lg" onClick={toggleTheme} className="mt-1">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light theme" : "Dark theme"}
          </Button>
        </nav>
      </div>
    </header>
  );
}
