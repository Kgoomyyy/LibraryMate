import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const {  email, role,password } = body;

  if (!password|| !email || !role) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("users").insert([
    {
      
      email,
      role,
      password
      
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
