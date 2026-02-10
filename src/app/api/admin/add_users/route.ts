import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  const { name, email, password, role_id } = await req.json();

  if (!name || !email || !password || !role_id) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("users").insert([
    {
      name,
      email,
      password: hashedPassword,
      role_id,
    },
  ]);

  if (error) {
    console.error("ADD USER ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
