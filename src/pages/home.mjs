import { page, BOOK, esc } from '../layout.mjs';
import { SITE_URL, FORMSPREE_ENDPOINT, TALK_URL, TALK_THUMB, TALK_TITLE } from '../config.mjs';

const check = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8FB0FF" stroke-width="2" aria-hidden="true"><path d="M20 6L9 17l-5-5"></path></svg>';

const problems = [
  ['USUALLY RAISED BY A CTO OR HEAD OF PRODUCT', '“The demo impressed everyone. On real data it falls apart.”', 'We rebuild around your actual data and edge cases, starting with a test set that defines what “working” means before any code is written.', 'AGENT MVP · AI RELIABILITY AUDIT'],
  ['USUALLY RAISED BY AN ENGINEERING LEAD', '“We changed a prompt or a model and can’t tell whether things got worse.”', 'We build an evaluation suite that runs on every change, so a drop in accuracy, safety or cost shows up before your customers notice it.', 'AI RELIABILITY AUDIT · MANAGED AI OPERATIONS'],
  ['USUALLY RAISED BY A HEAD OF RISK OR COMPLIANCE', '“Risk and compliance won’t sign off on anything with AI in it.”', 'We design the controls, audit trails and human checkpoints regulated teams expect, and document them in the language your reviewers use.', 'AI OPPORTUNITY SPRINT · TRANSFORM'],
  ['USUALLY RAISED BY A COO OR HEAD OF OPERATIONS', '“Our support and back-office queues keep growing.”', 'We automate the classification, triage and first responses, with AI that knows when to hand off to a person, and we measure the cost it takes out.', 'AGENT MVP · BUILD'],
  ['USUALLY RAISED BY A VP ENGINEERING OR HEAD OF QA', '“AI writes half our code now. Our testing hasn’t caught up.”', 'We bring your quality process up to speed for AI-generated code: automated test generation, risk-based coverage and release gates that protect velocity without the outages.', 'QE HEALTH CHECK · ASSURE'],
  ['USUALLY RAISED BY A FOUNDER OR CEO', '“We need senior technical leadership, but a full-time CTO isn’t realistic yet.”', 'A fractional CTO who owns architecture, hiring, delivery and AI strategy for the days a week you actually need.', 'FRACTIONAL CTO · SCALE'],
].map(([who, quote, body, tag]) => `<article class="card">
<div class="eyebrow eyebrow--xs eyebrow--grey">${who}</div>
<h3 class="card__title card__title--sm">${quote}</h3>
<p class="card__text">${body}</p>
<div class="card__tag">→ ${tag}</div>
</article>`).join('\n');

const services = [
  ['01 — BUILD', 'Agentic AI &amp; GenAI Engineering', 'AI agents that complete real tasks, assistants that answer from your own documents and data, and automation for support and operations.', ['AI agents and workflow automation', 'Knowledge assistants on your data', 'Fine-tuning and multi-model routing'], false],
  ['02 — ASSURE', 'AI Quality &amp; Verifiable Assurance', 'Find out how your AI really performs before your customers do. We measure accuracy, safety and cost, look for the ways it fails, and keep it dependable in production.', ['Evaluation suites for LLMs and agents', 'Adversarial testing and guardrails', 'Quality for AI-generated code'], true],
  ['03 — TRANSFORM', 'AI &amp; Engineering Transformation', 'The technology is the easy part. BCG estimates only about 10% of the value from AI comes from the model, 20% from data and technology, and 70% from how work, governance and teams change around it. That 70% is what we help with.', ['AI readiness and roadmap', 'AI governance and ISO/IEC 42001 readiness', 'Release and quality engineering'], false],
  ['04 — SCALE', 'Fractional Leadership &amp; Capability Centres', 'Senior technology leadership without the full-time hire, and engineering or QE teams set up for you in India. Large firms do this for large companies; we do it for startups and mid-market teams of 5 to 50.', ['Fractional CTO or Head of Engineering', 'India capability centre setup', 'Managed delivery teams'], false],
].map(([num, title, body, items, dark]) => `<article class="card card--svc${dark ? ' card--dark' : ''}">
<div class="card__num">${num}</div>
<h3 class="card__title">${title}</h3>
<p class="card__text">${body}</p>
<ul class="card__list">${items.map((i) => `<li>${i}</li>`).join('')}</ul>
</article>`).join('\n');

const uc = (title, body, foot) => `<div class="ucard"><h3>${title}</h3><p>${body}</p>${foot}</div>`;
const seen = (t) => `<div class="ucard__seen">${t}</div>`;
const note = (slug, t) => `<a class="ucard__note" href="/notes/${slug}/">${t}</a>`;
const usecases = [
  uc('Support and complaint handling', 'Classify, route and draft replies to tickets and complaints, with a person in the loop for the difficult ones.', seen('Seen before: 80% lower support-operations cost*') + note('measure-before-you-ship', 'Advisory note: measure the change before you ship it →')),
  uc('Knowledge assistants', 'Answer staff or customer questions from policies, contracts and manuals, citing the source every time.', note('grounded-answers', 'Advisory note: a fluent answer is not a grounded answer →')),
  uc('Document processing', 'Extract, check and reconcile data from invoices, KYC files, claims and forms at volume.', note('deterministic-orchestrator', 'Advisory note: keep the orchestrator deterministic →')),
  uc('Defect and incident triage', 'Deduplicate, prioritise and route bugs, alerts and test failures to the right team without manual sorting.', seen('Seen before: 300K-bug backlog cut to 12K in a year*')),
  uc('AI-assisted testing', 'Generate and maintain tests, flag risky changes and shorten regression cycles in fast-moving codebases.', seen('Seen before: 92% fewer field defects*')),
  uc('Data matching and identity resolution', 'Link records across messy datasets, including Indian-language names, into one trusted view.', seen('Seen before: 93%+ match accuracy on national datasets*')),
  uc('Compliance and review workflows', 'Pre-screen documents and decisions against policy, flag exceptions and keep a full audit trail.', note('guardrails-in-the-architecture', 'Advisory note: guardrails belong in the architecture →')),
  uc('Multi-model orchestration', 'Send each task to the model that handles it best on accuracy and cost, with a record of every decision.', seen('Built on our patent-pending engine')),
].join('\n');

const steps = [
  ['Define success', 'Choose the use case, agree the business metric and build the test set the system has to pass. The job description.'],
  ['Build on real data', 'A working version on your data within weeks, using whichever model handles each task best on accuracy and cost.'],
  ['Test it properly', 'Measure accuracy, safety and cost. Try to break it. Add guardrails until it clears the bar you set. The probation period.'],
  ['Run it, then hand over', 'Deploy with monitoring and train your team, so the momentum stays with you after we leave. Code, prompts, tests and documentation are all yours.'],
].map(([t, b], i) => `<li class="step"><div class="step__num" aria-hidden="true">${i + 1}</div><h3>${t}</h3><p class="card__text">${b}</p></li>`).join('\n');

const offers = [
  ['AI Opportunity Sprint', '2 WEEKS', 'Use-case discovery, feasibility checks and a prioritised roadmap, for enterprises starting with AI.', 'You walk away with', ['A ranked list of use cases with the business case for each', 'A data and readiness assessment with the gaps named', 'A 90-day plan for the first pilot, with its success metric'], 'How it runs: week 1 workshops and data review · week 2 analysis and roadmap readout'],
  ['Agent MVP', '4–6 WEEKS', 'A working agentic AI system on your own data, for startups and innovation teams.', 'You walk away with', ['A deployed agent running in your environment', 'An evaluation suite and the results it currently scores', 'A production roadmap with cost and latency estimates'], 'How it runs: week 1 define success · weeks 2–5 build and evaluate · week 6 harden and hand over'],
  ['AI Reliability Audit', '2–3 WEEKS', 'An independent evaluation of an AI product you already run, for teams shipping AI today.', 'You walk away with', ['An evaluation report with failure modes ranked by severity', 'A guardrail and monitoring plan', 'A re-runnable test suite your team owns'], 'How it runs: week 1 baseline and adversarial testing · week 2 analysis · week 3 fix plan and readout'],
  ['QE Health Check', '1–2 WEEKS', 'An assessment of your testing and release practices, for scale-ups with quality problems.', 'You walk away with', ['A maturity assessment against practices that work at scale', 'The top five changes, ranked by impact on release risk', 'A roadmap to faster, safer releases, including AI-generated code'], 'How it runs: interviews and pipeline review, then a written readout with your leads'],
  ['Managed AI Operations', 'MONTHLY', 'We keep your AI working after launch, for teams who would rather not build an AI operations function yet.', 'You walk away with, every month', ['Evaluations re-run on every prompt, model or data change', 'Monitoring of accuracy, cost and drift, with a report you can show your board', 'Prompts and models under release control, with guardrails kept current'], 'How it runs: a monthly retainer sized to the systems in scope, cancellable with notice'],
  ['Fractional CTO', 'ONGOING', 'Senior technology leadership on a retainer, for seed to Series A startups.', 'You walk away with', ['Architecture and technology decisions you can defend to investors', 'Hiring plans, interviews and onboarding for your first engineers', 'A delivery cadence and AI strategy owned by someone accountable'], 'How it runs: one to three days a week, with a defined hand-over when you hire full-time'],
  ['Team Workshops', '1–2 DAYS', 'Hands-on sessions for engineering and product teams, in person or remote.', 'Current workshops', ['Evaluating LLM applications and agents', 'Quality engineering for AI-generated code', 'AI governance for product and risk teams'], 'How it runs: tailored to your stack, with exercises on your own systems where possible'],
].map(([t, m, d, lab, items, foot]) => `<article class="card">
<div class="card__head"><h3 class="card__title card__title--eng">${t}</h3><span class="card__meta">${m}</span></div>
<p class="card__text">${d}</p>
<div class="card__label">${lab}</div>
<ul class="card__list card__list--eng">${items.map((i) => `<li>${i}</li>`).join('')}</ul>
<div class="card__foot">${foot}</div>
</article>`).join('\n');

const trust = [
  ['<rect x="4" y="10" width="16" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path>', 'Your data stays in your environment', 'We build inside your cloud or on your infrastructure. Where a third-party model is used, it is accessed under business terms that exclude training on your data, or replaced with a self-hosted model where your policy requires it.'],
  ['<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><path d="M14 3v6h6M9 14l2 2 4-4"></path>', 'You own what we build', 'Code, prompts, evaluation suites and documentation are yours on delivery. We sign a mutual NDA before any detailed discussion.'],
  ['<circle cx="6" cy="12" r="2.5"></circle><circle cx="18" cy="6" r="2.5"></circle><circle cx="18" cy="18" r="2.5"></circle><path d="M8.3 11l7.4-3.8M8.3 13l7.4 3.8"></path>', 'No model or cloud lock-in', 'OpenAI, Anthropic, Google, Llama, Mistral or open-source models; AWS, Azure, Google Cloud, OCI or on-premise. Chosen per task on accuracy, cost and your data policy.'],
  ['<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"></path>', 'Designed to recognised frameworks', 'Audit trails, access controls and human checkpoints built in from the start, designed to the NIST AI Risk Management Framework, ISO/IEC 42001, the EU AI Act’s risk tiers, India’s DPDP Act and GDPR.'],
].map(([svg, t, b]) => `<div class="card card--lg">
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2B5BFF" stroke-width="1.8" aria-hidden="true">${svg}</svg>
<h3 class="card__title card__title--xs">${t}</h3>
<p class="card__text card__text--sm">${b}</p>
</div>`).join('\n');

const sectors = ['Financial services', 'Mobility &amp; logistics', 'Gaming', 'Energy &amp; utilities', 'Public sector', 'Software &amp; SaaS']
  .map((s) => `<li class="pill">${s}</li>`).join('');

const faqs = [
  ['How quickly can EonAI start on a new engagement?', 'Usually within one to two weeks of a first conversation. Fixed-scope engagements such as the AI Opportunity Sprint or the AI Reliability Audit begin with a short kickoff, access to the relevant data or systems, and a signed statement of work. The people who scope the engagement are the people who deliver it, so there is no hand-off between a sales team and a delivery team.'],
  ['Do you work with clients outside India?', 'Yes. We work remotely with teams in the United States, the United Kingdom, Europe and Asia-Pacific, and arrange working hours to overlap with yours. Contracts can be under Indian or your local jurisdiction, and we invoice in INR, USD or GBP. For longer programmes we can travel for kickoffs and key milestones.'],
  ['Which AI models and cloud platforms do you use?', 'Whatever fits your constraints. We are not tied to any model provider and routinely work with OpenAI, Anthropic, Google, Llama and Mistral models, choosing per task on accuracy, cost and your data policy. We deploy on AWS, Azure, Google Cloud, OCI or on-premise, and we can use self-hosted models where data must not leave your environment.'],
  ['How do you make sure an AI system is safe to put in front of customers?', 'By agreeing what “good” looks like before we build, then measuring against it. Every system ships with an evaluation suite that scores accuracy, safety and cost on your real data, adversarial tests that try to make it fail, guardrails for the failure modes we find, and human checkpoints where the stakes are high. You see the results, not just a demo.'],
  ['What if we already have an AI product in production?', 'Start with an AI Reliability Audit. In two to three weeks we measure how the system actually performs, find where it fails, and give you a prioritised fix plan plus a re-runnable test suite your team owns. If you then want someone to keep it healthy as models and prompts change, Managed AI Operations covers that on a monthly basis.'],
  ['Should we build AI capability in-house or work with EonAI?', 'Both, usually. Our goal is to leave your team able to run and extend what we build, not to make you dependent on us. Every engagement includes knowledge transfer, documentation and the evaluation tooling in your hands. Many clients use us to get the first system into production quickly, then hire against a working example rather than a blank job description.'],
  ['Can you help us set up an engineering or QE team in India?', 'Yes. We have built engineering and quality organisations in India from scratch for global companies, including hiring, onboarding, tooling and the operating cadence that keeps a remote team aligned with headquarters. We focus on teams of 5 to 50 for startups and mid-market companies, a segment the large capability-centre providers generally don’t serve.'],
  ['How does EonAI charge for its work?', 'A fixed price for defined engagements such as the Sprint, the Audit and the Health Check; a monthly retainer for Managed AI Operations and Fractional CTO work; and time and materials for longer builds and programmes. We quote after a short scoping conversation, and the quote includes what you will walk away with and when.'],
].map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n');

const body = `
<!-- HERO -->
<section class="hero on-dark" id="top">
<div class="container hero__inner">
<div class="eyebrow">EVALUATION-FIRST AI ENGINEERING</div>
<h1>AI that works beyond the demo.</h1>
<p class="hero__lead">Plenty of AI pilots look good in a meeting and quietly stall afterwards. We help startups and enterprises get past that point: building, testing and running AI systems their customers, engineers and auditors can rely on.</p>
<p class="hero__sub">EonAI’s engineers spent twenty years keeping software reliable for millions of users before turning that discipline to AI. Hands-on, direct, and honest about what AI can and can’t do yet.</p>
<div class="hero__actions">
<a class="btn btn--primary" href="${BOOK}">Book a 30-minute working session</a>
<a class="btn btn--ghost" href="#problems">See what we solve</a>
</div>
<ul class="hero__checks">
<li>${check}<div><strong>Working software in weeks.</strong> We build on your data from the first sprint.</div></li>
<li>${check}<div><strong>Evidence, not assurances.</strong> You get the test results along with the system.</div></li>
<li>${check}<div><strong>Everything stays yours.</strong> Your environment, your code, your IP.</div></li>
</ul>
</div>
</section>

<!-- WHO WE SERVE -->
<section class="container section">
<div class="grid grid--2">
<div class="card card--lg">
<div class="eyebrow eyebrow--sm">FOR STARTUPS</div>
<h2 class="card__title">Ship a credible AI product before the runway runs out.</h2>
<p class="card__text">A working agent in weeks, senior technical leadership for the days you need it, and the evaluation evidence investors and first customers ask for.</p>
<a class="card__more" href="${BOOK}">Book a working session →</a>
</div>
<div class="card card--lg">
<div class="eyebrow eyebrow--sm">FOR ENTERPRISES</div>
<h2 class="card__title">Move AI from pilot to production, safely.</h2>
<p class="card__text">A clear view of where AI pays off, governance your risk and compliance teams will sign off on, and delivery that fits how your engineers already work.</p>
<a class="card__more" href="${BOOK}">Request an AI readiness workshop →</a>
</div>
</div>
</section>

<!-- WHY PILOTS STALL -->
<section class="container section">
<div class="band-dark">
<div class="band-dark__title">
<div class="eyebrow">WHY PILOTS STALL</div>
<h2>Four reasons, and none of them is the model.</h2>
</div>
<ul class="band-dark__list">
<li><strong>No agreed definition of success.</strong> So nobody can say whether it works.</li>
<li><strong>Built on sample data.</strong> Real data has edge cases the demo never saw.</li>
<li><strong>Governance bolted on at the end.</strong> Risk and compliance say no, late.</li>
<li><strong>Nobody owns it after launch.</strong> Models change, prompts drift, quality slips.</li>
</ul>
</div>
</section>

<!-- PROBLEMS -->
<section class="container section--tall" id="problems">
<div class="section-head">
<div class="eyebrow">PROBLEMS WE SOLVE</div>
<h2 class="h2">The situations clients usually bring to us</h2>
</div>
<div class="grid grid--3">
${problems}
</div>
</section>

<!-- SERVICES -->
<section class="container section--tall" id="services">
<div class="section-head">
<div class="eyebrow">SERVICES</div>
<h2 class="h2">What we do</h2>
</div>
<div class="grid grid--4">
${services}
</div>
</section>

<!-- USE CASES -->
<section class="usecases on-dark" id="usecases">
<div class="container usecases__inner">
<div class="section-head">
<div class="eyebrow">USE CASES</div>
<h2 class="h2">Where we tend to add the most value</h2>
<p class="lede">Problems we have built for, tested or led before, so we start with a working pattern rather than a blank page.</p>
</div>
<div class="grid grid--dark">
${usecases}
</div>
<div class="usecases__foot">
<p>*Results achieved by EonAI’s leadership in prior roles at a global mobility platform, a gaming company, a fintech and a national data programme. Your results will depend on your data, scope and starting point.</p>
<a href="${BOOK}">Describe your problem →</a>
</div>
</div>
</section>

<!-- APPROACH -->
<section class="container section--tall" id="approach">
<div class="panel-light">
<div class="section-head section-head--wide">
<div class="eyebrow">HOW WE WORK · EVALUATION-FIRST DELIVERY</div>
<h2 class="h2">If we can’t measure it, we don’t ship it.</h2>
<p class="lede">Think of an AI agent as a new hire. It needs a job description, a probation period, performance reviews and an exit process. That is what evaluation-first delivery means in practice: we agree what “good” looks like before writing any code, then test against it at every step. You see the numbers as we go, not just a demo at the end.</p>
</div>
<ol class="steps">
${steps}
</ol>
</div>
</section>

<!-- OFFERS -->
<section class="container section--tall" id="offers">
<div class="section-head section-head--split">
<div class="section-head">
<div class="eyebrow">ENGAGEMENTS</div>
<h2 class="h2">Start small, see the results, then decide.</h2>
<p class="lede">Most relationships begin with a short, fixed-scope engagement. Each one ends with something concrete you keep.</p>
</div>
<a class="link-strong" href="${BOOK}">Not sure which fits? Ask us →</a>
</div>
<div class="grid grid--engage">
${offers}
<article class="card card--highlight card--center">
<h3 class="card__title card__title--eng">Larger programmes</h3>
<p class="card__text">Full builds, multi-quarter transformations and India capability centres are scoped individually after a short discovery phase.</p>
<a class="card__more" href="${BOOK}">Start with a conversation →</a>
</article>
</div>
<figure class="pullquote">
<p>“AI projects are successful only if they keep working after they are deployed.”</p>
<p>QuantumBlack, AI by McKinsey, on the AI operations challenge. It is why Managed AI Operations is on this list.</p>
</figure>
</section>

<!-- TRUST -->
<section class="container section--tall">
<div class="section-head section-head--tight">
<div class="eyebrow">SECURITY, DATA AND OWNERSHIP</div>
<h2 class="h2">Built to pass your security review</h2>
</div>
<div class="grid grid--trust">
${trust}
</div>
<ul class="pills pills--sector" aria-label="Sector experience">
<li class="pills__label">SECTOR EXPERIENCE</li>
${sectors}
</ul>
</section>

<!-- LABS -->
<section class="container section--tall">
<div class="band-dark band-labs">
<div class="band-dark__title">
<div class="eyebrow">EONAI LABS</div>
<h2>The IP we bring to every engagement</h2>
<p>We don’t start from a blank page. Two pieces of our own work shorten engagements and raise reliability, and you can use them without being locked into them.</p>
</div>
<div class="labs-grid">
<div class="ucard"><h3>Multi-model orchestration engine</h3><p>Routes each task to the best-fit model for accuracy and cost, with a compliance trail for every decision. Patent application filed in India, 2025.</p></div>
<div class="ucard"><h3>GenAI quality platform</h3><p>Evaluation, test generation and triage for AI systems and AI-written code, in development on the engine above. The tooling behind our Assure work.</p></div>
</div>
</div>
</section>

<!-- ABOUT -->
<section class="container section--tall" id="about">
<div class="panel-light">
<div class="about">
<div class="eyebrow">ABOUT EONAI</div>
<h2 class="h2 h2--md">An AI engineering firm with a quality engineering background.</h2>
<p>EonAI is an India-registered firm serving clients worldwide. Its leadership spent two decades keeping software reliable for millions of users at global technology companies before turning that discipline to AI. The firm is senior-led and hands-on: the people who scope an engagement are the people who deliver it.</p>
<p>We are not an outsourcing firm. We are the people you call when the AI has to work.</p>
</div>
</div>
</section>

<!-- ENGINEERING NOTES -->
<section class="container section--tall notes-home" id="notes">
<div class="section-head section-head--split">
<div class="section-head">
<div class="eyebrow">ENGINEERING NOTES</div>
<h2 class="h2">Practical guidance for teams putting AI agents into production</h2>
<p class="lede">Short advisory notes on how agentic systems fail in production and the controls that prevent it, written for the person accountable for the decision.</p>
</div>
<a class="link-strong" href="/notes/">All notes →</a>
</div>
<div class="grid grid--2">
<a class="note-card note-card--dark" href="/notes/refunds-agent/">
<div class="eyebrow eyebrow--xs">SECURITY &amp; GUARDRAILS · 9 MIN</div>
<h3>If your agent can issue refunds, a content filter is not protecting you</h3>
<p>Six scenarios that read as ordinary customer traffic and cost money, and the seven controls we recommend.</p>
<span class="note-card__cta">Read →</span>
</a>
<a class="note-card" href="/notes/measure-before-you-ship/">
<div class="eyebrow eyebrow--xs">EVALUATION · 7 MIN</div>
<h3>Before you ship that agent “improvement”, measure it in layers</h3>
<p>An upgrade that improved decisions and quietly made the agent slower and less consistent. One accuracy number would have hidden both.</p>
<span class="note-card__cta">Read →</span>
</a>
<a class="note-card" href="/notes/grounded-answers/">
<div class="eyebrow eyebrow--xs">KNOWLEDGE ASSISTANTS · 6 MIN</div>
<h3>A fluent answer is not a grounded answer</h3>
<p>A knowledge assistant can pass every task check and still answer from nothing. What to measure before it reaches your clients.</p>
<span class="note-card__cta">Read →</span>
</a>
<a class="note-card note-card--talk" href="${TALK_URL}">
<img class="note-card__thumb" src="${TALK_THUMB}" width="480" height="360" loading="lazy" alt="Video thumbnail for the talk ${esc(TALK_TITLE)}">
<div class="eyebrow eyebrow--xs">TALK · TEST DRIVE PLATFORM</div>
<h3>${TALK_TITLE}</h3>
<p>A guest talk by EonAI’s CTO on what changes in testing and release practice when much of your code is written by AI.</p>
<span class="note-card__cta">Watch on YouTube →</span>
</a>
</div>
</section>

<!-- FAQ -->
<section class="container section--tall" style="padding-bottom: clamp(64px, 9vw, 112px)">
<div class="faq">
<div class="faq__head">
<div class="eyebrow">FAQ</div>
<h2 class="h2">Common questions</h2>
</div>
<div class="faq__list">
${faqs}
</div>
</div>
</section>

<!-- CONTACT -->
<section class="contact" id="contact">
<div class="container contact__inner">
<div class="contact__copy">
<div class="eyebrow">CONTACT</div>
<h2 class="h2">Tell us about the problem. We’ll tell you honestly whether we can help.</h2>
<p class="lede">If you’d rather talk, book a 30-minute call with a senior engineer. It’s a working session on your problem, not a sales pitch.</p>
<div class="contact__actions">
<a class="btn btn--primary" href="${BOOK}">Book a call</a>
<a class="contact__mail" href="mailto:hello@eonai.ai">hello@eonai.ai</a>
</div>
<div class="next">
<div class="eyebrow eyebrow--sm eyebrow--grey">WHAT HAPPENS NEXT</div>
<ol>
<li>We reply within one business day.</li>
<li>A 30-minute working session with a senior engineer.</li>
<li>A mutual NDA, if you want one before sharing details.</li>
<li>A written scope and quote within a week, including what you’ll walk away with.</li>
</ol>
</div>
</div>
<form class="form" id="contact-form" method="post" action="${esc(FORMSPREE_ENDPOINT)}">
<div class="form__row">
<div class="field"><label for="f-name">Name</label><input id="f-name" name="name" type="text" autocomplete="name"></div>
<div class="field"><label for="f-email">Work email</label><input id="f-email" name="email" type="email" autocomplete="email"></div>
</div>
<div class="form__row">
<div class="field"><label for="f-interest">I’m interested in</label><select id="f-interest" name="interest"><option>Building an AI product or agent</option><option>Testing or auditing an AI system</option><option>Keeping an AI system running well</option><option>AI strategy and governance</option><option>Fractional CTO or India team</option><option>A team workshop</option><option>Something else</option></select></div>
<div class="field"><label for="f-stage">Where are you in your AI journey?</label><select id="f-stage" name="stage"><option>Exploring what’s possible</option><option>Have a use case, no build yet</option><option>Have a pilot or prototype</option><option>Have something in production</option></select></div>
</div>
<div class="field"><label for="f-message">What problem are you trying to solve?</label><textarea id="f-message" name="message" rows="4"></textarea></div>
<div class="hp" aria-hidden="true"><label for="f-gotcha">Leave this field empty</label><input id="f-gotcha" type="text" name="_gotcha" tabindex="-1" autocomplete="off"></div>
<label class="check"><input type="checkbox" name="consent_processing" value="yes" required><span>I agree to EonAI processing this information to respond to my enquiry, as described in the <a href="/privacy/">Privacy policy</a>. Required.</span></label>
<label class="check"><input type="checkbox" name="consent_marketing" value="yes"><span>Send me occasional notes from EonAI on AI quality and engineering. I can unsubscribe at any time. Optional.</span></label>
<div class="form__actions">
<button class="btn btn--dark" type="submit">Send message</button>
<span>Treated as confidential.</span>
</div>
<div id="form-status" class="form__status" role="status" aria-live="polite" hidden></div>
</form>
</div>
</section>
`;

export default page({
  title: 'EonAI — Evaluation-first AI engineering for startups and enterprises',
  description: 'EonAI builds, tests and runs AI systems that work in production. Agentic AI engineering, AI quality and verifiable assurance, AI transformation and fractional technology leadership.',
  path: '/',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EonAI Private Limited',
    url: SITE_URL,
    email: 'hello@eonai.ai',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot No 4, Doc Bhavan, 4th & 5th Floor, Madhapur',
      addressLocality: 'Hyderabad',
      postalCode: '500081',
      addressCountry: 'IN',
    },
  },
}, body);
