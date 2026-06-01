import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  return admin ? supabase : null;
}

const ALLOWED_TABLES = ["poems", "chronicles", "stories", "articles", "news", "magazines"];

export async function POST(request: Request) {
  const supabase = await verifyAdmin();
  if (!supabase) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { table, data } = await request.json();
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Tabela inválida" }, { status: 400 });
  }

  const { data: row, error } = await supabase.from(table).insert(data).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(row);
}

export async function PUT(request: Request) {
  const supabase = await verifyAdmin();
  if (!supabase) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { table, id, data } = await request.json();
  if (!ALLOWED_TABLES.includes(table) || !id) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const { data: row, error } = await supabase.from(table).update(data).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(row);
}

export async function DELETE(request: Request) {
  const supabase = await verifyAdmin();
  if (!supabase) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table");
  const id = searchParams.get("id");

  if (!table || !id || !ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
