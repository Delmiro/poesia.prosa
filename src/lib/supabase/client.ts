import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

export { isSupabaseConfigured } from "@/lib/supabase/env";

export function createClient() {
  const { url, key } = getSupabaseEnv();
  if (!url || !key) {
    throw new Error("Supabase não configurado");
  }
  return createBrowserClient(url, key);
}
