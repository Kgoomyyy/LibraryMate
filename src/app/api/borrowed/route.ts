import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  // Get session from auth()
  const session = await auth(); 

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const user_id = session.user.id;

  const { data, error } = await supabase
    .from("borrowed_books")
    .select("id,book_id,due_date, borrowed_at,extended,date_extended, books(id, title, author, file_path)")
    .eq("user_id", user_id)
;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

 
// Borrow a book
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { book_id } = await req.json();
  if (!book_id) return NextResponse.json({ error: "Missing book_id" }, { status: 400 });



  // Borrowed dates
  const borrowedAt = new Date().toISOString();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 2 weeks

  // Insert borrow record
  const { error: borrowError } = await supabase.from("borrowed_books").insert({
    user_id: session.user.id,
    book_id,
    borrowed_at: borrowedAt,
    due_date: dueDate.toISOString(),
  });

  if (borrowError) return NextResponse.json({ error: borrowError.message }, { status: 500 });


  return NextResponse.json({ success: true,borrowed_at: borrowedAt, due_date: dueDate.toISOString() });
}
