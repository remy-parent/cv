import { useTranslation } from 'react-i18next';
import AnimatedSection from '../layout/AnimatedSection';
import SectionHeading from '../ui/SectionHeading';
import Tag from '../ui/Tag';

const TAGS = ['Anthropic', 'Claude API', 'LLM Architecture', 'Prompt Engineering'];

export default function CurrentlyWorkingOn() {
  const { t } = useTranslation();

  return (
    <AnimatedSection id="currently-on" className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeading eyebrow={t('currentlyOn.eyebrow')} title={t('currentlyOn.title')} />
      <div className="rounded-2xl border border-accent bg-accent-soft p-8 text-center">
        <h3 className="font-heading text-2xl text-text">Claude Certified Architect</h3>
        <p className="mt-1 text-sm text-accent">{t('currentlyOn.status')}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {TAGS.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
