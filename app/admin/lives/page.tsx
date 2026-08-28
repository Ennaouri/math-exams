'use client';

import React, { useState, useEffect } from 'react';
import { LiveSession } from '@/lib/types';

export default function AdminLivesPage() {
  const [lives, setLives] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [niveau, setNiveau] = useState('2bac');
  const [niveauLabel, setNiveauLabel] = useState('2ème Année BAC SM & PC/SVT');
  const [instructorName, setInstructorName] = useState('Professeur K. Ennaouri');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [meetingUrl, setMeetingUrl] = useState('');
  const [replayUrl, setReplayUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchLives = async () => {
    try {
      const res = await fetch('/api/lives?limit=50');
      const data = await res.json();
      setLives(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLives();
  }, []);

  const handleCreateLive = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/lives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          niveau,
          niveau_label: niveauLabel,
          instructor_name: instructorName,
          scheduled_at: new Date(scheduledAt),
          duration_minutes: Number(durationMinutes),
          meeting_url: meetingUrl,
          replay_url: replayUrl,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setTitle('');
        setDescription('');
        setMeetingUrl('');
        setReplayUrl('');
        fetchLives();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Séances en Direct (Lives)</h1>
          <p className="text-sm text-gray-500 mt-1">Programmez des séances en visioconférence pour les étudiants abonnés.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
        >
          + Programmer un Live
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement des séances...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="p-3">Titre</th>
                <th className="p-3">Niveau</th>
                <th className="p-3">Date & Heure</th>
                <th className="p-3">Enseignant</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Lien Salle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lives.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="p-3 font-semibold text-gray-900">{l.title}</td>
                  <td className="p-3 text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                      {l.niveau}
                    </span>
                  </td>
                  <td className="p-3 text-xs">{new Date(l.scheduled_at).toLocaleString('fr-FR')}</td>
                  <td className="p-3 text-xs">{l.instructor_name}</td>
                  <td className="p-3 text-xs">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      l.status === 'live' ? 'bg-red-100 text-red-700' :
                      l.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="p-3 text-xs">
                    {l.meeting_url ? (
                      <a href={l.meeting_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        Ouvrir le lien
                      </a>
                    ) : (
                      <span className="text-gray-400">Non défini</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal create live */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Programmer une Séance Live</h2>
            <form onSubmit={handleCreateLive} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Titre de la séance</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  placeholder="Ex: Étude de Fonctions & Dérivabilité"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Niveau</label>
                  <select
                    value={niveau}
                    onChange={(e) => {
                      setNiveau(e.target.value);
                      setNiveauLabel(e.target.options[e.target.selectedIndex].text);
                    }}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="tronc-commun">Tronc Commun Sciences</option>
                    <option value="1bac">1ère Année BAC</option>
                    <option value="2bac">2ème Année BAC</option>
                    <option value="concours">Concours Post-BAC</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Date et Heure</label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full border rounded-lg p-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Enseignant</label>
                  <input
                    type="text"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    className="w-full border rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Durée (minutes)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full border rounded-lg p-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Lien de la salle (Zoom / Google Meet)</label>
                <input
                  type="url"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Lien du Replay (YouTube / Vidéo)</label>
                <input
                  type="url"
                  value={replayUrl}
                  onChange={(e) => setReplayUrl(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description / Objectifs</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 py-2.5 rounded-lg font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : 'Créer la Séance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
