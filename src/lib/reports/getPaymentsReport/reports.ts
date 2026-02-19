import { supabase } from "@/lib/supabase";

export async function getPaymentsPerBook() {
  try {
    // Step 1: fetch all payments
    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (paymentsError) {
      console.error("Error fetching payments:", paymentsError);
      return [];
    }
    if (!payments || payments.length === 0) return [];

    // Step 2: fetch borrowed_books
    const borrowedBookIds = payments.map(p => p.borrowed_book_id);
    const { data: borrowedBooks } = await supabase
      .from("borrowed_books")
      .select("id, book_id")
      .in("id", borrowedBookIds);

    // Step 3: fetch book info
    const bookIds = borrowedBooks?.map(b => b.book_id) || [];
    const { data: books } = await supabase
      .from("books")
      .select("id, title, author")
      .in("id", bookIds);

    // Step 4: map payments to books
    const paymentsMapped = payments.map(p => {
      const borrowedBook = borrowedBooks?.find(b => b.id === p.borrowed_book_id);
      const book = borrowedBook ? books?.find(bk => bk.id === borrowedBook.book_id) : null;
      return {
        bookId: book?.id || "Unknown",
        bookTitle: book?.title || "Unknown",
        amount: p.amount,
      };
    });

    // Step 5: aggregate total revenue per book
    const revenuePerBook = paymentsMapped.reduce((acc: any, p) => {
      if (!p.bookTitle) return acc;
      if (acc[p.bookTitle]) {
        acc[p.bookTitle] += p.amount;
      } else {
        acc[p.bookTitle] = p.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    // Convert to array for frontend chart
    return Object.entries(revenuePerBook).map(([title, amount]) => ({
      title,
      amount,
    }));
  } catch (err) {
    console.error("Unexpected error fetching payments per book:", err);
    return [];
  }
}
