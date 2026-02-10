import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, role_id,created_at,name")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET USERS ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ users: data ?? [] });
}
