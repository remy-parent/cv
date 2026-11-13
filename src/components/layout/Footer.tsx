import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-6 py-8 text-center font-mono text-sm text-text-muted">
      <p>
        Remy Parent — {year}. {t('footer.rights')}
      </p>
      <p className="mt-2">
        <a
          href="https://github.com/remy-parent/cv"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          {t('footer.source')}
        </a>
      </p>
    </footer>
  );
}
