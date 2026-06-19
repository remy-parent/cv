import type { ExperienceEntry } from '../types/content';

export const experience: ExperienceEntry[] = [
  {
    id: 'darwin-salomon',
    period: { fr: 'Juil. 2023 — Sept. 2025', en: 'Jul. 2023 — Sep. 2025' },
    company: 'Darwin Partners — Contrat chez Salomon',
    location: 'Annecy, France',
    title: { fr: 'Développeur Back-end', en: 'Back-end Developer' },
    bullets: {
      fr: [
        'Maintenance et optimisation des performances de la plateforme e-commerce Magento.',
        'Refonte du site en Next.js, création et maintenance de microservices.',
      ],
      en: [
        'Maintained and optimized the performance of the Magento e-commerce platform.',
        'Led the Next.js site rebuild, built and maintained microservices.',
      ],
    },
    tags: ['Salomon', 'Magento 2', 'Next.js', 'Microservices'],
  },
  {
    id: 'quatrecentquatre',
    period: { fr: 'Févr. 2021 — Juil. 2023', en: 'Feb. 2021 — Jul. 2023' },
    company: 'QuatreCentQuatre — Agence web',
    location: 'Montréal, Canada',
    title: { fr: 'Chef d’équipe & Lead développeur', en: 'Team Lead & Lead Developer' },
    bullets: {
      fr: [
        'Supervision de 5 développeurs back-end, coordination technique et amélioration des bonnes pratiques.',
        "Analyse des besoins et définition de l'architecture (BDD & code).",
        'Découpage, estimation et développement des fonctionnalités.',
        'Support QA, revue de code, formation des juniors, déploiements et maintenance technique.',
      ],
      en: [
        'Supervised 5 back-end developers, technical coordination and best-practice improvements.',
        'Analyzed requirements and defined architecture (database & code).',
        'Broke down, estimated, and developed features.',
        'QA support, code review, junior mentoring, deployments and technical maintenance.',
      ],
    },
    tags: [
      'Trevi',
      'Dutailier',
      'Can-Am On-Road',
      'Can-Am Off-Road',
      'Sea-Doo',
      'Ski-Doo',
      'Point-S',
    ],
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
        'Développement complet d’une application interne (Pulse), en tant que seul développeur.',
        'Conception du concept et de l’architecture.',
      ],
      en: [
        'Built an internal application (Pulse) end-to-end as the sole developer.',
        'Designed the concept and the architecture.',
      ],
    },
    tags: ['Pulse'],
  },
  {
    id: 'o2web',
    period: { fr: 'Mai 2018 — Sept. 2020', en: 'May 2018 — Sep. 2020' },
    company: 'O2web — Agence web e-commerce',
    location: 'Montréal, Canada',
    title: { fr: 'Développeur Magento Back-end / Lead', en: 'Magento Back-end Developer / Lead' },
    bullets: {
      fr: [
        'Analyse des besoins clients et collaboration avec les analystes pour définir les fonctionnalités.',
        'Conception de l’architecture back-end.',
        'Formation des développeurs juniors, revue de code, amélioration du code legacy.',
      ],
      en: [
        'Analyzed client needs and collaborated with analysts to define features.',
        'Designed the back-end architecture.',
        'Mentored junior developers, code review, legacy code improvements.',
      ],
    },
    tags: ['BRP Shop', 'MUST', 'Maison Corbeil', 'Maison Adam', 'XPS Lubrifiants', 'HockeyShot'],
  },
  {
    id: 'monolith',
    period: { fr: 'Sept. 2017 — Avr. 2018', en: 'Sep. 2017 — Apr. 2018' },
    company: 'Monolith — Agence créative',
    location: 'Montréal, Canada',
    title: { fr: 'Développeur Full-stack', en: 'Full-stack Developer' },
    bullets: {
      fr: ['Correction de bugs et développement des fonctionnalités UI/UX.'],
      en: ['Bug fixing and UI/UX feature development.'],
    },
    tags: ['BiogasWorld', 'Cycle Néron', 'Nature Express'],
  },
];
