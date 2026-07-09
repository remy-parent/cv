import { useTranslation } from 'react-i18next';
import profile from '../../assets/profile.jpg';
import Button from '../ui/Button';
import AnimatedSection from '../layout/AnimatedSection';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <AnimatedSection className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-10 px-6 py-20 md:flex-row md:py-32">
      <div className="flex-1 text-center md:flex-[1.4] md:text-left">
        <p className="mb-4 inline-block rounded-full border border-border px-4 py-1 font-mono text-xs uppercase tracking-widest text-accent">
          {t('hero.availability')}
        </p>
        <h1 className="text-4xl text-text md:text-6xl">Remy Parent</h1>
        <p className="mt-4 text-xl text-accent md:text-2xl">{t('hero.hook')}</p>
        <p className="mt-4 max-w-2xl text-text-muted md:mx-0">{t('hero.description')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
          <Button href="#contact">{t('hero.ctaContact')}</Button>
          <Button href="#experience" variant="secondary">
            {t('hero.ctaBackground')}
          </Button>
        </div>
      </div>
      <div className="flex justify-center md:flex-1">
        <div className="aspect-square w-44 overflow-hidden rounded-full border-2 border-accent md:w-56">
          <img
            src={profile}
            alt="Remy Parent"
            width={220}
            height={220}
            className="h-full w-full translate-x-[5%] scale-110 object-cover object-[center_22%]"
          />
        </div>
      </div>
    </AnimatedSection>
  );
}
