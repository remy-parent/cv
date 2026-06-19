import type { ExperienceEntry, Lang } from '../../types/content';
import Tag from '../ui/Tag';

interface ExperienceItemProps {
  entry: ExperienceEntry;
  lang: Lang;
}

export default function ExperienceItem({ entry, lang }: ExperienceItemProps) {
  return (
    <li className="relative border-l border-border pl-8">
      <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-accent" />
      <p className="font-mono text-sm text-accent">{entry.period[lang]}</p>
      <h3 className="mt-1 font-heading text-xl text-text">{entry.title[lang]}</h3>
      <p className="text-text-muted">
        {entry.company} — {entry.location}
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-muted">
        {entry.bullets[lang].map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      {entry.tags && (
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
    </li>
  );
}
