import siteJson from './site.json';

/** Single source of truth for public contact + profile facts. */
export const site = siteJson;

export const contactEmail = site.email;
export const githubUrl = site.github.url;
export const linkedinUrl = site.linkedin.url;
export const siteUrl = site.siteUrl;
