import { caseStudies } from '@/content/case-studies';
import { site } from '@/content/site';
import type { Lang } from '@/i18n';

/** Verified facts only — never invent beyond this dossier. */
export const verifiedProfile = {
  name: site.name,
  role: site.role,
  location: site.location,
  since: '2023',
  employer: site.employer,
  education: site.education,
  availability: site.availability,
  contact: {
    email: site.email,
    github: site.github.url,
    linkedin: site.linkedin.url,
  },
  stackDaily: site.stackDaily,
} as const;

export function buildKnowledgeDossier(lang: Lang): string {
  const lines: string[] = [];
  lines.push(`Name: ${verifiedProfile.name}`);
  lines.push(`Role: ${verifiedProfile.role}`);
  lines.push(`Location: ${verifiedProfile.location[lang]}`);
  lines.push(
    `Employer: ${verifiedProfile.employer.name} — ${verifiedProfile.employer.role[lang]} (${verifiedProfile.employer.since[lang]})`,
  );
  lines.push(
    `Education: ${verifiedProfile.education.degree[lang]} (${verifiedProfile.education.school})`,
  );
  lines.push(`Availability: ${verifiedProfile.availability[lang]}`);
  lines.push(`Daily stack: ${verifiedProfile.stackDaily.join(', ')}`);
  lines.push(`Email: ${verifiedProfile.contact.email}`);
  lines.push(`GitHub: ${verifiedProfile.contact.github}`);
  lines.push(`LinkedIn: ${verifiedProfile.contact.linkedin}`);
  lines.push('');
  lines.push('Projects (verified facts only):');

  for (const study of Object.values(caseStudies)) {
    lines.push(`- slug: ${study.slug}`);
    if (study.role) lines.push(`  role: ${study.role[lang]}`);
    if (study.problem) lines.push(`  problem: ${study.problem[lang]}`);
    if (study.stack?.length) lines.push(`  stack: ${study.stack.join(', ')}`);
    if (study.results?.length) {
      lines.push(
        `  results: ${study.results.map((r) => `${r.label[lang]}=${r.value}`).join('; ')}`,
      );
    }
    if (study.decisions?.length) {
      lines.push(`  decisions: ${study.decisions.map((d) => d[lang]).join(' | ')}`);
    }
  }

  lines.push('');
  lines.push(
    'Hard rules: Never invent metrics, seniority years beyond "desde 2023", clients, or unlisted projects. Never mention "aro" or "Orbit".',
  );

  return lines.join('\n');
}
