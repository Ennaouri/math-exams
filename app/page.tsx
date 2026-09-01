import { getCategories, getExamPosts, getLatestPosts, getUpcomingLiveSessions } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import Link from "next/link";
import Script from "next/script";
import AdUnit from "./components/AdUnit";
import Image from "next/image";
import type { Category, Post } from "@/lib/types";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import LiveCountdownBanner from "./components/LiveCountdownBanner";

export const revalidate = 3600;

export const metadata = buildPageMetadata({
  title: "Cours, exercices et examens de maths au Maroc",
  description:
    "Ressources gratuites de mathématiques pour le programme marocain: cours, exercices corrigés, devoirs, examens nationaux et concours pour tronc commun, 1ère BAC et 2ème BAC.",
  path: "/",
});

export default async function Home() {
  let categories: Category[] = [];
  let posts: Post[] = [];
  let recentPosts: Post[] = [];
  let upcomingLives: any[] = [];

  try {
    [categories, posts, recentPosts, upcomingLives] = await Promise.all([
      getCategories(),
      getExamPosts(6),
      getLatestPosts(6),
      getUpcomingLiveSessions(3),
    ]);
  } catch (error) {
    console.error("Unable to load home data:", error);
  }
  const examPosts = posts;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Les ressources Maths-Exams suivent-elles le programme marocain ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. Les cours, exercices, devoirs et examens sont organisés autour du programme marocain du tronc commun, de la 1ère BAC, de la 2ème BAC et des concours.",
        },
      },
      {
        "@type": "Question",
        name: "Les élèves d'autres pays peuvent-ils utiliser le site ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. Les notions de mathématiques sont utiles aux élèves francophones d'autres pays, même si l'organisation principale suit le programme marocain.",
        },
      },
      {
        "@type": "Question",
        name: "Comment préparer un examen de mathématiques avec Maths-Exams ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Commencez par le cours du chapitre, entraînez-vous avec les exercices corrigés, puis passez aux devoirs et examens nationaux pour travailler en conditions réelles.",
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: SITE_URL,
      },
    ],
  };

  const itemListJsonLd = categories.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Niveaux scolaires – Mathématiques",
        description: "Liste des niveaux du programme marocain de mathématiques",
        itemListElement: categories.map((cat, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: cat.name,
          url: `${SITE_URL}/category/${cat.slug}`,
        })),
      }
    : null;

  return (
    <div>
      <Script
        id="home-faq-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="home-breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {itemListJsonLd && (
        <Script
          id="home-itemlist-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}

      {/* Live countdown banner */}
      {/* {upcomingLives.length > 0 && <LiveCountdownBanner lives={upcomingLives} />} */}

      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-500" aria-label="Fil d'Ariane">
        <ol className="flex items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-gray-700">Accueil</span>
            <meta itemProp="position" content="1" />
          </li>
        </ol>
      </nav>

      {/* Hero intro banner */}
      <section className="bg-white px-6 py-6 rounded-2xl border border-slate-200/80 shadow-sm mb-6">
        <h2 className="text-xl md:text-2xl font-black text-slate-900">
          Mathématiques du programme marocain : cours, exercices et examens corrigés
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Préparez les mathématiques du Tronc Commun, de la 1ère BAC, de la 2ème BAC et des concours post-bac avec des ressources pédagogiques conformes aux cadres de référence officiels.
        </p>
      </section>

      {/* <AdUnit slot="5512454890" format="fluid" layout="in-article" /> */}

      {/* Level cards */}
      <div id="niveaux" className="flex bg-slate-900 text-white px-5 py-3.5 justify-between items-center rounded-2xl mb-6 scroll-mt-28 shadow-sm">
        <h2 className="text-sm uppercase font-black tracking-wider text-white">
          📚 Niveaux Scolaires & Concours
        </h2>
        <span className="text-xs text-blue-300 font-semibold">Programme Officiel</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
        {categories.map((category, index) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer h-full flex flex-col justify-between">
              <div>
                {category.thumbnail && (
                  <div className="relative w-full h-44 bg-slate-100">
                    <Image
                      src={category.thumbnail}
                      alt={category.name}
                      fill
                      priority={index < 2}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-base font-black text-slate-900 hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="px-5 pb-4 pt-0">
                <span className="text-xs font-bold text-blue-600 inline-flex items-center gap-1">
                  Accéder aux chapitres & devoirs →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <section className="mt-10">
          <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
            <h2 className="text-base uppercase font-semibold font-roboto">
              Ressources récentes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/postdetails/${post.slug}`}
                className="block bg-white rounded shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100"
              >
                <h3 className="font-semibold text-gray-800">{post.name}</h3>
                {post.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{post.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Exam posts */}
      {examPosts.length > 0 && (
        <section className="mt-10">
          <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
            <h2 className="text-base uppercase font-semibold font-roboto">
              Préparation BAC et examens nationaux
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examPosts.map((post) => (
              <Link
                key={post.id}
                href={`/postdetails/${post.slug}`}
                className="block bg-white rounded shadow-sm hover:shadow-md transition-shadow p-4 border-l-4 border-blue-600"
              >
                <h3 className="font-semibold text-gray-800">{post.name}</h3>
                {post.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Study method */}
      <section className="mt-10 bg-white px-5 py-6 rounded-sm">
        <h2 className="text-xl font-bold text-gray-800">Méthode simple pour progresser en mathématiques</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-gray-800">1. Comprendre le cours</h3>
            <p className="mt-2 text-sm text-gray-600">Relisez les définitions, propriétés et exemples avant de commencer les exercices.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">2. S'entraîner par chapitre</h3>
            <p className="mt-2 text-sm text-gray-600">Travaillez les exercices corrigés pour maîtriser les méthodes classiques du programme.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">3. Passer aux examens</h3>
            <p className="mt-2 text-sm text-gray-600">Terminez par les devoirs et examens nationaux pour apprendre à gérer le temps et la rédaction.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10 bg-white px-5 py-6 rounded-sm">
        <h2 className="text-xl font-bold text-gray-800">Questions fréquentes</h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800">Les ressources suivent-elles le programme marocain ?</h3>
            <p className="mt-1 text-sm text-gray-600">Oui, le classement principal suit les niveaux et chapitres du programme marocain.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Le site est-il utile hors du Maroc ?</h3>
            <p className="mt-1 text-sm text-gray-600">Oui, les cours et exercices de mathématiques restent utiles pour les élèves francophones d'autres pays.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Est-ce que le site est gratuit ?</h3>
            <p className="mt-1 text-sm text-gray-600">Oui, toutes les ressources de Maths-Exams sont accessibles gratuitement. Aucune inscription n'est requise pour consulter les cours et exercices.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
