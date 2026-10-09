"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import type { CategoryCardType } from "../layout";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

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
    <nav className="bg-white/95 text-slate-800 sticky top-0 z-50 border-b border-slate-100 shadow-sm backdrop-blur-md" aria-label="Navigation principale">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-0.5 group">
          <span className="text-[#FFC107] font-black text-2xl tracking-tighter uppercase flex items-center">
            <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"/></svg>
            LOW
          </span>
          <span className="text-[#007BFF] font-black text-2xl tracking-tighter uppercase">
            DISCOVERY
          </span>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-slate-500 rounded-xl lg:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
          aria-expanded={isOpen}
          aria-controls="navbar-dropdown"
          aria-label="Ouvrir le menu de navigation"
        >
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

        {/* Navigation links */}
        <div id="navbar-dropdown" className={`${isOpen ? "block" : "hidden"} w-full lg:block lg:w-auto`}>
          <ul className="flex flex-col font-semibold p-4 lg:p-0 mt-4 rounded-2xl bg-slate-50 lg:space-x-6 lg:flex-row lg:items-center lg:mt-0 lg:border-0 lg:bg-transparent text-[13px] uppercase tracking-wide">
            {/* Niveau dropdown */}
            <li ref={levelRef} className="relative">
              <button
                onClick={() => setLevelOpen(!levelOpen)}
                className="flex items-center justify-between w-full py-2 px-3 text-slate-700 hover:text-blue-600 lg:p-0 transition-colors"
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
                <ul className="absolute z-20 mt-2 font-normal bg-white border border-slate-100 divide-y divide-slate-100 rounded-xl shadow-2xl w-56 py-2 text-xs text-slate-700">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/category/${category.slug}`}
                        onClick={closeAll}
                        className="block px-4 py-2.5 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* <li>
                <Link href="/classes" onClick={closeAll} className="block py-2 px-3 text-slate-700 hover:text-blue-600 lg:p-0 transition-colors">
                  Classes e-learning
                </Link>
              </li> */}
            <li>
              <Link href="/lives" onClick={closeAll} className="block py-2 px-3 text-slate-700 hover:text-blue-600 lg:p-0 transition-colors">
                  Séances Live
                </Link>
            </li>
            
            <li>
              <Link href="/about" onClick={closeAll} className="block py-2 px-3 text-slate-700 hover:text-blue-600 lg:p-0 transition-colors">
                  À propos
                </Link>
            </li>
            <li>
              <Link href="/contact" onClick={closeAll} className="block py-2 px-3 text-slate-700 hover:text-blue-600 lg:p-0 transition-colors">
                  Contact
                </Link>
            </li>
            <li className="hidden lg:block border-l border-slate-300 h-5 mx-2"></li>
            <li className="hidden lg:block">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="FR" className="w-6 h-6 rounded-full object-cover border border-slate-200 shadow-sm" />
              </li>
              <li className="mt-4 lg:mt-0 lg:ml-2 flex items-center justify-center">
                <ThemeToggle />
              </li>
            <li className="mt-4 lg:mt-0 lg:ml-2">
              {status === 'authenticated' ? (
                <div className="flex gap-2">
                  {userRole === 'admin' && (
                    <Link href="/admin/dashboard" onClick={closeAll} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-5 rounded-lg transition-colors text-xs">
                      ADMIN
                    </Link>
                  )}
                  <button onClick={() => signOut()} className="bg-[#111827] hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-xs flex items-center shadow-md">
                    DÉCONNEXION <span className="ml-2">→</span>
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={closeAll} className="bg-[#111827] hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-xs flex items-center shadow-md block w-fit">
                  ESPACE MEMBRE <span className="ml-2">→</span>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}