import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json({ session: null }, { status: 500 });
  }
}