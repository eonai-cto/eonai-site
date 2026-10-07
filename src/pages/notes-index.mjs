import { page, esc } from '../layout.mjs';
import { TALK_URL, TALK_THUMB, TALK_TITLE } from '../config.mjs';
import { notes } from '../notes-data.mjs';

const upper = (s) => s.toUpperCase().replace(/&/g, '&amp;');

const cards = notes.map((n, i) => {
  const href = `/notes/${n.slug}/`;
  const meta = i === 0
    ? `<span class="eyebrow eyebrow--xs eyebrow--light">${upper(n.category)}</span><span class="eyebrow eyebrow--xs eyebrow--quiet">· ${n.indexMins || n.mins} MIN READ · FEATURED</span>`
    : `<span class="eyebrow eyebrow--xs">${upper(n.category)}</span><span class="eyebrow eyebrow--xs eyebrow--grey">· ${n.mins} MIN READ</span>`;
  return `<a class="note-card${i === 0 ? ' note-card--featured' : ''}" href="${href}">
<div class="note-card__meta">${meta}</div>
<h2>${n.cardTitle || n.title}</h2>
<p>${n.card}</p>
<span class="note-card__cta">Read the note →</span>
</a>`;
}).join('\n');

const pills = ['Evaluation', 'Security &amp; guardrails', 'Multi-agent systems', 'Knowledge assistants', 'Responsible AI']
  .map((p) => `<li class="pill">${p}</li>`).join('');

const body = `
<section class="page-title on-dark">
<div class="container page-title__inner">
<div class="eyebrow">ENGINEERING NOTES</div>
<h1>Practical guidance for teams putting AI agents into production.</h1>
<p class="page-title__lead">Short advisory notes on the ways agentic systems fail in production and the controls that prevent it. Each one is written for the person accountable for the decision: the exposure, where standard controls fall short, what we recommend, and what it would take.</p>
<p class="page-title__fine">Findings are drawn from EonAI’s reference systems, built and tested on synthetic data. They describe patterns we see across clients’ systems, not individual engagements.</p>
</div>
</section>

<section class="container" style="padding-block: clamp(48px, 7vw, 72px) clamp(64px, 9vw, 112px)">
<ul class="pills" style="margin: 0 0 32px" aria-label="Note categories">
<li class="pills__label">FILTER</li>
<li class="pill pill--active">All</li>
${pills}
</ul>
<div class="grid grid--3">
${cards}
<a class="note-card note-card--talk" href="${TALK_URL}">
<img class="note-card__thumb" src="${TALK_THUMB}" width="480" height="360" loading="lazy" alt="Video thumbnail for the talk ${esc(TALK_TITLE)}">
<div class="note-card__meta"><span class="eyebrow eyebrow--xs">TALK</span><span class="eyebrow eyebrow--xs eyebrow--grey">· TEST DRIVE PLATFORM · VIDEO</span></div>
<h2>${TALK_TITLE}</h2>
<p>A guest talk by EonAI’s CTO on what changes in testing and release practice when a large share of your code is written by AI, and what to do about it.</p>
<span class="note-card__cta">Watch on YouTube →</span>
</a>
</div>
</section>
`;

export default page({
  title: 'Engineering notes — EonAI',
  description: 'Short advisory notes on the ways agentic systems fail in production and the controls that prevent it, written for the person accountable for the decision.',
  path: '/notes/',
  current: 'notes',
}, body);
