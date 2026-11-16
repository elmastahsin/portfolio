import "server-only";
import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "admin_token";

// No defaults: the admin area also gates private content, so missing env vars must lock everyone out.
export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  return username && password ? { username, password } : null;
}

export function generateSessionToken(password: string): string {
  return crypto.createHash("sha256").update(`${password}_portfolio_secure_salt_2026`).digest("hex");
}

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

// The raw password is accepted too: scripts/weekly-blog.mjs sends it as its token. The token is derived
// from the password with a public salt, so this grants nothing the password doesn't already.
function isValidToken(token: string | undefined): boolean {
  const credentials = getAdminCredentials();
  if (!credentials || !token) return false;
  return safeEqual(token, generateSessionToken(credentials.password)) || safeEqual(token, credentials.password);
}

export function isAuthorizedRequest(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  return isValidToken(authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader);
}

export function hasValidSessionCookie(request: NextRequest): boolean {
  return isValidToken(request.cookies.get(SESSION_COOKIE)?.value);
}
