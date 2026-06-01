/** Remove aspas e espaços comuns ao colar variáveis na Vercel. */
function cleanEnvValue(value: string | undefined): string {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "");
}

/**
 * Normaliza a URL do Supabase (aceita só o host ou URL sem https).
 * Retorna string vazia se inválida — evita crash no middleware.
 */
export function normalizeSupabaseUrl(raw: string): string {
  const cleaned = cleanEnvValue(raw);
  if (!cleaned) return "";

  let candidate = cleaned;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return parsed.origin.replace(/\/$/, "");
  } catch {
    return "";
  }
}

/** Lê variáveis Supabase. Suporta chave anon (JWT) ou publishable (sb_publishable_...). */
export function getSupabaseEnv() {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key =
    cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseEnv();
  return url.length > 0 && key.length > 0;
}

/** Mensagem de ajuda quando a URL está mal configurada na Vercel. */
export function getSupabaseConfigHint(): string | null {
  const rawUrl = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const { url, key } = getSupabaseEnv();

  if (!rawUrl && !key) {
    return "Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY nas variáveis de ambiente.";
  }
  if (rawUrl && !url) {
    return `URL inválida: "${rawUrl}". Use exatamente: https://SEU-PROJETO.supabase.co (com https://, sem aspas).`;
  }
  if (!key) {
    return "Chave ausente. Defina NEXT_PUBLIC_SUPABASE_ANON_KEY (anon public ou publishable).";
  }
  return null;
}
