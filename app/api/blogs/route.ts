import { NextResponse } from "next/server";
import { deleteBlog, getBlogs, saveBlog } from "@/lib/database";
import { isAuthorizedRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

// 1. GET: Fetch All Blogs
export async function GET() {
  try {
    return NextResponse.json(await getBlogs());
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

    return NextResponse.json(await saveBlog({
      ...body,
      readTime: body.readTime || body.read_time,
      coverImage: body.coverImage || body.cover_image,
      tags: body.tags || [],
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
