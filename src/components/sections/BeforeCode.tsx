import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PreCodeEntry {
  period: string;
  label: string;
}

export default function BeforeCode() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const entries = t('experience.beforeCode', { returnObjects: true }) as unknown as PreCodeEntry[];

  return (
    <li>
      <div className="relative border-l border-border pl-8">
        <span
          aria-hidden="true"
          className="absolute -left-[5px] top-1.5 size-2.5 rounded-full border border-[#4b5563] bg-bg"
        />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex items-center gap-2 font-mono text-sm text-text-muted transition-colors hover:text-accent"
        >
          <span
            aria-hidden="true"
            className={`text-base leading-none text-accent transition-transform duration-300 ${
              open ? 'rotate-45' : ''
            }`}
          >
            +
          </span>
          {t('experience.beforeCodeToggle')}
        </button>
      </div>
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-out ${
          open ? 'max-h-72' : 'max-h-0'
        }`}
      >
        <ul className="space-y-10 pt-10">
          {entries.map((entry) => (
            <li key={entry.label} className="relative border-l border-border pl-8">
              <span
                aria-hidden="true"
                className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-[#4b5563]"
              />
              <p className="font-mono text-sm text-[#6b7280]">{entry.period}</p>
              <p className="mt-1 text-[#9ca3af]">{entry.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
