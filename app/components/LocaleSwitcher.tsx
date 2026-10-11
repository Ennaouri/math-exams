'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '../../i18n/routing';
import { useState, useRef, useEffect } from 'react';

const locales = [
  { code: 'fr', name: 'Français', flag: '/flags/fr.svg', alt: 'Français' },
  { code: 'en', name: 'English', flag: '/flags/en.svg', alt: 'English' }
];

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

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
          <img
            src={currentLocale.flag}
            alt={currentLocale.alt}
            className="w-full h-full object-cover"
          />
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
          {locales.map((l) => (
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
                <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-200 shrink-0">
                  <img src={l.flag} alt={l.alt} className="w-full h-full object-cover" />
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
          ))}
        </div>
      )}
    </div>
  );
}
