import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import Image from 'next/image';

export const metadata: Metadata = buildPageMetadata({
  title: 'À propos | Maths-Exams',
  description: "Découvrez Maths-Exams, votre partenaire d'excellence pour la réussite en mathématiques au collège et lycée.",
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-100 pt-20 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Notre Mission : <span className="text-[#0084c7]">Votre Réussite.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
          Maths-Exams est né d'une conviction simple : chaque élève a le potentiel d'exceller en mathématiques s'il est accompagné avec la bonne méthode. Nous avons conçu cette plateforme pour vous offrir une longueur d'avance.
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 mt-16">
        
        {/* Story Section */}
        <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden relative shadow-xl">
              <Image 
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Enseignement et Mathématiques" 
                fill 
                className="object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full -z-10 blur-2xl opacity-70"></div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl font-black text-slate-900">Plus qu'une plateforme, un accompagnement sur mesure.</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Face aux exigences grandissantes du programme de mathématiques (au Collège, au Lycée et lors de la préparation au Baccalauréat), de nombreux élèves se sentent parfois dépassés. 
            </p>
            <p className="text-slate-600 leading-relaxed text-lg">
              C'est pour répondre à ce besoin que nous avons rassemblé Monsieur Mohammed Ennaouri, professeur de mathématiques expérimenté et passionné. Notre objectif : déconstruire la complexité des mathématiques, proposer des cours clairs, des exercices d'application corrigés pas à pas, et des annales d'examens nationaux décortiquées.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Ce qui fait notre différence</h2>
            <p className="text-slate-500">Une approche pédagogique axée sur la compréhension profonde et l'entraînement ciblé.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Pédagogie Structurée</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Des cours allant de l'essentiel à l'approfondissement, conçus pour vous faire progresser étape par étape, sans brûler les étapes.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Séances Live Interactives</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Le contact humain reste primordial. Posez vos questions en direct à votre professeur lors de nos visioconférences régulières.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Focus sur l'Examen</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Des centaines d'examens nationaux corrigés. Nous vous apprenons la méthodologie pour rédiger correctement vos réponses le jour J.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#111827] rounded-3xl p-10 md:p-16 text-center text-white">
          <h2 className="text-3xl font-black mb-6">Prêt à booster vos notes en Maths ?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d'élèves qui font confiance à Maths-Exams pour leur réussite scolaire.
          </p>
          <a href="/login" className="inline-block bg-[#0084c7] hover:bg-[#006ba1] text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-md shadow-blue-500/20">
            Commencer dès maintenant
          </a>
        </div>

      </div>
    </div>
  );
}
