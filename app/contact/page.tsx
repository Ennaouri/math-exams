import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact | Maths-Exams',
  description: "Une question ? Besoin d'information ? Contactez notre équipe.",
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-screen-md mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Contactez-nous
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Une question sur nos cours, un besoin spécifique ou une assistance technique ? Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
          </p>
        </div>

        {/* Contact Form & Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
          <form className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                  Nom Complet *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ex: Ahmed B."
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-bold text-slate-700 mb-2">
                Sujet *
              </label>
              <select
                id="subject"
                required
                defaultValue=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
              >
                <option value="" disabled>Sélectionnez un sujet</option>
                <option value="inscription">Problème d'inscription / abonnement</option>
                <option value="cours">Question sur les cours ou séances live</option>
                <option value="technique">Support technique</option>
                <option value="autre">Autre demande</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">
                Votre Message *
              </label>
              <textarea
                id="message"
                required
                rows={5}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
                placeholder="Comment pouvons-nous vous aider ?"
              ></textarea>
            </div>

            <button
              type="button"
              className="w-full bg-[#0084c7] hover:bg-[#006ba1] text-white font-bold py-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 mt-4"
            >
              ENVOYER LE MESSAGE
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
            
          </form>
        </div>

        {/* Alternative contact info */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-8 text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
              <p className="font-semibold text-slate-800">contact@maths-exams.ma</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
