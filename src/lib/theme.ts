export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'portfolio-theme';
export const MOTION_STORAGE_KEY = 'portfolio-reduced-motion';

export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage not available
  }
  return null;
}

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function getPreferredTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

export function setTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage not available
  }
}

export function getStoredMotionPreference(): boolean | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(MOTION_STORAGE_KEY);
    if (stored === 'true') return true;
    if (stored === 'false') return false;
  } catch {
    // localStorage not available
  }
  return null;
}

export function getSystemMotionPreference(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getPreferredMotion(): boolean {
  const stored = getStoredMotionPreference();
  if (stored !== null) return stored;
  return getSystemMotionPreference();
}

export function setReducedMotion(reduced: boolean): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (reduced) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }

  try {
    localStorage.setItem(MOTION_STORAGE_KEY, String(reduced));
  } catch {
    // localStorage not available
  }
}
