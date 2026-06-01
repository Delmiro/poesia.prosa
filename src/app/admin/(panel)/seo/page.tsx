import { SeoSettingsForm } from "@/components/admin/seo-settings-form";
import { requireAdmin } from "@/lib/auth/admin";

export default async function SeoPage() {
  const { supabase } = await requireAdmin();
  const { data: settings } = await supabase.from("seo_settings").select("*");

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">SEO</h1>
      <p className="mt-2 text-muted">
        Meta tags, Open Graph e Schema.org configuráveis por página.
      </p>
      <SeoSettingsForm settings={settings ?? []} />
    </div>
  );
}
