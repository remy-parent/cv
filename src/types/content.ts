export type Lang = 'fr' | 'en';

export type Bilingual<T> = Record<Lang, T>;

export interface TechCategory {
  category: Bilingual<string>;
  skills: string[];
}

export interface ExperienceEntry {
  id: string;
  period: Bilingual<string>;
  company: string;
  location: string;
  title: Bilingual<string>;
  bullets: Bilingual<string[]>;
  tags?: string[];
}

export interface ValueCardItem {
  title: Bilingual<string>;
  description: Bilingual<string>;
}
