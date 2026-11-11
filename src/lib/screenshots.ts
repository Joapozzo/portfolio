import { existsSync } from 'node:fs';
import path from 'node:path';

/** Resolve a captured screenshot id to a public URL (WebP preferred). */
export function shotUrl(slug: string, id: string): string | undefined {
  for (const ext of ['webp', 'avif'] as const) {
    const abs = path.join(process.cwd(), 'public', 'projects', slug, `${id}.${ext}`);
    if (existsSync(abs)) return `/projects/${slug}/${id}.${ext}`;
  }
  return undefined;
}

export function resolveShots(
  slug: string,
  ids: { mac?: string[]; ipad?: string[]; iphone?: string[] } | undefined
) {
  const map = (list: string[] = []) =>
    list.map((id) => shotUrl(slug, id)).filter((v): v is string => Boolean(v));

  return {
    mac: map(ids?.mac),
    ipad: map(ids?.ipad),
    iphone: map(ids?.iphone),
  };
}
