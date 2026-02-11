import { supabase } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";



export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get("user_id");
  const session = await auth; 
  console.log("Session in borrowed route:", session);
  const { data } = await supabase
    .from("borrowed_books")
    .select("id, borrowed_at, books(id, title, author, image_url)")
    .eq("user_id", user_id)
    .eq("returned", false);
  return NextResponse.json(data);
}
 


export async function POST(req: NextRequest) {
  const { user_id, book_id } = await req.json();
  await supabase.from("borrowed_books").insert({ user_id, book_id });
  return NextResponse.json({ success: true });
}

