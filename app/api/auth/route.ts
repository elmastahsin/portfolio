import { NextResponse } from "next/server";
import { getAdminCredentials, generateSessionToken, isAuthorizedRequest, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

// httpOnly copy of the token: plain page/asset requests (e.g. /admin/learn) can't send the Authorization header
const COOKIE_OPTIONS = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 30 };

// Brute-force brake for the login form.
// shortcut: in-memory per container, resets on restart; move to a shared store if the site ever runs more than one instance.
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function tooManyAttempts(request: Request): boolean {
  // behind the Cloudflare tunnel; the port is bound to localhost, so the header can't be forged from outside
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const now = Date.now();
  if (attempts.size > 10_000) attempts.forEach((v, k) => v.resetAt < now && attempts.delete(k));
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  return ++entry.count > MAX_ATTEMPTS;
}

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
  if (tooManyAttempts(request)) {
    return NextResponse.json({ error: "Too many login attempts, try again later" }, { status: 429 });
  }
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
