import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos | Maths-Exams",
  description: "À propos de Maths-Exams - La plateforme éducative pour les examens et concours de mathématiques au Maroc et au Maghreb.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}