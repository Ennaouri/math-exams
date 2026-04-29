import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Maths-Exams",
  description:
    "Contactez Maths-Exams pour une question sur les cours, exercices, examens corrigés ou concours de mathématiques.",
  path: "/contactus",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
