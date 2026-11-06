import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';

type Theme = 'dark' | 'light';

// The theme lives on <html data-theme>. The inline script in index.html sets it
// before the first paint; this component only reads it and changes it on click.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

// The prerendered HTML cannot know the visitor's theme and is always rendered as
// dark. Hydration must start from the same value, then React switches to the real one.
function getServerTheme(): Theme {
  return 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'light' ? '#f7f7f5' : '#0d0e12');
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Ignore storage errors (e.g. private mode).
  }
  listeners.forEach((listener) => listener());
}

export default function ThemeToggle() {
  const { t } = useTranslation();
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  const toggle = () => applyTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('themeToggle.label')}
      aria-pressed={theme === 'light'}
      className="rounded p-2 text-text-muted transition-colors hover:text-accent"
    >
      {theme === 'dark' ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" />
        </svg>
      )}
    </button>
  );
}
