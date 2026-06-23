import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import StatsBar from '../components/sections/StatsBar';
import TechStack from '../components/sections/TechStack';
import Experience from '../components/sections/Experience';
import ValueProposition from '../components/sections/ValueProposition';
import CurrentlyWorkingOn from '../components/sections/CurrentlyWorkingOn';
import Contact from '../components/sections/Contact';

export default function Home() {
  const { lang } = useParams();
  const siteUrl = import.meta.env.VITE_SITE_URL ?? 'https://remyparent.com';

  return (
    <>
      <Helmet>
        <title>Remy Parent — Senior Back-End Developer</title>
        <meta
          name="description"
          content="Remy Parent — Senior back-end developer. I help e-commerce teams turn business needs into reliable, well-architected systems, with 9 years of experience from legacy refactors to greenfield microservices."
        />
        <link rel="canonical" href={`${siteUrl}/${lang}`} />
      </Helmet>
      <Nav />
      <main>
        <Hero />
        <StatsBar />
        <TechStack />
        <Experience />
        <ValueProposition />
        <CurrentlyWorkingOn />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
