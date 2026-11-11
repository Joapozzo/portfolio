import type { Lang } from '@/i18n';
import { site } from '@/content/site';

export function getPersonJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    url: site.siteUrl,
    email: site.email,
    sameAs: [site.github.url, site.linkedin.url],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Córdoba',
      addressCountry: 'AR',
    },
    worksFor: {
      '@type': 'Organization',
      name: site.employer.name,
    },
    description:
      lang === 'es'
        ? site.availability.es
        : site.availability.en,
  };
}

export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${site.name} — Portfolio`,
    url: site.siteUrl,
    inLanguage: ['es-AR', 'en-US'],
    author: {
      '@type': 'Person',
      name: site.name,
    },
  };
}
