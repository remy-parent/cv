import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isLang, persistLang } from '../i18n/language';

export default function LocaleLayout() {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const valid = isLang(lang);

  useEffect(() => {
    if (!valid || !lang) return;
    void i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    persistLang(lang);
  }, [lang, valid, i18n]);

  if (!valid) return <Navigate to="/404" replace />;

  return <Outlet />;
}
