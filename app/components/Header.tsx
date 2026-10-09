'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Adolescent utilisant un ordinateur portable"
  },
  {
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Étudiant étudiant à la maison"
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Étudiants travaillant ensemble"
  }
];

export default function Header() {
  const pathname = usePathname();

  // ONLY show hero on the home page
  if (pathname !== "/") return null;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative bg-gradient-to-br from-[#f0f9ff] via-[#fffdf5] to-white border-b border-slate-100 overflow-hidden">
      <div className="relative max-w-screen-xl mx-auto px-4 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        
        {/* Left Column: Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left z-10">
          <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] font-black text-[#1a202c] leading-[1.05] tracking-tight uppercase mb-6">
            RÉUSSIR<br />
            LES MATHS,<br />
            TOUT SIMPLEMENT.
          </h1>
          
          <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
            Réussir les Mathématiques au Collège et Lycée : cours structurés, séances en direct, exercices d'application et annales d'examens corrigées pas à pas.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/#niveaux"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[#0084c7] hover:bg-[#006ba1] text-white font-bold text-[13px] uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/20 transition-all"
            >
              COMMENCER À APPRENDRE <span className="ml-2">→</span>
            </Link>
            
            <Link
              href="/lives"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-[13px] uppercase tracking-wider rounded-xl shadow-sm transition-all"
            >
              VOIR LES SÉANCES LIVE
            </Link>
          </div>

          <p className="text-xs text-slate-500 mt-8 mb-4 font-medium">
            Matières, classes en direct et annales : toute votre préparation dans votre poche.
          </p>

          {/* Stats */}
          <hr className="w-full border-slate-200 mb-6" />
          <div className="flex flex-wrap items-start justify-between w-full max-w-lg">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-[#0084c7]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                <span className="text-2xl font-black text-[#1a202c]">805</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">élèves inscrits</span>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-[#0084c7]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                <span className="text-2xl font-black text-[#1a202c]">1</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">professeur référent</span>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-[#0084c7]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                <span className="text-2xl font-black text-[#1a202c]">77</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">programmes disponibles</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4">
            Chiffres réels, mis à jour automatiquement depuis la plateforme.
          </p>
        </div>

        {/* Right Column: Carousel Photos */}
        <div className="w-full lg:w-1/2 relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center mt-10 lg:mt-0">
          
          {HERO_IMAGES.map((img, index) => {
            // Determine position relative to active index
            // 0 = active, 1 = right, 2 = left
            let position = (index - activeIndex + HERO_IMAGES.length) % HERO_IMAGES.length;
            
            let transformClass = "";
            let zIndexClass = "";
            
            if (position === 0) {
              // Active: Center and front
              transformClass = "scale-100 translate-x-0 rotate-0 shadow-2xl";
              zIndexClass = "z-20 opacity-100";
            } else if (position === 1) {
              // Next: Back right
              transformClass = "scale-90 translate-x-16 sm:translate-x-24 translate-y-4 rotate-6 shadow-xl";
              zIndexClass = "z-10 opacity-90";
            } else {
              // Prev: Back left
              transformClass = "scale-90 -translate-x-16 sm:-translate-x-24 translate-y-4 -rotate-6 shadow-xl";
              zIndexClass = "z-10 opacity-90";
            }

            return (
              <div 
                key={index}
                className={`absolute w-[260px] sm:w-[300px] lg:w-[340px] aspect-[3/4] rounded-2xl bg-slate-200 border-[6px] sm:border-[8px] border-white overflow-hidden transition-all duration-700 ease-in-out cursor-pointer ${transformClass} ${zIndexClass}`}
                onClick={() => setActiveIndex(index)}
              >
                <Image 
                  src={img.src} 
                  alt={img.alt} 
                  fill
                  className="object-cover"
                />
              </div>
            );
          })}

        </div>

      </div>
    </header>
  );
}
