// AssureGraph product page hero: the product's own screens, animated. Four scenes, each in four stages, in the
// same dark window and driven by the same player as the home hero demo (site.js turns on every [data-at] element
// at its time, in ms from the scene start). Everything is HTML and CSS; values are illustrative and match the
// app mock (src/product-ui.mjs): PR #482, run 5127, PAY-77, REQ-311. All scenes render at the same height.

const chip = (kind, text, at) => `<span class="app-chip app-chip--${kind}"${at === undefined ? '' : ` data-at="${at}"`}>${text}</span>`;
// A chip that changes state: later chips cover earlier ones as they turn on.
const chipStack = (states) => `<span class="pd-chipstack">${states.map(([kind, text, at]) => chip(kind, text, at)).join('')}</span>`;
const stages = (names, ats) => `<ol class="pd-stages" aria-hidden="true">${names.map((n, i) => `<li data-at="${ats[i]}">${n}</li>`).join('')}</ol>`;
const block = (at, title, body, cls = '') => `<div class="pd-block ${cls}" data-at="${at}"><div class="pd-block__title">${title}</div>${body}</div>`;
const row = (at, left, right) => `<div class="pd-row" data-at="${at}"><span class="pd-row__l">${left}</span><span class="pd-row__r">${right}</span></div>`;
const diff = (lines) => `<div class="pd-diff">${lines.map(([k, t, at]) => `<span class="pd-diff__l pd-diff__l--${k}" data-at="${at}">${t}</span>`).join('')}</div>`;
const chain = (nodes, start, step) => `<div class="pd-chain">${nodes.map(([kind, big, small, cls], i) =>
  `<div class="pd-node ${cls || ''}" data-at="${start + i * step}"><span class="pd-node__kind">${kind}</span><strong>${big}</strong><span>${small}</span></div>`).join('')}</div>`;
const verdict = (at, kind, text) => `<div class="pd-verdict pd-verdict--${kind}" data-at="${at}">${text}</div>`;
const bar = (at, pct, kind = 'accent') => `<span class="pd-bar pd-bar--${kind}" data-at="${at}"><span style="--w:${pct}%"></span></span>`;

const scenes = [
  {
    title: 'pr-482 · refund cap',
    end: 15500,
    label: 'Illustration of the product: a pull request changes the refund cap. AssureGraph detects a behaviour change and routes it under policy, generates three unit tests, validates and judges each one, runs them with three of three passing, and records the lineage from requirement to evidence. A pull request with the tests is opened.',
    body: `
${stages(['Change', 'Test plan', 'Run', 'Traceability'], [300, 2800, 6600, 9200])}
${block(300, 'PR #482 · refunds.py', diff([
  ['del', '-   if amt <= order.total:', 500],
  ['add', '+   paid = ledger.refunded(order.id)', 750],
  ['add', '+   if amt + paid <= order.total:', 1000],
]) + row(1500, 'Policy Brain', chipStack([['pending', 'reading the change', 1500], ['pending', 'behaviour change · unit tests · mid model', 2200]])))}
${block(2800, 'Test plan · 3 generated', [
  ['test_refund_within_total', 3000],
  ['test_refund_over_total_after_partial', 3400],
  ['test_refund_exact_total', 3800],
].map(([t, at]) => row(at, t, chipStack([['pending', 'generating', at], ['pending', 'validated', at + 1200], ['pass', 'judged ✓', at + 2000]]))).join(''))}
${block(6600, 'Run 5128 · unit', bar(6700, 100) + row(8000, '3 of 3 pass · 2.4 s', chip('pass', 'green', 8000)))}
${block(9200, 'Traceability', chain([
  ['Requirement', 'REQ-311', 'cumulative cap'],
  ['Change', 'PR #482', '3 lines'],
  ['Tests', '3', 'unit'],
  ['Run', '5128', '3 of 3'],
  ['Evidence', 'Signed', 'judge ok', 'pd-node--end'],
], 9400, 350))}
${verdict(11600, 'pass', 'PR opened · 3 tests · lineage recorded')}`,
  },
  {
    title: 'nightly-5127 · triage',
    end: 15000,
    label: 'Illustration of the product: a nightly run has three failures. AssureGraph checks each test’s history. Two fail without any code change and are quarantined with fix pull requests; the third began failing after a specific pull request and is ticketed to its owning team. The build is green.',
    body: `
${stages(['Failures', 'History', 'Action', 'Result'], [300, 2600, 6400, 9600])}
${block(300, 'Nightly run 5127 · 2,418 tests · 41 min', [
  ['checkout/test_cart.py::test_total', 500],
  ['search/test_index.py::test_rebuild', 750],
  ['auth/test_login.py::test_lockout', 1000],
].map(([t, at]) => row(at, t, chip('fail', 'FAILED', at))).join('') + row(1600, '2,415 passed', chip('fail', '3 failed', 1600)))}
${block(2600, 'History · last 12 runs', [
  ['test_total', [['pending', 'checking', 2800], ['fail', 'fails 4 of 12 · no code change', 3600]]],
  ['test_rebuild', [['pending', 'checking', 3900], ['fail', 'fails 3 of 12 · order-dependent', 4700]]],
  ['test_lockout', [['pending', 'checking', 5000], ['pending', 'first failure · since PR #480', 5800]]],
].map(([t, st]) => row(st[0][2], t, chipStack(st))).join(''))}
${block(6400, 'Action', [
  ['quarantine test_total', ['pending', 'fix PR opened · missing await', 6600]],
  ['quarantine test_rebuild', ['pending', 'fix PR opened · test order', 7400]],
  ['ticket test_lockout', ['fail', 'real failure → auth team', 8200]],
].map(([t, c]) => row(c[2], t, chip(c[0], c[1], c[2]))).join(''))}
${block(9600, 'Result', row(9800, 'Nightly 5127', chip('pass', 'green', 9800)) + row(10400, 'Flaky reruns this week', chip('pass', '2 fewer', 10400)))}
${verdict(11400, 'pass', '2 flaky quarantined · 1 real failure ticketed · build green')}`,
  },
  {
    title: 'pay-77 · spec change',
    end: 14500,
    label: 'Illustration of the product: a policy document changes the refund window from 14 to 30 days. The coverage map shows tests for the old window and none for the new one. Two API tests are generated for the new boundary and recorded against the requirement ahead of the code change.',
    body: `
${stages(['Spec', 'Coverage gap', 'Test plan', 'Traceability'], [300, 2400, 5200, 8600])}
${block(300, 'Jira PAY-77 · Refund policy v4', diff([
  ['del', '- Refunds allowed within 14 days', 500],
  ['add', '+ Refunds allowed within 30 days', 750],
  ['add', '+ Partial refunds count toward the cap', 1000],
]) + row(1600, 'Policy Brain', chipStack([['pending', 'reading the spec', 1600], ['pending', 'api tests · large model', 2100]])))}
${block(2400, 'Coverage · refund window', row(2600, 'within 14 days', bar(2600, 100) + chip('pass', '2 tests', 2600)) + row(3300, 'within 30 days', bar(3300, 0, 'fail') + chip('fail', 'no tests', 3300)) + row(4200, 'partial refunds in the cap', bar(4200, 0, 'fail') + chip('fail', 'no tests', 4200)))}
${block(5200, 'Test plan · 2 generated', [
  ['test_refund_day_29_succeeds', 5400],
  ['test_refund_day_31_refused', 5900],
].map(([t, at]) => row(at, t, chipStack([['pending', 'generating', at], ['pending', 'validated · fails until the code ships', at + 1300]]))).join(''))}
${block(8600, 'Traceability', chain([
  ['Requirement', 'PAY-77', '30-day window'],
  ['Change', 'pending', 'not yet written'],
  ['Tests', '2', 'api · ready'],
  ['Run', 'waiting', 'for the code'],
  ['Evidence', 'open', 'gap recorded', 'pd-node--open'],
], 8800, 350))}
${verdict(11000, 'pending', '2 tests ahead of the code · gap recorded')}`,
  },
  {
    title: 'v2.14.0 · release gate',
    end: 13500,
    label: 'Illustration of the product: a release gate. AssureGraph queries the ledger for every change in the release, confirms each has a passing test and that two were reviewed by a person, checks the hot-path policy and the flaky-test count, and exports the evidence pack. The gate opens.',
    body: `
${stages(['Release', 'Evidence', 'Policy', 'Gate'], [300, 2200, 6000, 8800])}
${block(300, 'Release v2.14.0', row(500, '18 changes', chip('pending', '14 PRs · 3 specs · 1 design', 500)) + row(1000, 'Tests in the release', chip('pending', '+41 generated · 6 maintained', 1000)))}
${block(2200, 'Evidence · from the ledger', row(2400, '18 changes → 59 tests → 59 runs', chip('pass', 'complete', 3000)) + row(3400, 'Every change has a passing test', chip('pass', '18 of 18', 4000)) + row(4400, 'Reviewed by a person', chip('pass', 'refunds, auth', 5000)))}
${block(6000, 'Policy', row(6200, 'Hot paths covered', bar(6200, 100) + chip('pass', '100%', 7000)) + row(7200, 'Flaky tests open', chip('pass', '0', 7800)))}
${block(8800, 'Gate', chain([
  ['Changes', '18', 'all traced'],
  ['Tests', '59', 'all pass'],
  ['Reviews', '2', 'human'],
  ['Policy', 'met', 'hot paths'],
  ['Pack', 'PDF', 'exported', 'pd-node--end'],
], 9000, 300))}
${verdict(10800, 'pass', 'GATE OPEN · evidence pack attached')}`,
  },
];

export const productDemo = () => `<div class="demo demo--ui" data-view="0">
<div class="demo__bar"><span class="demo__dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="demo__title" aria-hidden="true">${scenes[0].title}</span><button class="demo__toggle" type="button" aria-label="Pause animation">Pause</button></div>
${scenes.map((sc, k) => `<div class="demo__scene pd${k === 0 ? ' is-active' : ''}" data-end="${sc.end}" data-title="${sc.title}" role="img" aria-label="${sc.label}">${sc.body}
</div>`).join('\n')}
</div>`;
