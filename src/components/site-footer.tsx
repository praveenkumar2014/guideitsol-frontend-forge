import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";

import { site } from "@/data/site";
import { courseCategories } from "@/data/training";
import { useTheme } from "@/lib/theme";
import logoLight from "../logolight.svg?url";
import logoDark from "../logodark.svg?url";

const company = [
  { label: "About GuideSoft", to: "/about" },
  { label: "Instructors", to: "/instructors" },
  { label: "Our Projects", to: "/projects" },
  { label: "Career Center", to: "/career-center" },
  { label: "Internships", to: "/internships" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact Us", to: "/contact" },
] as const;

const platform = [
  { label: "All Courses", to: "/courses" },
  { label: "Live Batches", to: "/live-batches" },
  { label: "Learning Paths", to: "/learning-paths" },
  { label: "AI Content Studio", to: "/ai-studio" },
  { label: "Verify Certificate", to: "/verify" },
  { label: "Student Dashboard", to: "/student-dashboard" },
  { label: "Admin Console", to: "/admin" },
  { label: "Sign In / Register", to: "/auth" },
] as const;

const social = [
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/guideitsol" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@guideitsol" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/guideitsol" },
  { icon: Twitter, label: "X / Twitter", href: "https://twitter.com/guideitsol" },
  { icon: Github, label: "GitHub", href: "https://github.com/guideitsol" },
] as const;

export function SiteFooter() {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-border bg-surface/30">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block">
              <img
                src={theme === "dark" ? logoLight : logoDark}
                alt={site.legalName}
                className="h-10 w-auto max-w-[180px] object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">{site.tagline}</p>

            {/* Contact details - purely email support */}
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2.5 hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                {site.email}
              </a>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="h-9 w-9 rounded-xl bg-surface border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Learning Areas */}
          <div>
            <h2 className="font-display text-sm font-semibold text-foreground mb-4">
              Learning Areas
            </h2>
            <ul className="space-y-2.5 text-sm">
              {courseCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    to="/browse/$category"
                    params={{
                      category: category.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"),
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h2 className="font-display text-sm font-semibold text-foreground mb-4">Platform</h2>
            <ul className="space-y-2.5 text-sm">
              {platform.map((p) => (
                <li key={p.to}>
                  <Link
                    to={p.to}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="font-display text-sm font-semibold text-foreground mb-4">Company</h2>
            <ul className="space-y-2.5 text-sm">
              {company.map((c) => (
                <li key={c.to}>
                  <Link
                    to={c.to}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://www.guideitsol.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  guideitsol.in
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>CIN: U80904AP2016PTC097xxx</span>
            <span>GST: 37AXXXXX1234X1ZX</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund" className="hover:text-foreground transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
