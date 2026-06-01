import { HomeSettingsForm } from "@/components/admin/home-settings-form";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminHomePage() {
  const { supabase } = await requireAdmin();

  const { data: settings } = await supabase.from("homepage_settings").select("*");
  const { data: banners } = await supabase.from("banners").select("*").order("sort_order");
  const { data: poems } = await supabase
    .from("poems")
    .select("id, title")
    .eq("status", "published")
    .limit(20);
  const { data: magazines } = await supabase
    .from("magazines")
    .select("id, title")
    .eq("status", "published")
    .limit(20);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Gestão da Home</h1>
      <p className="mt-2 text-muted">
        Configure banner, frase do dia, destaques e seções exibidas na página inicial.
      </p>
      <HomeSettingsForm
        settings={settings ?? []}
        banners={banners ?? []}
        poems={poems ?? []}
        magazines={magazines ?? []}
      />
    </div>
  );
}
