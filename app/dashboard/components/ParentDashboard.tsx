'use client';

import React, { useState } from 'react';
import { ParentStudent, SubscriptionPlan, LiveSession } from '@/lib/types';
import Link from 'next/link';
import ProgressSection from './ProgressSection';

interface ParentStudentWithStats extends ParentStudent {
  progressStats?: any;
}

interface ParentDashboardProps {
  parentUser: any;
  students: ParentStudentWithStats[];
  plans: SubscriptionPlan[];
  upcomingLives: LiveSession[];
}

export default function ParentDashboard({
  parentUser,
  students,
  plans,
  upcomingLives,
}: ParentDashboardProps) {
  const [studentList, setStudentList] = useState<ParentStudentWithStats[]>(students);
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/parent-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentEmail: studentEmail.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Impossible de rattacher l'étudiant.");
      } else {
        setSuccess(data.message || 'Étudiant rattaché avec succès !');
        setStudentEmail('');
        // Refresh list
        const updatedRes = await fetch('/api/parent-student');
        if (updatedRes.ok) {
          const list = await updatedRes.json();
          setStudentList(list);
        }
      }
    } catch {
      setError('Erreur réseau lors de la communication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Parent summary bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="text-slate-400 font-bold uppercase text-[10px]">Enfants Suivis</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{studentList.length}</div>
          <p className="text-xs text-slate-500 mt-1">Étudiants rattachés à votre espace</p>
        </div>

        {/* 
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="text-slate-400 font-bold uppercase text-[10px]">Séances Live cette semaine</div>
          <div className="text-3xl font-black text-blue-600 mt-1">{upcomingLives.length}</div>
          <p className="text-xs text-slate-500 mt-1">Cours et entraînements programmés</p>
        </div>
        */}

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-slate-400 font-bold uppercase text-[10px]">Conseiller Pédagogique</div>
            <div className="text-sm font-bold text-slate-900 mt-1">Assistance Parent 7j/7</div>
          </div>
          <a
            href="https://wa.me/212710500405"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            <span>💬 Contacter sur WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Linked Children Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Mes Enfants & Abonnements
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Gérez les accès et les formules pour chaque élève.
            </p>
          </div>
        </div>

        {studentList.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl p-6 mb-6">
            <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
            <h3 className="font-bold text-slate-800 text-sm">Aucun enfant rattaché pour le moment</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Entrez l'adresse email utilisée par votre enfant pour créer son compte élève afin de le lier à votre espace.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {studentList.map((st) => {
              const isExpanded = expandedStudentId === st.id;
              return (
                <div key={st.id} className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50/70 overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-base">
                        🎓
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{st.student_name || 'Élève'}</h3>
                        <div className="text-xs text-slate-500">{st.student_email}</div>
                        {st.student_niveau && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                            {st.student_niveau}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setExpandedStudentId(isExpanded ? null : st.id)}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                      >
                        {isExpanded ? 'Masquer la progression' : 'Voir la progression'}
                        <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {/* 
                      <Link
                        href="/tarifs"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                      >
                        Souscrire un Pack
                      </Link>
                      */}
                    </div>
                  </div>

                  {/* Expanded Progress Section */}
                  {isExpanded && st.progressStats && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-200/60 bg-white">
                      <ProgressSection stats={st.progressStats} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Form to link student */}
        <form onSubmit={handleLinkStudent} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70">
          <h3 className="text-xs font-bold uppercase text-slate-700 mb-2">
            Rattacher un compte élève existant
          </h3>
          {error && <div className="text-xs text-rose-600 mb-2">{error}</div>}
          {success && <div className="text-xs text-emerald-600 mb-2">{success}</div>}

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Email du compte élève de votre enfant"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {loading ? 'Rattachement...' : 'Rattacher l\'enfant'}
            </button>
          </div>
        </form>
      </div>

      {/* Upcoming Lives Schedule for Children */}
      {/* 
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 mb-4">
          Planning des Cours en Direct pour vos Enfants
        </h2>
        <div className="space-y-3">
          {upcomingLives.map((live) => (
            <div
              key={live.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/60"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600">{live.niveau_label}</span>
                <h3 className="font-bold text-slate-900 text-xs">{live.title}</h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  📅 {new Date(live.scheduled_at).toLocaleDateString('fr-FR')} • {live.duration_minutes} min
                </div>
              </div>

              <Link
                href="/lives"
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Détails de la séance →
              </Link>
            </div>
          ))}
        </div>
      </div>
      */}
    </div>
  );
}
