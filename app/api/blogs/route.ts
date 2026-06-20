import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

// 1. GET: Fetch All Blogs
export async function GET() {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "SUPABASE_UNCONFIGURED" }, { status: 503 });
    }

    const { data, error } = await supabaseServer
      .from("portfolio_blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map database snake_case fields back to frontend camelCase if needed
    const mappedData = (data || []).map((b: any) => ({
      id: b.id,
      slug: b.slug,
      title: b.title,
      summary: b.summary,
      content: b.content,
      category: b.category,
      date: b.date,
      readTime: b.read_time,
      coverImage: b.cover_image,
      author: b.author,
      tags: b.tags,
    }));

    return NextResponse.json(mappedData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. POST: Secure Create or Update Blog
export async function POST(request: Request) {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "SUPABASE_UNCONFIGURED" }, { status: 503 });
    }

    // Authentication Check
    const authHeader = request.headers.get("authorization");
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";

    if (authHeader !== expectedPassword) {
      return NextResponse.json({ error: "UNAUTHORIZED: Invalid credentials token" }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabaseServer
      .from("portfolio_blogs")
      .upsert({
        id: body.id,
        slug: body.slug,
        title: body.title,
        summary: body.summary,
        content: body.content,
        category: body.category,
        date: body.date,
        read_time: body.readTime || body.read_time,
        cover_image: body.coverImage || body.cover_image,
        author: body.author,
        tags: body.tags || [],
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. DELETE: Secure Delete Blog
export async function DELETE(request: Request) {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "SUPABASE_UNCONFIGURED" }, { status: 503 });
    }

    // Authentication Check
    const authHeader = request.headers.get("authorization");
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";

    if (authHeader !== expectedPassword) {
      return NextResponse.json({ error: "UNAUTHORIZED: Invalid credentials token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing parameter 'id'" }, { status: 400 });
    }

    const { error } = await supabaseServer
      .from("portfolio_blogs")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
