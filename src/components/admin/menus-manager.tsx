"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { MenuItem, MenuType } from "@/types";

export function MenusManager({ initialMenus }: { initialMenus: MenuItem[] }) {
  const [menus, setMenus] = useState(initialMenus);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [menuType, setMenuType] = useState<MenuType>("main");
  const [loading, setLoading] = useState(false);

  const add = async () => {
    if (!label || !url) return;
    setLoading(true);
    const res = await fetch("/api/admin/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, url, menu_type: menuType, sort_order: menus.length }),
    });
    const row = await res.json();
    if (res.ok) setMenus([...menus, row]);
    setLabel("");
    setUrl("");
    setLoading(false);
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/menus?id=${id}`, { method: "DELETE" });
    setMenus(menus.filter((m) => m.id !== id));
  };

  return (
    <div className="mt-8 max-w-2xl">
      <div className="rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-medium">Adicionar item</h2>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Rótulo"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL (/caminho)"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
        <select
          value={menuType}
          onChange={(e) => setMenuType(e.target.value as MenuType)}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        >
          <option value="main">Menu principal</option>
          <option value="footer">Rodapé</option>
          <option value="category">Categorias</option>
          <option value="institutional">Institucional</option>
        </select>
        <Button onClick={add} disabled={loading}>Adicionar</Button>
      </div>

      <ul className="mt-8 space-y-2">
        {menus.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
          >
            <div>
              <span className="font-medium">{m.label}</span>
              <span className="ml-2 text-sm text-muted">{m.url}</span>
              <span className="ml-2 text-xs text-accent">({m.menu_type})</span>
            </div>
            <button
              type="button"
              onClick={() => remove(m.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
