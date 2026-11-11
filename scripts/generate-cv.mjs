/**
 * Build-time CV PDFs (ES + EN) from verified site facts only.
 * Contact/profile come from src/content/site.json (single source of truth).
 */
import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public');
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/content/site.json'), 'utf8'));

/** Verified project lines for the CV — first-person implicit, no invented stack. */
const projects = [
  {
    title: 'Copa Relámpago / UCFA',
    role: {
      es: 'Backend: diseño y desarrollo completo (~600 commits).',
      en: 'Backend: full design and development (~600 commits).',
    },
    stack:
      'Node.js, Express, TypeScript, Prisma, PostgreSQL, Socket.IO, Redis, Sentry, Mercado Pago, Firebase Auth',
    results: {
      es: '91 modelos Prisma · 69 tests backend · 38 tests frontend · CI',
      en: '91 Prisma models · 69 backend test files · 38 frontend test files · CI',
    },
  },
  {
    title: 'GND (Natural Design)',
    role: {
      es: 'API REST: diseño y desarrollo.',
      en: 'REST API: design and development.',
    },
    stack: 'Docker, GitHub Actions a Hostinger',
    results: { es: '83 tests', en: '83 tests' },
  },
  {
    title: 'Altiplano Experience',
    role: {
      es: 'Front y back: diseño y desarrollo.',
      en: 'Front end and back end: design and development.',
    },
    stack: '',
    results: { es: '', en: '' },
  },
  {
    title: 'MaxShop',
    role: {
      es: 'Frontend e integraciones (Andreani, Mercado Pago).',
      en: 'Frontend and integrations (Andreani, Mercado Pago).',
    },
    stack: 'Andreani, Mercado Pago',
    results: { es: '', en: '' },
  },
  {
    title: 'Loopin',
    role: {
      es: 'Frontend Developer, participando en decisiones de producto.',
      en: 'Frontend Developer, participating in product decisions.',
    },
    // Stack omitted — React/TypeScript not owner-verified for Loopin
    stack: '',
    results: {
      es: 'Plataforma de fidelización de clientes para comercios.',
      en: 'Customer loyalty platform for businesses.',
    },
  },
];

function writeCv(lang) {
  const file = path.join(outDir, `cv-${lang}.pdf`);
  const doc = new PDFDocument({
    margin: 54,
    size: 'A4',
    info: { Title: `CV — ${site.name}`, Author: site.name },
  });
  const stream = fs.createWriteStream(file);
  doc.pipe(stream);

  // ES headings use proper accents (WinAnsi / Helvetica supports Latin-1).
  const t = {
    es: {
      contact: 'Contacto',
      experience: 'Experiencia',
      education: 'Educación',
      projects: 'Proyectos',
      stack: 'Stack',
      availability: 'Disponibilidad',
    },
    en: {
      contact: 'Contact',
      experience: 'Experience',
      education: 'Education',
      projects: 'Projects',
      stack: 'Stack',
      availability: 'Availability',
    },
  }[lang];

  // Helvetica (PDF built-in) — avoid Unicode arrows/glyphs that render as !
  doc.font('Helvetica-Bold').fontSize(22).fillColor('#1d1d1f').text(site.name);
  doc.moveDown(0.3);
  doc.font('Helvetica').fontSize(12).fillColor('#3a3a3c').text(site.role);
  doc.fontSize(10).fillColor('#6e6e73').text(site.location[lang]);
  doc.moveDown(0.6);
  doc.fontSize(10).fillColor('#0066cc').text(`${site.email}`);
  doc.fillColor('#0066cc').text(site.github.label);
  doc.fillColor('#0066cc').text(site.linkedin.label);

  section(doc, t.availability);
  doc.font('Helvetica').fontSize(10).fillColor('#1d1d1f').text(site.availability[lang]);

  section(doc, t.experience);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#1d1d1f').text(site.employer.name);
  doc.font('Helvetica').fontSize(10).fillColor('#3a3a3c').text(site.employer.role[lang]);
  doc.fontSize(9).fillColor('#6e6e73').text(site.employer.since[lang]);

  section(doc, t.education);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#1d1d1f').text(site.education.degree[lang]);
  doc.font('Helvetica').fontSize(9).fillColor('#6e6e73').text(site.education.school);

  section(doc, t.stack);
  doc.font('Helvetica').fontSize(10).fillColor('#1d1d1f').text(site.stackDaily.join(' · '));

  section(doc, t.projects);
  for (const p of projects) {
    doc.moveDown(0.35);
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#1d1d1f').text(p.title);
    doc.font('Helvetica').fontSize(10).fillColor('#3a3a3c').text(p.role[lang]);
    if (p.stack) doc.fontSize(9).fillColor('#6e6e73').text(p.stack);
    if (p.results[lang]) doc.fontSize(9).fillColor('#6e6e73').text(p.results[lang]);
  }

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(file));
    stream.on('error', reject);
  });
}

function section(doc, title) {
  doc.moveDown(1);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#0066cc').text(title.toUpperCase());
  doc.moveDown(0.3);
}

fs.mkdirSync(outDir, { recursive: true });
const files = await Promise.all([writeCv('es'), writeCv('en')]);
console.log('CV generated:', files.map((f) => path.relative(root, f)).join(', '));
