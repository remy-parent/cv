import { stats } from '../../data/stats';
import { useCurrentLang } from '../../hooks/useCurrentLang';
import AnimatedSection from '../layout/AnimatedSection';

export default function StatsBar() {
  const lang = useCurrentLang();

  return (
    <AnimatedSection className="border-y border-border bg-bg-raised px-6 py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label.fr}>
            <p className="font-heading text-4xl text-accent">{stat.value}</p>
            <p className="mt-2 text-sm text-text-muted">{stat.label[lang]}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
