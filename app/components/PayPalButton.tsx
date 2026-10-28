'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PAYMENT_CONFIG, convertMadToEur } from '@/lib/payment-config';

interface PayPalButtonProps {
  amountMad: number | string;
  itemTitle: string;
  onSuccess: (data: { orderId: string; details?: any }) => void;
  onError?: (error: any) => void;
  locale?: string;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalButton({
  amountMad,
  itemTitle,
  onSuccess,
  onError,
  locale = 'fr',
}: PayPalButtonProps) {
  const isEn = locale === 'en';
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const eurAmount = convertMadToEur(amountMad);
  const clientId = PAYMENT_CONFIG.paypal.clientId;
  const paypalMeUrl = `${PAYMENT_CONFIG.paypal.paypalMeUrl}/${eurAmount}EUR`;

  useEffect(() => {
    let isMounted = true;

    const loadPayPalScript = () => {
      // Check if PayPal script is already on page
      if (window.paypal) {
        if (isMounted) setSdkLoaded(true);
        return;
      }

      const scriptId = 'paypal-sdk-script';
      const existingScript = document.getElementById(scriptId);

      if (existingScript) {
        existingScript.addEventListener('load', () => {
          if (isMounted) setSdkLoaded(true);
        });
        existingScript.addEventListener('error', () => {
          if (isMounted) setSdkError('Failed to load PayPal SDK');
        });
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=capture&disable-funding=credit,card`;
      script.async = true;

      script.onload = () => {
        if (isMounted) setSdkLoaded(true);
      };

      script.onerror = () => {
        if (isMounted) {
          setSdkError(isEn ? 'Could not load PayPal SDK.' : 'Impossible de charger le module PayPal.');
        }
      };

      document.body.appendChild(script);
    };

    loadPayPalScript();

    return () => {
      isMounted = false;
    };
  }, [clientId, isEn]);

  useEffect(() => {
    if (!sdkLoaded || !window.paypal || !containerRef.current) return;

    // Clear previous button render
    containerRef.current.innerHTML = '';

    try {
      window.paypal
        .Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 44,
          },
          createOrder: (_data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: itemTitle.substring(0, 127),
                  amount: {
                    currency_code: 'EUR',
                    value: eurAmount,
                  },
                },
              ],
              application_context: {
                shipping_preference: 'NO_SHIPPING',
              },
            });
          },
          onApprove: async (_data: any, actions: any) => {
            setIsProcessing(true);
            try {
              const details = await actions.order.capture();
              onSuccess({
                orderId: details?.id || _data?.orderID,
                details,
              });
            } catch (err) {
              console.error('PayPal capture error:', err);
              if (onError) onError(err);
            } finally {
              setIsProcessing(false);
            }
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            if (onError) onError(err);
          },
        })
        .render(containerRef.current);
    } catch (err: any) {
      console.warn('PayPal render error:', err);
      setSdkError(err.message || 'Render error');
    }
  }, [sdkLoaded, eurAmount, itemTitle, onSuccess, onError]);

  return (
    <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border border-blue-200/80 rounded-2xl p-5 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-blue-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#003087] text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-900/20">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.79.79 0 0 1 .78-.663h7.243c3.782 0 6.38 1.862 5.926 5.348-.37 2.842-2.348 4.498-5.067 4.498h-2.14l-1.096 6.966a.64.64 0 0 1-.632.535l-2.882-.067z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isEn ? 'PayPal Online Payment' : 'Paiement en ligne par PayPal'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEn ? 'PayPal account or international debit/credit cards' : 'Compte PayPal ou Cartes internationales'}
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-[11px] font-bold">
          {isEn ? 'Instant activation' : 'Activation immédiate'}
        </span>
      </div>

      {/* Currency conversion box */}
      <div className="bg-white rounded-xl border border-blue-100 p-4 mb-4 text-xs">
        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500 font-medium">{isEn ? 'Original amount (MAD):' : 'Montant initial (MAD) :'}</span>
          <span className="font-bold text-slate-800">{amountMad} MAD</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-500 font-medium">
            {isEn ? 'Charged in EUR (1€ ≈ 10.5 DH):' : 'Facturé en EUR (1€ ≈ 10.5 DH) :'}
          </span>
          <span className="text-base font-black text-[#003087]">{eurAmount} €</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 italic">
          {isEn
            ? '* PayPal processes transactions in EUR as Moroccan Dirham (MAD) is not directly supported by PayPal.'
            : '* PayPal traite les transactions en EUR car le Dirham marocain (MAD) n\'est pas directement pris en charge par PayPal.'}
        </p>
      </div>

      {/* Smart Buttons Container */}
      <div className="relative min-h-[50px] mb-4">
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-10 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              {isEn ? 'Finalizing transaction...' : 'Finalisation de la transaction...'}
            </div>
          </div>
        )}

        {!sdkLoaded && !sdkError && (
          <div className="py-4 text-center">
            <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">{isEn ? 'Loading PayPal buttons...' : 'Chargement sécurisé de PayPal...'}</p>
          </div>
        )}

        <div ref={containerRef} className="space-y-2" />
      </div>

      {/* Alternative Direct PayPal Link */}
      <div className="pt-3 border-t border-blue-200/60">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-600 font-medium">
            {isEn ? 'Prefer direct transfer?' : 'Vous préférez envoyer directement ?'}
          </span>
          <span className="text-[11px] text-slate-400">PayPal.Me</span>
        </div>
        <a
          href={paypalMeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-white hover:bg-slate-50 text-[#003087] border border-blue-300 rounded-xl font-bold text-xs transition-colors shadow-xs"
        >
          <svg className="w-4 h-4 fill-[#003087]" viewBox="0 0 24 24">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.79.79 0 0 1 .78-.663h7.243c3.782 0 6.38 1.862 5.926 5.348-.37 2.842-2.348 4.498-5.067 4.498h-2.14l-1.096 6.966a.64.64 0 0 1-.632.535l-2.882-.067z" />
          </svg>
          {isEn ? `Pay ${eurAmount} € via PayPal.Me` : `Payer ${eurAmount} € via PayPal.Me`}
        </a>
      </div>
    </div>
  );
}
