import { useEffect, useState } from "react";
import {
  supabase,
  signInWithGoogle as supabaseSignInWithGoogle,
  signOut as supabaseSignOut,
  getSession,
} from "@/lib/supabase";

export type UserRole = "learner" | "instructor" | "admin" | "partner";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  badge: string;
  enrolledTrack?: string;
  progress?: number;
  permissions: string[];
}

export const TEST_ACCOUNTS: Record<UserRole, UserProfile> = {
  learner: {
    id: "usr_learner_01",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    role: "learner",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    title: "Enrolled Student (Cohort #24)",
    badge: "Active Learner",
    enrolledTrack: "Java Full Stack Cloud Architecture",
    progress: 68,
    permissions: ["view_materials", "submit_assignments", "track_progress", "view_credentials"],
  },
  instructor: {
    id: "usr_instructor_01",
    name: "Aarav Menon",
    email: "aarav.menon@guideitsol.in",
    role: "instructor",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Lead Cloud & Microservices Architect",
    badge: "Master Faculty",
    permissions: ["view_materials", "grade_assignments", "manage_cohorts", "review_curriculum"],
  },
  admin: {
    id: "usr_admin_01",
    name: "Admin Operations",
    email: "admin@guideitsol.in",
    role: "admin",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    title: "Executive Director & Operations Lead",
    badge: "Platform Admin",
    permissions: [
      "view_materials",
      "manage_cohorts",
      "manage_leads",
      "issue_certificates",
      "view_analytics",
      "manage_system",
    ],
  },
  partner: {
    id: "usr_partner_01",
    name: "Rohan Verma",
    email: "rohan.verma@techcorp.in",
    role: "partner",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    title: "VP Talent Acquisition @ TechCorp Solutions",
    badge: "Enterprise Partner",
    permissions: ["view_candidates", "view_credentials", "post_internships", "schedule_interviews"],
  },
};

const AUTH_STORAGE_KEY = "guideitsol_auth_session";
const AUTH_EVENT_NAME = "guideitsol_auth_change";

function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loginAs(role: UserRole): UserProfile {
  const user = TEST_ACCOUNTS[role];
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: user }));
  }
  return user;
}

export function loginWithCredentials(
  email: string,
  name?: string,
  role: UserRole = "learner",
): UserProfile {
  const user: UserProfile = {
    id: `usr_${Date.now()}`,
    name: name?.trim() || email.split("@")[0],
    email: email.trim(),
    role,
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    title:
      role === "admin"
        ? "Platform Administrator"
        : role === "instructor"
          ? "Faculty Member"
          : "Registered Learner",
    badge: role.toUpperCase(),
    permissions: TEST_ACCOUNTS[role].permissions,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: user }));
  }
  return user;
}

export async function loginWithGoogle(): Promise<UserProfile> {
  try {
    const session = await getSession();
    if (session?.user) {
      const meta = session.user.user_metadata || {};
      const user: UserProfile = {
        id: session.user.id,
        name: meta.full_name || meta.name || session.user.email?.split("@")[0] || "Learner",
        email: session.user.email || "",
        role: "learner",
        avatar: meta.avatar_url || meta.picture || "",
        title: "Google Authenticated Member",
        badge: "Google Verified",
        permissions: TEST_ACCOUNTS.learner.permissions,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: user }));
      }
      return user;
    }
    // Fall back to mock if Supabase not configured
    const googleUser: UserProfile = {
      ...TEST_ACCOUNTS.learner,
      id: `usr_google_${Date.now()}`,
      name: "Google Verified Learner",
      email: "learner@gmail.com",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(googleUser));
      window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: googleUser }));
    }
    return googleUser;
  } catch {
    // Supabase not configured, use mock
    const googleUser: UserProfile = {
      ...TEST_ACCOUNTS.learner,
      id: `usr_google_${Date.now()}`,
      name: "Google Verified Learner",
      email: "learner@gmail.com",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(googleUser));
      window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: googleUser }));
    }
    return googleUser;
  }
}

export async function logout(): Promise<void> {
  try {
    await supabaseSignOut();
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: null }));
  }
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());

  useEffect(() => {
    setUser(getStoredUser());

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile | null>;
      setUser(customEvent.detail);
    };

    window.addEventListener(AUTH_EVENT_NAME, handler);
    return () => window.removeEventListener(AUTH_EVENT_NAME, handler);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    role: user?.role,
    loginAs,
    loginWithCredentials,
    loginWithGoogle,
    logout,
    hasPermission: (permission: string) => !!user?.permissions.includes(permission),
  };
}
