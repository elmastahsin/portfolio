import fs from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { hasValidSessionCookie } from "@/lib/auth";

// Serves the private int-prep build (third-party course content). The files live on the server in
// LEARN_DIST_DIR, never in this public repo, and every request needs the admin session cookie.
const BASE = "/admin/learn/";

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
  ".txt": "text/plain; charset=utf-8",
};

const reply = (status: number, headers: Record<string, string> = {}, body: BodyInit | null = null) =>
  new Response(body, { status, headers: { "X-Robots-Tag": "noindex", ...headers } });

export async function GET(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  if (!hasValidSessionCookie(request)) {
    // pages go to the login screen; assets and service-worker fetches just fail
    return request.headers.get("sec-fetch-mode") === "navigate"
      ? reply(302, { Location: `/admin/login?next=${encodeURIComponent(BASE)}` })
      : reply(401);
  }
  // the app's relative URLs and service-worker scope need the trailing slash
  if (request.nextUrl.pathname === BASE.slice(0, -1)) return reply(308, { Location: BASE });

  const root = process.env.LEARN_DIST_DIR;
  if (!root) return reply(503);
  const rootDir = path.resolve(root);
  const file = path.resolve(rootDir, (await params).path?.join("/") || "index.html");
  if (!file.startsWith(rootDir + path.sep)) return reply(404);

  let body: Buffer;
  try {
    body = await fs.readFile(file);
  } catch {
    return reply(404);
  }
  const hashed = file.startsWith(path.join(rootDir, "assets") + path.sep);
  return reply(200, {
    "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream",
    "Cache-Control": hashed ? "private, max-age=31536000, immutable" : "private, no-cache",
  }, new Uint8Array(body));
}
