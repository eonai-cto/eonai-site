// AssureGraph product page. Copy was reviewed against the house style on 2026-10-25 (see CLAUDE.md § AssureGraph).
import { readFileSync } from 'node:fs';
import { page, BOOK, BOOK_ATTRS, BOOK_SR } from '../layout.mjs';
import { SITE_URL } from '../config.mjs';
import { productDemo } from '../product-demo.mjs';

// The lowercase lockup, inlined like the EonAI logo (brand/make-assuregraph.py). Decorative; the h1 carries the name as hidden text.
const lockup = readFileSync(new URL('../../brand/logo/assuregraph-logo-on-dark.svg', import.meta.url), 'utf8')
  .trim().replace(' role="img" aria-label="AssureGraph"', ' class="ag-lockup" aria-hidden="true" focusable="false"');

const EARLY_ACCESS = '/#contact';

// Flow diagram: five stages joined by arrows, drawn in the site's icon style.
const flow = () => {
  const stages = [
    ['Change', 'commit, pull request, spec, design or log signal'],
    ['Route', 'Policy Brain picks the model under your policies'],
    ['Generate and validate', 'tests for the changed behaviour, checked before review'],
    ['Test suites', 'placed at the lowest level that proves it'],
    ['Ledger', 'requirement to test to run to evidence'],
  ];
  return `<ol class="flow" aria-label="How AssureGraph handles a change">
${stages.map(([t, d], i) => `<li class="flow__step"><span class="flow__num" aria-hidden="true">${i + 1}</span><strong>${t}</strong><span class="visually-hidden">: </span><span>${d}</span></li>`).join('\n')}
</ol>`;
};

const parts = [
  ['coverage-graph', 'Coverage Graph', 'Keeps a live map of which behaviours have tests and which do not. It is built from the code, the specs, the designs and the logs you share with it, so a path that is busy in production but thin in tests moves to the top of the list.'],
  ['policy-brain', 'Policy Brain', 'The routing engine. For each change it looks at what changed and in which part of the system, then applies your policies for accuracy, latency, cost and data handling to pick a model from the ones you have approved. Each routing decision is recorded with the policy that drove it, so a reviewer can see why a given model handled a given change. A patent application for this engine has been filed in India.'],
  ['traceability-ledger', 'Traceability Ledger', 'An append-only record that links each requirement to the tests that cover it, each test to the runs that executed it, and each run to its evidence. When someone asks why a release was safe to ship, the evidence is already assembled.'],
].map(([id, t, body]) => `<article class="card card--lg ag-part" id="${id}">
<h3 class="card__title">${t}</h3>
<p class="card__text">${body}</p>
</article>`).join('\n');

const uses = [
  ['Test maintenance', 'Keeps tests current as the code under them changes, and hands the update to your team as a pull request.'],
  ['Test generation for changed behaviour', 'New tests for what a change altered, opened as a pull request with the diff they cover.'],
  ['Flaky-test triage', 'Identifies tests that fail without a code change, attaches the likely cause (timing, ordering, environment) and quarantines them, so a red build means a real failure.'],
  ['Coverage re-prioritisation', 'Moves effort to the paths the Coverage Graph ranks highest.'],
  ['Root-cause analysis on failed runs', 'A first diagnosis attached to the failure before an engineer opens it.'],
  ['Release gates with evidence', 'The lineage and the results in one place when someone has to sign off.'],
].map(([t, d]) => `<li><strong>${t}.</strong> ${d}</li>`).join('\n');

const security = [
  ['Your models', 'It runs on the LLM you already use. Nothing routes through a model you have not approved.'],
  ['Your environment', 'Deploys in your VPC or as an isolated tenant.'],
  ['Scoped integrations', 'Read access to GitHub or GitLab, Jira, your CI and the logs you share with it. Its only output into your repository is a pull request for your team to review. Secrets are masked.'],
  ['Access and audit', 'Role-based access control and an audit log of every action it takes.'],
].map(([t, d]) => `<div class="trust"><h3 class="card__title card__title--xs">${t}</h3><p class="card__text">${d}</p></div>`).join('\n');

const body = `
<section class="hero on-dark ag-hero">
<div class="container hero__inner">
<div class="hero__copy">
<div class="eyebrow">PRODUCT · AGENTIC AI FOR QUALITY ENGINEERING</div>
<h1 class="ag-h1">${lockup}<span class="visually-hidden">AssureGraph</span></h1>
<p class="page-title__lead">Developers write code with AI assistants now, and the rate of change has gone up. Testing has not kept pace. AssureGraph watches changes in your code, specs, designs and logs, writes and maintains the tests they need, and keeps the record from requirement to evidence. It runs on the LLM you already use, in your VPC or an isolated tenant.</p>
<div class="hero__actions">
<a class="btn btn--primary" href="${EARLY_ACCESS}">Join the waitlist</a>
<a class="btn btn--ghost" href="${BOOK}"${BOOK_ATTRS}>Book a 30-minute working session${BOOK_SR}</a>
</div>
</div>
${productDemo()}
</div>
</section>

<section class="container section--tall" id="gap">
<div class="section-head">
<div class="eyebrow">THE GAP</div>
<h2 class="h2">Where testing falls behind</h2>
</div>
<ul class="ag-gap">
<li><strong>Coverage drifts.</strong> Critical paths change with every release and the tests do not follow. Code assistants write tests when an engineer asks, and nobody asks for the ones that fell behind. Where traceability exists at all, it lives in a spreadsheet that is out of date by the next sprint.</li>
<li><strong>The picture is split across tools.</strong> Test management, CI, observability and the issue tracker each hold part of it. Feedback arrives late and in pieces.</li>
<li><strong>Triage is manual.</strong> Flaky tests and red builds are worked through by hand, one at a time. Recovery takes longer and releases slip.</li>
</ul>
</section>

<section class="container section--tall" id="how">
<div class="section-head">
<div class="eyebrow">HOW IT WORKS</div>
<h2 class="h2">From a change to an updated test suite</h2>
</div>
${flow()}
<ol class="ag-steps">
<li><strong>A change lands.</strong> A commit, a pull request, a spec update, a design change or a new failure pattern in the logs you share with it.</li>
<li><strong>Policy Brain routes it.</strong> It picks the model for that kind of change, under your policies. It acts only on changes that can alter behaviour, so it is not writing tests for a rename.</li>
<li><strong>Agents generate and validate.</strong> The generator writes tests for the changed behaviour. A validator runs each test against the changed code; a judge checks that the written rationale matches the diff and your policy. Only tests that pass both reach a reviewer.</li>
<li><strong>The test suites update.</strong> New and changed tests land at the lowest level that can prove the behaviour, unit before API before UI, and are ranked by the risk of the path and the cost of the test.</li>
<li><strong>The ledger records it.</strong> Requirement to test to run to evidence, in a form your auditors can read.</li>
</ol>
<p class="ag-metrics">It reports change failure rate, mean time to recovery, time to green, flaky reruns and test-suite acceptance, so you can see what it changed.</p>
</section>

<section class="container section--tall" id="inside">
<div class="section-head">
<div class="eyebrow">COMPONENTS</div>
<h2 class="h2">What is inside</h2>
</div>
<div class="grid grid--3">
${parts}
</div>
</section>

<section class="usecases on-dark" id="uses">
<div class="container usecases__inner">
<div class="section-head">
<div class="eyebrow">USE CASES</div>
<h2 class="h2">What it takes on</h2>
</div>
<ul class="ag-uses">
${uses}
</ul>
</div>
</section>

<section class="container section--tall" id="security">
<div class="section-head section-head--tight">
<div class="eyebrow">SECURITY</div>
<h2 class="h2">Security and deployment</h2>
</div>
<div class="grid grid--trust">
${security}
</div>
</section>

<section class="container section--tall">
<div class="cta-band">
<div>
<h2>Try it on your own pipeline</h2>
<p>AssureGraph is in development. If your pipeline runs thousands of tests a night and your engineers lose mornings to red builds, join the waitlist and we will show you what it does on a week of your own changes as soon as there is a build to run.</p>
</div>
<div class="hero__actions">
<a class="btn btn--primary" href="${EARLY_ACCESS}">Join the waitlist</a>
<a class="btn btn--ghost btn--ghost-light" href="${BOOK}"${BOOK_ATTRS}>Book a 30-minute working session${BOOK_SR}</a>
</div>
</div>
</section>
`;

export default page({
  title: 'AssureGraph: agentic AI for quality engineering — EonAI',
  description: 'AssureGraph watches real change in your code, specs and logs, writes and maintains the tests that change needs, and keeps the lineage from requirement to evidence. Runs on your own LLM, in your VPC.',
  path: '/assuregraph/',
  current: 'assuregraph',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AssureGraph',
    applicationCategory: 'DeveloperApplication',
    description: 'Agentic AI for quality engineering: change-triggered test generation and maintenance with policy-aware model routing and a traceability ledger.',
    url: `${SITE_URL}/assuregraph/`,
    author: { '@type': 'Organization', name: 'EonAI', url: SITE_URL },
  },
}, body);
