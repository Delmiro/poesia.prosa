import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: admin } = await supabase.from("admins").select("id").eq("user_id", user.id).single();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const { error } = await supabase
    .from("seo_settings")
    .upsert(body, { onConflict: "page_key" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
