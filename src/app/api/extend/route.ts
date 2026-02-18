// /api/extend/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth"; // server-side auth

export async function POST(req: Request) {
  try {
    // Get server-side session
    const session = await auth(); 
    const user_id = session?.user?.id;
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { borrowed_id } = await req.json();
    if (!borrowed_id) {
      return NextResponse.json({ error: "Missing borrowed_id" }, { status: 400 });
    }

    // Fetch borrowed book
    const { data: borrowed, error: borrowError } = await supabase
      .from("borrowed_books")
      .select("*")
      .eq("id", borrowed_id)
      .single();

    if (borrowError || !borrowed) {
      return NextResponse.json({ error: "Borrowed book not found" }, { status: 404 });
    }

    // Ownership check
    if (borrowed.user_id !== user_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Ensure book is expired
    const now = new Date();
    const dueDate = new Date(borrowed.due_date);
    if (dueDate > now) {
      return NextResponse.json({ error: "Book has not expired yet" }, { status: 400 });
    }

    // Mock payment
    const paymentAmount = 20;
    const { error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id,
        borrowed_book_id: borrowed_id,
        amount: paymentAmount,
        status: "success",
        created_at: new Date().toISOString(),
      });

    if (paymentError) {
      console.error("Payment insert error:", paymentError);
      return NextResponse.json({ error: "Payment failed" }, { status: 500 });
    }

    // Extend due date
const newDueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
const extensionDate = new Date().toISOString();

const { error: updateError } = await supabase
  .from("borrowed_books")
  .update({
    due_date: newDueDate,
    extended: true,
    date_extended: extensionDate,
  })
  .eq("id", borrowed_id);

if (updateError) {
  return NextResponse.json({ error: "Failed to extend access" }, { status: 500 });
}


   return NextResponse.json({
  success: true,
  message: "Payment successful. Access extended by 14 days.",
  amount_paid: paymentAmount,
  new_due_date: newDueDate,
  date_extended: extensionDate, // <-- return this
});

  } catch (err) {
    console.error("Extend error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
