import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const quantity = Number(formData.get("quantity"));
    const file = formData.get("file") as File;

    if (!title || !author || !file) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("books")
      .upload(fileName, file);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message });
    }

    const { error } = await supabase.from("books").insert({
      title,
      author,
      quantity,
      status: quantity > 0 ? "available" : "unavailable",
      file_path: uploadData.path,
    });

    if (error) {
      return NextResponse.json({ error: error.message });
    }

    return NextResponse.json({ message: "Book added successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

/* GET ALL BOOKS */
export async function GET() {
  const { data, error } = await supabase.from("books").select("*");

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  return NextResponse.json(data);
}
