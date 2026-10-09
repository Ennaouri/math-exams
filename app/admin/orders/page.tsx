import { getAllUserSubscriptions } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

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
          <p className="text-sm text-slate-500">Gérez les inscriptions et les paiements</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold shadow-sm">
          Total: <span className="text-blue-600">{orders.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Abonnement / Live</th>
                <th className="px-6 py-4">Paiement</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Aucune commande trouvée.
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{order.User?.name || 'Inconnu'}</p>
                      <p className="text-xs text-slate-500">{order.User?.email || ''}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">{order.Plan?.name || 'Session Live'}</span>
                      {order.Plan?.niveau && <p className="text-xs text-slate-500">{order.Plan.niveau}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-slate-600 font-medium">
                        {order.payment_method || 'Virement'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${order.status === 'active' || order.status === 'paid' ? 'bg-green-100 text-green-700' : 
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          'bg-red-100 text-red-700'}`}
                      >
                        {order.status || 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
