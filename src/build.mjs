// Static build: renders every page into /docs (served by GitHub Pages).
import { mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL } from './config.mjs';
import { notes } from './notes-data.mjs';
import home from './pages/home.mjs';
import notesIndex from './pages/notes-index.mjs';
import { notePage } from './pages/note.mjs';
import privacy from './pages/privacy.mjs';
import notFound from './pages/not-found.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'docs');

async function write(rel, content) {
  const file = join(out, rel);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const pages = [
  ['index.html', home, '/'],
  ['notes/index.html', notesIndex, '/notes/'],
  ...notes.map((n) => [`notes/${n.slug}/index.html`, notePage(n), `/notes/${n.slug}/`]),
  ['privacy/index.html', privacy, '/privacy/'],
];
for (const [rel, html] of pages) await write(rel, html);
await write('404.html', notFound);

await cp(join(root, 'src/assets'), join(out, 'assets'), { recursive: true });
await cp(join(root, 'src/static'), out, { recursive: true });

const urls = pages.map(([, , path]) => `  <url><loc>${SITE_URL}${path}</loc><lastmod>2026-10-07</lastmod></url>`).join('\n');
await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
await write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
await write('CNAME', 'eonai.ai\n');
await write('.nojekyll', '');

console.log(`Built ${pages.length + 1} pages into docs/`);
