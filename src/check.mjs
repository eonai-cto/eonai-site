// Post-build checks: internal links/anchors resolve, copy rules hold, required files exist.
import { readdir, readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const docs = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs');
const files = [];
(async function walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) await walk(p); else files.push(p);
  }
})(docs).then(async () => {
  const exists = (p) => access(p).then(() => true, () => false);
  const html = files.filter((f) => f.endsWith('.html'));
  const ids = {};
  const pages = {};
  for (const f of html) {
    const t = await readFile(f, 'utf8');
    const url = '/' + f.slice(docs.length + 1).replace(/index\.html$/, '');
    pages[url] = t;
    ids[url] = new Set([...t.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  }
  let bad = 0;
  const fail = (m) => { bad++; console.log('FAIL', m); };
  for (const [url, t] of Object.entries(pages)) {
    for (const m of t.matchAll(/<a [^>]*href="([^"]*)"/g)) {
      const h = m[1];
      if (/^(https?:|mailto:)/.test(h)) continue;
      const [path, hash] = h.split('#');
      const target = path === '' ? url : path;
      if (!(target in pages) && !(await exists(join(docs, target)))) fail(`${url}: broken link ${h}`);
      if (hash && target in pages && !ids[target].has(hash)) fail(`${url}: missing anchor ${h}`);
      if (h === '#' || h === '#top' && url !== '/') fail(`${url}: placeholder href ${h}`);
    }
    if ((t.match(/<h1[ >]/g) || []).length !== 1) fail(`${url}: h1 count`);
    // "founder" is allowed only where it names the client's role ("raised by a founder or CEO").
    const text = t.replace(/<script[\s\S]*?<\/script>/g, '').replace(/FOUNDER OR CEO/g, '');
    for (const re of [/\+91/, /Rajshiva/i, /founder/i, /₹/, /\btel:/]) {
      const m = text.match(re);
      if (m) console.log(`NOTE ${url}: matches ${re} -> "${text.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\n/g, ' ')}"`);
    }
  }
  for (const f of ['robots.txt', 'sitemap.xml', '404.html', 'favicon.svg', 'CNAME', 'assets/og.png']) {
    if (!(await exists(join(docs, f)))) fail(`missing ${f}`);
  }
  console.log(bad ? `${bad} failure(s)` : `OK: ${html.length} pages checked`);
  process.exit(bad ? 1 : 0);
});
