'use client';

import React, { useState, useEffect } from 'react';
import { UserSubscription } from '@/lib/types';

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch('/api/subscriptions?mode=all');
      const data = await res.json();
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleStatusChange = async (id: number, status: 'active' | 'pending' | 'expired' | 'cancelled') => {
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchSubscriptions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Abonnements</h1>
          <p className="text-sm text-gray-500 mt-1">Validez et suivez les inscriptions aux packs de formation et lives.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement des abonnements...</div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          Aucun abonnement enregistré pour le moment.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="p-3">Utilisateur</th>
                <th className="p-3">Formule</th>
                <th className="p-3">Mode Paiement</th>
                <th className="p-3">Date Début</th>
                <th className="p-3">Date Expiration</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{sub.user_name || `Utilisateur #${sub.user_id}`}</div>
                    <div className="text-xs text-gray-400">{sub.user_email}</div>
                  </td>
                  <td className="p-3 font-semibold text-blue-600">{sub.plan_name || 'Pack Excellence'}</td>
                  <td className="p-3 text-xs uppercase">{sub.payment_method}</td>
                  <td className="p-3 text-xs">{new Date(sub.started_at).toLocaleDateString('fr-FR')}</td>
                  <td className="p-3 text-xs">{new Date(sub.expires_at).toLocaleDateString('fr-FR')}</td>
                  <td className="p-3 text-xs">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      sub.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                      sub.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-3 text-xs">
                    {sub.status === 'pending' ? (
                      <button
                        onClick={() => handleStatusChange(sub.id, 'active')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                      >
                        Activer
                      </button>
                    ) : sub.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(sub.id, 'expired')}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg text-xs"
                      >
                        Suspendre
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(sub.id, 'active')}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                      >
                        Réactiver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
