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

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: "Mathématiques Du Secondaire | Examens | Exercice | Concours",
    template: "%s | Maths-Exams",
  },
  description: "Les solutions de tous les examens de maths du secondaire qualifiants (BAC) ainsi que la correction des concours des grandes écoles. Vidéos explicatifs et corrections détaillées.",
  keywords: ["maths", "Mathématiques", "exams", "Secondaire", "exercices", "bac", "examens", "concours", "solution", "correction", "tronc commun", "1ere", "maths bac"],
  metadataBase: new URL("https://maths-exams.com"),
  alternates: {
    canonical: "https://maths-exams.com",
    languages: {
      fr: "https://maths-exams.com",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://maths-exams.com",
    siteName: "Maths-Exams",
    title: "Mathématiques Du Secondaire | Examens | Exercice | Concours",
    description: "Les solutions de tous les examens de maths du secondaire qualifiants (BAC) ainsi que la correction des concours des grandes écoles.",
    images: [
      {
        url: "https://maths-exams.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maths-Exams - Examens et Concours de Mathématiques",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mathématiques Du Secondaire | Examens | Exercice | Concours",
    description: "Les solutions de tous les examens de maths du secondaire qualifiants (BAC) ainsi que la correction des concours des grandes écoles.",
    images: ["https://maths-exams.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "google-site-verification-code",
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

  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5587331919297301" crossOrigin="anonymous" strategy="lazyOnload" />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_TRACKING_ID}');`}
      </Script>
      <Providers>
      <body>
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
