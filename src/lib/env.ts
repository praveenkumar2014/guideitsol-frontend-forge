// Environment access helper. Vite only exposes VITE_* variables to the client
// bundle, but we also accept the plain PUBLIC_API_BASE_URL name for parity with
// the backend's .env conventions.

function pick(keys: string[], fallback: string): string {
  for (const key of keys) {
    const value = (import.meta.env as Record<string, string | undefined>)[key];
    if (value) return value;
  }
  return fallback;
}

export const env = {
  publicApiBaseUrl: pick(
    ["VITE_PUBLIC_API_BASE_URL", "PUBLIC_API_BASE_URL"],
    "http://localhost:8000",
  ),
  supabaseUrl: pick(["VITE_SUPABASE_URL", "SUPABASE_URL"], ""),
  supabaseAnonKey: pick(["VITE_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY"], ""),
  cashfreeEnv: pick(["VITE_CASHFREE_ENV", "CASHFREE_ENV"], "sandbox"),
} as const;

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);

export function apiBaseUrl(): string {
  return env.publicApiBaseUrl.replace(/\/$/, "");
}