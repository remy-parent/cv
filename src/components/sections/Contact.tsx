import { useTranslation } from 'react-i18next';
import AnimatedSection from '../layout/AnimatedSection';
import SectionHeading from '../ui/SectionHeading';

const EMAIL = 'remy.email@icloud.com';
const LINKEDIN = 'linkedin.com/in/remyparent';
const GITHUB = 'github.com/xyphoide';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <AnimatedSection id="contact" className="mx-auto max-w-3xl px-6 py-20 text-center">
      <SectionHeading eyebrow={t('contact.eyebrow')} title={t('contact.title')} />
      <p className="mx-auto max-w-md text-text-muted">{t('contact.description')}</p>
      <dl className="mt-8 space-y-3 font-mono text-sm">
        <div className="flex justify-center gap-2">
          <dt className="text-text-muted">{t('contact.emailLabel')}:</dt>
          <dd>
            <a href={`mailto:${EMAIL}`} className="text-accent hover:underline">
              {EMAIL}
            </a>
          </dd>
        </div>
        <div className="flex justify-center gap-2">
          <dt className="text-text-muted">{t('contact.linkedinLabel')}:</dt>
          <dd>
            <a
              href={`https://${LINKEDIN}`}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              {LINKEDIN}
            </a>
          </dd>
        </div>
        <div className="flex justify-center gap-2">
          <dt className="text-text-muted">{t('contact.githubLabel')}:</dt>
          <dd>
            <a
              href={`https://${GITHUB}`}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              {GITHUB}
            </a>
          </dd>
        </div>
      </dl>
    </AnimatedSection>
  );
}
