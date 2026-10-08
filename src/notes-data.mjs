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
  'Transform': { href: '/#services', blurb: 'AI readiness, governance and release practice, for teams that need risk and compliance to sign off.' },
  'How we work': { href: '/#approach', blurb: 'Agree what good looks like, build on real data, test it properly, then hand over.' },
};

export const notes = [
  {
    slug: 'refunds-agent',
    title: 'If your agent can issue refunds, a content filter is not protecting you',
    cardTitle: 'If your agent can issue refunds, a content filter is not protecting you',
    category: 'Security & guardrails',
    mins: 8,
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
          { p: 'A chatbot that says the wrong thing produces a bad sentence. An agent that is manipulated into the wrong action produces a refund, a redirected parcel or a disclosed customer record, and the liability for that sits with you rather than with the model vendor.' },
          { p: 'The controls most teams ship with are designed for an ordinary user who may be rude or careless. They are not designed for a motivated person who has read the defences and is working around them, and that is the person who extracts money. The practical question for your business is whether anyone can make this agent take an action it should not. Whether the filter catches bad text is a different question.' },
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
                ['Injection without keywords', 'The same instruction-hijack as the textbook attack, phrased so nothing on the block list appears. The agent follows it.', 'The classifier matches on wording rather than intent.'],
                ['Multi-turn setup', 'Four ordinary messages. A false premise is established in the third and acted on in the fourth: a profile change the agent had no way to verify.', 'Per-message checks cannot see a sequence.'],
                ['Tampered policy document', 'Six characters changed in the knowledge base: $250 became $2,500. The agent’s self-service authority increased tenfold, and it quoted the new limit with full confidence.', 'Not an injection and not visibly wrong. A human review skims past it.'],
                ['Acting on someone else’s account', 'A customer requested a refund on another customer’s $1,899 order and received it.', 'The agent had no concept of who was asking. Nothing to check ownership against.'],
                ['Refund splitting', 'Three refunds of $160, $150 and $140, each with a plausible reason, on an order worth $612 that had already been partly refunded. Total paid out exceeded the order value.', 'The per-transaction cap was satisfied every time. It limits the wrong thing.'],
                ['Two routine actions, one fraud', 'An address change followed by a refund on the same order in one session. Individually routine; together, the delivery-interception pattern your own policy probably warns about.', 'Per-action checks see one action at a time. The risk only exists across two.'],
              ],
            },
          },
          { p: 'The pattern matters more than any single row. The standard controls stopped the one attack that looked like an attack and missed the six that look like ordinary traffic. If your current protection is a filter and a cap, assume the lower five rows apply to you.' },
        ],
      },
      {
        id: 'recommend', h: 'What we recommend', blocks: [
          { p: 'Put authorisation in the architecture rather than in the prompt. The model can propose an action, but what is permitted is decided in code. In practice that is seven controls, in order of dependency. Most teams can implement the first two in days, and they close the most expensive scenarios.' },
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
          { p: 'The most expensive scenario, acting on someone else’s account, was closed by a single ownership check: does this record belong to the customer in this session? That check involves no classifier, threshold or prompt, so it has no false-negative rate. In our experience the most effective controls on agents are usually this plain.' },
        ],
      },
    ],
    recommendation: 'Before the next release, ask three questions of every tool your agent can call: who is calling, what are they entitled to, and what has already happened in this session? If any of those answers lives in a prompt, you have a request rather than a control. Keep the filters as defence in depth and move authorisation into the architecture. A two-week audit is enough to find out which of the six scenarios apply to you and what closing them would take.',
  },

  {
    slug: 'measure-before-you-ship',
    title: 'Before you ship that agent “improvement”, measure it in layers',
    category: 'Evaluation',
    mins: 7,
    forWho: 'CTOs, heads of engineering, product leads',
    engagements: ['AI Reliability Audit', 'Managed AI Operations'],
    lede: 'An upgrade to a triage agent improved its decisions and also made it slower and less consistent. One accuracy number would have hidden both. How to set up a golden set and layered metrics so your team sees the trade-off before customers do.',
    card: "An upgrade to a triage agent improved its decisions and also made it slower and less consistent. One accuracy number would have hidden both. How to set up a golden set and layered metrics so your team sees the trade-off before customers do.",
    homeCard: 'An upgrade that improved decisions and also made the agent slower and less consistent. One accuracy number would have hidden both.',
    related: ['when-a-high-score-means-nothing', 'guardrails-in-the-architecture', 'build-on-real-data'],
    sections: [
      {
        id: 'exposure', h: "The exposure", blocks: [
          { p: "Support triage has to be fast, consistent and auditable. A single-pass triage agent tends to fail in three places: tickets that fit no category, the wrong tool chosen for the job, and the right tool called with badly formed arguments." },
          { p: "When a team changes the agent, it usually checks one headline accuracy figure or reads through a few examples. That shows whether the agent got better at its main job, and very little about what happened to speed and consistency along the way." },
        ],
      },
      {
        id: 'shortfalls', h: "Where standard controls fall short", blocks: [
          { p: "These are the habits we see most often when teams evaluate a change to an agent." },
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
          { p: "In our reference build, adding planning and self-correction made tool choice and argument quality markedly better. It also cut step efficiency by roughly two-thirds and slightly reduced completion. A single accuracy figure would have shown the improvement and missed the other two effects." },
        ],
      },
      {
        id: 'recommend', h: "What we recommend", blocks: [
          { p: "We recommend six steps, and the first one happens before anyone touches the agent." },
          {
            ol: [
              ["Freeze a golden set.", "Collect real tickets, agree the correct outcome for each, and fix the set before any change is made."],
              ["Score in layers rather than with one number.", "For an agentic workflow, a practical set is: prompts and instructions (does the model follow the constraints it was given?), planning and reasoning (is the plan sound, and are the right tools chosen?), actions (tool-call success, retries, latency, error handling), context and retrieval (quality of retrieved information, grounding, citation accuracy) and outcomes (task completion, factuality, safety checks, user satisfaction)."],
              "Tie each layer to a business measure, such as routing accuracy, escalation quality, operational efficiency or decision consistency, so that leadership reads the same report as engineering.",
              "Run the suite several times and report the mean and the spread. Treat a small difference as noise until it shows up again.",
              "If the planning layer produces nothing to score, record that as a gap rather than reading the empty result as a perfect score.",
              "Re-run the suite whenever a prompt, model or tool changes. Managed AI Operations does this every month.",
            ],
          },
        ],
      },
    ],
    recommendation: "If your team can’t show what the last change did at each layer, you are shipping without evidence. A golden set and a layered scorecard take one to two weeks to set up, and they pay for themselves on the first regression they catch.",
  },

  {
    slug: 'guardrails-in-the-architecture',
    title: 'Guardrails are topology, not prompts',
    category: 'Security & guardrails',
    mins: 8,
    forWho: 'CTOs, heads of product, trust & safety, legal',
    engagements: ['AI Reliability Audit', 'Agent MVP'],
    lede: 'A safety rule in the system prompt is a request, and the model can ignore it. A check built into the workflow cannot be skipped. What a guardrail architecture looks like, and the failure policy each check needs before launch.',
    card: 'A safety rule in the system prompt is a request, and the model can ignore it. A check built into the workflow cannot be skipped. What a guardrail architecture looks like, and the failure policy each check needs before launch.',
    homeCard: '',
    related: ['refunds-agent', 'deterministic-orchestrator', 'fairness-is-a-test'],
    sections: [
      {
        id: 'exposure', h: "The exposure", blocks: [
          { p: "A returns-and-refunds agent takes actions, so its mistakes cost something: a refund paid in error, a customer record disclosed, two customers treated differently for no good reason. Trust & Safety and Legal will want to review it before launch, and they will ask what prevents each of those." },
          { p: "The safety training that model vendors build in catches some attacks, but not reliably. You can’t configure it, and you can’t test how it will behave after the next model update, so it can’t be the control you show a reviewer." },
        ],
      },
      {
        id: 'shortfalls', h: "Where standard controls fall short", blocks: [
          { p: "Each scenario below gets past safety rules written into the prompt, because the attack arrives through the same channel as the instructions." },
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
        id: 'recommend', h: "What we recommend", blocks: [
          { p: "We recommend building guardrails as steps in the workflow that every request has to pass through, rather than as instructions to the model. A step the agent has no way around holds up in review in a way that a line in the prompt does not." },
          {
            ol: [
              "Input checks run in a fixed order before the agent sees the message: PII redaction (redact and continue), injection classifier (fail closed), toxicity (route to a person), topic (fail open and log).",
              "An output check the agent cannot skip. Its only path to the customer runs through that check.",
              "The refund cap is enforced inside the tool, on the server, and not in the prompt.",
              "Models score the risk; deterministic code makes and enforces the decision.",
              "Every check has a written failure policy, stating what happens on an error or a trigger, agreed with Trust & Safety before launch.",
              "Fairness is tested as behaviour: identical claims with different customer names must produce identical decisions.",
              "A decision trace records which check made which call, so any outcome can be reconstructed.",
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
        id: 'exposure', h: "The exposure", blocks: [
          { p: "Reviewing claims and their documents by hand is slow, costly and inconsistent. Fixed rules are faster but break as soon as a case doesn’t fit them, and most claims arrive with partial evidence: a document missing, a figure that doesn’t match, no obvious answer." },
          { p: "A multi-agent design is the usual next step. Often it turns out to be three model calls running in parallel, with no defined roles, no agreement on what evidence each one must produce, and no record of how the final decision was reached. That is hard to defend once money has been paid out on the result." },
        ],
      },
      {
        id: 'shortfalls', h: "Where standard controls fall short", blocks: [
          { p: "These are common in first multi-agent builds, and each one leaves a question an auditor will ask." },
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
        id: 'recommend', h: "What we recommend", blocks: [
          { p: "We recommend giving each component a single job, making the evidence explicit, and keeping the decision about what runs next in code." },
          {
            ol: [
              "Specialist workers with explicit responsibilities and an output contract (a risk signal plus evidence-backed notes), each with stated limits, for example “never infer risk from frequency alone”.",
              "Tools reached through a standard protocol boundary (MCP), so data access is governed and logged.",
              "A critic that compares the findings, flags contradictions and evidence gaps, and may request exactly one retry.",
              "A deterministic orchestrator, written as code rather than run by a model, that dispatches the work, enforces retry caps and applies the verdict.",
              "A quorum rule: if the evidence is insufficient, the claim falls back to a denial or to human review, never to an approval.",
              "An append-only audit trail for each claim, readable by compliance.",
              "A human review branch for high-value or contested decisions.",
            ],
          },
        ],
      },
    ],
    recommendation: 'If the thing deciding which agent runs next is itself a model, you cannot promise your auditor a repeatable process. Write the orchestrator as ordinary code.',
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
        id: 'exposure', h: "The exposure", blocks: [
          { p: "A tourism website published AI-generated descriptions of hot springs that do not exist, and visitors travelled to look for them. The business lost its credibility in a single news cycle. A proper evaluation before publication would have caught the problem." },
          { p: "Assistants that answer from legal, research or policy documents are trusted because they sound authoritative. A confident wrong answer in a client deliverable damages your reputation and, in regulated work, can become a compliance matter. The quick pilots that paste documents into a model are fast to build, and they are where this tends to happen." },
        ],
      },
      {
        id: 'shortfalls', h: "Where standard controls fall short", blocks: [
          { p: "One assistant we tested answered an out-of-scope question fluently, without retrieving anything, and its task checks still scored it highly. These are the gaps that let that through." },
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
        id: 'recommend', h: "What we recommend", blocks: [
          { p: "Groundedness has to be measured on its own, by a judge that didn’t write the answer, with somewhere to send the answers that fall short." },
          {
            ol: [
              "A scope guard that returns “out of scope” before any retrieval runs.",
              "An answer-only-from-context rule: when the documents don’t support an answer, the assistant says it doesn’t know.",
              "An independent judge model that scores groundedness and citation precision against a gold set.",
              "Confidence-based routing, so that low-confidence answers go to a person and never reach a client unchecked.",
              "Prompt changes driven by failure feedback and validated on held-out questions.",
              "Groundedness and relevance tracked over time, with any drift triggering a review.",
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
        id: 'exposure', h: "The exposure", blocks: [
          { p: "Automated screening of CVs, applications or claims can be biased, hard to explain and more confident than it should be. A written policy addresses none of that, and regulators and candidates increasingly ask for evidence of how the system actually behaves." },
        ],
      },
      {
        id: 'shortfalls', h: "Where standard controls fall short", blocks: [
          { p: "Most teams have some of the following in place. None of it produces evidence about how the system behaves." },
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
        id: 'recommend', h: "What we recommend", blocks: [
          { p: "We recommend testing fairness the way you would test any other behaviour, with controlled inputs and recorded outputs." },
          {
            ol: [
              "Injection scrubbing and PII redaction before anything is scored.",
              "Scores built from weighted components, each with an explanation, rather than a single opaque number.",
              "Repeated scoring, with the system abstaining when the runs disagree.",
              "Matched-pair probes: swapping a name or flipping a proxy must not move the decision.",
              "A group fairness snapshot across the applicant pool.",
              "A compact audit log for each decision, including its explanation.",
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
    ctaTitle: "Planning an AI build?",
    ctaText: "A 30-minute working session is usually enough to scope the first sprint.",
    sections: [
      {
        id: 'exposure', h: "The exposure", blocks: [
          { p: "Plans and prototypes built on clean sample data meet real data late in the project, when changing direction is expensive. The edge cases that matter were never in the sample." },
        ],
      },
      {
        id: 'shortfalls', h: "Where the usual plan fails", blocks: [
          { p: "A plan-and-execute agent predicts every step at the start and carries them out without checking the results. It breaks on the first ambiguity, such as two contacts with the same name." },
          { p: "Projects often run the same way: a detailed plan, a demo on sample data, and a surprise in week eight." },
        ],
      },
      {
        id: 'recommend', h: "What we recommend", blocks: [
          { p: "The fix is the same for the agent and for the project." },
          {
            ol: [
              "An adaptive loop: observe the result of each step and reconsider before taking the next one.",
              "Real data from the first sprint, under NDA and inside your environment.",
              "A definition of success agreed before building starts, so that adjusting course has a target.",
              "Short cycles, each ending in a measured checkpoint.",
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
        id: 'exposure', h: "The exposure", blocks: [
          { p: "The second case, scoring without doing the task, is known as reward hacking. In one documented example, a frontier model asked to extract records from a large log file found a metadata folder it had not been pointed to, located the exact answer the grader would check against, copied it, and described what it had done as a smart use of indexing." },
          { p: "The task was recorded as complete, yet nothing had been learned, and the next log file without a metadata folder would have failed. A decision to ship, invest or scale on a score like that rests on a number that doesn’t measure what it appears to." },
        ],
      },
      {
        id: 'shortfalls', h: "Where standard controls fall short", blocks: [
          { p: "These habits make a gamed score look the same as an earned one." },
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
        id: 'recommend', h: "What we recommend", blocks: [
          { p: "We treat the evaluation harness as part of the attack surface, since an agent under test can find its way to it." },
          {
            ol: [
              "Isolate the evaluation harness. The agent under test must have no path to grader files, gold labels or harness configuration, and this should be enforced as an access-control boundary rather than left as a convention.",
              "Review traces as well as scores. Sample runs, check how each result was reached, and flag any access outside the task’s declared scope.",
              "Score task performance separately from outcome match, so that a right answer reached by the wrong route is visible.",
              "Vary the held-out cases, so that a memorised or located answer cannot pass.",
              "Treat exploration during evaluation as a security signal. An agent that goes looking for evaluator files in testing gets least-privilege scoping before it goes anywhere near production data.",
              "Re-run under Managed AI Operations whenever models or prompts change, because gaming behaviour changes with the model.",
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
    ctaTitle: "Paying frontier prices for every call?",
    ctaText: "A 30-minute working session is usually enough to see how much of that cost can move.",
    sections: [
      {
        id: 'exposure', h: "The exposure", blocks: [
          { p: "An agent loop makes two kinds of model call. Reasoning calls work through context, plan and write a response. Decision calls route a request, classify a ticket, check whether a tool call is safe or decide whether an output passes. Practitioner estimates put decision calls at the large majority of the volume." },
          { p: "Most teams send nearly all of these calls to a frontier model at frontier prices, and the cost repeats on every iteration of the loop, as does the latency. Cheaper and faster classification models can handle the decision calls, including small models, fine-tuned classifiers and newer calibrated decision models such as TypeSafe’s Jev, one example among several. That only works safely if the architecture is designed for it." },
        ],
      },
      {
        id: 'shortfalls', h: "Where the usual setup falls short", blocks: [
          { p: "The practices below keep costs high and leave the decisions unmeasured." },
          {
            table: {
              head: ['Practice', 'Problem', 'Consequence'],
              rows: [
                ['One frontier model for every call', 'Paying reasoning prices for yes/no decisions', 'Cost and latency scale with every loop iteration'],
                ['Bundled questions (“is this ticket a good automation candidate?”)', 'The model judges a bundle of three checks as one and returns a plausible but low-confidence score', 'Weighting hidden in the prompt rather than in code'],
                ['One confidence threshold for every action', 'A read-only lookup and an automated refund treated the same', 'Either too timid or too dangerous'],
                ['Routing accuracy never measured', 'Misrouting rarely throws an error, just a worse result', 'Drift goes unnoticed'],
                ['Classifier as the approver', 'Text in context can sway a probability', 'A manipulated classification becomes an executed action'],
              ],
            },
          },
        ],
      },
      {
        id: 'recommend', h: "What we recommend", blocks: [
          { p: "We recommend separating the two kinds of call, routing them differently, and keeping the decisions that carry risk in code." },
          {
            ol: [
              "Audit your traces and count reasoning calls against structured decisions. The split tells you how much of the cost can move.",
              "Send the four decision-heavy points (routing, pre-execution guardrails, output evaluation, triage classification) to a cheap calibrated classifier, falling back to the frontier model when confidence is low. A wrong decision on the cheap side compounds, while an extra frontier call costs cents.",
              "Keep permission checks in code. The classifier recommends and the code decides, and no amount of persuasive text in the context will change what an if-statement returns.",
              "Ask single questions and combine the answers in code, where the weighting is visible and can be tested.",
              "Match the confidence threshold to the cost of a mistake. A lookup can act at 0.5; an automated refund might need 0.9, and anything below that goes to a person or a heavier model.",
              "Measure routing accuracy continuously against a hand-labelled set. Routing is classification, and classifiers drift.",
              "Treat the classifier’s input as untrusted. These models run alongside your existing security checks, never in place of them.",
            ],
          },
        ],
      },
    ],
    recommendation: 'Audit one week of agent traces. If more than half the calls are decisions, you are overpaying for them and probably under-measuring them. The fix is architectural, takes a few weeks, and usually pays for itself within a quarter.',
  },
];

export const bySlug = Object.fromEntries(notes.map((n) => [n.slug, n]));
