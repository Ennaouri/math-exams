'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-500 hover:text-white text-slate-300 font-semibold py-2 px-3 rounded-lg transition-colors text-xs border border-slate-700 hover:border-red-600"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
      Déconnexion
    </button>
  );
}