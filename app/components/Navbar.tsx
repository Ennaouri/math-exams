"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import type { CategoryCardType } from "../layout";

function getStoredImage(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userImage");
}

export default function Navbar({ categories }: { categories: CategoryCardType[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: session, status } = useSession();
  const levelRef = useRef<HTMLLIElement>(null);
  const profileRef = useRef<HTMLLIElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (levelRef.current && !levelRef.current.contains(event.target as Node)) {
        setLevelOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAll = () => {
    setIsOpen(false);
    setLevelOpen(false);
    setProfileOpen(false);
  };

  const userImage = (session?.user as any)?.image || getStoredImage();
  const userRole = (session?.user as any)?.role;

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800/80 shadow-lg backdrop-blur-md bg-slate-900/95" aria-label="Navigation principale">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl">M</span>
          </div>
          <span className="self-center text-xl sm:text-2xl font-black whitespace-nowrap tracking-tight">
            Maths<span className="text-blue-400">-Exams</span>
          </span>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-slate-300 rounded-xl md:hidden hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
          aria-expanded={isOpen}
          aria-controls="navbar-dropdown"
          aria-label="Ouvrir le menu de navigation"
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Navigation links */}
        <div
          id="navbar-dropdown"
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-2xl bg-slate-800 md:space-x-6 md:flex-row md:items-center md:mt-0 md:border-0 md:bg-transparent text-sm">
            <li>
              <Link
                href="/"
                onClick={closeAll}
                className="block py-2 px-3 text-slate-200 hover:text-blue-400 md:p-0 transition-colors"
                aria-current="page"
              >
                Accueil
              </Link>
            </li>

            {/* Niveau dropdown */}
            <li ref={levelRef} className="relative">
              <button
                onClick={() => setLevelOpen(!levelOpen)}
                className="flex items-center justify-between w-full py-2 px-3 text-slate-200 hover:text-blue-400 md:p-0 md:w-auto transition-colors"
                aria-expanded={levelOpen}
                aria-haspopup="true"
              >
                Niveaux
                <svg
                  className={`w-2.5 h-2.5 ms-1.5 transition-transform ${levelOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
              {levelOpen && (
                <ul className="absolute z-20 mt-2 font-normal bg-slate-800 border border-slate-700 divide-y divide-slate-700/60 rounded-xl shadow-2xl w-56 py-2 text-xs text-slate-200">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/category/${category.slug}`}
                        onClick={closeAll}
                        className="block px-4 py-2.5 hover:bg-slate-700/80 hover:text-blue-400 transition-colors"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <Link
                href="/formations"
                onClick={closeAll}
                className="block py-2 px-3 text-slate-200 hover:text-blue-400 md:p-0 transition-colors"
              >
                Formations
              </Link>
            </li>

            <li>
              <Link
                href="/lives"
                onClick={closeAll}
                className="flex items-center gap-1.5 py-2 px-3 text-slate-200 hover:text-blue-400 md:p-0 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Lives</span>
              </Link>
            </li>

            <li>
              <Link
                href="/tarifs"
                onClick={closeAll}
                className="block py-2 px-3 text-amber-300 hover:text-amber-200 font-bold md:p-0 transition-colors"
              >
                Tarifs & Packs
              </Link>
            </li>

            <li>
              <Link
                href="/methodologie-bac"
                onClick={closeAll}
                className="block py-2 px-3 text-slate-200 hover:text-blue-400 md:p-0 transition-colors"
              >
                Méthode BAC
              </Link>
            </li>

            {/* Auth / Dashboard button */}
            {status === "loading" ? null : session ? (
              <li ref={profileRef} className="relative mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-700">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full transition-all"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden text-xs font-bold">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt={session.user?.name || "Utilisateur"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      session.user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="text-xs font-bold max-w-[100px] truncate">{session.user?.name}</span>
                  <svg className="w-2 h-2 text-slate-400" fill="none" viewBox="0 0 10 6" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="z-20 bg-slate-800 border border-slate-700 divide-y divide-slate-700 rounded-2xl shadow-2xl w-64 absolute right-0 mt-2">
                    <div className="px-4 py-3">
                      <p className="text-sm text-white font-bold">{session.user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          userRole === 'admin'
                            ? 'bg-purple-600 text-white'
                            : userRole === 'parent'
                            ? 'bg-amber-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}>
                          {userRole === 'admin' ? 'Admin' : userRole === 'parent' ? 'Parent' : 'Étudiant'}
                        </span>
                      </div>
                    </div>

                    <ul className="py-2 text-xs text-slate-200">
                      <li>
                        <Link
                          href="/dashboard"
                          onClick={closeAll}
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-700 text-blue-400 font-bold"
                        >
                          <span>📊</span>
                          <span>Mon Tableau de Bord</span>
                        </Link>
                      </li>
                      {userRole === 'admin' && (
                        <li>
                          <Link
                            href="/admin"
                            onClick={closeAll}
                            className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-700 text-purple-400 font-bold"
                          >
                            <span>⚙️</span>
                            <span>Administration</span>
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          href="/profile"
                          onClick={closeAll}
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-700"
                        >
                          <span>👤</span>
                          <span>Paramètres du Profil</span>
                        </Link>
                      </li>
                    </ul>

                    <div className="py-2">
                      <button
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            localStorage.removeItem("userImage");
                          }
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-slate-700 font-semibold"
                      >
                        <span>🚪</span>
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ) : (
              <li className="mt-3 md:mt-0">
                <Link
                  href="/login"
                  onClick={closeAll}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-blue-600/30 transition-all"
                >
                  Espace Membre
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
