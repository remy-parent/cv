import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import TechStack from '../components/sections/TechStack';
import Experience from '../components/sections/Experience';
import ValueProposition from '../components/sections/ValueProposition';
import CurrentlyWorkingOn from '../components/sections/CurrentlyWorkingOn';
import Education from '../components/sections/Education';
import Contact from '../components/sections/Contact';

export default function Home() {
  const { lang } = useParams();
  const siteUrl = import.meta.env.VITE_SITE_URL ?? 'https://remyparent.com';

  return (
    <>
      <Helmet>
        <title>Remy Parent — Senior Full-stack Developer</title>
        <meta
          name="description"
          content="Remy Parent — Senior full-stack developer with a strong back-end e-commerce background. React / Next.js / TypeScript on the front, Node.js / API on the server — complete products, typed and tested end-to-end."
        />
        <link rel="canonical" href={`${siteUrl}/${lang}`} />
      </Helmet>
      <Nav />
      <main>
        <Hero />
        <TechStack />
        <Experience />
        <ValueProposition />
        <CurrentlyWorkingOn />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
