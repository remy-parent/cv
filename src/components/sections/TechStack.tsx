import { useTranslation } from 'react-i18next';
import { techStack } from '../../data/techStack';
import { useCurrentLang } from '../../hooks/useCurrentLang';
import AnimatedSection from '../layout/AnimatedSection';
import SectionHeading from '../ui/SectionHeading';
import Tag from '../ui/Tag';

export default function TechStack() {
  const { t } = useTranslation();
  const lang = useCurrentLang();

  return (
    <AnimatedSection id="stack" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeading eyebrow={t('techStack.eyebrow')} title={t('techStack.title')} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {techStack.map((group) => (
          <div key={group.category.fr} className="rounded-2xl border border-border p-6">
            <h3 className="mb-4 font-heading text-lg text-text">{group.category[lang]}</h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => {
                const label = typeof skill === 'string' ? skill : skill[lang];
                return <Tag key={label}>{label}</Tag>;
              })}
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
