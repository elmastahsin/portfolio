import "server-only";
import crypto from "node:crypto";

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME || process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
  return { username, password };
}

export function generateSessionToken(password: string): string {
  return crypto.createHash("sha256").update(`${password}_portfolio_secure_salt_2026`).digest("hex");
}

export function isAuthorizedRequest(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
  const { password } = getAdminCredentials();
  const validToken = generateSessionToken(password);

  return token === validToken || token === password;
}
