import { notFound, redirect } from 'next/navigation';
import { SERVICES } from '@/lib/live-services';
import { auth } from '@/lib/auth';
import CheckoutClient from './CheckoutClient';

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const service = SERVICES.find(s => s.id === parseInt(resolvedParams.id));
  
  if (!service) {
    notFound();
  }

  const session = await auth();
  
  if (!session) {
    redirect(`/login?callbackUrl=/checkout/${service.id}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Paiement Sécurisé</h1>
          <p className="text-slate-500">Finalisez votre inscription à la séance en direct</p>
        </div>
        
        <CheckoutClient service={service} user={session.user as any} />
      </div>
    </div>
  );
}
