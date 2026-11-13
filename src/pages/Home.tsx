import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import TechStack from '../components/sections/TechStack';
import Experience from '../components/sections/Experience';
import ValueProposition from '../components/sections/ValueProposition';
import Certifications from '../components/sections/Certifications';
import Education from '../components/sections/Education';
import Contact from '../components/sections/Contact';

export default function Home() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const siteUrl = import.meta.env.VITE_SITE_URL ?? 'https://cv.remyparent.com';

  return (
    <>
      <Helmet>
        <title>Remy Parent — Senior Full-stack Developer</title>
        <meta name="description" content={t('seo.description')} />
        <link rel="canonical" href={`${siteUrl}/${lang}`} />
        <link rel="alternate" hrefLang="fr" href={`${siteUrl}/fr`} />
        <link rel="alternate" hrefLang="en" href={`${siteUrl}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/`} />
      </Helmet>
      <Nav />
      <main>
        <Hero />
        <TechStack />
        <Experience />
        <ValueProposition />
        <Certifications />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
