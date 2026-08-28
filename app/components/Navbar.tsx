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

  // Close mobile menu on route change
  const closeAll = () => {
    setIsOpen(false);
    setLevelOpen(false);
    setProfileOpen(false);
  };

  const userImage = (session?.user as any)?.image || getStoredImage();

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50" aria-label="Navigation principale">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="self-center text-2xl font-bold whitespace-nowrap">
            Maths<span className="text-blue-400">-Exams</span>
          </span>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-300 rounded-lg md:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700"
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

        {/* Nav links */}
        <div
          id="navbar-dropdown"
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg bg-gray-800 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-transparent">
            <li>
              <Link
                href="/"
                onClick={closeAll}
                className="block py-2 px-3 text-white bg-blue-600 rounded md:bg-transparent md:text-blue-400 md:p-0 md:hover:text-blue-300"
                aria-current="page"
              >
                Accueil
              </Link>
            </li>

            {/* Niveau dropdown — pure React, no Flowbite */}
            <li ref={levelRef} className="relative">
              <button
                onClick={() => setLevelOpen(!levelOpen)}
                className="flex items-center justify-between w-full py-2 px-3 text-gray-200 rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-400 md:p-0 md:w-auto"
                aria-expanded={levelOpen}
                aria-haspopup="true"
              >
                Niveau
                <svg
                  className={`w-2.5 h-2.5 ms-2.5 ml-2 transition-transform ${levelOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {levelOpen && (
                <ul className="absolute z-10 mt-1 font-normal bg-gray-800 divide-y divide-gray-700 rounded-lg shadow w-44 py-2 text-sm text-gray-200">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/category/${category.slug}`}
                        onClick={closeAll}
                        className="block px-4 py-2 hover:bg-gray-700 hover:text-white"
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
                href="/about"
                onClick={closeAll}
                className="block py-2 px-3 text-gray-200 rounded hover:bg-gray-700 md:hover:text-blue-400 md:p-0"
              >
                À propos
              </Link>
            </li>
            <li>
              <Link
                href="/methodologie-bac"
                onClick={closeAll}
                className="block py-2 px-3 text-gray-200 rounded hover:bg-gray-700 md:hover:text-blue-400 md:p-0"
              >
                Méthode BAC
              </Link>
            </li>
            <li>
              <Link
                href="/contactus"
                onClick={closeAll}
                className="block py-2 px-3 text-gray-200 rounded hover:bg-gray-700 md:hover:text-blue-400 md:p-0"
              >
                Contactez-nous
              </Link>
            </li>

            {/* Auth section */}
            {status === "loading" ? null : session ? (
              <>
                {(session.user as any)?.role === "admin" && (
                  <li>
                    <Link
                      href="/admin"
                      onClick={closeAll}
                      className="block py-2 px-3 text-gray-200 rounded hover:bg-gray-700 md:hover:text-blue-400 md:p-0"
                    >
                      Admin
                    </Link>
                  </li>
                )}
                <li ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 py-2 px-3 text-gray-200 rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-400 md:p-0"
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                      {userImage ? (
                        <img
                          src={userImage}
                          alt={session.user?.name || "Utilisateur"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <span className="hidden md:inline">{session.user?.name}</span>
                    <svg className="w-2.5 h-2.5 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  {profileOpen && (
                    <div className="z-10 font-normal bg-gray-800 divide-y divide-gray-700 rounded-lg shadow w-64 absolute right-0 mt-2">
                      <div className="px-4 py-3">
                        <p className="text-sm text-white font-semibold">{session.user?.name}</p>
                        <p className="text-sm text-gray-400 truncate">{session.user?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            (session.user as any)?.role === "admin"
                              ? "bg-purple-600 text-white"
                              : "bg-green-600 text-white"
                          }`}>
                            {(session.user as any)?.role === "admin" ? "Admin" : "Utilisateur"}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">
                            Vérifié
                          </span>
                        </div>
                      </div>
                      <ul className="py-2 text-sm text-gray-200">
                        <li>
                          <Link
                            href="/profile"
                            onClick={closeAll}
                            className="block px-4 py-2 hover:bg-gray-700 hover:text-white"
                          >
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Profil
                            </span>
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
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  onClick={closeAll}
                  className="block py-2 px-3 text-gray-200 rounded hover:bg-gray-700 md:hover:text-blue-400 md:p-0"
                >
                  Connexion
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
