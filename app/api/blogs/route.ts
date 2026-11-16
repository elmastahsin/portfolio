import { NextResponse } from "next/server";
import { deleteBlog, getBlog, getBlogs, saveBlog } from "@/lib/database";
import { isAuthorizedRequest } from "@/lib/auth";
import { isPublished } from "@/data/blogs";

export const dynamic = "force-dynamic";

// 1. GET: Fetch blogs — drafts are only visible to the admin
export async function GET(request: Request) {
  try {
    const blogs = await getBlogs();
    return NextResponse.json(isAuthorizedRequest(request) ? blogs : blogs.filter(isPublished));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. POST: Secure Create or Update Blog
export async function POST(request: Request) {
  try {
    // Authentication Check
    if (!isAuthorizedRequest(request)) {
      return NextResponse.json({ error: "UNAUTHORIZED: Invalid credentials token" }, { status: 401 });
    }

    const body = await request.json();

    // Merge onto the stored post so editors that only send the basic fields
    // keep the draft status, translation and LinkedIn metadata intact.
    const existing = body.id ? await getBlog(body.id) : null;

    return NextResponse.json(await saveBlog({
      ...existing,
      ...body,
      readTime: body.readTime || body.read_time || existing?.readTime,
      coverImage: body.coverImage || body.cover_image || existing?.coverImage,
      tags: body.tags || existing?.tags || [],
    }));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. DELETE: Secure Delete Blog
export async function DELETE(request: Request) {
  try {
    // Authentication Check
    if (!isAuthorizedRequest(request)) {
      return NextResponse.json({ error: "UNAUTHORIZED: Invalid credentials token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing parameter 'id'" }, { status: 400 });
    }

    await deleteBlog(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
