'use client';

import React, { useState } from 'react';

interface OrderItem {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  plan_name?: string;
  niveau?: string;
  notes?: string;
  status: string;
  payment_method: string;
  created_at: string | Date;
  User?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  Plan?: {
    name?: string;
    niveau?: string;
  };
}

export default function OrdersTableClient({ initialOrders }: { initialOrders: OrderItem[] }) {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      } else {
        alert('Erreur lors de la mise à jour du statut.');
      }
    } catch {
      alert('Erreur réseau.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    if (filterMethod !== 'all' && order.payment_method !== filterMethod) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const userName = (order.User?.name || order.user_name || '').toLowerCase();
      const userEmail = (order.User?.email || order.user_email || '').toLowerCase();
      const notes = (order.notes || '').toLowerCase();
      const idMatch = order.id.toString().includes(q);
      return userName.includes(q) || userEmail.includes(q) || notes.includes(q) || idMatch;
    }

    return true;
  });

  return (
    <div>
      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Rechercher élève, email, réf..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 outline-none font-medium"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente (Virement)</option>
            <option value="paid">Payé (PayPal)</option>
            <option value="active">Actif</option>
            <option value="cancelled">Annulé</option>
          </select>

          {/* Method filter */}
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 outline-none font-medium"
          >
            <option value="all">Tous les modes</option>
            <option value="virement">Virement CIH</option>
            <option value="paypal">PayPal</option>
            <option value="whatsapp">Wafacash / Cash</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Réf</th>
                <th className="px-6 py-4">Élève</th>
                <th className="px-6 py-4">Détails de la commande</th>
                <th className="px-6 py-4">Paiement</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-xs">
                    Aucune commande ne correspond aux critères.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isUpdating = updatingId === order.id;
                  const isPending = order.status === 'pending';
                  const isPaidOrActive = order.status === 'paid' || order.status === 'active';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                        #{order.id}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-xs">
                          {order.User?.name || order.user_name || 'Utilisateur inconnu'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {order.User?.email || order.user_email || '-'}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-xs text-slate-800">
                          {order.Plan?.name || order.plan_name || 'Séance Live'}
                        </p>
                        {order.notes && (
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-xs" title={order.notes}>
                            {order.notes}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.payment_method === 'paypal'
                              ? 'bg-blue-100 text-[#003087]'
                              : order.payment_method === 'virement'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {order.payment_method === 'paypal' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#003087]" />
                          )}
                          {order.payment_method === 'virement' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          )}
                          {order.payment_method || 'Virement'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPaidOrActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : isPending
                              ? 'bg-amber-100 text-amber-700 animate-pulse'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {isPaidOrActive ? 'Validé' : isPending ? 'En attente' : order.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isPending ? (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(order.id, 'active')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs transition-all"
                          >
                            {isUpdating ? (
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                Valider
                              </>
                            )}
                          </button>
                        ) : isPaidOrActive ? (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                            className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors font-medium"
                          >
                            Désactiver
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(order.id, 'active')}
                            className="text-[11px] text-blue-600 hover:text-blue-800 transition-colors font-bold"
                          >
                            Réactiver
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
