import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function POST(request: Request) {
  const { publicationType, publicationId } = await request.json();

  if (!publicationType || !publicationId) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, demo: true });
  }

  const cookieStore = await cookies();
  let sessionId = cookieStore.get("reader_session")?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set("reader_session", sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("publication_likes").insert({
    publication_type: publicationType,
    publication_id: publicationId,
    session_id: sessionId,
  });

  if (error && error.code !== "23505") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
