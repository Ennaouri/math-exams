import { NextRequest, NextResponse } from "next/server";
import { getCategoryBySlug, getUnderCategoriesByCategorySlug } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({ error: "Slug est requis" }, { status: 400 });
    }

    const category = await getCategoryBySlug(slug);
    
    if (!category) {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 });
    }

    const underCategories = await getUnderCategoriesByCategorySlug(slug);

    return NextResponse.json({
      category,
      underCategories
    });
  } catch (error: any) {
    console.error("API /api/mobile/category/[slug] error:", error);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}
