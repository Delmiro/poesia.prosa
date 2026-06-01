"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Subscriber } from "@/types";

export function SubscribersTable({ subscribers }: { subscribers: Subscriber[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const exportExcel = () => {
    const de = params.get("de") ?? "";
    const ate = params.get("ate") ?? "";
    window.open(`/api/admin/subscribers/export?de=${de}&ate=${ate}`, "_blank");
  };

  const filter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const de = fd.get("de") as string;
    const ate = fd.get("ate") as string;
    const q = new URLSearchParams();
    if (de) q.set("de", de);
    if (ate) q.set("ate", ate);
    router.push(`/admin/assinantes?${q.toString()}`);
  };

  return (
    <div className="mt-8">
      <form onSubmit={filter} className="mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm text-muted">De</label>
          <input
            name="de"
            type="date"
            defaultValue={params.get("de") ?? ""}
            className="block rounded-lg border border-border bg-background px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-muted">Até</label>
          <input
            name="ate"
            type="date"
            defaultValue={params.get("ate") ?? ""}
            className="block rounded-lg border border-border bg-background px-3 py-2"
          />
        </div>
        <Button type="submit" variant="secondary" size="sm">Filtrar</Button>
        <Button type="button" variant="outline" size="sm" onClick={exportExcel}>
          Exportar Excel
        </Button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-card/50">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">WhatsApp</th>
              <th className="p-4">Data</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-b border-border/50">
                <td className="p-4">{s.name}</td>
                <td className="p-4">{s.email}</td>
                <td className="p-4 text-muted">{s.whatsapp ?? "—"}</td>
                <td className="p-4 text-muted">{formatDate(s.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!subscribers.length && (
          <p className="p-8 text-center text-muted">Nenhum assinante encontrado.</p>
        )}
      </div>
    </div>
  );
}
