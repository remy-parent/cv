import { useTranslation } from 'react-i18next';
import { useCurrentLang } from '../../hooks/useCurrentLang';
import type { Bilingual } from '../../types/content';
import AnimatedSection from '../layout/AnimatedSection';
import SectionHeading from '../ui/SectionHeading';

const PREP_COURSE_URL =
  'https://www.udemy.com/certificate/UC-7e497c9d-99f1-425e-9549-3ae8c7c993ce/';

interface Certification {
  name: string;
  date: Bilingual<string>;
  url: string;
}

const CERTIFICATIONS: Certification[] = [
  {
    name: 'Claude Code 101',
    date: { fr: 'Mai 2026', en: 'May 2026' },
    url: 'https://verify.skilljar.com/c/9vnxrrovpbnx',
  },
  {
    name: 'Claude Code in Action',
    date: { fr: 'Juin 2026', en: 'June 2026' },
    url: 'https://verify.skilljar.com/c/hu8raudyayra',
  },
  {
    name: 'Building with the Claude API',
    date: { fr: '2026', en: '2026' },
    url: 'https://verify.skilljar.com/c/ncmbuppm9k2m',
  },
  {
    name: 'Introduction to MCP',
    date: { fr: '2026', en: '2026' },
    url: 'https://verify.skilljar.com/c/gowi6vu8sib5',
  },
  {
    name: 'MCP: Advanced Topics',
    date: { fr: '2026', en: '2026' },
    url: 'https://verify.skilljar.com/c/626idhj2nk6v',
  },
];

function AnthropicMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5 text-accent">
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  );
}

export default function Certifications() {
  const { t } = useTranslation();
  const lang = useCurrentLang();

  return (
    <AnimatedSection id="certifications" className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeading eyebrow={t('certifications.eyebrow')} title={t('certifications.title')} />
      <div className="grid gap-4 sm:grid-cols-2">
        {CERTIFICATIONS.map((cert) => (
          <div
            key={cert.name}
            className="flex flex-col gap-3 rounded-xl border border-border bg-bg-raised p-5"
          >
            <AnthropicMark />
            <div>
              <h4 className="font-heading text-lg text-text">{cert.name}</h4>
              <p className="mt-1 text-xs text-text-muted">
                {t('certifications.issuedBy')} · {cert.date[lang]}
              </p>
            </div>
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted underline-offset-4 hover:text-accent hover:underline"
            >
              {t('certifications.verify')} →
            </a>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-border px-5 py-4 text-center">
        <h4 className="font-heading text-base text-text">{t('certifications.prepTitle')}</h4>
        <p className="mt-1 text-xs text-text-muted">{t('certifications.prepCourse')}</p>
        <a
          href={PREP_COURSE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-text-muted underline-offset-4 hover:text-accent hover:underline"
        >
          {t('certifications.verify')} →
        </a>
      </div>
    </AnimatedSection>
  );
}
