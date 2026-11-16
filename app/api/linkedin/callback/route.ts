import { NextResponse } from "next/server";
import { completeAuthorization, getSiteUrl } from "@/lib/linkedin";

export const dynamic = "force-dynamic";

// GET: LinkedIn redirects here after consent. Protected by the one-time OAuth state.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const target = new URL("/admin", getSiteUrl());

  if (!code || !state) {
    target.searchParams.set("linkedin", searchParams.get("error") || "missing_code");
    return NextResponse.redirect(target);
  }

  try {
    await completeAuthorization(code, state);
    target.searchParams.set("linkedin", "connected");
  } catch (err) {
    console.error("LinkedIn OAuth callback failed", err);
    target.searchParams.set("linkedin", "failed");
  }
  return NextResponse.redirect(target);
}
