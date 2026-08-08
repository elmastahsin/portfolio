import { NextResponse } from "next/server";
import { getProfile, saveProfile } from "@/lib/database";
import { isAuthorizedRequest } from "@/lib/auth";

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
    if (!isAuthorizedRequest(request)) {
      return NextResponse.json({ error: "UNAUTHORIZED: Invalid credentials token" }, { status: 401 });
    }

    const body = await request.json();

    return NextResponse.json(await saveProfile(body));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
