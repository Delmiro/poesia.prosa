import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: admin } = await supabase.from("admins").select("id").eq("user_id", user.id).single();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const de = searchParams.get("de");
  const ate = searchParams.get("ate");

  let query = supabase.from("subscribers").select("name, email, whatsapp, created_at");
  if (de) query = query.gte("created_at", de);
  if (ate) query = query.lte("created_at", `${ate}T23:59:59`);

  const { data } = await query;

  const sheet = XLSX.utils.json_to_sheet(
    (data ?? []).map((r) => ({
      Nome: r.name,
      Email: r.email,
      WhatsApp: r.whatsapp ?? "",
      Data: r.created_at,
    }))
  );
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Assinantes");
  const buffer = XLSX.write(book, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="assinantes.xlsx"',
    },
  });
}
