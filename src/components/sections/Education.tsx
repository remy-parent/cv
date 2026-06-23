import { useTranslation } from 'react-i18next';
import AnimatedSection from '../layout/AnimatedSection';
import SectionHeading from '../ui/SectionHeading';

export default function Education() {
  const { t } = useTranslation();

  return (
    <AnimatedSection id="education" className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeading eyebrow={t('education.eyebrow')} title={t('education.title')} />
      <p className="mx-auto max-w-xl text-balance text-center text-sm text-text-muted">
        {t('education.entry')}
      </p>
      <p className="mt-2 text-center font-mono text-xs uppercase tracking-widest text-text-muted/70">
        {t('education.period')}
      </p>
    </AnimatedSection>
  );
}
