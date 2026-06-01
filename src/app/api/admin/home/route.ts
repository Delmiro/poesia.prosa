import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();

  const updates = [
    { key: "quote_of_day", value: body.quote_of_day },
    { key: "featured_poem_id", value: body.featured_poem_id },
    { key: "featured_magazine_id", value: body.featured_magazine_id },
  ];

  for (const item of updates) {
    await supabase
      .from("homepage_settings")
      .upsert({ key: item.key, value: item.value }, { onConflict: "key" });
  }

  return NextResponse.json({ success: true });
}
