import { getCategories } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export const metadata = buildPageMetadata({
  title: "Cours, exercices et examens de maths au Maroc",
  description:
    "Ressources gratuites de mathématiques pour le programme marocain: cours, exercices corrigés, devoirs, examens nationaux et concours pour tronc commun, 1ère BAC et 2ème BAC.",
  path: "/",
});

export default async function Home() {
  const categories = await getCategories();

  return (
    <div>
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
    </div>
  );
}
