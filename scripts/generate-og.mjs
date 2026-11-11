/**
 * Build-time OG PNGs (ES/EN) with Sharp + SVG — no paid services.
 * Output: public/og/{es,en}/*.png
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outRoot = path.join(root, 'public', 'og');
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/content/site.json'), 'utf8'));
const ogHostLabel = site.email;

const projects = [
  { slug: 'copa-relampago', title: 'Copa Relámpago / UCFA' },
  { slug: 'loopin', title: 'Loopin' },
  { slug: 'gnd', title: 'GND (Natural Design)' },
  { slug: 'altiplano', title: 'Altiplano Experience' },
  { slug: 'maxshop', title: 'MaxShop' },
  { slug: 'landings', title: 'Landings' },
];

const pages = [
  { id: 'home', es: { title: 'Joaquín Pozzo', subtitle: 'Backend & Full Stack Developer' }, en: { title: 'Joaquín Pozzo', subtitle: 'Backend & Full Stack Developer' } },
  { id: 'sobre-mi', es: { title: 'Sobre mí', subtitle: 'Joaquín Pozzo' }, en: { title: 'About', subtitle: 'Joaquín Pozzo' } },
  { id: 'cv', es: { title: 'Curriculum Vitae', subtitle: 'Joaquín Pozzo' }, en: { title: 'Resume', subtitle: 'Joaquín Pozzo' } },
  {
    id: 'contacto',
    es: { title: 'Contacto', subtitle: site.email },
    en: { title: 'Contact', subtitle: site.email },
  },
];

function escapeXml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function svgFor({ title, subtitle, lang }) {
  const badge = lang === 'es' ? 'Portfolio' : 'Portfolio';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F5F5F7"/>
      <stop offset="100%" stop-color="#E8EEF7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="980" cy="120" r="220" fill="#0066CC" fill-opacity="0.12"/>
  <circle cx="180" cy="520" r="160" fill="#30D158" fill-opacity="0.10"/>
  <rect x="64" y="64" width="1072" height="502" rx="40" fill="#FFFFFF" fill-opacity="0.78"/>
  <text x="100" y="140" font-family="Inter, Helvetica, Arial, sans-serif" font-size="28" font-weight="600" fill="#0066CC">${escapeXml(badge)}</text>
  <text x="100" y="260" font-family="Inter, Helvetica, Arial, sans-serif" font-size="64" font-weight="800" fill="#1D1D1F">${escapeXml(title).slice(0, 42)}</text>
  <text x="100" y="340" font-family="Inter, Helvetica, Arial, sans-serif" font-size="32" font-weight="600" fill="#3A3A3C">${escapeXml(subtitle).slice(0, 60)}</text>
  <text x="100" y="500" font-family="Inter, Helvetica, Arial, sans-serif" font-size="24" fill="#6E6E73">${escapeXml(ogHostLabel)} · ${lang.toUpperCase()}</text>
</svg>`;
}

async function writePng(lang, id, title, subtitle) {
  const dir = path.join(outRoot, lang);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${id}.png`);
  const svg = svgFor({ title, subtitle, lang });
  await sharp(Buffer.from(svg)).png().toFile(file);
  return file;
}

const written = [];
for (const lang of ['es', 'en']) {
  for (const page of pages) {
    const copy = page[lang];
    written.push(await writePng(lang, page.id, copy.title, copy.subtitle));
  }
  for (const project of projects) {
    written.push(
      await writePng(
        lang,
        `proyectos-${project.slug}`,
        project.title,
        lang === 'es' ? 'Caso de estudio' : 'Case study',
      ),
    );
  }
}

// Legacy fallback
await sharp(Buffer.from(svgFor({ title: 'Joaquín Pozzo', subtitle: 'Backend & Full Stack Developer', lang: 'es' })))
  .png()
  .toFile(path.join(root, 'public', 'og-image.png'));

console.log(`OG images: ${written.length + 1} files`);
