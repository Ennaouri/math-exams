import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Équipe pédagogique Maths-Exams",
  description:
    "Présentation de l'approche pédagogique de Maths-Exams pour les cours, exercices, examens et corrections de mathématiques.",
  path: "/equipe-pedagogique",
});

export default function EquipePedagogiquePage() {
  return (
    <article className="bg-white rounded-sm p-5 md:p-8 shadow-sm">
      <nav className="mb-4 text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-red-600">Accueil</Link></li>
          <li>/</li>
          <li className="text-gray-700">Équipe pédagogique</li>
        </ol>
      </nav>
      <h1 className="text-3xl font-bold text-gray-800">Équipe pédagogique Maths-Exams</h1>
      <p className="mt-4 leading-7 text-gray-700">
        Maths-Exams propose des ressources de mathématiques pensées pour aider les élèves à comprendre les notions, s'entraîner progressivement et préparer les examens avec des corrections claires.
      </p>
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Notre approche</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800">Clarté</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Les contenus sont organisés par niveau, chapitre et type de ressource pour faciliter les révisions.
            </p>
          </div>
          <div className="rounded-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800">Progression</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Les élèves peuvent passer du cours aux exercices, puis aux devoirs et examens corrigés.
            </p>
          </div>
          <div className="rounded-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800">Utilité</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Les ressources ciblent les notions les plus fréquentes dans les évaluations et examens.
            </p>
          </div>
        </div>
      </section>
      <section className="mt-8 rounded-sm bg-gray-50 p-5">
        <h2 className="text-xl font-semibold text-gray-800">Pour les élèves et les parents</h2>
        <p className="mt-2 leading-7 text-gray-700">
          Le site est conçu pour être simple à utiliser: choisissez le niveau, ouvrez le chapitre, puis travaillez les ressources dans l'ordre. Pour toute question ou suggestion de contenu, vous pouvez nous contacter.
        </p>
        <Link
          href="/contactus"
          className="mt-4 inline-flex rounded-sm bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Contacter Maths-Exams
        </Link>
      </section>
    </article>
  );
}
