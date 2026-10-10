'use client';

import React, { useState, useMemo } from 'react';
import type { ExamEvent } from '@/lib/types';
import Link from 'next/link';

interface CalendarClientProps {
  allEvents: ExamEvent[];
  upcomingEvents: ExamEvent[];
}

export default function CalendarClient({ allEvents, upcomingEvents }: CalendarClientProps) {
  const [niveauFilter, setNiveauFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const filteredEvents = useMemo(() => {
    return allEvents.filter(ev => {
      if (niveauFilter && ev.niveau !== niveauFilter && ev.niveau !== 'all') return false;
      if (typeFilter && ev.type !== typeFilter) return false;
      return true;
    });
  }, [allEvents, niveauFilter, typeFilter]);

  // Group events by Month-Year
  const groupedEvents = useMemo(() => {
    const groups: Record<string, ExamEvent[]> = {};
    filteredEvents.forEach(ev => {
      const d = new Date(ev.event_date);
      const key = d.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(ev);
    });
    return groups;
  }, [filteredEvents]);

  const typeLabels: Record<string, string> = {
    'examen_national': 'Examen National',
    'examen_regional': 'Examen Régional',
    'concours': 'Concours Post-BAC',
    'devoir_surveille': 'Devoir Surveillé',
    'autre': 'Autre',
  };

  const typeColors: Record<string, string> = {
    'examen_national': 'bg-rose-100 text-rose-800 border-rose-200',
    'examen_regional': 'bg-blue-100 text-blue-800 border-blue-200',
    'concours': 'bg-purple-100 text-purple-800 border-purple-200',
    'devoir_surveille': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'autre': 'bg-slate-100 text-slate-800 border-slate-200',
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const exportUrl = `/api/calendar/ical${niveauFilter || typeFilter ? `?niveau=${niveauFilter}&type=${typeFilter}` : ''}`;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 sm:p-12 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
            </div>
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl font-black mb-4">Calendrier des Examens</h1>
              <p className="text-blue-200 text-sm sm:text-base max-w-2xl mb-8">
                Ne manquez aucune date importante. Retrouvez ici le calendrier officiel des examens nationaux, régionaux et des concours pour mieux organiser vos révisions.
              </p>
              <a 
                href={exportUrl}
                className="inline-flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 hover:scale-105 transition-all shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Ajouter à mon agenda (iCal)
              </a>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Filtres :</span>
            <select 
              value={niveauFilter} 
              onChange={(e) => setNiveauFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">Tous les niveaux</option>
              <option value="tronc-commun">Tronc Commun</option>
              <option value="1bac">1ère Année BAC</option>
              <option value="2bac">2ème Année BAC</option>
              <option value="concours">Concours Post-BAC</option>
            </select>

            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">Tous les types</option>
              <option value="examen_national">Examen National</option>
              <option value="examen_regional">Examen Régional</option>
              <option value="concours">Concours</option>
              <option value="devoir_surveille">Devoir Surveillé</option>
            </select>
          </div>

          {/* Event List */}
          <div className="space-y-10">
            {Object.entries(groupedEvents).length > 0 ? (
              Object.entries(groupedEvents).map(([monthYear, events]) => (
                <div key={monthYear} className="space-y-4">
                  <h2 className="text-xl font-black text-slate-800 capitalize border-b-2 border-indigo-100 pb-2">
                    {monthYear}
                  </h2>
                  <div className="grid gap-4">
                    {events.map((ev) => (
                      <div key={ev.id} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start">
                        {/* Date Cube */}
                        <div className="flex-shrink-0 bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col items-center justify-center w-24 h-24 text-center">
                          <span className="text-slate-500 text-xs font-bold uppercase">{new Date(ev.event_date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                          <span className="text-3xl font-black text-indigo-900">{new Date(ev.event_date).getDate()}</span>
                          <span className="text-slate-400 text-xs font-semibold">{new Date(ev.event_date).toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                        </div>
                        
                        {/* Event Details */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${typeColors[ev.type]}`}>
                              {typeLabels[ev.type]}
                            </span>
                            {ev.niveau_label && (
                              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                                {ev.niveau_label}
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                            {ev.title}
                          </h3>
                          
                          {ev.description && (
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {ev.description}
                            </p>
                          )}
                          
                          {ev.end_date && ev.end_date !== ev.event_date && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-2">
                              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Jusqu'au {formatDate(new Date(ev.end_date))}
                            </div>
                          )}
                        </div>
                        
                        {/* Actions */}
                        {(ev.pdf_url || ev.source_url) && (
                          <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                            {ev.pdf_url && (
                              <a href={ev.pdf_url} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                PDF
                              </a>
                            )}
                            {ev.source_url && (
                              <a href={ev.source_url} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                Officiel
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200">
                <span className="text-4xl block mb-4">📅</span>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Aucun événement trouvé</h3>
                <p className="text-slate-500 text-sm">Essayez de modifier vos filtres de recherche.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Prochainement
            </h3>
            
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(ev => {
                  const daysUntil = Math.ceil((new Date(ev.event_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                  return (
                    <div key={ev.id} className="group relative block p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {new Date(ev.event_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                        {daysUntil >= 0 && daysUntil <= 30 && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${daysUntil <= 7 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            J-{daysUntil}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-900 transition-colors leading-tight mb-1">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {typeLabels[ev.type]} {ev.niveau_label ? `• ${ev.niveau_label}` : ''}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Aucun événement à venir prochainement.</p>
              )}
            </div>
          </div>
          
          {/*
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-indigo-100 text-center">
            <h4 className="font-black text-indigo-900 mb-2">Prêt pour les examens ?</h4>
            <p className="text-xs text-indigo-700/80 mb-4">Accédez à tous nos cours et exercices corrigés pour vous préparer efficacement.</p>
            <Link href="/tarifs" className="inline-block w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-indigo-200">
              Voir nos offres
            </Link>
          </div>
          */}
        </div>

      </div>
    </div>
  );
}
