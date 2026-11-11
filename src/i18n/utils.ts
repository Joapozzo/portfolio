import { ui, defaultLang, type Lang, type TranslationKey } from './translations';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return ui[lang][key] ?? ui[defaultLang][key] ?? key;
  };
}

export function getRouteFromUrl(url: URL): string {
  const pathname = url.pathname;
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) return '/';
  if (parts[0] === 'es' || parts[0] === 'en') {
    return '/' + parts.slice(1).join('/');
  }
  return pathname;
}

export function getLocalizedPath(path: string, lang: Lang): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
}

export function getAlternateLanguage(currentLang: Lang): Lang {
  return currentLang === 'es' ? 'en' : 'es';
}

export function getHrefLang(lang: Lang): string {
  return lang === 'es' ? 'es-AR' : 'en-US';
}

export { ui, defaultLang, type Lang, type TranslationKey };
