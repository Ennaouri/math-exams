import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Recherche de ressources de mathématiques",
  description:
    "Recherchez des cours, exercices corrigés, devoirs et examens de mathématiques sur Maths-Exams.",
  path: "/search",
  noIndex: true,
});

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
