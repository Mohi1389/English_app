import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Lang } from './i18n';
import { getTheme } from '@/styles/tokens';

interface UIState {
  lang: Lang;
  setLang: (l: Lang) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
  toggleLang: () => void;
  toggleDark: () => void;
  theme: ReturnType<typeof getTheme>;
  rtl: boolean;
}

const UIContext = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  // Persian is the DEFAULT language
  const [lang, setLang] = useState<Lang>('fa');
  const [dark, setDark] = useState(false);

  // Restore preferences
  useEffect(() => {
    const savedLang = localStorage.getItem('lwm-lang');
    const savedDark = localStorage.getItem('lwm-dark');
    if (savedLang === 'fa' || savedLang === 'en') setLang(savedLang);
    if (savedDark) setDark(savedDark === '1');
  }, []);

  useEffect(() => {
    localStorage.setItem('lwm-lang', lang);
    localStorage.setItem('lwm-dark', dark ? '1' : '0');
  }, [lang, dark]);

  const value: UIState = {
    lang,
    setLang,
    dark,
    setDark,
    toggleLang: () => setLang((l) => (l === 'fa' ? 'en' : 'fa')),
    toggleDark: () => setDark((d) => !d),
    theme: getTheme(dark),
    rtl: lang === 'fa',
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIProvider');
  return ctx;
}
