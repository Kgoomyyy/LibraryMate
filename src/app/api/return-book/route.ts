import { supabase } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { book_id } = await req.json();
  if (!book_id)
    return NextResponse.json({ error: "Missing book_id" }, { status: 400 });

  // Find active borrow record
  const { data: borrowRecord, error: findError } = await supabase
    .from("borrowed_books")
    .select("id, book_id, due_date")
    .eq("user_id", session.user.id)
    .eq("book_id", book_id)
    .eq("returned", false)
    .single();

  if (findError || !borrowRecord)
    return NextResponse.json({ error: "No active borrow found" }, { status: 404 });

  const returnedAt = new Date();
  const dueDate = borrowRecord.due_date ? new Date(borrowRecord.due_date) : returnedAt;

  // Calculate late fee (5 ZAR/day)
  let lateFee = 0;
  if (returnedAt > dueDate) {
    const diffTime = returnedAt.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    lateFee = diffDays * 5;
  }

  // Update borrowed_books record
  await supabase
    .from("borrowed_books")
    .update({
      returned: true,
      returned_at: returnedAt.toISOString(),
      late_fee: lateFee,
    })
    .eq("id", borrowRecord.id);

  // Update book quantity
  const { data: bookData } = await supabase
    .from("books")
    .select("quantity")
    .eq("id", book_id)
    .single();

  const newQuantity = (bookData?.quantity || 0) + 1;

  await supabase
    .from("books")
    .update({ quantity: newQuantity, status: "available" })
    .eq("id", book_id);

  return NextResponse.json({
    success: true,
    returned_at: returnedAt.toISOString(),
    late_fee: lateFee,
    newQuantity,
  });
}
