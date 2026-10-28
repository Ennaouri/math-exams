'use client';

import React, { useState } from 'react';
import { SubscriptionPlan } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import BankTransferDetails from '@/app/components/BankTransferDetails';
import PayPalButton from '@/app/components/PayPalButton';
import { buildWhatsAppPaymentUrl } from '@/lib/payment-config';

export default function PricingClient({ initialPlans }: { initialPlans: SubscriptionPlan[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const isEn = locale === 'en';

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'mensuel' | 'annuel'>('mensuel');
  const [paymentMethod, setPaymentMethod] = useState<'virement' | 'paypal' | 'whatsapp'>('virement');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [createdSubId, setCreatedSubId] = useState<number | null>(null);

  const calculateFinalPrice = (plan: SubscriptionPlan) => {
    return billingPeriod === 'annuel'
      ? Math.round(plan.price * 8) // 8 mois au lieu de 10
      : plan.price;
  };

  const handleSubscribe = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/tarifs`);
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
        if (data.subscription?.id) {
          setCreatedSubId(data.subscription.id);
        }
        setSuccess(true);
      }
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalSuccess = async ({ orderId }: { orderId: string }) => {
    if (!selectedPlan) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          paymentMethod: 'paypal',
          paypalOrderId: orderId,
          durationMonths: billingPeriod === 'annuel' ? 10 : 1,
          status: 'paid',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erreur lors de la confirmation PayPal');
      } else {
        if (data.subscription?.id) {
          setCreatedSubId(data.subscription.id);
        }
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
          {isEn ? 'Monthly Billing' : 'Paiement Mensuel'}
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
            {isEn ? 'Annual School Plan' : 'Paiement Annuel Scolaire'}
          </span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-black rounded-full uppercase">
            {isEn ? '20% off' : '-20% de remise'}
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {initialPlans.map((plan) => {
          const finalPrice = calculateFinalPrice(plan);

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
                  ★ {isEn ? 'Most Popular' : 'Le Plus Demandé'}
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
                    / {billingPeriod === 'annuel' ? (isEn ? 'year' : 'année') : (isEn ? 'month' : 'mois')}
                  </span>
                </div>

                <div className="space-y-2.5 mb-6">
                  <div className="text-xs font-bold uppercase text-slate-400">
                    {isEn ? 'Included in formula:' : 'Inclus dans la formule :'}
                  </div>
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
                onClick={() => {
                  setSelectedPlan(plan);
                  setSuccess(false);
                  setError('');
                }}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  plan.is_popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isEn ? 'Choose this Pack' : 'Rejoindre ce Pack'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Subscription Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 border border-slate-100 max-h-[92vh] overflow-y-auto">
            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-sm">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {paymentMethod === 'paypal'
                    ? (isEn ? 'Subscription Active!' : 'Abonnement Activé !')
                    : (isEn ? 'Request Recorded!' : 'Demande Enregistrée !')}
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {paymentMethod === 'paypal'
                    ? (isEn
                        ? `Your PayPal payment for ${selectedPlan.name} has been confirmed. You now have immediate access to live sessions and study materials.`
                        : `Votre paiement PayPal pour ${selectedPlan.name} a été validé. Vos accès aux séances en direct et aux cours sont désormais actifs.`)
                    : (isEn
                        ? `Your request for ${selectedPlan.name} is saved. Please complete the bank transfer and send your receipt on WhatsApp to finalize your activation.`
                        : `Votre demande pour ${selectedPlan.name} a bien été enregistrée. Veuillez effectuer le virement bancaire et nous envoyer votre reçu sur WhatsApp pour activation.`)}
                </p>

                {paymentMethod === 'virement' && (
                  <div className="mb-6">
                    <a
                      href={buildWhatsAppPaymentUrl({
                        title: selectedPlan.name,
                        amount: calculateFinalPrice(selectedPlan),
                        orderId: createdSubId || undefined,
                        studentName: session?.user?.name || undefined,
                        locale,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      {isEn ? 'Send receipt on WhatsApp' : 'Envoyer le reçu sur WhatsApp'}
                    </a>
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all"
                  >
                    {isEn ? 'Go to Dashboard' : 'Accéder à mon Espace'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlan(null);
                      setSuccess(false);
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all"
                  >
                    {isEn ? 'Close' : 'Fermer'}
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
                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl mb-5 flex justify-between items-center border border-slate-100">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">
                      {isEn ? 'Total amount' : 'Montant total'}
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {calculateFinalPrice(selectedPlan)} DH
                      <span className="text-xs font-normal text-slate-500 ml-1">
                        / {billingPeriod === 'annuel' ? (isEn ? 'School year (10 months)' : 'Année scolaire (10 mois)') : (isEn ? 'Month' : 'Mois')}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                    {isEn ? 'Payment Method' : 'Mode de règlement'}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                    {/* Option 1: Virement */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('virement')}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === 'virement'
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900 mb-0.5">
                        {isEn ? 'Bank Transfer' : 'Virement CIH'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {isEn ? 'RIB & WhatsApp' : 'RIB CIH Bank'}
                      </div>
                    </button>

                    {/* Option 2: PayPal */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900 mb-0.5">PayPal</div>
                      <div className="text-[10px] text-slate-500">
                        {isEn ? 'Instant / Card' : 'En ligne / Carte'}
                      </div>
                    </button>

                    {/* Option 3: Wafacash */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('whatsapp')}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === 'whatsapp'
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900 mb-0.5">Wafacash</div>
                      <div className="text-[10px] text-slate-500">
                        {isEn ? 'Cash deposit' : 'Cash Plus / Cash'}
                      </div>
                    </button>
                  </div>

                  {/* Render detail based on selection */}
                  {paymentMethod === 'virement' && (
                    <BankTransferDetails
                      amount={calculateFinalPrice(selectedPlan)}
                      itemTitle={selectedPlan.name}
                      studentName={session?.user?.name || undefined}
                      locale={locale}
                    />
                  )}

                  {paymentMethod === 'paypal' && (
                    <PayPalButton
                      amountMad={calculateFinalPrice(selectedPlan)}
                      itemTitle={selectedPlan.name}
                      locale={locale}
                      onSuccess={handlePayPalSuccess}
                      onError={() =>
                        setError(isEn ? 'PayPal payment failed.' : 'Le paiement PayPal a échoué.')
                      }
                    />
                  )}

                  {paymentMethod === 'whatsapp' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-2">
                      <div className="font-bold text-slate-900">
                        {isEn ? 'Cash transfer details' : 'Transfert d\'argent national (Wafacash / Cash Plus)'}
                      </div>
                      <p className="text-slate-600">
                        {isEn
                          ? 'Send the payment to the name of Mohammed Ennaouri (+212 710 500 405) and send the transfer code to our WhatsApp support.'
                          : 'Effectuez le transfert au nom de Mohammed Ennaouri (+212 710 500 405) puis transmettez le code de retrait à notre équipe sur WhatsApp.'}
                      </p>
                    </div>
                  )}
                </div>

                {paymentMethod !== 'paypal' && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan(null)}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase transition-colors"
                    >
                      {isEn ? 'Cancel' : 'Annuler'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSubscribe}
                      disabled={loading}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase shadow-md shadow-blue-600/30 disabled:opacity-50 transition-all"
                    >
                      {loading
                        ? (isEn ? 'Processing...' : 'Traitement...')
                        : (isEn ? 'Confirm & Register' : 'Confirmer & S\'inscrire')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
