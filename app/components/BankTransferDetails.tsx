'use client';

import React, { useState } from 'react';
import { PAYMENT_CONFIG, buildWhatsAppPaymentUrl } from '@/lib/payment-config';

interface BankTransferDetailsProps {
  amount: string | number;
  itemTitle: string;
  orderId?: string | number;
  studentName?: string;
  locale?: string;
}

export default function BankTransferDetails({
  amount,
  itemTitle,
  orderId,
  studentName,
  locale = 'fr',
}: BankTransferDetailsProps) {
  const [copied, setCopied] = useState(false);
  const isEn = locale === 'en';

  const handleCopyRib = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_CONFIG.bank.ribRaw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = buildWhatsAppPaymentUrl({
    title: itemTitle,
    amount,
    orderId,
    studentName,
    locale,
  });

  return (
    <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/60 border border-amber-200/80 rounded-2xl p-5 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-orange-600/20 tracking-tighter">
            CIH
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isEn ? 'Bank Transfer Details (Morocco)' : 'Coordonnées Bancaires (Maroc)'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEn ? 'Instant or classic bank transfer' : 'Virement instantané ou versement bancaire'}
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[11px] font-bold">
          {isEn ? 'Validated manually' : 'Validation manuelle'}
        </span>
      </div>

      {/* Account Info Box */}
      <div className="bg-white rounded-xl border border-amber-200 p-4 space-y-3 mb-4 text-xs">
        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500 font-medium">{isEn ? 'Bank:' : 'Banque :'}</span>
          <span className="font-bold text-slate-800">{PAYMENT_CONFIG.bank.bankName}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500 font-medium">{isEn ? 'Beneficiary / Account Holder:' : 'Bénéficiaire / Titulaire :'}</span>
          <span className="font-bold text-slate-900">{PAYMENT_CONFIG.bank.accountHolder}</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500 font-medium">{isEn ? 'Exact amount to transfer:' : 'Montant exact à virer :'}</span>
          <span className="text-sm font-black text-blue-600">{amount} MAD</span>
        </div>

        {/* RIB with copy button */}
        <div className="pt-1">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-slate-500 font-medium">{isEn ? 'Bank RIB (24 digits):' : 'RIB Bancaire (24 chiffres) :'}</span>
            <button
              type="button"
              onClick={handleCopyRib}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                copied
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEn ? 'Copied!' : 'Copié !'}
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {isEn ? 'Copy RIB' : 'Copier le RIB'}
                </>
              )}
            </button>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-center font-bold text-slate-800 tracking-wider text-xs sm:text-sm select-all">
            {PAYMENT_CONFIG.bank.rib}
          </div>
        </div>
      </div>

      {/* Steps instructions */}
      <div className="space-y-2 mb-4 text-xs text-slate-700">
        <div className="font-bold text-slate-900 mb-1">
          {isEn ? 'How to proceed?' : 'Comment procéder ?'}
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
          <span>{isEn ? 'Make the transfer from your banking app (CIH Mobile, Attijari, Chaabi, etc.) or in person.' : 'Effectuez le virement depuis votre application bancaire (CIH Mobile, Attijari, Chaabi...) ou en agence.'}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
          <span>{isEn ? 'Mention your name in the transfer description/purpose.' : 'Mentionnez votre nom complet en motif de virement.'}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
          <span>{isEn ? 'Send your transfer receipt on WhatsApp for instant confirmation.' : 'Envoyez votre reçu de virement sur WhatsApp pour validation immédiate.'}</span>
        </div>
      </div>

      {/* Direct WhatsApp Action */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        {isEn ? 'Send receipt on WhatsApp (+212 710 500 405)' : 'Envoyer le reçu sur WhatsApp (+212 710 500 405)'}
      </a>
    </div>
  );
}
