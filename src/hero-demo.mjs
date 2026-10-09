// Hero illustration: an agent is written, run on a ticket, held back by its evaluation, fixed, then shipped.
// Everything is rendered here in its final state; site.js replays it as a timeline (typing is a CSS clip,
// the terminal scrolls with a transform), so nothing changes layout and CLS stays 0.
// No JS, reduced motion or "Pause" all show the final state.

const CHAR_MS = 22; // typing speed; must match the calc() in .dl--type in site.css
const VIEW = 9; // terminal lines visible at once

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Tiny markup for colour: {k:…} keyword, {f:…} name, {s:…} string, {d:…} dim, {o:…} pass, {x:…} fail, {w:…} white
const paint = (src) => esc(src).replace(/\{([kfsdoxw]):([^}]*)\}/g, '<span class="t-$1">$2</span>');
const plain = (src) => src.replace(/\{[kfsdoxw]:([^}]*)\}/g, '$1');

// Editor: [text, act]. Act 1 lines type at the start; act 3 lines are the fix, typed after the eval fails.
const code = [
  ['{k:@tool}', 1],
  ['{k:def} {f:lookup_policy}(query: str):', 1],
  ['    {k:return} index.search(query, k={s:5})', 1],
  ['', 1],
  ['agent = {f:Agent}(', 1],
  ['    model=router.pick({s:"support"}),', 1],
  ['    tools=[lookup_policy, draft_reply],', 1],
  ['    guardrails=[cite_sources, redact_pii],', 1],
  [')', 1],
  ['', 3],
  ['agent.{f:on_low_confidence}(hand_to_human)', 3],
];

// Terminal: [text, act, typed?]
const term = [
  ['{d:$} {w:python run.py --ticket 4821}', 2, true],
  ['  {d:plan}   refund request, annual plan', 2],
  ['  {d:tool}   lookup_policy({s:"refund window"})', 2],
  ['  {d:tool}   draft_reply(sources={s:3})', 2],
  ['  {o:✓} cite_sources   {o:✓} redact_pii', 2],
  ['  {d:reply drafted · 2.4s}', 2],
  ['{d:$} {w:make eval}', 2, true],
  ['  grounded answers     {o:✓ pass}', 2],
  ['  policy compliance    {o:✓ pass}', 2],
  ['  edge cases           {x:✗ 2 failing}', 2],
  ['  {x:below threshold · release blocked}', 2],
  ['{d:$} {w:make eval}', 4, true],
  ['  edge cases           {o:✓ pass}', 4],
  ['  {o:✓ all suites pass · ready to ship}', 4],
  ['{d:$} ', 4],
];

// Build the timeline (ms).
let t = 500;
const typed = (src) => plain(src).length * CHAR_MS;
const codeAt = [];
const termAt = [];
for (const [src, act] of code) if (act === 1) { codeAt.push(t); t += src ? typed(src) + 120 : 80; }
t += 500;
let i = 0;
const runTerm = (act) => {
  for (; i < term.length && term[i][1] === act; i++) {
    const [src, , isTyped] = term[i];
    termAt[i] = t;
    t += isTyped ? typed(src.replace(/^\{d:\$\} /, '')) + 350 : (src.includes('{x:') ? 700 : 380);
  }
};
runTerm(2);
t += 900;
for (const [src, act] of code) if (act === 3) { codeAt.push(t); t += src ? typed(src) + 300 : 80; }
t += 400;
runTerm(4);
const END = t + 4500;

const line = (src, at, cls, n) => {
  const isTyped = cls.includes('dl--type');
  const body = isTyped && src.startsWith('{d:$} ')
    ? `<span class="t-d">$</span> <span class="dl__txt" style="--n:${plain(src).length - 2}">${paint(src.slice(6))}</span>`
    : `<span class="dl__txt"${isTyped ? ` style="--n:${plain(src).length}"` : ''}>${paint(src) || ' '}</span>`;
  return `<span class="dl ${cls}" data-at="${at}">${n !== undefined ? `<span class="dl__n">${n}</span>` : ''}${body}</span>`;
};

export const heroDemo = () => {
  const codeHtml = code.map(([src, act], j) =>
    line(src, codeAt[j], `dl--code${src ? ' dl--type' : ''}${act === 3 ? ' dl--add' : ''}`, act === 3 ? '+' : j + 1)).join('');
  const termHtml = term.map(([src, , isTyped], j) =>
    line(src, termAt[j], `${isTyped ? 'dl--type' : ''}${j === term.length - 1 ? ' dl--cursor' : ''}`)).join('');
  return `<div class="demo" data-end="${END}">
<div class="demo__bar"><span class="demo__dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="demo__title" aria-hidden="true">support-agent</span><button class="demo__toggle" type="button" aria-label="Pause animation">Pause</button></div>
<div class="demo__body" role="img" aria-label="Illustration: a support agent is written in code and run on a ticket. Its evaluation finds two failing edge cases and blocks the release. A fix is added, the evaluation passes, and it is ready to ship.">
<div class="demo__pane"><div class="demo__label">agent.py</div><div class="demo__code">${codeHtml}</div></div>
<div class="demo__pane demo__pane--term"><div class="demo__label">terminal</div><div class="demo__term" style="--view:${VIEW}"><div class="demo__scroll" style="--end:${term.length - VIEW}" data-view="${VIEW}">${termHtml}</div></div></div>
</div>
</div>`;
};
