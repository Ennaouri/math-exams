import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import { createTranslator } from 'next-intl';

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact | Maths-Exams',
  description: "Une question ? Besoin d'information ? Contactez notre équipe.",
  path: '/contact',
});

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages, namespace: 'Contact' });

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-screen-md mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Contact Form & Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
          <form className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                  {t('nameLabel')}
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={t('namePlaceholder')}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                  {t('emailLabel')}
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={t('emailPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-bold text-slate-700 mb-2">
                {t('subjectLabel')}
              </label>
              <select
                id="subject"
                required
                defaultValue=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
              >
                <option value="" disabled>{t('subjectSelect')}</option>
                <option value="inscription">{t('subjectOption1')}</option>
                <option value="cours">{t('subjectOption2')}</option>
                <option value="technique">{t('subjectOption3')}</option>
                <option value="autre">{t('subjectOption4')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">
                {t('messageLabel')}
              </label>
              <textarea
                id="message"
                required
                rows={5}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
                placeholder={t('messagePlaceholder')}
              ></textarea>
            </div>

            <button
              type="button"
              className="w-full bg-[#0084c7] hover:bg-[#006ba1] text-white font-bold py-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 mt-4"
            >
              {t('sendBtn')}
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
