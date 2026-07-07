import type { TechCategory } from '../types/content';

export const techStack: TechCategory[] = [
  {
    category: { fr: 'Front-end', en: 'Front-end' },
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Vitest',
      'Testing Library',
      'Playwright',
    ],
  },
  {
    category: { fr: 'Back-end', en: 'Back-end' },
    skills: ['Node.js', 'TypeScript', 'PHP 7/8', 'Symfony', 'Laravel', 'Doctrine', 'POO'],
  },
  {
    category: { fr: 'Data & APIs', en: 'Data & APIs' },
    skills: ['REST APIs', 'GraphQL', 'MySQL', 'NoSQL', 'DynamoDB', 'Elasticsearch', 'ETL'],
  },
  {
    category: { fr: 'E-commerce & CMS', en: 'E-commerce & CMS' },
    skills: ['Magento 2', 'WordPress', 'Passerelles de paiement', 'Intégration CRM'],
  },
  {
    category: { fr: 'Cloud & Architecture', en: 'Cloud & Architecture' },
    skills: ['AWS', 'Vercel', 'Serverless', 'Docker', 'Microservices', 'SOLID', 'Git', 'CI/CD'],
  },
  {
    category: { fr: 'Qualité & IA', en: 'Quality & AI' },
    skills: ['Revue de code', 'Méthodes agiles', 'Prompt Engineering', 'LLM', 'Claude Code'],
  },
  {
    category: { fr: 'Langues', en: 'Languages' },
    skills: ['Français', 'English'],
  },
];
