import CategoriesSideBar from "./components/CategoriesSideBar";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import RandomPosts from "./components/RandomPosts";
import RightSide from "./components/RightSide";
import "./globals.css";
import Footer from "./components/Footer";
import type { Metadata } from "next";
import { getCategories, getLatestPosts, getLatestUnderCategories } from "@/lib/db";
import { Providers } from "./providers";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, seoKeywords } from "@/lib/seo";
import type { Category, Post, UnderCategory } from "@/lib/types";


// Revalidate layout data once per hour instead of force-dynamic on every request
export const revalidate = 3600;

const isProduction = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  title: {
    default: "Maths-Exams | Mathématiques du programme marocain",
    template: "%s | Maths-Exams",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: seoKeywords,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "education",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    languages: {
      "fr-MA": SITE_URL,
      fr: SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Maths-Exams | Cours, exercices et examens de maths",
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Maths-Exams - ressources de mathématiques",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maths-Exams | Mathématiques du programme marocain",
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export interface CategoryCardType {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  slug: string;
}

/** Pick N unique random items from an array (no duplicates). */
function pickUniqueRandom<T>(arr: T[], count: number): T[] {
  if (!arr.length) return [];
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: Category[] = [];
  let posts: Post[] = [];
  let undercategories: UnderCategory[] = [];

  try {
    [categories, posts, undercategories] = await Promise.all([
      getCategories(),
      getLatestPosts(8),
      getLatestUnderCategories(4),
    ]);
  } catch (error) {
    console.error("Unable to load layout data:", error);
  }

  const randomPosts = pickUniqueRandom(posts, 4);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "fr-MA",
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    areaServed: ["MA", "FR", "BE", "CA"],
    knowsAbout: ["Mathématiques", "Baccalauréat marocain", "Examens nationaux", "Concours"],
  };

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <Providers>
          {isProduction && (
            <>
              <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5587331919297301"
                crossOrigin="anonymous"
                strategy="lazyOnload"
              />
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                strategy="afterInteractive"
              />
              <Script id="gtag-init" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_TRACKING_ID}');`}
              </Script>
            </>
          )}
          <SpeedInsights />
          <div className="bg-gray-100 dark:bg-slate-900 min-h-screen w-screen transition-colors">
            <div className="max-w-screen-xl m-auto bg-white dark:bg-slate-900 transition-colors">
              <Navbar categories={categories} />
              <Header />
              <div className="pt-12 bg-gray-100 dark:bg-slate-900 pb-12 transition-colors">
                <div className="container mx-auto flex flex-wrap lg:flex-nowrap">
                  <aside className="w-full xl:w-3/12 hidden xl:block" aria-label="Barre latérale">
                    <CategoriesSideBar categories={categories} />
                    {isProduction && (
                      <div style={{ overflow: "hidden", margin: "5px" }}>
                        <ins
                          className="adsbygoogle"
                          style={{ display: "block" }}
                          data-ad-format="autorelaxed"
                          data-ad-client="ca-pub-5587331919297301"
                          data-ad-slot="1112602893"
                          data-full-width-responsive="true"
                          data-ad-status="unfilled"
                        ></ins>
                      </div>
                    )}
                    {randomPosts.length > 0 && <RandomPosts posts={randomPosts} />}
                    <div className="mt-4">
                      <RightSide undercategories={undercategories} />
                    </div>
                  </aside>
                  <main className="xl:w-9/12 lg:w-9/12 w-full xl:ml-6 lg:mr-6" id="main-content">
                    {children}
                  </main>
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
