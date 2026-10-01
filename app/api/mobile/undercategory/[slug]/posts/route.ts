import { NextRequest, NextResponse } from "next/server";
import { getPostsByUnderCategorySlug, getUnderCategoryBySlug } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug est requis" }, { status: 400 });
    }

    const underCategory = await getUnderCategoryBySlug(slug);
    
    if (!underCategory) {
      return NextResponse.json({ error: "Sous-catégorie non trouvée" }, { status: 404 });
    }

    const posts = await getPostsByUnderCategorySlug(slug);

    return NextResponse.json({
      underCategory,
      posts
    });
  } catch (error: any) {
    console.error("API /api/mobile/undercategory/[slug]/posts error:", error);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}
