'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import BankTransferDetails from '@/app/components/BankTransferDetails';
import PayPalButton from '@/app/components/PayPalButton';
import { buildWhatsAppPaymentUrl, convertMadToEur, PAYMENT_CONFIG } from '@/lib/payment-config';

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

export default function CheckoutClient({ service, user }: { service: Service; user: any }) {
  const locale = useLocale();
  const isEn = locale === 'en';

  const [formatChoice, setFormatChoice] = useState<'en_ligne' | 'presentiel'>('en_ligne');
  const [city, setCity] = useState<'Rabat' | 'Témara' | 'Salé'>('Rabat');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [studentPhone, setStudentPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'virement' | 'paypal'>('virement');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const eurAmount = convertMadToEur(service.price);

  const formatLabel = formatChoice === 'presentiel'
    ? (isEn ? `In-person (${city})` : `Présentiel à ${city}`)
    : (isEn ? 'Online (Google Meet / Zoom)' : 'En ligne (Visioconférence)');

  // Handle bank transfer order confirmation
  const handleTransferCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const notes = `Séance: ${formatLabel}${formatChoice === 'presentiel' && address ? ` (${address})` : ''} | Date souhaitée: ${preferredDate || 'À convenir'} | Tél: ${studentPhone}`;

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'live',
          serviceId: service.id,
          serviceTitle: `${service.title} [${formatLabel}]`,
          amount: service.price,
          paymentMethod: 'virement',
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'enregistrement de la réservation');
      }

      setOrderId(data.orderId);
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle PayPal success capture
  const handlePayPalSuccess = async ({ orderId: paypalId }: { orderId: string }) => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const notes = `Séance: ${formatLabel}${formatChoice === 'presentiel' && address ? ` (${address})` : ''} | Date: ${preferredDate || 'À convenir'} | Tél: ${studentPhone}`;

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'live',
          serviceId: service.id,
          serviceTitle: `${service.title} [${formatLabel}]`,
          amount: service.price,
          paymentMethod: 'paypal',
          paypalOrderId: paypalId,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la validation');
      }

      setOrderId(data.orderId);
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de la validation.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    const bookingDescription = `${service.title} (${formatLabel})`;
    const customWhatsAppUrl = `https://wa.me/${PAYMENT_CONFIG.whatsapp.phoneRaw}?text=${encodeURIComponent(
      isEn
        ? `Hello Mr. Ennaouri, I have booked a session (${formatLabel}) for "${service.title}" [Ref: #${orderId || ''}] (Student: ${user?.name || ''}, Phone: ${studentPhone}). Here is my confirmation/receipt:`
        : `Bonjour M. Ennaouri, je viens de réserver une séance de soutien (${formatLabel}) pour "${service.title}" [Réf: #${orderId || ''}] (Élève: ${user?.name || ''}, Tél: ${studentPhone}). Voici ma confirmation / reçu de virement :`
    )}`;

    return (
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-200 p-8 md:p-12 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-wider">
          {isEn ? `Booking #${orderId || ''}` : `Réservation #${orderId || ''}`}
        </span>

        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-3 mb-2">
          {paymentMethod === 'paypal'
            ? (isEn ? 'Session Reserved & Confirmed!' : 'Séance Réservée & Confirmée !')
            : (isEn ? 'Booking Request Registered!' : 'Demande de Réservation Enregistrée !')}
        </h2>

        <p className="text-slate-600 mb-6 text-sm max-w-lg mx-auto leading-relaxed">
          {paymentMethod === 'paypal'
            ? (isEn
                ? `Your PayPal payment is verified. Your session (${formatLabel}) with Mr. Mohammed Ennaouri is locked. We will contact you at ${studentPhone || user?.email} to coordinate the schedule.`
                : `Votre paiement par PayPal a été validé. Votre séance (${formatLabel}) avec M. Mohammed Ennaouri est bien enregistrée. Nous vous contacterons à ${studentPhone || user?.email} pour fixer la date et l'heure exactes.`)
            : (isEn
                ? `Your reservation request (${formatLabel}) is saved. Please complete the bank transfer and send your receipt on WhatsApp so we can schedule the session.`
                : `Votre demande de séance (${formatLabel}) a été créée. Veuillez effectuer le virement bancaire et nous envoyer la capture du reçu sur WhatsApp afin de fixer le créneau avec le professeur.`)}
        </p>

        {paymentMethod === 'virement' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left max-w-md mx-auto">
            <div className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isEn ? 'Send Transfer Receipt on WhatsApp' : 'Envoyer le reçu sur WhatsApp'}
            </div>
            <p className="text-xs text-amber-800 mb-3">
              {isEn
                ? 'Contact Mr. Ennaouri directly to send the receipt and confirm the date of your session.'
                : 'Contactez directement M. Ennaouri pour envoyer votre reçu et convenir du jour et de l\'heure.'}
            </p>
            <a
              href={customWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              {isEn ? 'Send on WhatsApp & Pick Date' : 'Contacter sur WhatsApp pour fixer la date'}
            </a>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/dashboard"
            className="bg-[#0084c7] hover:bg-[#006ba1] text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors text-sm"
          >
            {isEn ? 'Go to Student Space' : 'Accéder à mon Espace'}
          </Link>
          <Link
            href="/lives"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-colors text-sm"
          >
            {isEn ? 'Back to Tutoring Sessions' : 'Retour aux séances de soutien'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Booking & Payment Details */}
      <div className="w-full lg:w-2/3 space-y-6">
        
        {/* 1. Format Choice: En ligne vs Présentiel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
            {isEn ? 'Choose Session Modality' : 'Format de la séance (2 heures)'}
          </h2>
          <p className="text-xs text-slate-500 mb-4 ml-8">
            {isEn
              ? 'Select whether you prefer an online video session or an in-person session in Rabat, Témara, or Salé.'
              : 'Indiquez si vous préférez une séance en ligne ou en présentiel (disponible à Rabat, Témara et Salé).'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format 1: En ligne */}
            <div
              onClick={() => setFormatChoice('en_ligne')}
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                formatChoice === 'en_ligne'
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formatChoice === 'en_ligne' ? 'border-blue-600' : 'border-slate-300'
                  }`}
                >
                  {formatChoice === 'en_ligne' && (
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">💻</span>
                  <span className="font-bold text-sm text-slate-900">
                    {isEn ? 'Online (Remote)' : 'En ligne (À distance)'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 ml-7">
                {isEn
                  ? 'Interactive video session via Google Meet / Zoom with shared whiteboard.'
                  : 'Visioconférence interactive avec tableau partagé et micro.'}
              </p>
            </div>

            {/* Format 2: Présentiel */}
            <div
              onClick={() => setFormatChoice('presentiel')}
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                formatChoice === 'presentiel'
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formatChoice === 'presentiel' ? 'border-blue-600' : 'border-slate-300'
                  }`}
                >
                  {formatChoice === 'presentiel' && (
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏫</span>
                  <span className="font-bold text-sm text-slate-900">
                    {isEn ? 'In-Person' : 'En présentiel'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 ml-7">
                {isEn
                  ? 'Available exclusively in Rabat, Témara, and Salé.'
                  : 'Disponible exclusivement à Rabat, Témara et Salé.'}
              </p>
            </div>
          </div>

          {/* Conditional In-Person City & Address */}
          {formatChoice === 'presentiel' && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isEn ? 'City (Morocco)' : 'Ville *'}
                  </label>
                  <select
                    value={city}
                    onChange={(e: any) => setCity(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="Rabat">Rabat</option>
                    <option value="Témara">Témara</option>
                    <option value="Salé">Salé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isEn ? 'Neighborhood / Address' : 'Quartier / Adresse *'}
                  </label>
                  <input
                    type="text"
                    placeholder={isEn ? 'e.g. Agdal, Hay Riad, Bettana...' : 'Ex : Agdal, Hay Riad, Tabriquet...'}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Student Info & Preferred Availability */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
            {isEn ? 'Student Details & Availability' : 'Coordonnées & Disponibilité'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                {isEn ? 'Full Name' : 'Nom complet'}
              </label>
              <input
                type="text"
                readOnly
                value={user?.name || ''}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-700 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
              <input
                type="email"
                readOnly
                value={user?.email || ''}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-700 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isEn ? 'Phone (WhatsApp) *' : 'Téléphone / WhatsApp *'}
              </label>
              <input
                type="tel"
                placeholder="06 XX XX XX XX"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isEn ? 'Preferred Date or Slot' : 'Date ou Créneau souhaité'}
              </label>
              <input
                type="text"
                placeholder={isEn ? 'e.g. Saturday afternoon, ASAP...' : 'Ex : Samedi après-midi, dès que possible...'}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Payment Method */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</span>
            {isEn ? 'Payment Method' : 'Mode de règlement'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Virement Bancaire */}
            <div
              onClick={() => setPaymentMethod('virement')}
              className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                paymentMethod === 'virement'
                  ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'virement' ? 'border-amber-600' : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'virement' && (
                      <div className="w-2 h-2 rounded-full bg-amber-600" />
                    )}
                  </div>
                  <span className="font-bold text-sm text-slate-900">
                    {isEn ? 'Bank Transfer (CIH)' : 'Virement Bancaire (CIH)'}
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase">
                  {isEn ? 'Morocco' : 'National'}
                </span>
              </div>
              <p className="text-xs text-slate-500 ml-6">
                {isEn
                  ? 'CIH Bank transfer with WhatsApp receipt validation'
                  : 'Virement bancaire via application CIH, Attijari ou versement'}
              </p>
            </div>

            {/* PayPal */}
            <div
              onClick={() => setPaymentMethod('paypal')}
              className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                paymentMethod === 'paypal'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'paypal' ? 'border-blue-600' : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'paypal' && (
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <span className="font-bold text-sm text-slate-900">PayPal</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-[#003087]">
                    {eurAmount} €
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 ml-6">
                {isEn
                  ? 'Instant online payment via PayPal or international card'
                  : 'Paiement en ligne sécurisé par PayPal ou Cartes'}
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl mb-4">
              {errorMessage}
            </div>
          )}

          {/* Conditional Payment UI */}
          {paymentMethod === 'virement' && (
            <BankTransferDetails
              amount={service.price}
              itemTitle={`${service.title} (${formatLabel})`}
              studentName={user?.name}
              locale={locale}
            />
          )}

          {paymentMethod === 'paypal' && (
            <PayPalButton
              amountMad={service.price}
              itemTitle={`${service.title} (${formatLabel})`}
              locale={locale}
              onSuccess={handlePayPalSuccess}
              onError={() =>
                setErrorMessage(
                  isEn
                    ? 'Payment was cancelled or could not be processed.'
                    : 'Le paiement a été interrompu ou a échoué. Veuillez réessayer.'
                )
              }
            />
          )}
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-blue-100 p-6 sticky top-24">
          <h2 className="text-lg font-black text-slate-900 mb-4">
            {isEn ? 'Booking Summary' : 'Détails de la réservation'}
          </h2>

          <div className="flex gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-20 h-16 rounded-lg overflow-hidden relative shrink-0">
              <Image src={service.image} alt={service.title} fill className="object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#0084c7] uppercase mb-1">{service.niveau}</p>
              <p className="text-xs font-bold text-slate-800 leading-tight line-clamp-2">{service.title}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-black uppercase">
                {formatLabel}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 mb-6 pb-6 border-b border-slate-100">
            <div className="flex justify-between">
              <span>{isEn ? 'Duration' : 'Durée de la séance'}</span>
              <span className="font-bold text-slate-900">2 heures</span>
            </div>
            <div className="flex justify-between">
              <span>{isEn ? 'Teacher' : 'Professeur'}</span>
              <span className="font-bold text-slate-900">{service.teacher}</span>
            </div>
            <div className="flex justify-between">
              <span>{isEn ? 'Modality' : 'Modalité'}</span>
              <span className="font-bold text-blue-600">{formatLabel}</span>
            </div>
            {paymentMethod === 'paypal' && (
              <div className="flex justify-between text-blue-600 font-medium">
                <span>{isEn ? 'Amount in EUR' : 'Facturé en EUR'}</span>
                <span>~ {eurAmount} €</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-end mb-6">
            <span className="text-sm font-bold text-slate-800">
              {isEn ? 'Total to Pay' : 'Total à régler'}
            </span>
            <div className="text-right">
              <span className="text-2xl font-black text-[#0084c7]">{service.price}</span>
              <span className="text-xs font-bold text-slate-500 ml-1">DH</span>
            </div>
          </div>

          {paymentMethod === 'virement' ? (
            <form onSubmit={handleTransferCheckout}>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#0084c7] hover:bg-[#006ba1] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs md:text-sm font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isEn ? 'CONFIRM BOOKING' : 'CONFIRMER LA RÉSERVATION'}
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center text-xs text-slate-500 py-2">
              {isEn ? '👉 Complete payment using the PayPal button on the left.' : '👉 Finalisez votre paiement via le bouton PayPal à gauche.'}
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" />
            </svg>
            {isEn ? 'Secure Booking' : 'Réservation Sécurisée'}
          </div>
        </div>
      </div>
    </div>
  );
}
