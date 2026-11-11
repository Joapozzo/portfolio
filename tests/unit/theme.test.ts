/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  THEME_STORAGE_KEY,
  MOTION_STORAGE_KEY,
  getStoredTheme,
  getSystemTheme,
  getPreferredTheme,
  setTheme,
  getStoredMotionPreference,
  getSystemMotionPreference,
  getPreferredMotion,
  setReducedMotion,
} from '../../src/lib/theme';

describe('theme utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'reduce-motion');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('getStoredTheme', () => {
    it('returns light when stored', () => {
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
      expect(getStoredTheme()).toBe('light');
    });

    it('returns dark when stored', () => {
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      expect(getStoredTheme()).toBe('dark');
    });

    it('returns null for invalid value', () => {
      localStorage.setItem(THEME_STORAGE_KEY, 'invalid');
      expect(getStoredTheme()).toBeNull();
    });

    it('returns null when not stored', () => {
      expect(getStoredTheme()).toBeNull();
    });
  });

  describe('getSystemTheme', () => {
    it('returns dark when system prefers dark', () => {
      vi.spyOn(window, 'matchMedia').mockImplementation((query: string) =>
        ({
          matches: query.includes('dark'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
      );
      expect(getSystemTheme()).toBe('dark');
    });

    it('returns light when system prefers light', () => {
      vi.spyOn(window, 'matchMedia').mockImplementation((query: string) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
      );
      expect(getSystemTheme()).toBe('light');
    });
  });

  describe('getPreferredTheme', () => {
    it('returns stored theme if available', () => {
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      expect(getPreferredTheme()).toBe('dark');
    });

    it('falls back to system theme', () => {
      vi.spyOn(window, 'matchMedia').mockImplementation((query: string) =>
        ({
          matches: query.includes('dark'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
      );
      expect(getPreferredTheme()).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('applies dark class and persists', () => {
      setTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    });

    it('removes dark class for light and persists', () => {
      document.documentElement.classList.add('dark');
      setTheme('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    });
  });

  describe('getStoredMotionPreference', () => {
    it('returns true when stored as true', () => {
      localStorage.setItem(MOTION_STORAGE_KEY, 'true');
      expect(getStoredMotionPreference()).toBe(true);
    });

    it('returns false when stored as false', () => {
      localStorage.setItem(MOTION_STORAGE_KEY, 'false');
      expect(getStoredMotionPreference()).toBe(false);
    });

    it('returns null when not stored', () => {
      expect(getStoredMotionPreference()).toBeNull();
    });
  });

  describe('getSystemMotionPreference', () => {
    it('returns true when system prefers reduced motion', () => {
      vi.spyOn(window, 'matchMedia').mockImplementation((query: string) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
      );
      expect(getSystemMotionPreference()).toBe(true);
    });

    it('returns false when system does not prefer reduced motion', () => {
      vi.spyOn(window, 'matchMedia').mockImplementation((query: string) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
      );
      expect(getSystemMotionPreference()).toBe(false);
    });
  });

  describe('getPreferredMotion', () => {
    it('returns stored preference if available', () => {
      localStorage.setItem(MOTION_STORAGE_KEY, 'true');
      expect(getPreferredMotion()).toBe(true);
    });

    it('falls back to system preference', () => {
      vi.spyOn(window, 'matchMedia').mockImplementation((query: string) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
      );
      expect(getPreferredMotion()).toBe(true);
    });
  });

  describe('setReducedMotion', () => {
    it('adds reduce-motion class and persists', () => {
      setReducedMotion(true);
      expect(document.documentElement.classList.contains('reduce-motion')).toBe(true);
      expect(localStorage.getItem(MOTION_STORAGE_KEY)).toBe('true');
    });

    it('removes reduce-motion class and persists', () => {
      document.documentElement.classList.add('reduce-motion');
      setReducedMotion(false);
      expect(document.documentElement.classList.contains('reduce-motion')).toBe(false);
      expect(localStorage.getItem(MOTION_STORAGE_KEY)).toBe('false');
    });
  });

  describe('storage keys', () => {
    it('has correct theme storage key', () => {
      expect(THEME_STORAGE_KEY).toBe('portfolio-theme');
    });

    it('has correct motion storage key', () => {
      expect(MOTION_STORAGE_KEY).toBe('portfolio-reduced-motion');
    });
  });
});
