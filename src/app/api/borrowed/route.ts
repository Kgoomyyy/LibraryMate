import { supabase } from "@/app/lib/supabase";
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
    .select("id, borrowed_at, books(id, title, author, image_url)")
    .eq("user_id", user_id)
    .eq("returned", false);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

 


export async function POST(req: NextRequest) {
  const session = await auth(); // get logged-in user

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { book_id } = await req.json();
  if (!book_id) {
    return NextResponse.json({ error: "Missing book_id" }, { status: 400 });
  }

  // 1️⃣ Check current quantity
  const { data: bookData, error: bookError } = await supabase
    .from("books")
    .select("quantity")
    .eq("id", book_id)
    .single();

  if (bookError || !bookData) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  if (bookData.quantity <= 0) {
    return NextResponse.json({ error: "Book unavailable" }, { status: 400 });
  }

  // 2️⃣ Insert into borrowed_books
  const { error: borrowError } = await supabase.from("borrowed_books").insert({
    user_id: session.user.id,
    book_id,
  });

  if (borrowError) {
    return NextResponse.json({ error: borrowError.message }, { status: 500 });
  }

  // 3️⃣ Decrease book quantity by 1
  const newQuantity = bookData.quantity - 1;
  const newStatus = newQuantity === 0 ? "unavailable" : "available";

  const { error: updateError } = await supabase
    .from("books")
    .update({ quantity: newQuantity, status: newStatus })
    .eq("id", book_id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, newQuantity, newStatus });
}

