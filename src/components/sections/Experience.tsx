import { useTranslation } from 'react-i18next';
import { experience } from '../../data/experience';
import { useCurrentLang } from '../../hooks/useCurrentLang';
import AnimatedSection from '../layout/AnimatedSection';
import SectionHeading from '../ui/SectionHeading';
import BeforeCode from './BeforeCode';
import ExperienceItem from './ExperienceItem';

export default function Experience() {
  const { t } = useTranslation();
  const lang = useCurrentLang();

  return (
    <AnimatedSection id="experience" className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeading eyebrow={t('experience.eyebrow')} title={t('experience.title')} />
      <ul className="space-y-10">
        {experience.map((entry) => (
          <ExperienceItem key={entry.id} entry={entry} lang={lang} />
        ))}
        <BeforeCode />
      </ul>
    </AnimatedSection>
  );
}
