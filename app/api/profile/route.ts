import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

// 1. GET: Fetch Profile
export async function GET() {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "SUPABASE_UNCONFIGURED" }, { status: 503 });
    }

    const { data, error } = await supabaseServer
      .from("portfolio_profile")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. POST: Secure Profile Update
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
      .from("portfolio_profile")
      .upsert({
        id: 1,
        name: body.name,
        title: body.title,
        tagline: body.tagline,
        location: body.location,
        email: body.email,
        cv_url: body.cvUrl || body.cv_url,
        profile_image: body.profileImage || body.profile_image,
        theme_color: body.themeColor || body.theme_color,
        socials: body.socials,
        about: body.about,
        skills: body.skills,
        updated_at: new Date().toISOString(),
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
