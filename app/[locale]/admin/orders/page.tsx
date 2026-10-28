import { getAllUserSubscriptions } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import OrdersTableClient from './OrdersTableClient';

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') {
    redirect('/');
  }

  const orders = await getAllUserSubscriptions();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Commandes & Abonnements</h1>
          <p className="text-sm text-slate-500">
            Validez les virements bancaires CIH et suivez les paiements PayPal
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold shadow-xs">
          Total commandes : <span className="text-blue-600 font-black">{orders.length}</span>
        </div>
      </div>

      <OrdersTableClient initialOrders={orders as any} />
    </div>
  );
}
