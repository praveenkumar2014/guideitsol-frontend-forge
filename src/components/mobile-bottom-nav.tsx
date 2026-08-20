import { Link, useLocation } from "@tanstack/react-router";
import { BookOpen, GraduationCap, Home, Radio, User } from "lucide-react";

import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", to: "/", icon: Home },
  { label: "Courses", to: "/courses", icon: BookOpen },
  { label: "Live", to: "/live-batches", icon: Radio },
  { label: "Learn", to: "/learning-paths", icon: GraduationCap },
  { label: "Profile", to: "/student-dashboard", icon: User },
] as const;

export function MobileBottomNav() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden border-t border-border bg-background/80 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const isActive = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-full py-1.5 rounded-lg transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <tab.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className="text-[10px] font-semibold leading-tight">{tab.label}</span>
              {isActive && <span className="absolute bottom-1.5 h-1 w-4 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
