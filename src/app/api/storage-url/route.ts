import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get("path");
    const expiresStr = searchParams.get("expires");

    if (!filePath) {
      return NextResponse.json({ error: "Missing path" }, { status: 400 });
    }

    const expires = expiresStr ? Number(expiresStr) : 60; // default 60s

 
    const { data, error } = await supabase.storage
      .from("books")
      .createSignedUrl(filePath, expires);

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Could not create url" }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
