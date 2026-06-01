"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { adminLoginAction, type LoginState } from "@/lib/auth/login-action";
import { Button } from "@/components/ui/button";

interface AdminLoginFormProps {
  supabaseReady: boolean;
}

const initialState: LoginState = {};

export function AdminLoginForm({ supabaseReady }: AdminLoginFormProps) {
  const [state, formAction, pending] = useActionState(adminLoginAction, initialState);
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    unauthorized:
      "Você não tem permissão de administrador. Execute grant_admin no Supabase.",
    supabase:
      "Supabase não configurado no servidor. Veja docs/CONFIGURAR-SUPABASE.md",
  };

  const displayError =
    state.error || (urlError ? errorMessages[urlError] : undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-center font-display text-2xl font-semibold">Área Administrativa</h1>
        <p className="mt-2 text-center text-sm text-muted">
          Acesso restrito a administradores
        </p>

        {!supabaseReady && (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            Supabase não detectado no servidor. Crie{" "}
            <code className="text-xs">.env.local</code> com URL e chave, depois reinicie{" "}
            <code className="text-xs">npm run dev</code>.
          </p>
        )}

        {supabaseReady && (
          <p className="mt-3 text-center text-xs text-muted">
            Conexão com Supabase ativa no servidor.
          </p>
        )}

        {displayError && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {displayError}
          </p>
        )}

        <form action={formAction} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">E-mail</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              disabled={!supabaseReady || pending}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 outline-none focus:border-accent disabled:opacity-60"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Senha</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              disabled={!supabaseReady || pending}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 outline-none focus:border-accent disabled:opacity-60"
            />
          </div>
          <Button type="submit" className="w-full" disabled={!supabaseReady || pending}>
            {pending ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
