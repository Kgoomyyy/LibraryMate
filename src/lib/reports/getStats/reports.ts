import { supabase } from "@/lib/supabase";

export async function getStats() {
  try {
    // Count users
    const { count: usersCount } = await supabase.from("users").select("*", { count: "exact" });
    // Count books
    const { count: booksCount } = await supabase.from("books").select("*", { count: "exact" });
    // Count borrowed books
    const { count: borrowedCount } = await supabase.from("borrowed_books").select("*", { count: "exact" });
    // Sum total revenue from payments
    const { data: paymentsData } = await supabase
      .from("payments")
      .select("amount");

    const totalRevenue = paymentsData?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;

    return {
      users: usersCount || 0,
      books: booksCount || 0,
      borrowed: borrowedCount || 0,
      revenue: totalRevenue,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { users: 0, books: 0, borrowed: 0, revenue: 0 };
  }
}
