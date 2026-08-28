import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import { getSubscriptionPlans } from '@/lib/db';
import PricingClient from './PricingClient';

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Formules d'Abonnement & Tarifs | Maths-Exams",
  description:
    "Découvrez nos formules d'accompagnement d'excellence en mathématiques : séances en direct (Lives), replays, fiches de synthèse, exercices corrigés et préparation intensive au Baccalauréat.",
  path: "/tarifs",
});

export default async function TarifsPage() {
  const plans = await getSubscriptionPlans();

  return (
    <div className="py-8">
      {/* Hero section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
          ✨ Formules d'Accompagnement & Réussite
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Investissez dans l'excellence en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Mathématiques</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Choisissez le pack adapté à votre filière : séances interactives en direct (Lives), replays illimités, résumés de cours et téléchargement des séries corrigées type Examen National.
        </p>
      </div>

      <PricingClient initialPlans={plans} />

      {/* Features & Guarantees */}
      <section className="mt-16 bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 text-center mb-8">
          Pourquoi plus de 10 000 élèves et parents choisissent Maths-Exams ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0">
              🎯
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Enseignants Spécialisés BAC & Concours</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Des professeurs chevronnés qui connaissent parfaitement le barème et les pièges classiques de l'Examen National marocain.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl shrink-0">
              🎥
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Lives Interactifs & Replays 24/7</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Posez vos questions en direct pendant la séance et révisez à tout moment grâce aux enregistrements HD archivés.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl shrink-0">
              📥
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Supports PDF Téléchargeables</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Polycopiés complets de cours, résumés de formules, devoirs surveillés et séries avec solutions pas à pas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 bg-slate-50 border border-slate-200/70 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Questions fréquentes sur les abonnements</h2>
        <div className="space-y-4 text-sm">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-semibold text-slate-800">Comment se déroulent les séances Live ?</h3>
            <p className="text-slate-600 mt-1 text-xs leading-relaxed">
              Les séances ont lieu en soirée ou le week-end via notre salle privée interactive (Zoom / Google Meet). Vous recevez un lien de connexion et une notification de rappel sur WhatsApp avant chaque séance.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-semibold text-slate-800">Un parent peut-il payer et suivre les cours pour son enfant ?</h3>
            <p className="text-slate-600 mt-1 text-xs leading-relaxed">
              Absolument ! Le parent peut créer un compte Parent, souscrire à la formule pour le niveau de son enfant et rattacher le compte élève pour suivre ses présences et plannings.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-semibold text-slate-800">Quels sont les modes de paiement acceptés au Maroc ?</h3>
            <p className="text-slate-600 mt-1 text-xs leading-relaxed">
              Nous acceptons le virement / versement bancaire (Attijariwafa Bank, CIH, BMCE, etc.), le paiement par carte bancaire marocaine / internationale ou via agence Wafacash / Cash Plus.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
