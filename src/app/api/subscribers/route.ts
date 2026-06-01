import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  notify_poems: z.boolean().default(true),
  notify_articles: z.boolean().default(true),
  notify_magazines: z.boolean().default(true),
  notify_news: z.boolean().default(true),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, demo: true });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("subscribers").insert(parsed.data);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
