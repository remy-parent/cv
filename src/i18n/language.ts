import type { Lang } from '../types/content';

export const LANG_STORAGE_KEY = 'preferred-lang';

export function isLang(value: string | undefined): value is Lang {
  return value === 'fr' || value === 'en';
}

export function detectLang(): Lang {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  if (isLang(stored ?? undefined)) return stored as Lang;
  return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function persistLang(lang: Lang) {
  localStorage.setItem(LANG_STORAGE_KEY, lang);
}
