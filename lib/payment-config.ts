export const PAYMENT_CONFIG = {
  bank: {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || 'CIH Bank',
    accountHolder: process.env.NEXT_PUBLIC_BANK_HOLDER || 'Mohammed Ennaouri',
    rib: process.env.NEXT_PUBLIC_BANK_RIB || '230 810 5180719211024500 56',
    ribRaw: (process.env.NEXT_PUBLIC_BANK_RIB || '230 810 5180719211024500 56').replace(/\s+/g, ''),
    city: 'Maroc',
  },
  whatsapp: {
    phone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '+212710500405',
    phoneRaw: (process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '212710500405').replace(/[^\d]/g, ''),
  },
  paypal: {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb',
    currency: 'EUR',
    paypalMeUrl: process.env.NEXT_PUBLIC_PAYPAL_ME_URL || 'https://paypal.me/ennaouriMohammed',
    paypalEmail: process.env.NEXT_PUBLIC_PAYPAL_EMAIL || 'ennaouri.mohammed@gmail.com',
    // 1 EUR ≈ 10.5 MAD (taux de conversion indicatif)
    madToEurRate: 10.5,
  },
};

/**
 * Convert MAD amount to EUR formatted to 2 decimals
 */
export function convertMadToEur(madAmount: number | string): string {
  const numeric = typeof madAmount === 'string' ? parseFloat(madAmount) || 0 : madAmount;
  if (!numeric || numeric <= 0) return '0.00';
  const eur = numeric / PAYMENT_CONFIG.paypal.madToEurRate;
  return eur.toFixed(2);
}

/**
 * Build prefilled WhatsApp URL for sending transfer receipt
 */
export function buildWhatsAppPaymentUrl(params: {
  title: string;
  amount: string | number;
  orderId?: string | number;
  studentName?: string;
  locale?: string;
}): string {
  const isEn = params.locale === 'en';
  const refText = params.orderId ? ` [Réf: #${params.orderId}]` : '';
  const studentText = params.studentName ? ` (Élève: ${params.studentName})` : '';

  const message = isEn
    ? `Hello Mr. Ennaouri, I have made the bank transfer of ${params.amount} MAD for "${params.title}"${refText}${studentText}. Here is my transfer receipt:`
    : `Bonjour M. Ennaouri, je viens d'effectuer le virement bancaire de ${params.amount} MAD pour "${params.title}"${refText}${studentText}. Voici mon reçu de virement :`;

  return `https://wa.me/${PAYMENT_CONFIG.whatsapp.phoneRaw}?text=${encodeURIComponent(message)}`;
}
