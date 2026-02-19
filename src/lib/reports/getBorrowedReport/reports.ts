import { supabase } from "@/lib/supabase";

export async function getBorrowedReport() {
  try {
    const { data, error } = await supabase
      .from("borrowed_books")
      .select(`
        id,
        due_date,
        users(id, name),
        books(id, title, author)
      `)
      .order("due_date", { ascending: false });

    if (error) {
      console.error("Error fetching borrowed report:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching borrowed report:", err);
    return [];
  }
}
