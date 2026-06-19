import { useTranslation } from 'react-i18next';
import { valueProposition } from '../../data/valueProposition';
import { useCurrentLang } from '../../hooks/useCurrentLang';
import AnimatedSection from '../layout/AnimatedSection';
import SectionHeading from '../ui/SectionHeading';

export default function ValueProposition() {
  const { t } = useTranslation();
  const lang = useCurrentLang();

  return (
    <AnimatedSection id="values" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeading eyebrow={t('values.eyebrow')} title={t('values.title')} />
      <div className="grid gap-6 md:grid-cols-3">
        {valueProposition.map((card) => (
          <div
            key={card.title.fr}
            className="rounded-2xl border border-border p-6 transition-colors hover:border-accent"
          >
            <h3 className="mb-2 font-heading text-lg text-text">{card.title[lang]}</h3>
            <p className="text-sm text-text-muted">{card.description[lang]}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
