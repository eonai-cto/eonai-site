// Hero illustration: an editor and a terminal replaying short scenes, each showing one part of how we build agents.
// Every scene is rendered here in its final state; site.js plays them one after another in a random order
// (reshuffled per visit). Typing is a CSS clip and the terminal scrolls with a transform, so nothing changes
// layout and CLS stays 0. No JS, reduced motion or "Pause" show a scene's final state.
//
// Scene format. code: [text, act]; term: [text, act, typed?]. Acts play in order:
// 1 code is written, 2 terminal runs, 3 a fix is added to the code (marked +), 4 terminal runs again.
// Colour markup: {k:…} keyword, {f:…} name, {s:…} literal, {d:…} dim, {o:…} pass, {x:…} fail, {w:…} command.
// Keep lines to 42 characters so they fit a 375px phone, and code to 11 lines (the editor height).

const CHAR_MS = 22; // typing speed; must match the calc() on .dl--type in site.css
const VIEW = 9; // terminal lines visible at once
const CODE_LINES = 11;

const scenes = [
  {
    title: 'support-agent',
    file: 'agent.py',
    label: 'Illustration: a support agent is written in code and run on a ticket. Its evaluation finds failing edge cases and blocks the release. A fix is added, the evaluation passes, and it is ready to ship.',
    code: [
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
    ],
    term: [
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
    ],
  },
  {
    title: 'refunds-agent',
    file: 'refunds.py',
    label: 'Illustration: a refunds agent is attacked with adversarial conversations. One attack splits a refund across several chats and gets through, so the release is blocked. A rule sending large refunds to a person is added, and every attack is then handled.',
    code: [
      ['{k:@tool}(side_effects={k:True})', 1],
      ['{k:def} {f:issue_refund}(order_id: str, amount):', 1],
      ['    {k:return} payments.refund(order_id, amount)', 1],
      ['', 1],
      ['agent = {f:Agent}(', 1],
      ['    tools=[lookup_order, issue_refund],', 1],
      ['    policy=refund_policy,', 1],
      [')', 1],
      ['', 3],
      ['issue_refund.{f:require}(', 3],
      ['    within_policy, human_above_limit)', 3],
    ],
    term: [
      ['{d:$} {w:make redteam}', 2, true],
      ['  {d:running 48 adversarial conversations}', 2],
      ['  {o:✓} prompt injection     refused', 2],
      ['  {o:✓} fake order number    refused', 2],
      ['  {o:✓} angry escalation     refused', 2],
      ['  {x:✗} split refund         executed', 2],
      ['  {x:policy bypass · release blocked}', 2],
      ['{d:$} {w:make redteam}', 4, true],
      ['  {o:✓} split refund         sent to a person', 4],
      ['  {o:✓ 48 of 48 handled · ready to ship}', 4],
    ],
  },
  {
    title: 'model-router',
    file: 'routing.py',
    label: 'Illustration: a router sends each task to the model that does it best on accuracy and cost. A provider releases a new model, the evaluation finds it is worse at drafting, and the router pins the last good version while logging every decision.',
    code: [
      ['router = {f:Router}(', 1],
      ['    candidates=[small, medium, large],', 1],
      ['    choose_by=[{s:"accuracy"}, {s:"cost"}],', 1],
      ['    eval_set={s:"tickets_v12"},', 1],
      ['    log_decisions={k:True},', 1],
      [')', 1],
      ['', 1],
      ['model = router.{f:pick}(task)', 1],
      ['', 3],
      ['router.{f:pin}({s:"draft"}, to={s:"last_good"})', 3],
    ],
    term: [
      ['{d:$} {w:make eval-routes}', 2, true],
      ['  classify   → small model    {o:✓}', 2],
      ['  extract    → medium model   {o:✓}', 2],
      ['  draft      → large model    {o:✓}', 2],
      ['  {d:# provider ships a new large model}', 2],
      ['{d:$} {w:make eval-routes}', 2, true],
      ['  draft      → large v2  {x:✗ regression}', 2],
      ['  {x:below the bar · route held back}', 2],
      ['{d:$} {w:make eval-routes}', 4, true],
      ['  draft      → last good      {o:✓ pass}', 4],
      ['  {o:✓ stable · every decision logged}', 4],
    ],
  },
  {
    title: 'invoice-pipeline',
    file: 'pipeline.py',
    label: 'Illustration: an invoice pipeline where a model extracts fields and plain code does the checking. Replaying past invoices shows duplicates being posted, so a duplicate check is added and every check then passes.',
    code: [
      ['pipeline = {f:Pipeline}([', 1],
      ['    extract_fields,     {d:# model}', 1],
      ['    validate_schema,    {d:# code}', 1],
      ['    reconcile_totals,   {d:# code}', 1],
      ['    post_to_ledger,     {d:# code}', 1],
      ['])', 1],
      ['pipeline.{f:review_if}(confidence < {s:0.9})', 1],
      ['', 3],
      ['pipeline.{f:insert}({s:3}, reject_duplicates)', 3],
    ],
    term: [
      ['{d:$} {w:make eval}', 2, true],
      ['  {d:replaying 500 past invoices}', 2],
      ['  fields extracted      {o:✓ pass}', 2],
      ['  totals reconciled     {o:✓ pass}', 2],
      ['  sent to a person      {d:14}', 2],
      ['  duplicates posted     {x:✗ 2}', 2],
      ['  {x:ledger at risk · release blocked}', 2],
      ['{d:$} {w:make eval}', 4, true],
      ['  duplicates posted     {o:✓ 0}', 4],
      ['  {o:✓ all checks pass · ready to ship}', 4],
    ],
  },
  {
    title: 'ai-ops-monitor',
    file: 'monitor.py',
    label: 'Illustration: a monitor samples live conversations. After a prompt change, answers become less grounded, so it rolls back to the previous version, alerts the team, and the failing conversations are added to the test set.',
    code: [
      ['monitor = {f:Monitor}(agent,', 1],
      ['    sample={s:0.05},', 1],
      ['    checks=[grounded, on_policy, latency],', 1],
      ['    alert={s:"#ai-ops"},', 1],
      [')', 1],
      ['monitor.{f:rollback_on}(grounded < {s:0.95})', 1],
    ],
    term: [
      ['{d:$} {w:deploy prompt v18}', 2, true],
      ['  {d:live · sampling 5% of conversations}', 2],
      ['  on_policy     {o:✓ steady}', 2],
      ['  latency       {o:✓ steady}', 2],
      ['  grounded      {x:✗ falling}', 2],
      ['  {x:below 0.95 · rolled back to v17}', 2],
      ['  {d:alert sent to #ai-ops with 12 traces}', 2],
      ['{d:$} {w:make eval --from-traces}', 2, true],
      ['  {o:✓ 12 failing cases added to the tests}', 2],
    ],
  },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const paint = (src) => esc(src).replace(/\{([kfsdoxw]):([^}]*)\}/g, '<span class="t-$1">$2</span>');
const plain = (src) => src.replace(/\{[kfsdoxw]:([^}]*)\}/g, '$1');
const typedMs = (src) => plain(src).length * CHAR_MS;

for (const sc of scenes) {
  if (sc.code.length > CODE_LINES) throw new Error(`hero-demo: ${sc.title} has more than ${CODE_LINES} code lines`);
  for (const [src] of [...sc.code, ...sc.term]) {
    if (plain(src).length > 44) throw new Error(`hero-demo: line too long in ${sc.title}: ${plain(src)}`);
  }
}

// Timeline (ms from scene start) for one scene; returns [codeAt, termAt, end].
const timeline = (sc) => {
  const codeAt = [];
  const termAt = [];
  let t = 400;
  const runCode = (act, pause) => sc.code.forEach(([src, a], j) => {
    if (a !== act) return;
    codeAt[j] = t;
    t += src ? typedMs(src) + pause : 80;
  });
  const runTerm = (act) => sc.term.forEach(([src, a, isTyped], j) => {
    if (a !== act) return;
    termAt[j] = t;
    t += isTyped ? typedMs(src.replace(/^\{d:\$\} /, '')) + 350 : (src.includes('{x:') ? 700 : 380);
  });
  runCode(1, 120);
  t += 500;
  runTerm(2);
  if (sc.code.some(([, a]) => a === 3)) { t += 900; runCode(3, 300); t += 400; }
  runTerm(4);
  return [codeAt, termAt, t + 3500];
};

const line = (src, at, cls, n) => {
  const isTyped = cls.includes('dl--type');
  const body = isTyped && src.startsWith('{d:$} ')
    ? `<span class="t-d">$</span> <span class="dl__txt" style="--n:${plain(src).length - 2}">${paint(src.slice(6))}</span>`
    : `<span class="dl__txt"${isTyped ? ` style="--n:${plain(src).length}"` : ''}>${paint(src) || ' '}</span>`;
  return `<span class="dl ${cls}" data-at="${at}">${n !== undefined ? `<span class="dl__n">${n}</span>` : ''}${body}</span>`;
};

const scene = (sc, k) => {
  const [codeAt, termAt, end] = timeline(sc);
  const term = [...sc.term, ['{d:$} ', 0]];
  termAt.push(end - 3400);
  const codeHtml = sc.code.map(([src, act], j) =>
    line(src, codeAt[j], `dl--code${src ? ' dl--type' : ''}${act === 3 ? ' dl--add' : ''}`, act === 3 ? '+' : j + 1)).join('');
  const termHtml = term.map(([src, , isTyped], j) =>
    line(src, termAt[j], `${isTyped ? 'dl--type' : ''}${j === term.length - 1 ? ' dl--cursor' : ''}`)).join('');
  return `<div class="demo__scene${k === 0 ? ' is-active' : ''}" data-end="${end}" data-title="${sc.title}" role="img" aria-label="${sc.label}">
<div class="demo__pane"><div class="demo__label">${sc.file}</div><div class="demo__code">${codeHtml}</div></div>
<div class="demo__pane demo__pane--term"><div class="demo__label">terminal</div><div class="demo__term"><div class="demo__scroll" style="--end:${Math.max(0, term.length - VIEW)}">${termHtml}</div></div></div>
</div>`;
};

export const heroDemo = () => `<div class="demo" data-view="${VIEW}" style="--view:${VIEW};--code-lines:${CODE_LINES}">
<div class="demo__bar"><span class="demo__dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="demo__title" aria-hidden="true">${scenes[0].title}</span><button class="demo__toggle" type="button" aria-label="Pause animation">Pause</button></div>
${scenes.map(scene).join('\n')}
</div>`;
