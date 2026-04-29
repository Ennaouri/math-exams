import type { Metadata } from "next";

export const SITE_URL = "https://maths-exams.com";
export const SITE_NAME = "Maths-Exams";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

export const DEFAULT_DESCRIPTION =
  "Cours, exercices, devoirs, examens nationaux et corrigés de mathématiques pour le programme marocain: tronc commun, 1ère BAC, 2ème BAC et concours.";

export const seoKeywords = [
  "mathématiques Maroc",
  "maths programme marocain",
  "cours maths lycée",
  "exercices maths corrigés",
  "examens nationaux maths",
  "correction bac maths",
  "tronc commun sciences",
  "1ère année bac",
  "2ème année bac",
  "bac PC SVT",
  "bac sciences maths",
  "concours mathématiques",
];

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  type = "website",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: {
  title: string;
  description?: string | null;
  path?: string;
  type?: "website" | "article";
  image?: string | null;
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image || DEFAULT_OG_IMAGE);

  return {
    title,
    description: description || DEFAULT_DESCRIPTION,
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      locale: "fr_MA",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description: description || DEFAULT_DESCRIPTION,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || DEFAULT_DESCRIPTION,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
