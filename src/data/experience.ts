import type { ExperienceEntry } from '../types/content';

export const experience: ExperienceEntry[] = [
  {
    id: 'personal-fullstack',
    period: { fr: 'Depuis sept. 2025', en: 'Since Sep. 2025' },
    company: 'Projets personnels & montée en compétence',
    location: 'Aix-en-Provence, France',
    title: { fr: 'Développeur Full-stack', en: 'Full-stack Developer' },
    bullets: {
      fr: [
        'Période dédiée au full-stack moderne : conception et développement d’applications web personnelles en React / Next.js / TypeScript.',
        'Produits typés et testés de bout en bout (Vitest / Playwright), déployés en CI/CD sur Vercel.',
        'Workflow assisté par IA, certifié Claude Code (voir Certifications).',
      ],
      en: [
        'Dedicated period focused on modern full-stack: designing and building personal web apps in React / Next.js / TypeScript.',
        'End-to-end typed and tested products (Vitest / Playwright), deployed via CI/CD on Vercel.',
        'AI-assisted workflow, Claude Code certified (see Certifications).',
      ],
    },
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vitest', 'CI/CD', 'Vercel'],
  },
  {
    id: 'darwin-salomon',
    period: { fr: 'Juil. 2023 — Sept. 2025', en: 'Jul. 2023 — Sep. 2025' },
    company: 'Darwin Partners — Contrat chez Salomon',
    location: 'Annecy, France',
    title: { fr: 'Développeur Full-stack', en: 'Full-stack Developer' },
    bullets: {
      fr: [
        'Contribué à la refonte complète du site Salomon en Next.js / React (monorepo), responsable de la page produit au sein d’une équipe de 5 développeurs (composants React réutilisables, logique, état, Tailwind).',
        'Conçu et maintenu seul le microservice central des données produits (Node.js / TypeScript) et 2 librairies partagées, alimentant un catalogue de 2 500–3 500 modèles (30 000+ SKUs) déployé sur 12 pays (EMEA & Amérique du Nord).',
        'Fait évoluer et maintenu 5 sites e-commerce Amer Sports sous Magento (Salomon, Peak Performance, Wilson, Atomic, Armada) pendant les ~18 premiers mois, avant le lancement de la refonte.',
      ],
      en: [
        'Contributed to the full rebuild of the Salomon site in Next.js / React (monorepo), owning the product page within a team of 5 developers (reusable React components, logic, state, Tailwind).',
        'Solely designed and maintained the central product-data microservice (Node.js / TypeScript) and 2 shared libraries, powering a catalog of 2,500–3,500 models (30,000+ SKUs) deployed across 12 countries (EMEA & North America).',
        'Evolved and maintained 5 Amer Sports e-commerce sites on Magento (Salomon, Peak Performance, Wilson, Atomic, Armada) for the first ~18 months, before the rebuild launched.',
      ],
    },
    tags: ['Next.js', 'React', 'Node.js', 'TypeScript', 'Microservices', 'Magento 2'],
  },
  {
    id: 'quatrecentquatre',
    period: { fr: 'Févr. 2021 — Juil. 2023', en: 'Feb. 2021 — Jul. 2023' },
    company: 'QuatreCentQuatre — Agence web',
    location: 'Montréal, Canada',
    title: { fr: 'Chef d’équipe & Lead développeur', en: 'Team Lead & Lead Developer' },
    bullets: {
      fr: [
        'Développé plusieurs sites e-commerce sur des stacks variées (Magento pour Trevi et Dutailier, Laravel pour Point-S et Can-Am Retailers, CraftCMS pour La Cage), de l’architecture (BDD & code) aux fonctionnalités.',
        'Traduit les besoins clients en fonctionnalités avec les analystes, estimé et découpé les tâches, développé et refactoré du code legacy, puis assuré déploiements et mises à jour de frameworks (support QA).',
        'Monté en compétence jusqu’à devenir Lead d’une équipe de 7 développeurs : revues de code, formation des juniors, ateliers techniques (SOLID, design patterns) et rituels EOS (Level 10 meetings).',
      ],
      en: [
        'Built several e-commerce sites across varied stacks (Magento for Trevi and Dutailier, Laravel for Point-S and Can-Am Retailers, CraftCMS for La Cage), from architecture (database & code) to features.',
        'Translated client needs into features with the analysts, estimated and broke down tasks, developed and refactored legacy code, then handled deployments and framework upgrades (QA support).',
        'Grew into the Lead of a team of 7 developers: code reviews, junior mentoring, technical workshops (SOLID, design patterns) and EOS rituals (Level 10 meetings).',
      ],
    },
    tags: ['Magento', 'Laravel', 'CraftCMS', 'PHP', 'MySQL'],
  },
  {
    id: 'u92-pulse',
    period: { fr: 'Oct. 2020 — Janv. 2021', en: 'Oct. 2020 — Jan. 2021' },
    company: 'U92 — Agence digitale',
    location: 'Montréal, Canada',
    title: {
      fr: 'Développeur Back-end — Projet Pulse (Humanise)',
      en: 'Back-end Developer — Pulse Project (Humanise)',
    },
    bullets: {
      fr: [
        'Développé de bout en bout Pulse, une application RH interne, en tant que seul développeur back-end (PHP / Symfony).',
        'Conçu l’architecture technique du projet et défini le concept produit.',
      ],
      en: [
        'Built Pulse, an internal HR application, end-to-end as the sole back-end developer (PHP / Symfony).',
        'Designed the project’s technical architecture and defined the product concept.',
      ],
    },
    tags: ['PHP', 'Symfony', 'MySQL'],
  },
  {
    id: 'o2web',
    period: { fr: 'Mai 2018 — Sept. 2020', en: 'May 2018 — Sep. 2020' },
    company: 'O2web — Agence web e-commerce',
    location: 'Montréal, Canada',
    title: { fr: 'Développeur Magento Back-end / Lead', en: 'Magento Back-end Developer / Lead' },
    bullets: {
      fr: [
        'Bâti l’architecture back-end de 9 sites e-commerce (7 en Magento 2, 2 en Drupal 8) pour des marques nationales (BRP, MUST, Maison Corbeil…).',
        'Mené la migration Magento 1 → 2 de HockeyShot : montée de version, refonte du code legacy et nouvelles fonctionnalités.',
        'Développé les intégrations critiques (passerelles de paiement, connecteurs ERP / CRM) et encadré jusqu’à 3 développeurs.',
      ],
      en: [
        'Built the back-end architecture of 9 e-commerce sites (7 on Magento 2, 2 on Drupal 8) for national brands (BRP, MUST, Maison Corbeil…).',
        'Led the Magento 1 → 2 migration of HockeyShot: version upgrade, legacy code overhaul and new features.',
        'Developed the critical integrations (payment gateways, ERP / CRM connectors) and mentored up to 3 developers.',
      ],
    },
    tags: ['Magento 2', 'Drupal 8', 'PHP', 'ERP / CRM', 'Passerelles de paiement'],
  },
  {
    id: 'monolith',
    period: { fr: 'Sept. 2017 — Avr. 2018', en: 'Sep. 2017 — Apr. 2018' },
    company: 'Monolith — Agence créative',
    location: 'Montréal, Canada',
    title: { fr: 'Développeur Full-stack', en: 'Full-stack Developer' },
    bullets: {
      fr: [
        'Développement full-stack orienté back-end sur des projets e-commerce (WooCommerce et Magento 1 en PHP, Shopify en JavaScript) : logique applicative et intégration des fonctionnalités.',
      ],
      en: [
        'Back-end-oriented full-stack development on e-commerce projects (WooCommerce and Magento 1 in PHP, Shopify in JavaScript): application logic and feature integration.',
      ],
    },
    tags: ['WooCommerce', 'Magento 1', 'Shopify', 'PHP', 'JavaScript'],
  },
];
