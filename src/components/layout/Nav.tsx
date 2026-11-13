import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  const { lang } = useParams();
  const { t } = useTranslation();

  const links = [
    { href: '#stack', label: t('nav.stack') },
    { href: '#experience', label: t('nav.experience') },
    { href: '#values', label: t('nav.values') },
    { href: '#certifications', label: t('nav.certifications') },
    { href: '#contact', label: t('nav.contact') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href={`/${lang}`} className="font-heading text-xl text-text">
          {t('nav.logo')}
        </a>
        <ul className="hidden items-center gap-6 text-sm text-text-muted md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-accent">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </nav>
    </header>
  );
}
