import { NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/lib/auth";
import { createAuthorizationUrl, disconnectLinkedIn, getLinkedInStatus } from "@/lib/linkedin";

export const dynamic = "force-dynamic";

// 1. GET: Admin-only — connection status
export async function GET(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED: Invalid credentials token" }, { status: 401 });
  }
  return NextResponse.json(await getLinkedInStatus());
}

// 2. POST: Admin-only — start the OAuth flow; the client redirects to the returned URL
export async function POST(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED: Invalid credentials token" }, { status: 401 });
  }
  try {
    return NextResponse.json({ url: await createAuthorizationUrl() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. DELETE: Admin-only — forget the stored token
export async function DELETE(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED: Invalid credentials token" }, { status: 401 });
  }
  await disconnectLinkedIn();
  return NextResponse.json({ success: true });
}
