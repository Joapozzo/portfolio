import { describe, it, expect } from 'vitest';
import {
  getLangFromUrl,
  useTranslations,
  getRouteFromUrl,
  getLocalizedPath,
  getAlternateLanguage,
  getHrefLang,
  defaultLang,
} from '../../src/i18n';

describe('i18n utilities', () => {
  describe('getLangFromUrl', () => {
    it('returns es for Spanish URLs', () => {
      const url = new URL('https://example.com/es/proyectos');
      expect(getLangFromUrl(url)).toBe('es');
    });

    it('returns en for English URLs', () => {
      const url = new URL('https://example.com/en/projects');
      expect(getLangFromUrl(url)).toBe('en');
    });

    it('returns default lang for invalid language', () => {
      const url = new URL('https://example.com/fr/page');
      expect(getLangFromUrl(url)).toBe(defaultLang);
    });

    it('returns default lang for root URL', () => {
      const url = new URL('https://example.com/');
      expect(getLangFromUrl(url)).toBe(defaultLang);
    });
  });

  describe('useTranslations', () => {
    it('returns Spanish translation for es', () => {
      const t = useTranslations('es');
      expect(t('nav.home')).toBe('Inicio');
    });

    it('returns English translation for en', () => {
      const t = useTranslations('en');
      expect(t('nav.home')).toBe('Home');
    });

    it('returns key for missing translation', () => {
      const t = useTranslations('es');
      expect(t('nonexistent.key' as 'nav.home')).toBe('nonexistent.key');
    });
  });

  describe('getRouteFromUrl', () => {
    it('extracts route without language prefix', () => {
      const url = new URL('https://example.com/es/proyectos/test');
      expect(getRouteFromUrl(url)).toBe('/proyectos/test');
    });

    it('returns root for home page', () => {
      const url = new URL('https://example.com/es');
      expect(getRouteFromUrl(url)).toBe('/');
    });

    it('handles paths without language prefix', () => {
      const url = new URL('https://example.com/some/path');
      expect(getRouteFromUrl(url)).toBe('/some/path');
    });
  });

  describe('getLocalizedPath', () => {
    it('adds language prefix to path', () => {
      expect(getLocalizedPath('/proyectos', 'es')).toBe('/es/proyectos');
      expect(getLocalizedPath('/projects', 'en')).toBe('/en/projects');
    });

    it('handles root path correctly', () => {
      expect(getLocalizedPath('/', 'es')).toBe('/es');
      expect(getLocalizedPath('/', 'en')).toBe('/en');
    });

    it('handles paths without leading slash', () => {
      expect(getLocalizedPath('about', 'es')).toBe('/es/about');
    });
  });

  describe('getAlternateLanguage', () => {
    it('returns en for es', () => {
      expect(getAlternateLanguage('es')).toBe('en');
    });

    it('returns es for en', () => {
      expect(getAlternateLanguage('en')).toBe('es');
    });
  });

  describe('getHrefLang', () => {
    it('returns es-AR for es', () => {
      expect(getHrefLang('es')).toBe('es-AR');
    });

    it('returns en-US for en', () => {
      expect(getHrefLang('en')).toBe('en-US');
    });
  });
});
