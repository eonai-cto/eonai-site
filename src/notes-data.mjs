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
        id: 'shortfalls', h: 'Six ways a filter and a cap lose money', blocks: [
          { p: 'In our reference build, on synthetic data, a support agent protected with the standard controls stopped the textbook injection and then failed six scenarios that read as normal customer traffic. Each one maps to a loss your finance or fraud team would recognise.' },
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
        id: 'recommend', h: 'Seven controls, in the order they depend on each other', blocks: [
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
    recommendation: 'Before the next release, ask three questions of every tool your agent can call: who is calling, what are they entitled to, and what has already happened in this session? If any of those answers lives in a prompt, you have a request rather than a control. Keep the filters as defence in depth and move authorisation into the architecture. An audit of two to three weeks is enough to find out which of the six scenarios apply to you and what closing them would take.',
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
    related: ['when-a-high-score-means-nothing', 'guardrails-in-the-architecture', 'decisions-not-reasoning'],
    sections: [
      {
        id: 'exposure', h: "Why one accuracy figure is not enough", blocks: [
          { p: "Support triage has to be fast and consistent, and every decision has to be explainable afterwards. A single-pass triage agent tends to fail in three places: tickets that fit no category, the wrong tool chosen for the job, and the right tool called with badly formed arguments." },
          { p: "When a team changes the agent, it usually checks one headline accuracy figure or reads through a few examples. That shows whether the agent got better at its main job. It shows very little about what happened to speed and consistency along the way." },
        ],
      },
      {
        id: 'shortfalls', h: "What teams usually check", blocks: [
          { p: "These are the habits we see most often when a team evaluates a change to an agent." },
          {
            table: {
              label: 'Common evaluation habits and what each one hides',
              head: ['What teams do', 'What it hides'],
              rows: [
                ['Report a single accuracy metric', 'The trade-off between decision quality and efficiency. A change can be better on hard cases and worse on cost and consistency, and the number goes up.'],
                ['Test with ad-hoc prompts that change each time', 'Regressions between versions. Two runs that used different prompts cannot be compared.'],
                ['Treat one run at temperature 0 as the truth', 'Run-to-run drift, in the agent and in the judge. Decisions get made on noise.'],
                ['Read planning metrics at face value', 'A perfect score that exists because there was no plan text to judge.'],
              ],
            },
          },
          { p: "In our reference build, adding planning and self-correction improved tool choice and argument quality, cut step efficiency by about two-thirds and slightly reduced completion. A single accuracy figure would have shown the improvement and missed the other two effects." },
        ],
      },
      {
        id: 'recommend', h: "Score in layers", blocks: [
          { p: "We score an agentic workflow in five layers, each with its own metric, so that a change which helps one layer and hurts another is visible as exactly that." },
          {
            table: {
              label: 'The five scoring layers',
              head: ['Layer', 'What it asks'],
              rows: [
                ['Instructions', 'Does the model follow the constraints it was given?'],
                ['Planning', 'Is the plan sound, and are the right tools chosen?'],
                ['Actions', 'Do tool calls succeed? How many retries, how much latency, how are errors handled?'],
                ['Context', 'Was the right information retrieved, and is the answer grounded in it with accurate citations?'],
                ['Outcomes', 'Was the task completed, is the result factual, did it pass the safety checks, and was the user satisfied?'],
              ],
            },
          },
          { p: "Six steps put that scorecard to work, and the first one happens before anyone touches the agent." },
          {
            ol: [
              ["Freeze a golden set.", "Collect real tickets, agree the correct outcome for each, and fix the set before any change is made."],
              ["Score every layer, every time.", "One number per layer, from the table above, on every run of the golden set."],
              ["Tie each layer to a business measure", "such as routing accuracy, escalation quality, operational efficiency or decision consistency, so that leadership reads the same report as engineering."],
              ["Run the suite several times", "and report the mean and the spread. Treat a small difference as noise until it shows up again."],
              ["Record an empty layer as a gap.", "If the planning layer produces nothing to score, that is a finding, not a perfect score."],
              ["Re-run the suite whenever a prompt, model or tool changes.", "A change that was never scored is a change nobody can explain later."],
            ],
          },
        ],
      },
    ],
    recommendation: "If your team can’t show what the last change did at each layer, you are shipping without evidence. A golden set and a layered scorecard take one to two weeks to set up, and they pay for themselves on the first regression they catch.",
  },

  {
    slug: 'guardrails-in-the-architecture',
    title: 'Put guardrails where the model cannot skip them',
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
        id: 'exposure', h: "What a reviewer will ask", blocks: [
          { p: "A returns-and-refunds agent takes actions, so its mistakes cost something: a refund paid in error, a customer record disclosed, two customers treated differently for no good reason. Trust & Safety and Legal will want to review it before launch, and they will ask what prevents each of those." },
          { p: "The safety training that model vendors build in catches some attacks, but not reliably. You can’t configure it, and you can’t test how it will behave after the next model update, so it can’t be the control you show a reviewer." },
        ],
      },
      {
        id: 'shortfalls', h: "Five ways a rule in the prompt fails", blocks: [
          { p: "Each scenario below gets past safety rules written into the prompt, because the attack arrives through the same channel as the instructions." },
          {
            table: {
              label: 'Scenarios that get past prompt-based safety',
              head: ['Scenario', 'What happens', 'Why the prompt does not stop it'],
              rows: [
                ['Direct prompt injection', 'The agent ignores its policy', 'The instruction and the attack arrive in the same channel'],
                ['A request to reveal personal data', 'A customer record is disclosed', 'The prompt says “don’t”, the attacker says “do”'],
                ['Indirect injection through tool output', 'The agent acts on text inside a record', 'Tool output is treated as trusted'],
                ['A frustrated legitimate customer', 'Wrongly refused or blocked', 'One toxicity threshold cannot tell angry from malicious'],
                ['An over-refund attempt', 'Money leaves', 'No cap is enforced where the action happens'],
              ],
            },
          },
        ],
      },
      {
        id: 'recommend', h: "Guardrails as steps in the workflow", blocks: [
          { p: "We build guardrails as steps in the workflow that every request has to pass through, rather than as instructions to the model. A step the agent has no way around holds up in review in a way that a line in the prompt does not." },
          {
            ol: [
              "Input checks run in a fixed order before the agent sees the message: PII redaction (redact and continue), injection classifier (fail closed), toxicity (route to a person), topic (fail open and log).",
              "An output check the agent cannot skip. Its only path to the customer runs through that check.",
              "The refund cap is enforced inside the tool, on the server, and not in the prompt.",
              "Models score the risk; deterministic code makes and enforces the decision.",
              "Every check has a written failure policy, stating what happens on an error or a trigger, agreed with Trust & Safety before launch.",
              "Fairness is checked in the same harness: identical claims with different customer names must produce identical decisions. The <a href=\"/notes/fairness-is-a-test/\">fairness note</a> covers how to build that test.",
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
        id: 'exposure', h: "Where claims review stands today", blocks: [
          { p: "Reviewing claims and their documents by hand is slow, expensive and inconsistent. Fixed rules are faster but break as soon as a case doesn’t fit them, and most claims arrive with partial evidence: a document missing, a figure that doesn’t match, no obvious answer." },
          { p: "A multi-agent design is the usual next step. Often it turns out to be three model calls running in parallel, with no defined roles, no agreement on what evidence each one must produce, and no record of how the final decision was reached. That is hard to defend once money has been paid out on the result." },
        ],
      },
      {
        id: 'shortfalls', h: "What first multi-agent builds get wrong", blocks: [
          { p: "These are common in first builds, and each one leaves a question an auditor will ask." },
          {
            table: {
              label: 'Common practices in first multi-agent builds',
              head: ['Practice', 'What it hides', 'What follows'],
              rows: [
                ['One model asked to “assess the claim”', 'There is no evidence trail', 'The decision cannot be defended'],
                ['Parallel calls with no critic', 'Contradictions between findings go unnoticed', 'Wrong approvals'],
                ['A model as the orchestrator', 'Retries and routing become unpredictable', 'Costs vary and the process cannot be replayed for an auditor'],
                ['No quorum rule', 'A missing result is read as “no objection”', 'Money paid out on no evidence'],
              ],
            },
          },
        ],
      },
      {
        id: 'example', h: "One claim, end to end", blocks: [
          { p: "A windscreen claim arrives. The invoice says 48,000, the claim form says 54,000, and the claim number in the document header does not match the one in the body. A document worker extracts the three figures and reports both mismatches as evidence, with no verdict attached. A policy worker confirms windscreen cover and reports the excess. A fraud worker finds a second claim on the same vehicle within ninety days and says so, with the record it found." },
          { p: "A critic compares the three reports, flags that the amount mismatch is unexplained, and requests one retry from the document worker with the invoice read again at higher resolution. The retry returns the same figures. The orchestrator, which is ordinary code, applies the quorum rule: an unexplained contradiction means no approval, so the claim goes to a human reviewer with the three reports and the critic’s note attached. Every step of that path is in the audit trail, and no model decided what ran next." },
        ],
      },
      {
        id: 'recommend', h: "Give each component one job", blocks: [
          { p: "We give each component a single job, make the evidence explicit, and keep the decision about what runs next in code." },
          {
            ol: [
              "Specialist workers with explicit responsibilities and an output contract (a risk signal plus evidence-backed notes), each with stated limits, for example “never infer risk from frequency alone”.",
              "Tools reached through one governed gateway, so that every data access is permitted explicitly and logged. We use the Model Context Protocol for this.",
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
        id: 'exposure', h: "A confident answer with nothing behind it", blocks: [
          { p: "In January 2026 a Tasmanian tour operator’s website carried an AI-written article about hot springs at Weldborough, a hamlet in the north-east of the state that has none. People booked flights and drove out to find them, and the local hotel spent weeks fielding calls before the article came down. Nobody had checked the text against a source before it went live." },
          { p: "That was a blog post, but the same failure sits inside knowledge assistants. Assistants that answer from legal, research or policy documents are trusted because they sound authoritative, and a confident wrong answer in a client deliverable damages your reputation. In regulated work it can become a compliance matter. The quick pilots that paste documents into a model are fast to build, and they are where this tends to happen." },
        ],
      },
      {
        id: 'shortfalls', h: "Why task checks let it through", blocks: [
          { p: "One assistant we tested answered an out-of-scope question fluently, without retrieving anything, and passed five of its six task checks. These are the gaps that let that through." },
          {
            table: {
              label: 'Gaps that let ungrounded answers through',
              head: ['Practice', 'What it hides'],
              rows: [
                ['Task-completion checks only', 'Whether the answer came from the documents at all'],
                ['The same model writes and grades', 'Self-assessment bias, so quality scores inflate'],
                ['No scope guard', 'Questions outside the knowledge base get confident answers'],
                ['No citation requirement', 'Nobody can trace a claim to its source'],
                ['Every answer treated the same', 'Low-confidence answers reach clients with no safety valve'],
              ],
            },
          },
        ],
      },
      {
        id: 'recommend', h: "Measure groundedness on its own", blocks: [
          { p: "Groundedness has to be measured on its own, by a judge that didn’t write the answer, with somewhere to send the answers that fall short." },
          {
            ol: [
              "A scope guard that returns “out of scope” before any retrieval runs.",
              "An answer-only-from-context rule: when the documents don’t support an answer, the assistant says it doesn’t know.",
              "An independent judge model that scores groundedness and citation precision against a gold set.",
              "Confidence-based routing, so that low-confidence answers go to a person and never reach a client unchecked.",
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
    title: 'Test fairness the way you test everything else',
    category: 'Responsible AI',
    mins: 5,
    forWho: 'HR and talent leaders, compliance, CTOs',
    engagements: ['AI Reliability Audit', 'Transform'],
    lede: 'If an automated screening decision moves when only the candidate’s name changes, you have a regulatory exposure, whatever your policy says. The matched-pair tests, abstain rules and audit trail we recommend before any such system goes live.',
    card: 'If an automated screening decision moves when only the candidate’s name changes, you have a regulatory exposure, whatever your policy says. The matched-pair tests, abstain rules and audit trail we recommend before any such system goes live.',
    related: ['guardrails-in-the-architecture', 'measure-before-you-ship', 'refunds-agent'],
    sections: [
      {
        id: 'exposure', h: "What a policy cannot show", blocks: [
          { p: "Automated screening of CVs, applications or claims can be biased, hard to explain and more confident than the evidence allows. A written policy addresses none of that. Under the EU AI Act, systems used in recruitment and in access to essential services such as credit and insurance are high-risk, and under GDPR a person can contest a decision made solely by automated means. Both ask for evidence of how the system behaves." },
        ],
      },
      {
        id: 'shortfalls', h: "What most teams have in place", blocks: [
          { p: "Most teams have some of the following. None of it produces evidence about behaviour." },
          {
            table: {
              label: 'Common fairness measures and what each one misses',
              head: ['Practice', 'What it misses'],
              rows: [
                ['A written fairness policy', 'It describes intent, so it says nothing about behaviour'],
                ['Removing the obvious sensitive fields', 'Proxies such as address, school and career gaps carry the same signal'],
                ['Scoring each candidate once', 'An unstable score is presented as a decision'],
                ['No injection check on documents', 'Text hidden in a CV can move the score'],
                ['No audit log', 'A decision cannot be explained after the fact'],
              ],
            },
          },
        ],
      },
      {
        id: 'recommend', h: "Six tests and controls", blocks: [
          { p: "We test fairness the way we test any other behaviour, with controlled inputs and recorded outputs." },
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
    recommendation: 'Run the name-swap test before launch and again every time the model or prompt changes. Building the harness takes a day or two, and it is the first thing a regulator will ask about.',
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
        id: 'exposure', h: "Two ways to get a high score", blocks: [
          { p: "The second case, scoring without doing the task, is known as reward hacking. The <a href=\"https://arxiv.org/abs/2605.02964\" target=\"_blank\" rel=\"noopener\">Reward Hacking Benchmark<span class=\"visually-hidden\"> (opens in a new tab)</span></a> records a clean example. A frontier model was asked to extract records from a large log file. It listed the task directory, found a metadata folder the task had never mentioned, and copied the precomputed answers it held into its output in two tool calls. The honest route was about eight tool calls of parsing and filtering." },
          { p: "The run was marked as passed. Nothing about the model’s ability to parse a log had been measured, and the next log file without a metadata folder would have failed. A decision to ship, invest or scale on a score like that rests on a number that doesn’t measure what it appears to." },
        ],
      },
      {
        id: 'shortfalls', h: "Habits that make a gamed score look earned", blocks: [
          {
            table: {
              label: 'Evaluation habits that hide gaming',
              head: ['Practice', 'What it hides'],
              rows: [
                ['Trusting the aggregate score', 'Whether the task was actually performed'],
                ['An evaluation harness the agent can reach (grader files, gold answers, internal metadata)', 'The agent reads the answer key'],
                ['Reviewing scores but not traces', 'The shortcut is invisible'],
                ['The same tool access in test and in production', 'The exploration that found the grader will probe customer data and code in production'],
              ],
            },
          },
        ],
      },
      {
        id: 'recommend', h: "Treat the harness as part of the attack surface", blocks: [
          { p: "We treat the evaluation harness as part of the attack surface, since an agent under test can find its way to it." },
          {
            ol: [
              "Isolate the evaluation harness. The agent under test must have no path to grader files, gold labels or harness configuration, and this should be enforced as an access-control boundary rather than left as a convention.",
              "Review traces as well as scores. Sample runs, check how each result was reached, and flag any access outside the task’s declared scope.",
              "Score task performance separately from outcome match, so that a right answer reached by the wrong route is visible.",
              "Vary the held-out cases, so that a memorised or located answer cannot pass.",
              "Treat exploration during evaluation as a security signal. An agent that goes looking for evaluator files in testing gets least-privilege scoping before it goes anywhere near production data.",
              "Re-run the evaluation whenever models or prompts change, because gaming behaviour changes with the model.",
            ],
          },
        ],
      },
    ],
    recommendation: 'A score is evidence only when the agent had no path to the grader and someone has read the traces. Until both are true, treat the number as a claim the agent made about itself.',
  },

  {
    slug: 'decisions-not-reasoning',
    title: 'Most of your agent’s model calls are decisions',
    category: 'Cost & architecture',
    mins: 7,
    forWho: 'CTOs, heads of engineering, finance leads watching AI spend',
    engagements: ['AI Opportunity Sprint', 'Agent MVP', 'Managed AI Operations'],
    lede: 'In a typical agent loop, most model calls decide something: route this, is that tool call safe, how urgent is this ticket, did this output pass. Only a minority reason through a problem, and most teams pay frontier-model prices for all of them. How to separate the two, cut cost and latency, and keep control flow in code.',
    card: 'In a typical agent loop, most model calls decide something: route this, is that tool call safe, how urgent is this ticket, did this output pass. Only a minority reason through a problem, and most teams pay frontier-model prices for all of them. How to separate the two, cut cost and latency, and keep control flow in code.',
    related: ['deterministic-orchestrator', 'measure-before-you-ship', 'when-a-high-score-means-nothing'],
    ctaTitle: "Paying frontier prices for every call?",
    ctaText: "A 30-minute working session is usually enough to see how much of that cost can move.",
    sections: [
      {
        id: 'exposure', h: "Two kinds of model call", blocks: [
          { p: "An agent loop makes two kinds of model call. Reasoning calls work through context, plan and write a response. Decision calls route a request, classify a ticket, check whether a tool call is safe or decide whether an output passes. In the agent loops we have built and audited, decision calls outnumber reasoning calls several times over." },
          { p: "Most teams send nearly all of these calls to a frontier model at frontier prices, and the cost repeats on every iteration of the loop, as does the latency. Cheaper and faster models can handle the decision calls: small language models, fine-tuned classifiers and, more recently, calibrated decision models built for exactly this. TypeSafe’s Jev is one, still in early access and benchmarked mainly by its vendor. Any of them only works safely if the architecture is designed for it." },
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
        id: 'recommend', h: "Separate the two kinds of call", blocks: [
          { p: "We separate the two kinds of call, route them differently, and keep the decisions that carry risk in code." },
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
    recommendation: 'Audit one week of agent traces. If more than half the calls are decisions, you are overpaying for them and probably under-measuring them. The fix is architectural and takes a few weeks.',
  },
];

// Reading time from the word count of everything on the page (200 words a minute, never under 2).
const text = (v) => Array.isArray(v) ? v.map(text).join(' ') : typeof v === 'string' ? v : v && typeof v === 'object' ? Object.values(v).map(text).join(' ') : '';
const words = (v) => text(v).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
for (const n of notes) n.mins = Math.max(2, Math.round(words([n.title, n.lede, n.sections, n.recommendation]) / 200));

export const bySlug = Object.fromEntries(notes.map((n) => [n.slug, n]));
