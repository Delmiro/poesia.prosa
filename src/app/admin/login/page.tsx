import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function AdminLoginPage() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">Carregando…</div>
      }
    >
      <AdminLoginForm supabaseReady={supabaseReady} />
    </Suspense>
  );
}
