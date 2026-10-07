import { page, BOOK, esc } from '../layout.mjs';
import { SITE_URL } from '../config.mjs';
import { bySlug, ENGAGEMENTS, PROVENANCE } from '../notes-data.mjs';

const amp = (s) => s.replace(/&/g, '&amp;');
const upper = (s) => amp(s.toUpperCase());

function block(b) {
  if (b.p) return `<p>${b.p}</p>`;
  if (b.ul) return `<ul>\n${b.ul.map((i) => `<li>${i}</li>`).join('\n')}\n</ul>`;
  if (b.ol) {
    return `<ol>\n${b.ol.map((i) => (Array.isArray(i) ? `<li><strong>${i[0]}</strong> ${i[1]}</li>` : `<li>${i}</li>`)).join('\n')}\n</ol>`;
  }
  if (b.table) {
    const t = b.table;
    const label = t.label || t.head.join(', ');
    return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(label)}">
<table class="scenario">
<thead><tr>${t.head.map((h) => `<th scope="col">${h.toUpperCase()}</th>`).join('')}</tr></thead>
<tbody>
${t.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('\n')}
</tbody>
</table>
</div>`;
  }
  return '';
}

export function notePage(n) {
  const sections = n.sections.map((s) => `<section id="${s.id}">
<h2>${s.h}</h2>
${s.draft ? '<p class="draft-flag">Draft — to be completed</p>\n' : ''}${s.blocks.map(block).join('\n')}
</section>`).join('\n\n');

  const toc = [...n.sections.map((s) => [s.id, s.h]), ['our-recommendation', 'Our recommendation']]
    .map(([id, h]) => `<a href="#${id}">${h}</a>`).join('\n');

  const applies = n.sideApplies
    ? `<h2>${n.engagements[0]}</h2>
<p>${n.sideApplies}</p>
<a class="card__more" href="${ENGAGEMENTS[n.engagements[0]].href}">See the engagement →</a>`
    : n.engagements.map((e) => {
      const info = ENGAGEMENTS[e];
      return `<h2>${e}</h2>${info.blurb ? `\n<p>${info.blurb}</p>` : ''}\n<a class="card__more" href="${info.href}">${info.href === '/#offers' ? 'See the engagement →' : 'Read more →'}</a>`;
    }).join('\n');

  const related = n.related.map((s) => `<a href="/notes/${s}/">${amp(bySlug[s].cardTitle || bySlug[s].title)}</a>`).join('\n');

  const meta = [`<span>For: ${n.forWho}</span>`];
  if (n.applies) meta.push(`<span>Applies to: ${n.applies}</span>`);
  meta.push(`<span>Related engagement: ${n.engagements.join(', ')}</span>`);

  const body = `
<section class="note-hero on-dark">
<div class="container note-hero__inner">
<a class="crumb" href="/notes/">← ENGINEERING NOTES</a>
<div class="eyebrow">${upper(n.category)} · ADVISORY NOTE · ${n.mins} MIN READ</div>
<h1>${n.title}</h1>
<p class="note-hero__lead">${n.lede}</p>
<div class="note-hero__meta">${meta.join('')}</div>
</div>
</section>

<div class="container note-layout">
<article class="article">

${sections}

<section id="our-recommendation" class="recommend">
<h2>OUR RECOMMENDATION</h2>
<p>${n.recommendation}</p>
</section>

<p class="provenance">${n.provenance || PROVENANCE}</p>

</article>

<aside class="sidebar" aria-label="Note details">
<nav class="side-card" aria-label="In this note">
<div class="eyebrow eyebrow--xs eyebrow--grey">IN THIS NOTE</div>
${toc}
</nav>
<div class="side-card">
<div class="eyebrow eyebrow--xs">WHERE THIS APPLIES</div>
${applies}
</div>
<nav class="side-card" aria-label="Related notes">
<div class="eyebrow eyebrow--xs eyebrow--grey">RELATED NOTES</div>
${related}
</nav>
<div class="side-card side-card--cta">
<h2>Does your agent have one of these exposures?</h2>
<p>A 30-minute working session is usually enough to find out.</p>
<a class="card__more" href="${BOOK}">Book a call →</a>
</div>
</aside>
</div>
`;

  const plain = (s) => s.replace(/<[^>]+>/g, '');
  return page({
    title: `${plain(n.title.replace(/\.$/, ''))} — EonAI`,
    description: plain(n.lede),
    path: `/notes/${n.slug}/`,
    current: 'notes',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: plain(n.title.replace(/\.$/, '')),
      datePublished: '2026-10-07',
      author: { '@type': 'Organization', name: 'EonAI' },
      mainEntityOfPage: `${SITE_URL}/notes/${n.slug}/`,
    },
  }, body);
}
