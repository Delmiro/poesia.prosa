"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
};

export async function adminLoginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase não está configurado no servidor. Confira .env.local na raiz do projeto e reinicie com npm run dev.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  const supabase = await createClient();
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    const hint =
      authError.message.toLowerCase().includes("invalid") ||
      authError.message.toLowerCase().includes("credentials")
        ? "E-mail ou senha incorretos."
        : `Erro de autenticação: ${authError.message}`;
    return { error: hint };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Não foi possível iniciar a sessão." };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return {
      error:
        "Sua conta não é administradora. No Supabase (SQL Editor), execute: SELECT public.grant_admin('seu@email.com'); — o usuário precisa existir em Authentication → Users.",
    };
  }

  redirect("/admin");
}
