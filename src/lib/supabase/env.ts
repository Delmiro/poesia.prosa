/** Lê variáveis Supabase (servidor e build). Suporta chave anon ou publishable. */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    "";

  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseEnv();
  return url.length > 0 && key.length > 0;
}
