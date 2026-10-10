'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Service {
  id: number;
  title: string;
  niveau: string;
  category: string;
  description: string;
  price: string;
  priceSuffix: string;
  image: string;
  teacher: string;
}

export default function CheckoutClient({ service, user }: { service: Service, user: any }) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call for checkout process
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-4">Commande confirmée !</h2>
        <p className="text-slate-600 mb-8">
          {paymentMethod === 'transfer' 
            ? "Votre demande d'inscription a été enregistrée. Veuillez effectuer le virement bancaire et nous envoyer le reçu pour validation."
            : "Votre paiement a été traité avec succès. Vous recevrez un email de confirmation avec le lien de la session."}
        </p>
        <a href="/lives" className="bg-[#0084c7] hover:bg-[#006ba1] text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors inline-block">
          Retour aux cours
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Payment Details */}
      <div className="w-full lg:w-2/3 space-y-6">
        
        {/* User Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
            Informations de l'étudiant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Nom complet</label>
              <input type="text" readOnly value={user?.name || ''} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
              <input type="email" readOnly value={user?.email || ''} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 outline-none" />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
            Méthode de paiement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div 
              onClick={() => setPaymentMethod('card')}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#0084c7] bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#0084c7]' : 'border-slate-300'}`}>
                    {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-[#0084c7]"></div>}
                  </div>
                  <span className="font-bold text-sm text-slate-800">Carte Bancaire</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-6 h-4 bg-slate-200 rounded text-[6px] font-bold flex items-center justify-center text-slate-500">VISA</div>
                  <div className="w-6 h-4 bg-slate-200 rounded text-[6px] font-bold flex items-center justify-center text-slate-500">MC</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 ml-6">Paiement sécurisé via CMI (bientôt disponible)</p>
            </div>

            <div 
              onClick={() => setPaymentMethod('transfer')}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-[#0084c7] bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-[#0084c7]' : 'border-slate-300'}`}>
                    {paymentMethod === 'transfer' && <div className="w-2 h-2 rounded-full bg-[#0084c7]"></div>}
                  </div>
                  <span className="font-bold text-sm text-slate-800">Virement Bancaire</span>
                </div>
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <p className="text-xs text-slate-500 ml-6">Virement classique ou via application (CIH, Attijari...)</p>
            </div>
          </div>

          {/* Conditional Payment UI */}
          {paymentMethod === 'transfer' && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-2">
              <h3 className="text-sm font-bold text-orange-800 mb-2">Instructions pour le virement</h3>
              <p className="text-xs text-orange-700 mb-4">Veuillez transférer le montant exact sur le compte bancaire ci-dessous :</p>
              
              <div className="bg-white rounded border border-orange-200 p-3 text-sm font-mono text-slate-700 mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Banque:</span>
                  <strong>CIH Bank</strong>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Nom:</span>
                  <strong>Mohammed Ennaouri</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">RIB:</span>
                  <strong>230 810 5180719211024500 56</strong>
                </div>
              </div>

              <div className="text-xs text-orange-700 flex items-start gap-2">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Après avoir cliqué sur Confirmer, vous devrez nous envoyer le reçu du virement sur WhatsApp pour activer votre accès.</span>
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-2 flex flex-col items-center justify-center text-center py-10 opacity-60">
              <svg className="w-10 h-10 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" /></svg>
              <p className="text-sm font-bold text-slate-600">Le paiement par carte bancaire sera bientôt disponible.</p>
              <p className="text-xs text-slate-500 mt-1">Veuillez choisir le virement bancaire en attendant.</p>
            </div>
          )}

        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-blue-100 p-6 sticky top-24">
          <h2 className="text-lg font-black text-slate-900 mb-4">Résumé de la commande</h2>
          
          <div className="flex gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-20 h-16 rounded-lg overflow-hidden relative shrink-0">
              <Image src={service.image} alt="Service" fill className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0084c7] uppercase mb-1">{service.niveau}</p>
              <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2">{service.title}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-600 mb-6 pb-6 border-b border-slate-100">
            <div className="flex justify-between">
              <span>Prix de la séance</span>
              <span>{service.price} MAD</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de dossier</span>
              <span className="text-green-600">Gratuit</span>
            </div>
          </div>

          <div className="flex justify-between items-end mb-6">
            <span className="text-sm font-bold text-slate-800">Total à payer</span>
            <div className="text-right">
              <span className="text-2xl font-black text-[#0084c7]">{service.price}</span>
              <span className="text-xs font-bold text-slate-500 ml-1">MAD</span>
            </div>
          </div>

          <form onSubmit={handleCheckout}>
            <button 
              type="submit" 
              disabled={isProcessing || paymentMethod === 'card'}
              className="w-full bg-[#0084c7] hover:bg-[#006ba1] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  CONFIRMER LE PAIEMENT
                </>
              )}
            </button>
          </form>
          
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" /></svg>
            Transaction sécurisée
          </div>
        </div>
      </div>
    </div>
  );
}
