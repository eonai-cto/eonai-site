// Hero illustration: an editor and a terminal replaying short scenes, each showing one part of how we build agents.
// Every scene is rendered here in its final state; site.js plays them one after another in a random order
// (reshuffled per visit). Typing is a CSS clip and the terminal scrolls with a transform, so nothing changes
// layout and CLS stays 0. No JS, reduced motion or "Pause" show a scene's final state.
//
// Scene format. code: [text, act]; term: [text, act, typed?]. Acts play in order:
// 1 code is written, 2 terminal runs, 3 a fix is added to the code (marked +), 4 terminal runs again.
// Colour markup: {k:…} keyword, {f:…} name, {s:…} literal, {d:…} dim, {o:…} pass, {x:…} fail, {w:…} command.
// Keep lines to 44 characters so they fit a 375px phone, and code to 9 lines (the editor height).
// {m:…} marks the verdict line of a scene (highlighted, held for a beat); {d:↳} tool calls show a pending dot until the next line.

const CHAR_MS = 22; // typing speed; must match the calc() on .dl--type in site.css
const VIEW = 9; // terminal lines visible at once
const CODE_LINES = 9;

const scenes = [
  {
    title: 'refunds-agent',
    file: 'refunds.py',
    label: 'Illustration: an agent handling a refund ticket. Before it issues the refund, the code checks earlier refunds on the same order, finds the combined amount is over the limit, holds the refund for human review.',
    code: [
      ['{k:for} step {k:in} agent.{f:run}(ticket):', 1],
      ['    {k:if} step.tool == {s:"issue_refund"}:', 1],
      ['        past = ledger.{f:refunds}(step.order_id,', 1],
      ['                               since={s:"24h"})', 1],
      ['        {k:if} past.total + step.amount > CAP:', 1],
      ['            step.{f:hold}({s:"refund over limit"})', 1],
      ['            {f:escalate}(ticket, to={s:"billing"})', 1],
      ['            {k:break}', 1],
      ['    step.{f:execute}()', 1],
    ],
    term: [
      ['{d:$} {w:python run.py --ticket 48213}', 2, true],
      ['  {d:›} "refund the other half now"', 2],
      ['  {d:↳} lookup_order({s:#48213})', 2],
      ['    {d:←} refunded 50% · 3h ago', 2],
      ['  {d:↳} issue_refund({s:#48213}, 50%)', 2],
      ['    {x:✗ held · refund over limit}', 2],
      ['  {d:↳} escalate({s:#48213}, to={s:"billing"})', 2],
      ['{m:HELD for human review · nothing refunded}', 2],
    ],
  },
  {
    title: 'agent-evals',
    file: 'test_agent.py',
    label: 'Illustration: pytest tests that run the agent on hard cases and assert every answer is grounded in its sources and free of personal data. One case scores below the threshold, so the release is blocked and the failing trace is attached.',
    code: [
      ['{k:@pytest}.mark.parametrize({s:"case"}, EDGE)', 1],
      ['{k:def} {f:test_grounded}(case):', 1],
      ['    reply = agent.{f:answer}(case.question)', 1],
      ['    score = {f:grounded}(reply, case.sources)', 1],
      ['    {k:assert} score >= {s:0.95}, reply.trace', 1],
      ['', 1],
      ['{k:def} {f:test_no_pii}(case):', 1],
      ['    reply = agent.{f:answer}(case.question)', 1],
      ['    {k:assert} {k:not} pii.{f:found}(reply.text)', 1],
    ],
    term: [
      ['{d:$} {w:pytest evals/ -q}', 2, true],
      ['  test_grounded[refund-window]   {o:PASSED}', 2],
      ['  test_grounded[plan-change]     {o:PASSED}', 2],
      ['  test_grounded[two-accounts]    {x:FAILED}', 2],
      ['  test_no_pii[*]                 {o:PASSED}', 2],
      ['    {x:assert 0.88 >= 0.95}', 2],
      ['    {d:← trace: agent cited the old policy}', 2],
      ['{m:RELEASE BLOCKED · 1 of 212 to fix first}', 2],
    ],
  },
  {
    title: 'model-router',
    file: 'router.py',
    label: 'Illustration: a router that scores every candidate model on the task, keeps the ones within a point of the best, picks the cheapest of those and logs the decision. A drafting task goes to the medium model; a classification task goes to the small one.',
    code: [
      ['{k:def} {f:choose}(task, pool):', 1],
      ['    acc = {p: {f:score}(p, task) {k:for} p {k:in} pool}', 1],
      ['    best = {f:max}(acc.values())', 1],
      ['    close = [m {k:for} m {k:in} pool', 1],
      ['             {k:if} best - acc[m] <= {s:0.01}]', 1],
      ['    pick = {f:min}(close, key={k:lambda} m: m.cost)', 1],
      ['    log.{f:decision}(task, pick, acc)', 1],
      ['    {k:return} pick', 1],
    ],
    term: [
      ['{d:$} {w:python route.py --task draft_reply}', 2, true],
      ['  {d:↳} score(small)    0.81   cost 1×', 2],
      ['  {d:↳} score(medium)   0.94   cost 4×', 2],
      ['  {d:↳} score(large)    0.95   cost 16×', 2],
      ['  {d:◦} medium is within 0.01 of best', 2],
      ['{m:ROUTED → medium · 4× cheaper, logged}', 2],
      ['{d:$} {w:python route.py --task classify}', 2, true],
      ['  {d:↳} score(small)    0.97   cost 1×', 2],
      ['{m:ROUTED → small · 16× cheaper, logged}', 2],
    ],
  },
  {
    title: 'invoice-pipeline',
    file: 'pipeline.py',
    label: 'Illustration: an agent extracts the fields from an invoice and plain code validates them, checks the ledger for a duplicate and holds anything doubtful for human review. In a monthly batch, 498 invoices post and two are held.',
    code: [
      ['fields = agent.{f:extract}(invoice, INVOICE)', 1],
      ['errors = {f:validate}(fields, INVOICE)', 1],
      ['{k:if} ledger.{f:has}(fields.number, fields.vendor):', 1],
      ['    errors.append({s:"duplicate invoice"})', 1],
      ['{k:if} errors {k:or} fields.confidence < {s:0.9}:', 1],
      ['    {k:return} review.{f:queue}(invoice, errors)', 1],
      ['{k:return} ledger.{f:post}(fields)', 1],
    ],
    term: [
      ['{d:$} {w:python run.py --batch 2026-10}', 2, true],
      ['  {d:↳} agent.extract({s:INV-20417})', 2],
      ['    {d:←} 11 fields · confidence 0.97', 2],
      ['  {d:↳} validate()     {o:0 errors}', 2],
      ['  {d:↳} ledger.has()   {x:True}', 2],
      ['    {x:✗ duplicate invoice}', 2],
      ['  {d:↳} review.queue({s:INV-20417})', 2],
      ['{m:498 posted · 2 held for human review}', 2],
    ],
  },
  {
    title: 'agent-monitor',
    file: 'monitor.py',
    label: 'Illustration: a monitor samples five percent of the agent’s live conversations and tracks how grounded its answers are over a rolling half hour. When the score falls below the bar it rolls the agent back, alerts the team and adds the failing traces to the test suite.',
    code: [
      ['{k:while} {k:True}:', 1],
      ['    batch = traces.{f:sample}(agent, pct={s:5})', 1],
      ['    score = {f:grounded}(batch).rolling({s:"30m"})', 1],
      ['    {k:if} score < {s:0.95}:', 1],
      ['        agent.{f:rollback}(to=last_good)', 1],
      ['        {f:alert}({s:"#ai-ops"}, batch.failed)', 1],
      ['        evals.{f:add}(batch.failed)', 1],
      ['    {f:sleep}(minutes={s:15})', 1],
    ],
    term: [
      ['{d:$} {w:python monitor.py --agent support}', 2, true],
      ['  14:02  grounded 0.97  {o:✓}', 2],
      ['  14:17  grounded 0.96  {o:✓}', 2],
      ['  14:31  grounded 0.93  {x:✗ falling}', 2],
      ['  {d:↳} agent.rollback(to={s:v17})', 2],
      ['  {d:↳} alert({s:#ai-ops}, 12 traces)', 2],
      ['  {d:↳} evals.add(12 traces)', 2],
      ['{m:ROLLED BACK in 29 min · 12 new tests}', 2],
    ],
  },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const paint = (src) => esc(src).replace(/\{([kfsdoxwm]):([^}]*)\}/g, '<span class="t-$1">$2</span>');
const plain = (src) => src.replace(/\{[kfsdoxwm]:([^}]*)\}/g, '$1');
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
    const isMark = src.startsWith('{m:');
    if (isMark) t += 700; // a beat before the verdict
    termAt[j] = t;
    t += isTyped ? typedMs(src.replace(/^\{d:\$\} /, '')) + 350
      : isMark ? 1400
      : src.includes('{x:') ? 800
      : src.includes('{d:↳}') ? 800 // a tool call waits for its result
      : src.includes('{d:◦}') ? 600
      : 420;
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
  if (src.startsWith('{m:')) cls += ' dl--mark';
  else if (src.includes('{d:↳}')) cls += ' dl--tool';
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
