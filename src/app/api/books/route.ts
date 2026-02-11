import { supabase } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { data } = await supabase.from("books").select("*");
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const imageFile = formData.get("image") as File;

  const fileName = `${Date.now()}-${imageFile.name}`;
  await supabase.storage.from("book-images").upload(fileName, imageFile.stream());
  const { data } = supabase.storage.from("book-images").getPublicUrl(fileName);

  await supabase.from("books").insert({
    title,
    author,
    image_url: data.publicUrl
  });

  return NextResponse.json({ success: true });
}
