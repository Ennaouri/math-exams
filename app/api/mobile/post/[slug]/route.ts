import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, getPostDetailsByPostSlug } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug est requis" }, { status: 400 });
    }

    const post = await getPostBySlug(slug);
    
    if (!post) {
      return NextResponse.json({ error: "Post non trouvé" }, { status: 404 });
    }

    const postDetails = await getPostDetailsByPostSlug(slug);

    return NextResponse.json({
      post,
      postDetails
    });
  } catch (error: any) {
    console.error("API /api/mobile/post/[slug] error:", error);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}
