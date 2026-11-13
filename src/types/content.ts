export type Lang = 'fr' | 'en';

export type Bilingual<T> = Record<Lang, T>;

export interface TechCategory {
  category: Bilingual<string>;
  skills: (string | Bilingual<string>)[];
}

export interface ExperienceEntry {
  id: string;
  period: Bilingual<string>;
  company: string;
  location: string;
  title: Bilingual<string>;
  bullets: Bilingual<string[]>;
  tags?: string[];
  links?: { label: Bilingual<string>; url: string }[];
}

export interface ValueCardItem {
  title: Bilingual<string>;
  description: Bilingual<string>;
}
