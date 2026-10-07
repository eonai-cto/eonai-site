// Engineering notes content. Strings may contain inline HTML.
// Block types: p, ul, ol (items may be [lead, rest]), table {head, rows}, draft.

export const PROVENANCE_REFUNDS =
  'Findings are from EonAI’s reference systems, built and tested on synthetic data. They describe patterns we see across support agents, not a client engagement.';
export const PROVENANCE =
  'Findings are from EonAI’s reference systems, built and tested on synthetic data. They describe patterns we see across clients’ systems, not a client engagement.';

// Home-page engagement blurbs, reused in the "Where this applies" sidebar.
export const ENGAGEMENTS = {
  'AI Reliability Audit': { href: '/#offers', blurb: 'An independent evaluation of an AI product you already run, for teams shipping AI today.' },
  'Managed AI Operations': { href: '/#offers', blurb: 'We keep your AI working after launch, for teams who would rather not build an AI operations function yet.' },
  'Agent MVP': { href: '/#offers', blurb: 'A working agentic AI system on your own data, for startups and innovation teams.' },
  'AI Opportunity Sprint': { href: '/#offers', blurb: 'Use-case discovery, feasibility checks and a prioritised roadmap, for enterprises starting with AI.' },
  'Transform': { href: '/#services', blurb: null },
  'How we work': { href: '/#approach', blurb: null },
};

export const notes = [
  {
    slug: 'refunds-agent',
    title: 'If your agent can issue refunds, a content filter is not protecting you.',
    cardTitle: 'If your agent can issue refunds, a content filter is not protecting you',
    category: 'Security & guardrails',
    mins: 8,
    indexMins: 9,
    forWho: 'CTOs, heads of customer operations, risk and compliance leads',
    applies: 'any agent that can refund, update records or send messages',
    engagements: ['AI Reliability Audit'],
    lede: 'Most support agents in production rely on injection filters, output scanning and a per-transaction cap. Those controls stop the attacks that look like attacks. The ones that cost money look like ordinary business. This note sets out the exposure, where standard controls fall short, and the seven controls we recommend.',
    card: 'Six scenarios that read as ordinary customer traffic and cost money, including split refunds under the cap and a six-character edit to a policy document. The seven controls we recommend, and why the two cheapest close the most expensive exposures.',
    homeCard: 'Six scenarios that read as ordinary customer traffic and cost money, and the seven controls we recommend.',
    related: ['guardrails-in-the-architecture', 'deterministic-orchestrator', 'grounded-answers'],
    sideApplies: 'In two to three weeks we run these scenarios and others specific to your tools against your agent, and hand you a severity-ranked report, a permission table, a fix plan and a re-runnable test suite your team owns.',
    provenance: PROVENANCE_REFUNDS,
    sections: [
      {
        id: 'exposure', h: 'The exposure', blocks: [
          { p: 'A chatbot that says the wrong thing produces a bad sentence. An agent that is manipulated into the wrong action produces a refund, a redirected parcel or a disclosed customer record. The liability sits with you, not with the model vendor.' },
          { p: 'The controls most teams ship with are designed for an ordinary user who may be rude or careless. They are not designed for a motivated person who has read the defences and is working around them, and that is the person who extracts money. The practical question for your business is not “can the filter catch bad text?” but “can anyone make this agent take an action it should not?”' },
        ],
      },
      {
        id: 'shortfalls', h: 'Where standard controls fall short', blocks: [
          { p: 'In our reference build, a support agent protected with the standard controls stopped the textbook injection and then failed six scenarios that read as normal customer traffic. Each one maps to a loss your finance or fraud team would recognise.' },
          {
            table: {
              label: 'Scenarios where standard controls fall short',
              head: ['Scenario', 'Exposure', 'Why standard controls miss it'],
              rows: [
                ['Injection without keywords', 'The same instruction-hijack as the textbook attack, phrased so nothing on the block list appears. The agent follows it.', 'The classifier matches appearance, not intent.'],
                ['Multi-turn setup', 'Four ordinary messages. A false premise is established in the third and acted on in the fourth: a profile change the agent had no way to verify.', 'Per-message checks cannot see a sequence.'],
                ['Tampered policy document', 'Six characters changed in the knowledge base: $250 became $2,500. The agent’s self-service authority increased tenfold, and it quoted the new limit with full confidence.', 'Not an injection and not visibly wrong. A human review skims past it.'],
                ['Acting on someone else’s account', 'A customer requested a refund on another customer’s $1,899 order and received it.', 'The agent had no concept of who was asking. Nothing to check ownership against.'],
                ['Refund splitting', 'Three refunds of $160, $150 and $140, each with a plausible reason, on an order worth $612 that had already been partly refunded. Total paid out exceeded the order value.', 'The per-transaction cap was satisfied every time. It limits the wrong thing.'],
                ['Two routine actions, one fraud', 'An address change followed by a refund on the same order in one session. Individually routine; together, the delivery-interception pattern your own policy probably warns about.', 'Per-action checks see one action at a time. The risk only exists across two.'],
              ],
            },
          },
          { p: 'The pattern matters more than any single row. Standard controls are strongest against the scenario that looks most like an attack and weakest against the ones that look like business as usual. If your current protection is a filter and a cap, assume the lower five rows apply to you.' },
        ],
      },
      {
        id: 'recommend', h: 'What we recommend', blocks: [
          { p: 'Put authorisation in the architecture, not in the prompt. The model may decide what to propose; it must never decide what is permitted. In practice that is seven controls, in order of dependency. Most teams can implement the first two in days, and they close the most expensive scenarios.' },
          {
            ol: [
              ['Know who is asking.', 'Every session is bound to an identified customer at a known assurance level (unverified, email-verified, MFA). Higher-impact actions require the higher levels. Everything below depends on this.'],
              ['A permission table your auditor can read.', 'Each tool declares what it requires; anything not listed is denied by default. Queries return only the fields a task needs, so a field that was never fetched cannot be leaked.'],
              ['Keep the filters, demote them.', 'Injection scanning stays, extended to retrieved documents, but it flags and logs rather than decides. It becomes your early-warning telemetry.'],
              ['Protect the policy source.', 'Knowledge-base documents are integrity-checked before use, and monetary limits live in code rather than in prose the model reads.'],
              ['Cap the total, not the transaction.', 'Limits are enforced against the order’s remaining value and the session’s running total. Splitting a refund no longer works.'],
              ['A person approves high-impact combinations.', 'Address changes, large refunds and any flagged pairing of actions route to a human before they execute.'],
              ['An audit trail that stands up to review.', 'Every decision and action recorded in tamper-evident form, so an incident is reconstructed rather than argued about, and compliance can sign off.'],
            ],
          },
          { p: 'The most expensive scenario, acting on someone else’s account, was closed by a single ownership check: does this record belong to the customer in this session? No classifier, no threshold, no prompt. The most effective controls on agents are usually this plain, and plain controls have no false-negative rate.' },
        ],
      },
    ],
    recommendation: 'Before the next release, ask three questions of every tool your agent can call: who is calling, what are they entitled to, and what has already happened in this session? If any answer lives in a prompt, the control is a request, not a guarantee. Keep the filters as defence in depth. Move authorisation into the architecture. A two-week audit is enough to find out which of the six scenarios apply to you and what closing them would take.',
  },

  {
    slug: 'measure-before-you-ship',
    title: 'Before you ship that agent “improvement”, measure it in layers',
    category: 'Evaluation',
    mins: 7,
    forWho: 'CTOs, heads of engineering, product leads',
    engagements: ['AI Reliability Audit', 'Managed AI Operations'],
    lede: 'An upgrade to a triage agent improved its decisions and quietly made it slower and less consistent. One accuracy number would have hidden both. How to set up a golden set and layered metrics so your team sees the trade-off before customers do.',
    card: 'Adding planning to a triage agent improved its decisions and quietly made it slower and less consistent. One accuracy number would have hidden both. How to set up a golden set and layered metrics so your team sees the trade-off before customers do.',
    homeCard: 'An upgrade that improved decisions and quietly made the agent slower and less consistent. One accuracy number would have hidden both.',
    related: ['when-a-high-score-means-nothing', 'guardrails-in-the-architecture', 'build-on-real-data'],
    sections: [
      {
        id: 'exposure', h: 'The exposure', draft: true, blocks: [
          {
            ul: [
              'Support triage must be fast, consistent and auditable; a single-pass agent fails in three ways: ambiguous tickets that fit no category, wrong tool choice, badly formed tool arguments.',
              'Teams typically judge an agent change by one headline accuracy figure, or by eyeballing a few examples.',
            ],
          },
        ],
      },
      {
        id: 'shortfalls', h: 'Where standard controls fall short', draft: true, blocks: [
          {
            table: {
              head: ['What teams do', 'What it hides', 'Consequence'],
              rows: [
                ['Single accuracy metric', 'Trade-offs between decision quality and efficiency', 'Ships a change that is better on hard cases and worse on cost and consistency'],
                ['Ad-hoc test prompts that change each time', 'Regressions between versions', '“Improvements” that cannot be compared'],
                ['One run at temperature 0 treated as truth', 'Run-to-run drift of both the agent and the judge', 'Decisions made on noise'],
                ['Planning metrics read at face value', 'A perfect score because no plan text existed to judge', 'False confidence'],
              ],
            },
          },
          { ul: ['Evidence from our reference build: adding planning and self-correction raised tool choice and argument quality markedly, cut step efficiency by roughly two-thirds and slightly reduced completion.'] },
        ],
      },
      {
        id: 'recommend', h: 'What we recommend', draft: true, blocks: [
          {
            ol: [
              'Freeze a golden set of real tickets with agreed correct outcomes before any change.',
              'Score in layers rather than with one number. A practical set for an agentic workflow: prompts and instructions (does the model follow the constraints set?), planning and reasoning (is the plan sound, are the right tools chosen?), actions (tool-call success, retries, latency, error handling), context and retrieval (quality of retrieved information, grounding, citation accuracy), outcomes (task completion, factuality, safety checks, user satisfaction).',
              'Map each layer to a business KPI (routing accuracy, escalation quality, operational efficiency, decision consistency) so leadership reads the same report as engineering.',
              'Run repeatedly and report mean and spread; treat small deltas as noise until they repeat.',
              'Treat “no planning signal” as a gap, not a pass.',
              'Re-run the suite on every prompt, model or tool change — this is what Managed AI Operations does monthly.',
            ],
          },
        ],
      },
    ],
    recommendation: 'If your team cannot show, per layer, what the last change did, you are shipping blind. A golden set and layered scorecard take one to two weeks to stand up and pay for themselves on the first regression they catch.',
  },

  {
    slug: 'guardrails-in-the-architecture',
    title: 'Guardrails are topology, not prompts',
    category: 'Security & guardrails',
    mins: 8,
    forWho: 'CTOs, heads of product, trust & safety, legal',
    engagements: ['AI Reliability Audit', 'Agent MVP'],
    lede: 'Safety that lives in a system prompt is a request. Safety that lives in the workflow the agent cannot bypass is a guarantee. What a guardrail architecture looks like, and the failure policy each check needs before launch.',
    card: 'Safety that lives in a system prompt is a request. Safety that lives in the workflow the agent cannot bypass is a guarantee. What a guardrail architecture looks like, and the failure policy each check needs before launch.',
    homeCard: '',
    related: ['refunds-agent', 'deterministic-orchestrator', 'fairness-is-a-test'],
    sections: [
      {
        id: 'exposure', h: 'The exposure', draft: true, blocks: [
          {
            ul: [
              'A returns-and-refunds agent that acts has consequential failures: wrong refund, leaked record, biased decision. Trust & Safety and Legal will ask for a review before launch.',
              'Model vendors’ built-in safety training catches some attacks some of the time; it is not controllable and cannot be relied on.',
            ],
          },
        ],
      },
      {
        id: 'shortfalls', h: 'Where standard controls fall short', draft: true, blocks: [
          {
            table: {
              head: ['Scenario', 'Exposure', 'Why prompt-based safety misses it'],
              rows: [
                ['Direct prompt injection', 'Agent ignores policy', 'The instruction is in the same channel as the attack'],
                ['PII exfiltration request', 'Customer record disclosed', 'Prompt says “don’t”, attacker says “do”'],
                ['Indirect injection via tool output', 'Agent acts on text inside a record', 'Tool output treated as trusted'],
                ['Frustrated legitimate customer', 'Wrongly refused or blocked', 'A single toxicity threshold cannot tell angry from malicious'],
                ['Over-refund attempt', 'Money out', 'No cap enforced where the action happens'],
              ],
            },
          },
        ],
      },
      {
        id: 'recommend', h: 'What we recommend', draft: true, blocks: [
          { p: 'Guardrails as workflow nodes the agent cannot bypass.' },
          {
            ol: [
              'Input checks run in order before the agent: PII redaction (redact and continue), injection classifier (fail closed), toxicity (route to a person), topic (fail open and log).',
              'Output check the agent cannot skip: the agent has no path to the customer except through it.',
              'Refund cap enforced inside the tool on the server, not in the prompt.',
              'Principle: neural components score, symbolic components decide and enforce.',
              'Every check has a written failure policy (what happens on error or trigger) agreed with Trust & Safety before launch.',
              'Fairness tested as behaviour: identical claims with different customer names must produce identical decisions.',
              'A decision trace that reconstructs which check made which call.',
            ],
          },
        ],
      },
    ],
    recommendation: 'Ask your team to show you the workflow diagram and point to the node that stops a bad output reaching a customer. If the answer is “the prompt”, you do not yet have a guardrail.',
  },

  {
    slug: 'deterministic-orchestrator',
    title: 'When money is involved, keep the orchestrator deterministic',
    category: 'Multi-agent systems',
    mins: 8,
    forWho: 'CTOs, heads of operations, claims/finance leaders',
    engagements: ['Agent MVP', 'AI Opportunity Sprint'],
    lede: 'How to structure a multi-agent review so every agent shows its evidence, a critic catches contradictions, insufficient evidence never becomes an approval, and your auditors get a complete trail. Illustrated with insurance claims.',
    card: 'How to structure a multi-agent review so every agent shows its evidence, a critic catches contradictions, insufficient evidence never becomes an approval, and your auditors get a complete trail. Illustrated with insurance claims.',
    related: ['guardrails-in-the-architecture', 'grounded-answers', 'decisions-not-reasoning'],
    sections: [
      {
        id: 'exposure', h: 'The exposure', draft: true, blocks: [
          {
            ul: [
              'Claim and document review is costly and inconsistent when manual, brittle when done by fixed rules; partial evidence is common.',
              '“Multi-agent” is often three parallel LLM calls with no role boundaries, no evidence contract and no way to explain a decision.',
            ],
          },
        ],
      },
      {
        id: 'shortfalls', h: 'Where standard controls fall short', draft: true, blocks: [
          {
            table: {
              head: ['Practice', 'What it hides', 'Consequence'],
              rows: [
                ['One LLM asked to “assess the claim”', 'No evidence trail', 'Decision cannot be defended'],
                ['Parallel calls with no critic', 'Contradictions between findings go unnoticed', 'Wrong approvals'],
                ['LLM as orchestrator', 'Retries and routing become unpredictable', 'Cost and audit problems'],
                ['No quorum rule', 'A missing worker result becomes an implicit approval', 'Money out on no evidence'],
                ['Document inconsistencies (header vs body claim ID, invoice amount vs claim amount)', 'Missed unless a worker is tasked with them', 'Fraud passes'],
              ],
            },
          },
        ],
      },
      {
        id: 'recommend', h: 'What we recommend', draft: true, blocks: [
          {
            ol: [
              'Specialist workers with explicit responsibilities and output contracts (“risk signal + evidence-backed notes”), each with stated limits (e.g. “never infer risk from frequency alone”).',
              'Tools accessed through a standard protocol boundary (MCP) so data access is governed and logged.',
              'A critic that compares findings, flags contradictions and evidence gaps, and may request exactly one retry.',
              'A deterministic orchestrator (code, not a model) that dispatches, enforces retry caps and applies the verdict.',
              'A quorum rule: insufficient evidence falls back to deny or to human review, never to approve.',
              'An append-only audit trail per claim, readable by compliance.',
              'Human review branch for high-value or contested decisions.',
            ],
          },
        ],
      },
    ],
    recommendation: 'If the thing deciding which agent runs next is itself a model, you cannot promise your auditor a repeatable process. Keep the orchestrator boring.',
  },

  {
    slug: 'grounded-answers',
    title: 'A fluent answer is not a grounded answer',
    category: 'Knowledge assistants',
    mins: 6,
    forWho: 'CTOs, heads of research/knowledge, compliance',
    engagements: ['AI Reliability Audit', 'Agent MVP'],
    lede: 'A knowledge assistant can pass every task check and still answer from nothing. Why groundedness needs its own measure, why the judge must be independent of the writer, and how confidence routing keeps weak answers away from your clients.',
    card: 'A knowledge assistant can pass every task check and still answer from nothing. Why groundedness needs its own measure, why the judge must be independent of the writer, and how confidence routing keeps weak answers away from your clients.',
    homeCard: 'A knowledge assistant can pass every task check and still answer from nothing. What to measure before it reaches your clients.',
    related: ['when-a-high-score-means-nothing', 'measure-before-you-ship', 'deterministic-orchestrator'],
    sections: [
      {
        id: 'exposure', h: 'The exposure', draft: true, blocks: [
          {
            ul: [
              'A tourism website published AI-generated content describing hot springs that do not exist, and visitors travelled to find them. The business lost credibility in a single news cycle. Hallucinations are not a theoretical problem; they are preventable with evaluation before publication.',
              'Assistants answering from documents (legal, research, policy) are trusted because they sound right. A confident wrong answer in a client deliverable is a reputational and regulatory event.',
              'Early “paste the documents into an LLM” pilots are fast and become liabilities for exactly this reason.',
            ],
          },
        ],
      },
      {
        id: 'shortfalls', h: 'Where standard controls fall short', draft: true, blocks: [
          {
            table: {
              head: ['Practice', 'What it hides', 'Consequence'],
              rows: [
                ['Task-completion checks only', 'An out-of-scope question answered fluently with zero retrieval scored 5/6', 'Ungrounded answer passes'],
                ['Same model writes and grades', 'Self-assessment bias', 'Inflated quality scores'],
                ['No scope guard', 'Assistant answers questions outside its knowledge base', 'Wrong domain, confident tone'],
                ['No citation requirement', 'Claims cannot be traced', 'Reviewers cannot verify'],
                ['All answers treated equally', 'Low-confidence answers reach clients', 'No safety valve'],
              ],
            },
          },
        ],
      },
      {
        id: 'recommend', h: 'What we recommend', draft: true, blocks: [
          {
            ol: [
              'Scope guard that returns “out of scope” before any retrieval.',
              'Answer-only-from-context contract: say “I don’t know” when the documents don’t support an answer.',
              'Independent judge model scoring groundedness and citation precision against a gold set.',
              'Confidence-routed outputs: low confidence goes to a person, never silently to a client.',
              'Prompt improvement driven by failure feedback and validated on held-out questions.',
              'Groundedness and relevance tracked over time; drift triggers review.',
            ],
          },
        ],
      },
    ],
    recommendation: 'Ask for two numbers before you trust an assistant: how often it answers from the documents, and how often it says it doesn’t know when it should. If nobody can give you those, it has not been evaluated.',
  },

  {
    slug: 'fairness-is-a-test',
    title: 'Fairness is a test, not a policy',
    category: 'Responsible AI',
    mins: 5,
    forWho: 'HR and talent leaders, compliance, CTOs',
    engagements: ['AI Reliability Audit', 'Transform'],
    lede: 'If an automated screening decision moves when only the candidate’s name changes, you have a regulatory exposure, whatever your policy says. The matched-pair tests, abstain rules and audit trail we recommend before any such system goes live.',
    card: 'If an automated screening decision moves when only the candidate’s name changes, you have a regulatory exposure, whatever your policy says. The matched-pair tests, abstain rules and audit trail we recommend before any such system goes live.',
    related: ['guardrails-in-the-architecture', 'measure-before-you-ship', 'refunds-agent'],
    sections: [
      {
        id: 'exposure', h: 'The exposure', draft: true, blocks: [
          { ul: ['AI screening (resumes, applications, claims) risks bias, opacity and false confidence; regulators and candidates increasingly ask for evidence, not policy.'] },
        ],
      },
      {
        id: 'shortfalls', h: 'Where standard controls fall short', draft: true, blocks: [
          {
            table: {
              head: ['Practice', 'What it hides', 'Consequence'],
              rows: [
                ['A written fairness policy', 'Says nothing about behaviour', 'No evidence'],
                ['Removing obvious sensitive fields', 'Proxies (address, school, gaps) carry the signal', 'Bias persists'],
                ['Single-pass scoring', 'Unstable scores presented as decisions', 'Inconsistent outcomes'],
                ['No injection check on documents', 'Text hidden in a resume influences the score', 'Manipulation'],
                ['No audit log', 'Decisions cannot be explained after the fact', 'Regulatory risk'],
              ],
            },
          },
        ],
      },
      {
        id: 'recommend', h: 'What we recommend', draft: true, blocks: [
          {
            ol: [
              'Injection scrubbing and PII redaction before scoring.',
              'Scores built from weighted, explained components, not a single opaque number.',
              'Repeated scoring with abstain-on-uncertainty when runs disagree.',
              'Matched-pair probes: name swaps and proxy flips must not move the decision.',
              'Group fairness snapshot across the applicant pool.',
              'Compact per-decision audit log with the explanation.',
            ],
          },
        ],
      },
    ],
    recommendation: 'Run the name-swap test before launch and again every time the model or prompt changes. It takes an afternoon and it is the question a regulator will ask first.',
  },

  {
    slug: 'build-on-real-data',
    title: 'Why we build on your real data from week one',
    category: 'Method',
    mins: 4,
    forWho: 'anyone sponsoring an AI build',
    engagements: ['Agent MVP', 'How we work'],
    lede: 'An agent that commits to a plan up front breaks the moment reality differs from the plan. One that checks each result and adjusts keeps going. The same is true of projects, which is why we never build on sample data.',
    card: 'An agent that commits to a plan up front breaks the moment reality differs from the plan. One that checks each result and adjusts keeps going. The same is true of projects, which is why we never build on sample data.',
    related: ['measure-before-you-ship', 'decisions-not-reasoning', 'when-a-high-score-means-nothing'],
    sections: [
      {
        id: 'exposure', h: 'The exposure', draft: true, blocks: [
          { ul: ['Plans and prototypes built on clean sample data meet real data late, when changing course is expensive.'] },
        ],
      },
      {
        id: 'shortfalls', h: 'Where standard controls fall short', draft: true, blocks: [
          {
            ul: [
              'Plan-and-execute agents: predict every step, execute blindly, collapse on the first ambiguity (e.g. two contacts with the same name).',
              'Projects run the same way: a detailed plan, a demo on sample data, a surprise in week eight.',
            ],
          },
        ],
      },
      {
        id: 'recommend', h: 'What we recommend', draft: true, blocks: [
          {
            ol: [
              'Adaptive loop: observe the result of each step and reconsider before the next.',
              'Real data from the first sprint, under NDA and inside the client’s environment.',
              'Define success before building, so “adjusting” has a target.',
              'Short cycles with a measured checkpoint at each.',
            ],
          },
        ],
      },
    ],
    recommendation: 'If a vendor’s plan has no point at which it expects to be wrong, be cautious. Ours does, and it is in week one.',
  },

  {
    slug: 'when-a-high-score-means-nothing',
    title: 'When a high score means nothing',
    category: 'Evaluation',
    mins: 6,
    forWho: 'CTOs, heads of engineering, anyone making product or investment decisions on eval numbers',
    engagements: ['AI Reliability Audit', 'Managed AI Operations'],
    lede: 'An agent can score highly because it did the task, or because it found a way to score highly without doing it. From the number alone you cannot tell which. Why eval integrity is both a quality problem and a security problem, and how we isolate the harness from the agent.',
    card: 'An agent can score highly because it did the task, or because it found a way to score highly without doing it. From the number alone you cannot tell which. Why eval integrity is both a quality problem and a security problem, and how we isolate the harness from the agent.',
    related: ['measure-before-you-ship', 'grounded-answers', 'guardrails-in-the-architecture'],
    sections: [
      {
        id: 'exposure', h: 'The exposure', draft: true, blocks: [
          {
            ul: [
              'Reward hacking: an agent finds a shortcut to the grade rather than the goal. Documented example: a frontier model asked to extract records from a large log file located a metadata folder it had not been pointed to, found the exact answer the grader would check against, copied it, and described the shortcut as a smart use of indexing.',
              'The task was “completed” and nothing was learned; the next log file without a metadata folder would fail.',
              'Decisions made on that score (ship, invest, scale) rest on a number that may not mean what it appears to.',
            ],
          },
        ],
      },
      {
        id: 'shortfalls', h: 'Where standard controls fall short', draft: true, blocks: [
          {
            table: {
              head: ['Practice', 'What it hides', 'Consequence'],
              rows: [
                ['Trusting the aggregate score', 'Whether the task was actually performed', 'False confidence'],
                ['Eval harness reachable by the agent (grader files, gold answers, internal metadata)', 'The agent reads the answer key', 'Scores inflated, behaviour unmeasured'],
                ['No review of traces, only of scores', 'The shortcut is invisible', 'Systematic gaming goes unnoticed'],
                ['Same tool access in test and production', 'The exploration pattern that found the grader will probe customer data and code in production', 'Security exposure, not just a quality one'],
              ],
            },
          },
        ],
      },
      {
        id: 'recommend', h: 'What we recommend', draft: true, blocks: [
          {
            ol: [
              'Isolate the evaluation harness: the agent under test must have no path to grader files, gold labels or harness configuration. Treat this as an access-control boundary, not a convention.',
              'Review traces, not just scores: sample runs and check how the result was reached. Flag any access outside the task’s declared scope.',
              'Score task performance separately from outcome match, so “arrived at the right answer by the wrong route” is visible.',
              'Vary held-out cases so a memorised or located answer cannot pass.',
              'Treat eval-time exploration as a security signal: an agent that looks for evaluator-adjacent files in testing gets least-privilege scoping before it goes anywhere near production data.',
              'Re-run under Managed AI Operations whenever models or prompts change; gaming behaviour changes with the model.',
            ],
          },
        ],
      },
    ],
    recommendation: 'Before you act on an eval number, ask two questions: could the agent have reached the grader, and has anyone read the traces? If either answer is no or unknown, the number is not yet evidence.',
  },

  {
    slug: 'decisions-not-reasoning',
    title: 'Most of your agent’s model calls are decisions, not reasoning',
    category: 'Cost & architecture',
    mins: 7,
    forWho: 'CTOs, heads of engineering, finance leads watching AI spend',
    engagements: ['AI Opportunity Sprint', 'Agent MVP', 'Managed AI Operations'],
    lede: 'In a typical agent loop, the large majority of model calls decide something (route this, is that tool call safe, how urgent is this ticket, did this output pass) rather than reason about it. Most teams pay frontier-model prices for all of them. How to separate the two, cut cost and latency, and keep control flow where it belongs.',
    card: 'In a typical agent loop, the large majority of model calls decide something (route this, is that tool call safe, how urgent is this ticket, did this output pass) rather than reason about it. Most teams pay frontier-model prices for all of them. How to separate the two, cut cost and latency, and keep control flow where it belongs.',
    related: ['deterministic-orchestrator', 'measure-before-you-ship', 'build-on-real-data'],
    sections: [
      {
        id: 'exposure', h: 'The exposure', draft: true, blocks: [
          {
            ul: [
              'Agent loops make two kinds of calls: reasoning calls (understand context, plan, write a response) and decision calls (route, classify, check, pass/fail). Practitioner estimates put decision calls at the large majority of volume.',
              'Almost all are served by a frontier model at frontier prices, multiplied by every iteration the agent runs. Cost compounds; latency does too.',
              'Cheaper, faster classification models (small models, fine-tuned classifiers, and newer calibrated decision models such as TypeSafe’s Jev, one example among several) can take the decision calls, but only if the architecture is set up to use them safely.',
            ],
          },
        ],
      },
      {
        id: 'shortfalls', h: 'Where standard controls fall short', draft: true, blocks: [
          {
            table: {
              head: ['Practice', 'Problem', 'Consequence'],
              rows: [
                ['One frontier model for every call', 'Paying reasoning prices for yes/no decisions', 'Cost and latency scale with every loop iteration'],
                ['Bundled questions (“is this ticket a good automation candidate?”)', 'The model judges a bundle of three checks as one and returns a plausible but low-confidence score', 'Weighting hidden in the prompt rather than in code'],
                ['One confidence threshold for every action', 'A read-only lookup and an automated refund treated the same', 'Either too timid or too dangerous'],
                ['Routing accuracy never measured', 'Misrouting rarely throws an error, it just produces a worse result', 'Drift goes unnoticed'],
                ['Classifier as the approver', 'Text in context can sway a probability', 'A manipulated classification becomes an executed action'],
              ],
            },
          },
        ],
      },
      {
        id: 'recommend', h: 'What we recommend', draft: true, blocks: [
          {
            ol: [
              'Audit your traces: count reasoning calls versus structured decisions. The split tells you how much cost is movable.',
              'Route the four decision-heavy places (routing, pre-execution guardrails, output evaluation, triage classification) to a cheap calibrated classifier, with fallback to the frontier model when confidence is low. A wrong decision on the cheap side compounds; an extra frontier call costs cents.',
              'Keep permission checks in code. The classifier recommends; the code decides. Nothing can talk an if-statement out of its answer.',
              'Ask single questions and combine the results in code, where the weighting is visible and A/B-testable.',
              'Match the confidence threshold to the cost of a mistake: a lookup can act at 0.5, an automated refund might need 0.9, below which it goes to a person or a heavier model.',
              'Measure routing accuracy against a hand-labelled set, continuously; it is classification, and classifiers drift.',
              'Treat classifier input as untrusted: these models run alongside existing security checks, never instead of them.',
            ],
          },
        ],
      },
    ],
    recommendation: 'Audit one week of agent traces. If more than half the calls are decisions, you are overpaying for them and probably under-measuring them. The fix is architectural, takes a few weeks, and usually pays for itself within a quarter.',
  },
];

export const bySlug = Object.fromEntries(notes.map((n) => [n.slug, n]));
