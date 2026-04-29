import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "À propos de Maths-Exams",
  description:
    "Découvrez Maths-Exams, une plateforme de cours, exercices, examens et concours de mathématiques pour le programme marocain et les élèves francophones.",
  path: "/about",
});

const stats = [
  { value: "500+", label: "Examens Corrigés" },
  { value: "50+", label: "Catégories" },
  { value: "10K+", label: "Utilisateurs" },
  { value: "100+", label: "Vidéos Explicatives" },
];

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Corrections Détaillées",
    description: "Des solutions complètes et expliquées pas à pas pour chaque exercice.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Tous les Niveaux",
    description: "Du tronc commun au baccalauréat, pour toutes les filières scientifiques.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Vidéos Explicatives",
    description: "Des tutoriels vidéo pour mieux comprendre les méthodes de résolution.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Équipe Professionnelle",
    description: "Des enseignants expérimentés et des examinateurs certifiés.",
  },
];

const About = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          À Propos de <span className="text-blue-600">Maths-Exams</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Votre plateforme de référence pour la réussite en mathématiques au Maroc
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
            <div className="text-sm md:text-base opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Qui Sommes-Nous ?
        </h2>
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="mb-6">
            <strong className="text-blue-600">Maths-Exams</strong> est la première plateforme éducative
            dédiée aux examens et concours de mathématiques au Maroc et au Maghreb. Nous avons pour mission
            de rendre accessible à tous les élèves et étudiants les meilleures ressources pour réussir
            leurs examens.
          </p>
          <p className="mb-6">
            Fondée par une équipe d&apos;enseignants passionnés et d&apos;anciens examinateurs du baccalauréat,
            notre plateforme propose des centaines de sujets d&apos;examens corrigés, des exercices interactifs
            et des vidéos explicatives pour vous aider à maîtriser les concepts mathématiques.
          </p>
          <p>
            Que vous soyez élève au <strong>tronc commun</strong>, en <strong>1ère année BAC</strong> ou en
            <strong> 2ème année BAC</strong> (PC, SVT ou SM), vous trouverez ici toutes les ressources
            nécessaires pour exceller en mathématiques.
          </p>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
        Pourquoi Choisir Maths-Exams ?
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl shadow-lg p-8 md:p-12 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Prêt à Réussir vos Examens ?
        </h2>
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          Rejoignez des milliers d&apos;étudiants qui font confiance à Maths-Exams pour préparer leur baccalauréat.
        </p>
        <Link
          href="/"
          className="inline-flex items-center bg-white text-blue-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors duration-300"
        >
          Commencer Gratuitement
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      <div className="mt-16 bg-gray-50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Nos Partenaires</h3>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="text-gray-400 font-semibold text-lg">Université Mohammed V</div>
          <div className="text-gray-400 font-semibold text-lg">ENSAM Rabat</div>
          <div className="text-gray-400 font-semibold text-lg">EMI</div>
          <div className="text-gray-400 font-semibold text-lg">INPT</div>
        </div>
      </div>
    </div>
  );
};

export default About;
