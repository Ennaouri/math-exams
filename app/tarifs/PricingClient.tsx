'use client';

import React, { useState } from 'react';
import { SubscriptionPlan } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PricingClient({ initialPlans }: { initialPlans: SubscriptionPlan[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'mensuel' | 'annuel'>('mensuel');
  const [paymentMethod, setPaymentMethod] = useState<'virement' | 'carte' | 'whatsapp'>('virement');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (!selectedPlan) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          paymentMethod,
          durationMonths: billingPeriod === 'annuel' ? 10 : 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erreur lors de la demande de souscription');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex justify-center items-center gap-3 mb-10">
        <span className={`text-sm font-semibold ${billingPeriod === 'mensuel' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
          Paiement Mensuel
        </span>
        <button
          type="button"
          onClick={() => setBillingPeriod(billingPeriod === 'mensuel' ? 'annuel' : 'mensuel')}
          className="w-14 h-7 bg-blue-600 rounded-full p-1 transition-colors relative cursor-pointer"
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              billingPeriod === 'annuel' ? 'translate-x-7' : 'translate-x-0'
            }`}
          />
        </button>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-semibold ${billingPeriod === 'annuel' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
            Paiement Annuel Scolaire
          </span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-black rounded-full uppercase">
            -20% de remise
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {initialPlans.map((plan) => {
          const finalPrice = billingPeriod === 'annuel'
            ? Math.round(plan.price * 8) // 8 mois au lieu de 10
            : plan.price;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between relative bg-white border ${
                plan.is_popular
                  ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/30'
                  : 'border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300'
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-md">
                  ★ Le Plus Demandé
                </div>
              )}

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                  {plan.level_label}
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-snug mb-2">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-500 mb-4 min-h-[36px]">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 my-4 pb-4 border-b border-slate-100">
                  <span className="text-3xl font-black text-slate-900">{finalPrice}</span>
                  <span className="text-sm font-bold text-slate-700">DH</span>
                  <span className="text-xs text-slate-400">
                    / {billingPeriod === 'annuel' ? 'année' : 'mois'}
                  </span>
                </div>

                <div className="space-y-2.5 mb-6">
                  <div className="text-xs font-bold uppercase text-slate-400">Inclus dans la formule :</div>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-tight">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlan(plan)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  plan.is_popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Rejoindre ce Pack
              </button>
            </div>
          );
        })}
      </div>

      {/* Subscription Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-100 max-h-[90vh] overflow-y-auto">
            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Souscription Confirmée !</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Votre demande pour le <strong>{selectedPlan.name}</strong> a bien été enregistrée. Vous pouvez dès maintenant accéder aux séances en direct et supports de cours depuis votre tableau de bord.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm"
                  >
                    Accéder à mon Espace
                  </button>
                  <button
                    onClick={() => { setSelectedPlan(null); setSuccess(false); }}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-blue-600">{selectedPlan.level_label}</span>
                    <h3 className="text-xl font-bold text-slate-900">{selectedPlan.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl mb-5 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-slate-500">Montant total</div>
                    <div className="text-2xl font-black text-slate-900">
                      {billingPeriod === 'annuel' ? selectedPlan.price * 8 : selectedPlan.price} DH
                      <span className="text-xs font-normal text-slate-500 ml-1">
                        / {billingPeriod === 'annuel' ? 'Année scolaire (10 mois)' : 'Mois'}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                    Mode de règlement
                  </label>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${paymentMethod === 'virement' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200'}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'virement'}
                        onChange={() => setPaymentMethod('virement')}
                        className="text-blue-600"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-slate-900">Virement ou Versement Bancaire (CIH / Attijari / BMCE)</div>
                        <div className="text-slate-500">Validation après envoi du reçu sur WhatsApp</div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${paymentMethod === 'whatsapp' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200'}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'whatsapp'}
                        onChange={() => setPaymentMethod('whatsapp')}
                        className="text-blue-600"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-slate-900">Wafacash / Cash Plus / Espèces</div>
                        <div className="text-slate-500">Paiement par transfert d'argent national</div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${paymentMethod === 'carte' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200'}`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'carte'}
                        onChange={() => setPaymentMethod('carte')}
                        className="text-blue-600"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-slate-900">Paiement par Carte Bancaire (CMI / Visa / Mastercard)</div>
                        <div className="text-slate-500">Activation immédiate en ligne</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase shadow-md shadow-blue-600/30 disabled:opacity-50"
                  >
                    {loading ? 'Traitement...' : 'Confirmer & S\'inscrire'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
