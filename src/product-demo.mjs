// assuregraph product page hero: one workflow, told twice. Eight stages (scenario, requirements, test cases,
// execution, bug, PR, fix, ship) in the demo window, driven by the same player as the home hero demo: site.js
// turns on every [data-at] element at its time in ms from the scene start. Finished stages collapse to a one-line
// summary (CSS :has), so the window never overflows. Everything is HTML and CSS; values are illustrative and match
// the app mock (src/product-ui.mjs): PR #482, run 5127, PAY-77, REQ-311.

import { readFileSync } from 'node:fs';

// The product mark in the window bar (brand/make-assuregraph.py), decorative.
const mark = readFileSync(new URL('../brand/logo/assuregraph-mark-on-dark.svg', import.meta.url), 'utf8')
  .trim().replace(' role="img" aria-label="assuregraph"', ' aria-hidden="true" focusable="false"');

const chip = (kind, text, at) => `<span class="app-chip app-chip--${kind}"${at === undefined ? '' : ` data-at="${at}"`}>${text}</span>`;
const chipStack = (states) => `<span class="pd-chipstack">${states.map(([kind, text, at]) => chip(kind, text, at)).join('')}</span>`;
const stages = (names, ats) => `<ol class="pd-stages" aria-hidden="true">${names.map((n, i) => `<li data-at="${ats[i]}">${n}</li>`).join('')}</ol>`;
const block = (at, title, sum, body) => `<div class="pd-block" data-at="${at}"><div class="pd-block__head"><span class="pd-block__title">${title}</span><span class="pd-block__sum">${sum}</span><span class="pd-block__queued">queued</span></div><div class="pd-block__body">${body}</div></div>`;
const row = (at, left, right, dim = false) => `<div class="pd-row${dim ? ' pd-row--dim' : ''}" data-at="${at}"><span class="pd-row__l">${left}</span><span class="pd-row__r">${right}</span></div>`;
const diff = (lines) => `<div class="pd-diff">${lines.map(([k, t, at]) => `<span class="pd-diff__l pd-diff__l--${k}" data-at="${at}">${t}</span>`).join('')}</div>`;
const chain = (nodes, start, step) => `<div class="pd-chain">${nodes.map(([kind, big, small, cls], i) =>
  `<div class="pd-node ${cls || ''}" data-at="${start + i * step}"><span class="pd-node__kind">${kind}</span><strong>${big}</strong><span>${small}</span></div>`).join('')}</div>`;
const verdict = (at, kind, text) => `<div class="pd-verdict pd-verdict--${kind}" data-at="${at}">${text}</div>`;
const bar = (at, pct, kind = 'accent') => `<span class="pd-bar pd-bar--${kind}" data-at="${at}"><span style="--w:${pct}%"></span></span>`;

const STAGES = ['Scenario', 'Reqs', 'Tests', 'Run', 'Bug', 'PR', 'Fix', 'Ship'];

const scenes = [
  {
    title: 'PR #482 · refund cap',
    end: 24500,
    label: 'Illustration of the product on a code change: a pull request changes the refund cap. assuregraph identifies the behaviours touched, writes three test requirements against REQ-311, generates and judges three tests, runs them and finds one failure, opens a defect with the trace attached, proposes a fix as a pull request that a person approves, re-runs with three of three passing, and ships with the lineage signed.',
    body: `
${stages(STAGES, [300, 2800, 4900, 8200, 10700, 12900, 15700, 17800])}
${block(300, 'Scenario · PR #482 refunds.py', '3 behaviours · 1 high risk', diff([
  ['del', '-   if amt <= order.total:', 500],
  ['add', '+   paid = ledger.refunded(order.id)', 700],
  ['add', '+   if amt + paid <= order.total:', 900],
]) + row(1300, 'refund within the total', chip('pending', 'medium risk', 1300)) + row(1600, 'refund after a partial refund', chip('fail', 'high risk · money out', 1600)) + row(1900, 'refund of the exact total', chip('pending', 'low risk', 1900)))}
${block(2800, 'Test requirements · REQ-311', '3 requirements · unit level', row(3000, 'TR-1 A refund up to the remaining total succeeds', chip('pending', 'unit', 3000)) + row(3400, 'TR-2 Refunds after a partial never exceed the order', chip('fail', 'unit · high', 3400)) + row(3800, 'TR-3 A refund of the exact remaining total succeeds', chip('pending', 'unit', 3800)))}
${block(4900, 'Test cases · 3 generated', '3 tests · validated and judged', [
  ['test_refund_within_total', 5100],
  ['test_refund_over_total_after_partial', 5500],
  ['test_refund_exact_total', 5900],
].map(([t, at]) => row(at, t, chipStack([['pending', 'generating', at], ['pending', 'validated', at + 1100], ['pass', 'judged ✓', at + 1800]]))).join(''))}
${block(8200, 'Execution · run 5128', '2 of 3 pass · 1 failure', bar(8300, 100) + row(9500, '2 of 3 pass · 2.6 s', chip('fail', '1 failed', 9500)) + row(9900, 'test_refund_over_total_after_partial', chip('fail', 'FAILED', 9900)))}
${block(10700, 'Bug · AG-19 from the failing test', 'AG-19 opened · trace attached', row(10900, 'After a 50% refund, a full refund pays 150% of the order', chip('fail', 'defect', 10900)) + row(11400, 'Cause: the cap checks the request, not what was already refunded', '', true) + row(11900, 'Owner', chip('pending', 'payments team · trace attached', 11900)))}
${block(12900, 'Fix PR #483 · refunds.py', '#483 approved by a person', diff([
  ['del', '-   if amt <= order.total:', 13100],
  ['add', '+   if amt + paid <= order.total:', 13400],
]) + row(13900, 'Review', chipStack([['pending', 'awaiting a person', 13900], ['pass', 'approved · payments lead', 14900]])))}
${block(15700, 'Fix verified · run 5129', '3 of 3 pass', bar(15800, 100) + row(17000, '3 of 3 pass · 2.3 s', chip('pass', 'green', 17000)))}
${block(17800, 'Ship · lineage', 'shipped', chain([
  ['Requirement', 'REQ-311', 'cumulative cap'],
  ['Changes', '#482 · #483', 'fix included'],
  ['Tests', '3', 'unit'],
  ['Run', '5129', '3 of 3'],
  ['Evidence', 'Signed', 'judge · review', 'pd-node--end'],
], 18000, 300))}
${verdict(19900, 'pass', 'Shipped · release gate open · lineage complete')}`,
  },
  {
    title: 'PAY-77 · policy v4',
    end: 24500,
    label: 'Illustration of the product on a spec change: a policy document moves the refund window from 14 to 30 days. assuregraph identifies the behaviours the change implies, writes three test requirements, generates and judges three API tests, runs them against the current code and finds two unmet, opens a change request to the owning team, a developer’s pull request is reviewed and approved, the re-run passes, and the policy ships with evidence.',
    body: `
${stages(STAGES, [300, 2800, 4900, 8200, 10700, 12900, 15700, 17800])}
${block(300, 'Scenario · Jira PAY-77 refund policy v4', '3 behaviours · policy change', diff([
  ['del', '- Refunds allowed within 14 days', 500],
  ['add', '+ Refunds allowed within 30 days', 700],
  ['add', '+ Partial refunds count toward the cap', 900],
]) + row(1300, 'refund on day 29', chip('pending', 'new behaviour', 1300)) + row(1600, 'refund on day 31', chip('pending', 'boundary', 1600)) + row(1900, 'partial refunds in the cap', chip('fail', 'high risk · money out', 1900)))}
${block(2800, 'Test requirements · PAY-77', '3 requirements · api level', row(3000, 'TR-1 A refund on day 29 succeeds', chip('pending', 'api', 3000)) + row(3400, 'TR-2 A refund on day 31 is refused', chip('pending', 'api', 3400)) + row(3800, 'TR-3 Partial refunds count toward the cap', chip('fail', 'api · high', 3800)))}
${block(4900, 'Test cases · 3 generated', '3 tests · validated and judged', [
  ['test_refund_day_29_succeeds', 5100],
  ['test_refund_day_31_refused', 5500],
  ['test_partial_refunds_count_toward_cap', 5900],
].map(([t, at]) => row(at, t, chipStack([['pending', 'generating', at], ['pending', 'validated', at + 1100], ['pass', 'judged ✓', at + 1800]]))).join(''))}
${block(8200, 'Execution · run 5130 against current code', '1 of 3 pass · 2 unmet', bar(8300, 100) + row(9500, '1 of 3 pass · 1.9 s', chip('fail', '2 failed', 9500)) + row(9900, 'the code still enforces 14 days and ignores partials', chip('fail', 'unmet', 9900)))}
${block(10700, 'Change request · AG-20 from the failing tests', 'AG-20 opened · 2 requirements', row(10900, 'TR-1 and TR-3 are not implemented', chip('fail', 'open', 10900)) + row(11400, 'The tests are ready; the code has to catch up with the policy', '', true) + row(11900, 'Owner', chip('pending', 'payments team · tests attached', 11900)))}
${block(12900, 'Developer PR #491 · refund window and cap', '#491 approved by a person', diff([
  ['del', '-   WINDOW_DAYS = 14', 13100],
  ['add', '+   WINDOW_DAYS = 30', 13400],
  ['add', '+   cap -= ledger.partial_refunds(order.id)', 13700],
]) + row(14100, 'Review', chipStack([['pending', 'awaiting a person', 14100], ['pass', 'approved · payments lead', 15000]])))}
${block(15700, 'Fix verified · run 5131', '3 of 3 pass', bar(15800, 100) + row(17000, '3 of 3 pass · 2.1 s', chip('pass', 'green', 17000)))}
${block(17800, 'Ship · lineage', 'shipped', chain([
  ['Requirement', 'PAY-77', '30-day window'],
  ['Change', 'PR #491', 'policy v4'],
  ['Tests', '3', 'api'],
  ['Run', '5131', '3 of 3'],
  ['Evidence', 'Signed', 'judge · review', 'pd-node--end'],
], 18000, 300))}
${verdict(19900, 'pass', 'Shipped · policy v4 live · lineage complete')}`,
  },
];

export const productDemo = () => `<div class="demo demo--ui" data-view="0">
<div class="demo__bar"><span class="demo__dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="demo__brand" aria-hidden="true">${mark}<span>assuregraph</span></span><span class="demo__title" aria-hidden="true">${scenes[0].title}</span><button class="demo__toggle" type="button" aria-label="Pause animation">Pause</button></div>
${scenes.map((sc, k) => `<div class="demo__scene pd${k === 0 ? ' is-active' : ''}" data-end="${sc.end}" data-title="${sc.title}" role="img" aria-label="${sc.label}">${sc.body}
</div>`).join('\n')}
</div>`;
