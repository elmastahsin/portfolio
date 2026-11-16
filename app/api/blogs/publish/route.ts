import { NextResponse } from "next/server";
import { getBlog, saveBlog } from "@/lib/database";
import { isAuthorizedRequest } from "@/lib/auth";
import { shareBlogPost } from "@/lib/linkedin";

export const dynamic = "force-dynamic";

// POST: Admin-only — publish a draft on the site, then share it on LinkedIn.
// Calling it again for an already published post retries only the LinkedIn share.
export async function POST(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED: Invalid credentials token" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const shareToLinkedIn = searchParams.get("linkedin") !== "false";
    if (!id) {
      return NextResponse.json({ error: "Missing parameter 'id'" }, { status: 400 });
    }

    let post = await getBlog(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.status === "draft") {
      post = await saveBlog({
        ...post,
        status: "published",
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      });
    }

    if (!shareToLinkedIn || post.linkedinPostUrn) {
      return NextResponse.json({ post, linkedin: post.linkedinPostUrn ? "already_shared" : "skipped" });
    }

    try {
      const urn = await shareBlogPost(post);
      post = await saveBlog({ ...post, linkedinPostUrn: urn, linkedinSharedAt: new Date().toISOString() });
      return NextResponse.json({ post, linkedin: "shared" });
    } catch (err: any) {
      // The post is live on the site either way; report the LinkedIn failure so it can be retried.
      return NextResponse.json({ post, linkedin: "failed", linkedinError: err.message });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
