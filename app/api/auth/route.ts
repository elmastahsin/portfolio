import { NextResponse } from "next/server";
import { getAdminCredentials, generateSessionToken, isAuthorizedRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

// 1. GET: Verify session token validity
export async function GET(request: Request) {
  if (isAuthorizedRequest(request)) {
    return NextResponse.json({ valid: true });
  }
  return NextResponse.json({ valid: false, error: "Unauthorized" }, { status: 401 });
}

// 2. POST: Authenticate admin credentials and issue token
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    const { username: expectedUser, password: expectedPass } = getAdminCredentials();

    if (username === expectedUser && password === expectedPass) {
      const token = generateSessionToken(expectedPass);
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Authentication error" }, { status: 500 });
  }
}
