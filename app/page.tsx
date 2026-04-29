import { getCategories, getExamPosts, getLatestPosts } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import Link from "next/link";
import Script from "next/script";
import AdUnit from "./components/AdUnit";
import type { Category, Post } from "@/lib/types";

export const dynamic = 'force-dynamic';

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

  try {
    [categories, posts, recentPosts] = await Promise.all([
      getCategories(),
      getExamPosts(6),
      getLatestPosts(6),
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

  return (
    <div>
      <Script
        id="home-faq-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <nav className="mb-4 text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li className="text-gray-700">Accueil</li>
        </ol>
      </nav>
      <section className="bg-white px-5 py-6 rounded-sm mb-5">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Mathématiques du programme marocain: cours, exercices et examens corrigés
        </h1>
        <p className="mt-3 text-gray-600 leading-relaxed">
          Préparez les mathématiques du tronc commun, de la 1ère BAC, de la 2ème BAC et des concours avec des ressources claires, utiles au Maroc et accessibles aux élèves d'autres pays francophones.
        </p>
      </section>
      <AdUnit slot="5512454890" format="fluid" layout="in-article" />
      <div id="niveaux" className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5 scroll-mt-32">
        <h2 className="text-base uppercase font-semibold font-roboto">
          Niveaux et Concours
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            <div className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              {category.thumbnail && (
                <img 
                  src={category.thumbnail} 
                  alt={category.name} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
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
        </div>
      </section>
    </div>
  );
}
