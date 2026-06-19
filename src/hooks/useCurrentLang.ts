import { useParams } from 'react-router-dom';
import { isLang } from '../i18n/language';
import type { Lang } from '../types/content';

export function useCurrentLang(): Lang {
  const { lang } = useParams();
  return isLang(lang) ? lang : 'fr';
}
