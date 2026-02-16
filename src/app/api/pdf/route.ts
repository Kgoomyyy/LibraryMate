import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  //  Check login
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user_id = session.user.id;

  //  Get book id from URL
  const { searchParams } = new URL(req.url);
  const book_id = searchParams.get("id");

  if (!book_id) {
    return NextResponse.json({ error: "Missing book id" }, { status: 400 });
  }

  //  Verify user borrowed this book
  const { data , error } = await supabase
    .from("borrowed_books")
    .select("file_path")
    .eq("user_id", user_id)
    .eq("book_id", book_id)
    .eq("returned", false)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Book not borrowed or access denied" },
      { status: 403 }
    );
  }

  const filePath = data.file_path;

  //  Download PDF from Supabase storage
  const { data: fileData, error: fileError } = await supabase.storage
    .from("books")
    .download(filePath);

  if (fileError || !fileData) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Convert to buffer
  const buffer = await fileData.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
