import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './env.js';

let supabaseAdmin: SupabaseClient | null = null;
let supabasePublic: SupabaseClient | null = null;

if (config.supabase.url && config.supabase.serviceRoleKey) {
  supabaseAdmin = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

if (config.supabase.url && config.supabase.anonKey) {
  supabasePublic = createClient(config.supabase.url, config.supabase.anonKey);
}

export { supabaseAdmin, supabasePublic };

export function isSupabaseReady(): boolean {
  return !!supabaseAdmin;
}
