import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { en, TranslationKey } from './en';
import { ar } from './ar';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey | string) => string;
  dir: Direction;
  isAr: boolean;
}

const STORAGE_KEY = 'akram_portfolio_lang';

const getInitialLang = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ar') {
      return stored;
    }
  } catch {
    // Fallback if localStorage is inaccessible
  }
  return 'en';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(getInitialLang);

  const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore storage errors
    }
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'ar' : 'en');
  }, [lang, setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;

    // Per-language title and meta description
    const titleText =
      lang === 'ar'
        ? 'أكرم شريف | مطوّر ومصمم مواقع ويب'
        : 'Akram Sherif | Web Developer & Website Designer';
    const descText =
      lang === 'ar'
        ? 'أصمّم وأطوّر مواقع الويب مع التركيز على سهولة الاستخدام، والتصميم المتجاوب، والواجهات النظيفة، والوظائف، وسهولة الصيانة.'
        : 'I design and develop websites with a focus on usability, responsive layouts, clean interfaces, functionality and maintainability.';

    document.title = titleText;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', descText);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', titleText);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', descText);

    // Update JSON-LD Person schema
    const schemaScript = document.getElementById('person-schema');
    if (schemaScript) {
      schemaScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: lang === 'ar' ? 'أكرم شريف' : 'Akram Sherif',
        jobTitle: lang === 'ar' ? 'مطوّر ومصمم مواقع ويب' : 'Web Developer & Website Designer',
      });
    }
  }, [lang, dir]);

  const dictionary = useMemo(() => {
    return lang === 'ar' ? ar : en;
  }, [lang]);

  const t = useCallback(
    (key: TranslationKey | string): string => {
      const dict = dictionary as Record<string, string>;
      if (key in dict) {
        return dict[key];
      }
      return key;
    },
    [dictionary]
  );

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t,
      dir,
      isAr: lang === 'ar',
    }),
    [lang, setLang, toggleLang, t, dir]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
