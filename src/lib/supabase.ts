import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env, isSupabaseConfigured } from "./env";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (client) return client;
  client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}

export async function signUp(email: string, password: string, name: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Authentication is not configured on this deployment.");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Authentication is not configured on this deployment.");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function sendPasswordReset(email: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Authentication is not configured on this deployment.");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/account`,
  });
  if (error) throw error;
}