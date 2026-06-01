import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function adminClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: admin } = await supabase.from("admins").select("id").eq("user_id", user.id).single();
  return admin ? supabase : null;
}

export async function POST(request: Request) {
  const supabase = await adminClient();
  if (!supabase) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const body = await request.json();
  const { data, error } = await supabase.from("menus").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await adminClient();
  if (!supabase) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  await supabase.from("menus").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
