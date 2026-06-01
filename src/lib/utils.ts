import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  try {
    return format(parseISO(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch {
    return "";
  }
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}

export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
