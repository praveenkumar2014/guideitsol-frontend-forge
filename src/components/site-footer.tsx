import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { site } from "@/data/site";
import { courseCategories } from "@/data/training";
import logoLight from "../logolight.svg?url";

const company = [
  { label: "About", to: "/about" },
  { label: "Instructors", to: "/instructors" },
  { label: "Projects", to: "/projects" },
  { label: "Career center", to: "/career-center" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <img
              src={logoLight}
              alt={site.legalName}
              className="h-10 w-auto max-w-[170px] object-contain"
            />
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">{site.tagline}</p>
          <p className="text-xs text-muted-foreground">{site.hours}</p>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold">Learning areas</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {courseCategories.slice(0, 5).map((category) => (
              <li key={category.name}>
                <Link
                  to="/courses"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {company.map((c) => (
              <li key={c.to}>
                <Link
                  to={c.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="hover:text-foreground">
                {site.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{site.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Training information and schedules are
            subject to change.
          </p>
          <p>{site.domain}</p>
        </div>
      </div>
    </footer>
  );
}
