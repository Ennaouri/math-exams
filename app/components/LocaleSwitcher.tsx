'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '../../i18n/routing';
import { useState, useRef, useEffect } from 'react';

function FranceFlagIcon({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 3 2" className={className} preserveAspectRatio="none">
      <rect width="1" height="2" fill="#002654" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#CE1126" />
    </svg>
  );
}

function UKFlagIcon({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} preserveAspectRatio="none">
      <clipPath id="uk-clip-locale">
        <path d="M30,15 L60,0 v30 z M30,15 L0,30 v-30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-locale)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

const locales = [
  { code: 'fr', name: 'Français', Icon: FranceFlagIcon },
  { code: 'en', name: 'English', Icon: UKFlagIcon }
];

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];
  const CurrentIcon = currentLocale.Icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (newLocale: string) => {
    setIsOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 cursor-pointer"
        aria-label="Changer de langue"
        title={currentLocale.name}
      >
        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center border border-slate-200/60 shadow-xs">
          <CurrentIcon className="w-full h-full object-cover" />
        </div>
        <svg
          className={`w-3 h-3 text-slate-500 transition-transform mr-1 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50">
          {locales.map((l) => {
            const Flag = l.Icon;
            return (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                  locale === l.code
                    ? 'text-blue-600 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                    <Flag className="w-full h-full object-cover" />
                  </div>
                  <span>{l.name}</span>
                </div>
                {locale === l.code && (
                  <svg
                    className="w-3.5 h-3.5 text-blue-600 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
