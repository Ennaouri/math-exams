import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Méthodologie pour réussir le BAC en mathématiques",
  description:
    "Méthode de préparation au BAC de mathématiques: organiser les révisions, travailler les cours, exercices corrigés et examens nationaux.",
  path: "/methodologie-bac",
});

const steps = [
  {
    title: "Revoir le cours avant les exercices",
    text: "Commencez par les définitions, propriétés et exemples corrigés. Une méthode comprise dans le cours devient plus facile à reconnaître dans un exercice.",
  },
  {
    title: "Classer les exercices par méthode",
    text: "Pour chaque chapitre, notez les techniques répétées: calcul de limite, étude de signe, dérivation, tableau de variation, probabilités ou nombres complexes.",
  },
  {
    title: "Travailler les examens nationaux",
    text: "Quand les bases sont solides, passez aux sujets du BAC. Chronométrez-vous et corrigez votre rédaction, pas seulement le résultat final.",
  },
  {
    title: "Revenir sur les erreurs",
    text: "Gardez une liste courte de vos erreurs fréquentes. Relisez-la avant chaque devoir ou examen pour éviter de répéter les mêmes blocages.",
  },
];

export default function MethodologieBacPage() {
  return (
    <article className="bg-white rounded-sm p-5 md:p-8 shadow-sm">
      <nav className="mb-4 text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-red-600">Accueil</Link></li>
          <li>/</li>
          <li className="text-gray-700">Méthodologie BAC</li>
        </ol>
      </nav>
      <h1 className="text-3xl font-bold text-gray-800">
        Méthodologie pour réussir le BAC en mathématiques
      </h1>
      <p className="mt-4 leading-7 text-gray-700">
        Réussir les mathématiques au BAC demande une méthode régulière. Il ne suffit pas de lire les corrections: il faut comprendre les idées du cours, reconnaître les méthodes classiques et apprendre à rédiger clairement.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        {steps.map((step, index) => (
          <section key={step.title} className="rounded-sm border border-gray-100 p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-sm bg-blue-600 text-white font-bold">
              {index + 1}
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{step.title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{step.text}</p>
          </section>
        ))}
      </div>
      <section className="mt-8 rounded-sm bg-blue-50 p-5">
        <h2 className="text-xl font-semibold text-gray-800">Plan de travail conseillé</h2>
        <p className="mt-2 leading-7 text-gray-700">
          Travaillez un chapitre à la fois: cours, exercices directs, exercices de synthèse, puis examens. Sur Maths-Exams, utilisez les catégories par niveau pour avancer dans cet ordre et garder une progression claire.
        </p>
        <Link
          href="/#niveaux"
          className="mt-4 inline-flex rounded-sm bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Voir les niveaux
        </Link>
      </section>
    </article>
  );
}
