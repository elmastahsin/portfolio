import { NextResponse } from "next/server";
import { getProfile, saveProfile } from "@/lib/database";

export const dynamic = "force-dynamic";

// 1. GET: Fetch Profile
export async function GET() {
  try {
    return NextResponse.json(await getProfile());
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. POST: Secure Profile Update
export async function POST(request: Request) {
  try {
    // Authentication Check
    const authHeader = request.headers.get("authorization");
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!expectedPassword || authHeader !== expectedPassword) {
      return NextResponse.json({ error: "UNAUTHORIZED: Invalid credentials token" }, { status: 401 });
    }

    const body = await request.json();

    return NextResponse.json(await saveProfile(body));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
