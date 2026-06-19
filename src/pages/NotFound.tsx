import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl text-text">{t('notFound.title')}</h1>
      <p className="text-text-muted">{t('notFound.description')}</p>
      <Link to="/" className="text-accent underline underline-offset-4">
        {t('notFound.back')}
      </Link>
    </div>
  );
}
