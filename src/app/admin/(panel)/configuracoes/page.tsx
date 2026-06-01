export default function ConfiguracoesPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Configurações</h1>
      <p className="mt-2 text-muted">
        Nome do site, URL e variáveis de ambiente são definidos em{" "}
        <code className="rounded bg-border px-1">.env.local</code>.
      </p>
      <ul className="mt-8 space-y-3 text-sm">
        <li>
          <strong>NEXT_PUBLIC_SITE_NAME</strong> — Nome exibido no header
        </li>
        <li>
          <strong>NEXT_PUBLIC_SITE_URL</strong> — URL base para SEO e compartilhamento
        </li>
        <li>
          <strong>Supabase</strong> — Banco, Auth e Storage
        </li>
      </ul>
    </div>
  );
}
