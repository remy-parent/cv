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
    category: { fr: 'IA & Qualité', en: 'AI & Quality' },
    skills: [
      'Claude API',
      'Tool use',
      'MCP',
      'Claude Code',
      'Prompt Engineering',
      'LLM',
      'Spec-Driven Development',
      { fr: 'Sous-agents', en: 'Sub-agents' },
      'Hooks',
      'Revue de code',
      'Méthodes agiles',
    ],
  },
  {
    category: { fr: 'Data & APIs', en: 'Data & APIs' },
    skills: [
      'REST APIs',
      'GraphQL',
      'MySQL',
      'PostgreSQL',
      'NoSQL',
      'DynamoDB',
      'Elasticsearch',
      'ETL',
    ],
  },
  {
    category: { fr: 'E-commerce & CMS', en: 'E-commerce & CMS' },
    skills: ['Magento 2', 'WordPress', 'Passerelles de paiement', 'Intégration CRM'],
  },
  {
    category: { fr: 'Cloud & Architecture', en: 'Cloud & Architecture' },
    skills: [
      'AWS',
      'Vercel',
      'Serverless',
      'Docker',
      'Microservices',
      'SOLID',
      'Git',
      'CI/CD',
      'GitHub Actions',
    ],
  },
  {
    category: { fr: 'Langues', en: 'Languages' },
    skills: ['Français', 'English'],
  },
];
