import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Maths-Exams",
  description: "Contactez Maths-Exams pour toute question sur les examens et concours de mathématiques.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}