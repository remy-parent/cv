import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr.json';
import en from './locales/en.json';

// The initial language must match the prerendered HTML of the current URL,
// otherwise hydration of /en starts with French UI strings and mismatches.
const initialLang =
  typeof window !== 'undefined' && window.location.pathname.startsWith('/en') ? 'en' : 'fr';

void i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: initialLang,
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
});

export default i18n;
