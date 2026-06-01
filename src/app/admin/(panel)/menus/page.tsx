import { MenusManager } from "@/components/admin/menus-manager";
import { requireAdmin } from "@/lib/auth/admin";

export default async function MenusPage() {
  const { supabase } = await requireAdmin();
  const { data: menus } = await supabase.from("menus").select("*").order("sort_order");

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Gestão de Menus</h1>
      <p className="mt-2 text-muted">
        Edite menu principal, categorias, rodapé e links institucionais.
      </p>
      <MenusManager initialMenus={menus ?? []} />
    </div>
  );
}
