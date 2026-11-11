import { useState, useEffect } from 'react';
import { getPreferredTheme, setTheme, type Theme } from '@/lib/theme';

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setThemeState(getPreferredTheme());
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setThemeState(next);
    setTheme(next);
  };

  if (!mounted) {
    return (
      <button type="button" className="focus-ring h-9 w-9 rounded-full" aria-label="Toggle theme">
        <span className="block h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-[var(--fg)] hover:bg-[var(--fill)]"
      aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {theme === 'light' ? (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
}
