import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "À propos de Maths-Exams",
  description:
    "Découvrez Maths-Exams, une plateforme de cours, exercices, examens et concours de mathématiques pour le programme marocain et les élèves francophones.",
  path: "/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
