import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getSupabaseConfigHint, isSupabaseConfigured } from "@/lib/supabase/env";

export default function AdminLoginPage() {
  const supabaseReady = isSupabaseConfigured();
  const configHint = getSupabaseConfigHint();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">Carregando…</div>
      }
    >
      <AdminLoginForm supabaseReady={supabaseReady} configHint={configHint} />
    </Suspense>
  );
}
