"use client";

import { useRouter } from "next/navigation";

export function DeleteContentButton({ table, id }: { table: string; id: string }) {
  const router = useRouter();

  const remove = async () => {
    if (!confirm("Excluir este conteúdo?")) return;
    await fetch(`/api/admin/content?table=${table}&id=${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button type="button" onClick={remove} className="text-red-600 hover:underline text-sm">
      Excluir
    </button>
  );
}
