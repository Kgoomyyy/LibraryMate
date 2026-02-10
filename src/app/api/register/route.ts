export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password, role_id } = await req.json();

    if (!email || !password || !role_id) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    
   /* if (role_id === 3) {
      return NextResponse.json(
        { error: "Admin role not allowed" },
        { status: 403 }
      );
    }*/

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          role_id,
        },
      ]);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
