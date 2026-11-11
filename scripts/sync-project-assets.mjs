import { cp, mkdir, readdir, access } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('src/assets/projects');
const DEST = path.resolve('public/projects');

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(SRC))) {
  console.log('No assets yet');
  process.exit(0);
}

const slugs = await readdir(SRC);
for (const slug of slugs) {
  const from = path.join(SRC, slug);
  const to = path.join(DEST, slug);
  await mkdir(to, { recursive: true });
  const files = await readdir(from);
  for (const file of files) {
    if (!/\.(webp|avif)$/i.test(file)) continue;
    await cp(path.join(from, file), path.join(to, file));
  }
  console.log(`synced ${slug}: ${files.filter((f) => /\.(webp|avif)$/i.test(f)).length} files`);
}
