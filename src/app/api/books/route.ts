import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";



export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const pdfFile = formData.get("file") as File;
    const coverFile = formData.get("cover") as File;

    if (!title || !author || !pdfFile || !coverFile) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    // ---------- Upload PDF ----------
    const pdfName = `pdf-${Date.now()}-${pdfFile.name}`;
    const { data: pdfUpload, error: pdfError } = await supabase.storage
      .from("books")  // <-- PDF bucket
      .upload(pdfName, pdfFile);

    if (pdfError) return NextResponse.json({ error: pdfError.message });

    // ---------- Upload Cover ----------
    const coverName = `cover-${Date.now()}-${coverFile.name}`;
    const { data: coverUpload, error: coverError } = await supabase.storage
      .from("IMAGES")  // <-- Cover image bucket
      .upload(coverName, coverFile);

    if (coverError) return NextResponse.json({ error: coverError.message });

    // ---------- Insert into DB ----------
    const { error } = await supabase.from("books").insert({
      title,
      author,
      status: "available",
      file_path: pdfUpload.path,    // stored in PDF bucket
      cover_url: coverUpload.path,  // stored in IMAGES bucket
    });

    if (error) return NextResponse.json({ error: error.message });

    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || "1");
  const limit = 8;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("books")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("id", { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message });

  return NextResponse.json({
    books: data,
    totalPages: Math.ceil((count || 0) / limit),
  });
}