import { NextResponse } from "next/server";
import { getAdminCredentials, generateSessionToken, isAuthorizedRequest, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

// httpOnly copy of the token: plain page/asset requests (e.g. /admin/learn) can't send the Authorization header
const COOKIE_OPTIONS = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 30 };

// 1. GET: Verify session token validity (and refresh the session cookie)
export async function GET(request: Request) {
  const credentials = getAdminCredentials();
  if (credentials && isAuthorizedRequest(request)) {
    const response = NextResponse.json({ valid: true });
    response.cookies.set(SESSION_COOKIE, generateSessionToken(credentials.password), COOKIE_OPTIONS);
    return response;
  }
  return NextResponse.json({ valid: false, error: "Unauthorized" }, { status: 401 });
}

// 2. POST: Authenticate admin credentials and issue token
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    const credentials = getAdminCredentials();

    if (credentials && username === credentials.username && password === credentials.password) {
      const token = generateSessionToken(credentials.password);
      const response = NextResponse.json({ success: true, token });
      response.cookies.set(SESSION_COOKIE, token, COOKIE_OPTIONS);
      return response;
    }

    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Authentication error" }, { status: 500 });
  }
}

// 3. DELETE: Logout, drop the session cookie
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  return response;
}
