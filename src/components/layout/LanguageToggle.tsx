import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isLang } from '../../i18n/language';
import type { Lang } from '../../types/content';

export default function LanguageToggle() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const current: Lang = isLang(lang) ? lang : 'fr';

  const switchTo = (next: Lang) => {
    if (next === current) return;
    navigate(`/${next}${window.location.hash}`);
  };

  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      {(['fr', 'en'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => switchTo(option)}
          aria-pressed={current === option}
          className={`rounded px-2 py-1 transition-colors ${
            current === option ? 'text-accent' : 'text-text-muted hover:text-text'
          }`}
        >
          {t(`languageToggle.${option}`)}
        </button>
      ))}
    </div>
  );
}
