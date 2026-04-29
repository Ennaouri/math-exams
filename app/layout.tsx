import CategoriesSideBar from "./components/CategoriesSideBar";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import RandomPosts from "./components/RandomPosts";
import RightSide from "./components/RightSide";
import "./globals.css";
import Footer from "./components/Footer";
import type { Metadata } from "next";
import { getCategories, getPosts, getUnderCategories } from "@/lib/db";
import { Providers } from "./providers";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, seoKeywords } from "@/lib/seo";

export const dynamic = 'force-dynamic';

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

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();
  const posts = await getPosts();
  const undercategories = await getUnderCategories();

  const randomPosts1 = posts[getRandomInt(posts.length)];
  const randomPosts2 = posts[getRandomInt(posts.length)];
  const randomPosts3 = posts[getRandomInt(posts.length)];
  const randomPosts4 = posts[getRandomInt(posts.length)];

  const randomPosts = [randomPosts1, randomPosts2, randomPosts3, randomPosts4];
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
      </head>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5587331919297301" crossOrigin="anonymous" strategy="lazyOnload" />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_TRACKING_ID}');`}
      </Script>
      <Script
        id="website-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Script
        id="organization-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Providers>
      <body>
        <SpeedInsights />
        <main className="bg-gray-100 min-h-screen w-screen">
          <main className="max-w-screen-xl m-auto bg-white">
            <main>
              <Navbar />
              <Header />
              <main className="pt-12 bg-gray-100 pb-12">
                <div className="container mx-auto  flex flex-wrap lg:flex-nowrap">
                  <div className="w-full xl:w-3/12 hidden xl:block">
                    <CategoriesSideBar categories={categories} />
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
                    <RandomPosts posts={randomPosts} />
                    <div className="mt-4">
                      <RightSide undercategories={undercategories} />
                    </div>
                    
                  </div>
                  <div className="xl:w-9/12 lg:w-9/12 w-full  xl:ml-6 lg:mr-6">
                    {children}
                  </div>
                </div>
              </main>
            </main>
            <Footer />
          </main>
        </main>
        
      </body>
      </Providers>
    </html>
  );
}
