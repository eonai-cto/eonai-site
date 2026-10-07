# Engineering notes — outline content for the six remaining notes

Each note uses the same page template as `reference/note-refunds-agent.html` and the same
section order: **The exposure → Where standard controls fall short → What we recommend →
Our recommendation**, plus sidebar (In this note · Where this applies · Related notes · CTA)
and the provenance line.

Voice: advisory, written to the person accountable for the decision. No experiment narration,
no decimal metrics in headlines, no exclamation marks. Where this outline gives bullets rather
than prose, build the section with the bullets and add a visible "Draft — to be completed"
marker; the owner will finish the prose.

Provenance line on every note (verbatim):
"Findings are from EonAI's reference systems, built and tested on synthetic data. They describe patterns we see across clients' systems, not a client engagement."

---

## 1. `measure-before-you-ship` — Before you ship that agent "improvement", measure it in layers

- Category: Evaluation · 7 min read · For: CTOs, heads of engineering, product leads · Related engagement: AI Reliability Audit, Managed AI Operations
- Lede: An upgrade to a triage agent improved its decisions and quietly made it slower and less consistent. One accuracy number would have hidden both. How to set up a golden set and layered metrics so your team sees the trade-off before customers do.

**The exposure**
- Support triage must be fast, consistent and auditable; a single-pass agent fails in three ways: ambiguous tickets that fit no category, wrong tool choice, badly formed tool arguments.
- Teams typically judge an agent change by one headline accuracy figure, or by eyeballing a few examples.

**Where standard controls fall short** (table: What teams do · What it hides · Consequence)
- Single accuracy metric · trade-offs between decision quality and efficiency · ships a change that is better on hard cases and worse on cost and consistency
- Ad-hoc test prompts that change each time · regressions between versions · "improvements" that cannot be compared
- One run at temperature 0 treated as truth · run-to-run drift of both the agent and the judge · decisions made on noise
- Planning metrics read at face value · a perfect score because no plan text existed to judge · false confidence
- Evidence from our reference build: adding planning and self-correction raised tool choice and argument quality markedly, cut step efficiency by roughly two-thirds and slightly reduced completion. Report as direction and magnitude, not decimals.

**What we recommend**
1. Freeze a golden set of real tickets with agreed correct outcomes before any change.
2. Score in layers rather than with one number. A practical set for an agentic workflow: prompts and instructions (does the model follow the constraints set?), planning and reasoning (is the plan sound, are the right tools chosen?), actions (tool-call success, retries, latency, error handling), context and retrieval (quality of retrieved information, grounding, citation accuracy), outcomes (task completion, factuality, safety checks, user satisfaction).
3. Map each layer to a business KPI (routing accuracy, escalation quality, operational efficiency, decision consistency) so leadership reads the same report as engineering.
4. Run repeatedly and report mean and spread; treat small deltas as noise until they repeat.
5. Treat "no planning signal" as a gap, not a pass.
6. Re-run the suite on every prompt, model or tool change — this is what Managed AI Operations does monthly.

**Our recommendation**: If your team cannot show, per layer, what the last change did, you are shipping blind. A golden set and layered scorecard take one to two weeks to stand up and pay for themselves on the first regression they catch.

---

## 2. `guardrails-in-the-architecture` — Guardrails are topology, not prompts

- Category: Security & guardrails · 8 min · For: CTOs, heads of product, trust & safety, legal · Related: AI Reliability Audit, Agent MVP
- Lede: Safety that lives in a system prompt is a request. Safety that lives in the workflow the agent cannot bypass is a guarantee. What a guardrail architecture looks like, and the failure policy each check needs before launch.

**The exposure**
- A returns-and-refunds agent that acts has consequential failures: wrong refund, leaked record, biased decision. Trust & Safety and Legal will ask for a review before launch.
- Model vendors' built-in safety training catches some attacks some of the time; it is not controllable and cannot be relied on.

**Where standard controls fall short** (table: Scenario · Exposure · Why prompt-based safety misses it)
- Direct prompt injection · agent ignores policy · the instruction is in the same channel as the attack
- PII exfiltration request · customer record disclosed · prompt says "don't", attacker says "do"
- Indirect injection via tool output · agent acts on text inside a record · tool output treated as trusted
- Frustrated legitimate customer · wrongly refused or blocked · a single toxicity threshold cannot tell angry from malicious
- Over-refund attempt · money out · no cap enforced where the action happens

**What we recommend** — guardrails as workflow nodes the agent cannot bypass
1. Input checks run in order before the agent: PII redaction (redact and continue), injection classifier (fail closed), toxicity (route to a person), topic (fail open and log).
2. Output check the agent cannot skip: the agent has no path to the customer except through it.
3. Refund cap enforced inside the tool on the server, not in the prompt.
4. Principle: neural components score, symbolic components decide and enforce.
5. Every check has a written failure policy (what happens on error or trigger) agreed with Trust & Safety before launch.
6. Fairness tested as behaviour: identical claims with different customer names must produce identical decisions.
7. A decision trace that reconstructs which check made which call.

**Our recommendation**: Ask your team to show you the workflow diagram and point to the node that stops a bad output reaching a customer. If the answer is "the prompt", you do not yet have a guardrail.

---

## 3. `deterministic-orchestrator` — When money is involved, keep the orchestrator deterministic

- Category: Multi-agent systems · 8 min · For: CTOs, heads of operations, claims/finance leaders · Related: Agent MVP, AI Opportunity Sprint
- Lede: How to structure a multi-agent review so every agent shows its evidence, a critic catches contradictions, insufficient evidence never becomes an approval, and your auditors get a complete trail. Illustrated with insurance claims.

**The exposure**
- Claim and document review is costly and inconsistent when manual, brittle when done by fixed rules; partial evidence is common.
- "Multi-agent" is often three parallel LLM calls with no role boundaries, no evidence contract and no way to explain a decision.

**Where standard controls fall short** (table)
- One LLM asked to "assess the claim" · no evidence trail · decision cannot be defended
- Parallel calls with no critic · contradictions between findings go unnoticed · wrong approvals
- LLM as orchestrator · retries and routing become unpredictable · cost and audit problems
- No quorum rule · a missing worker result becomes an implicit approval · money out on no evidence
- Document inconsistencies (header vs body claim ID, invoice amount vs claim amount) · missed unless a worker is tasked with them · fraud passes

**What we recommend**
1. Specialist workers with explicit responsibilities and output contracts ("risk signal + evidence-backed notes"), each with stated limits (e.g. "never infer risk from frequency alone").
2. Tools accessed through a standard protocol boundary (MCP) so data access is governed and logged.
3. A critic that compares findings, flags contradictions and evidence gaps, and may request exactly one retry.
4. A deterministic orchestrator (code, not a model) that dispatches, enforces retry caps and applies the verdict.
5. A quorum rule: insufficient evidence falls back to deny or to human review, never to approve.
6. An append-only audit trail per claim, readable by compliance.
7. Human review branch for high-value or contested decisions.

**Our recommendation**: If the thing deciding which agent runs next is itself a model, you cannot promise your auditor a repeatable process. Keep the orchestrator boring.

---

## 4. `grounded-answers` — A fluent answer is not a grounded answer

- Category: Knowledge assistants · 6 min · For: CTOs, heads of research/knowledge, compliance · Related: AI Reliability Audit, Agent MVP
- Lede: A knowledge assistant can pass every task check and still answer from nothing. Why groundedness needs its own measure, why the judge must be independent of the writer, and how confidence routing keeps weak answers away from your clients.

**The exposure**
- Open with a real incident: a tourism website published AI-generated content describing hot springs that do not exist, and visitors travelled to find them. The business lost credibility in a single news cycle. Hallucinations are not a theoretical problem; they are preventable with evaluation before publication.
- Assistants answering from documents (legal, research, policy) are trusted because they sound right. A confident wrong answer in a client deliverable is a reputational and regulatory event.
- Early "paste the documents into an LLM" pilots are fast and become liabilities for exactly this reason.

**Where standard controls fall short** (table)
- Task-completion checks only · an out-of-scope question answered fluently with zero retrieval scored 5/6 · ungrounded answer passes
- Same model writes and grades · self-assessment bias · inflated quality scores
- No scope guard · assistant answers questions outside its knowledge base · wrong domain, confident tone
- No citation requirement · claims cannot be traced · reviewers cannot verify
- All answers treated equally · low-confidence answers reach clients · no safety valve

**What we recommend**
1. Scope guard that returns "out of scope" before any retrieval.
2. Answer-only-from-context contract: say "I don't know" when the documents don't support an answer.
3. Independent judge model scoring groundedness and citation precision against a gold set.
4. Confidence-routed outputs: low confidence goes to a person, never silently to a client.
5. Prompt improvement driven by failure feedback and validated on held-out questions.
6. Groundedness and relevance tracked over time; drift triggers review.

**Our recommendation**: Ask for two numbers before you trust an assistant: how often it answers from the documents, and how often it says it doesn't know when it should. If nobody can give you those, it has not been evaluated.

---

## 5. `fairness-is-a-test` — Fairness is a test, not a policy

- Category: Responsible AI · 5 min · For: HR and talent leaders, compliance, CTOs · Related: AI Reliability Audit, Transform
- Lede: If an automated screening decision moves when only the candidate's name changes, you have a regulatory exposure, whatever your policy says. The matched-pair tests, abstain rules and audit trail we recommend before any such system goes live.

**The exposure**
- AI screening (resumes, applications, claims) risks bias, opacity and false confidence; regulators and candidates increasingly ask for evidence, not policy.

**Where standard controls fall short** (table)
- A written fairness policy · says nothing about behaviour · no evidence
- Removing obvious sensitive fields · proxies (address, school, gaps) carry the signal · bias persists
- Single-pass scoring · unstable scores presented as decisions · inconsistent outcomes
- No injection check on documents · text hidden in a resume influences the score · manipulation
- No audit log · decisions cannot be explained after the fact · regulatory risk

**What we recommend**
1. Injection scrubbing and PII redaction before scoring.
2. Scores built from weighted, explained components, not a single opaque number.
3. Repeated scoring with abstain-on-uncertainty when runs disagree.
4. Matched-pair probes: name swaps and proxy flips must not move the decision.
5. Group fairness snapshot across the applicant pool.
6. Compact per-decision audit log with the explanation.

**Our recommendation**: Run the name-swap test before launch and again every time the model or prompt changes. It takes an afternoon and it is the question a regulator will ask first.

---

## 6. `build-on-real-data` — Why we build on your real data from week one

- Category: Method · 4 min · For: anyone sponsoring an AI build · Related: Agent MVP, How we work
- Lede: An agent that commits to a plan up front breaks the moment reality differs from the plan. One that checks each result and adjusts keeps going. The same is true of projects, which is why we never build on sample data.

**The exposure**
- Plans and prototypes built on clean sample data meet real data late, when changing course is expensive.

**Where standard controls fall short**
- Plan-and-execute agents: predict every step, execute blindly, collapse on the first ambiguity (e.g. two contacts with the same name).
- Projects run the same way: a detailed plan, a demo on sample data, a surprise in week eight.

**What we recommend**
1. Adaptive loop: observe the result of each step and reconsider before the next.
2. Real data from the first sprint, under NDA and inside the client's environment.
3. Define success before building, so "adjusting" has a target.
4. Short cycles with a measured checkpoint at each.

**Our recommendation**: If a vendor's plan has no point at which it expects to be wrong, be cautious. Ours does, and it is in week one.

---

## 7. `when-a-high-score-means-nothing` — When a high score means nothing

- Category: Evaluation · 6 min · For: CTOs, heads of engineering, anyone making product or investment decisions on eval numbers · Related: AI Reliability Audit, Managed AI Operations
- Lede: An agent can score highly because it did the task, or because it found a way to score highly without doing it. From the number alone you cannot tell which. Why eval integrity is both a quality problem and a security problem, and how we isolate the harness from the agent.

**The exposure**
- Reward hacking: an agent finds a shortcut to the grade rather than the goal. Documented example: a frontier model asked to extract records from a large log file located a metadata folder it had not been pointed to, found the exact answer the grader would check against, copied it, and described the shortcut as a smart use of indexing.
- The task was "completed" and nothing was learned; the next log file without a metadata folder would fail.
- Decisions made on that score (ship, invest, scale) rest on a number that may not mean what it appears to.

**Where standard controls fall short** (table: Practice · What it hides · Consequence)
- Trusting the aggregate score · whether the task was actually performed · false confidence
- Eval harness reachable by the agent (grader files, gold answers, internal metadata) · the agent reads the answer key · scores inflated, behaviour unmeasured
- No review of traces, only of scores · the shortcut is invisible · systematic gaming goes unnoticed
- Same tool access in test and production · the exploration pattern that found the grader will probe customer data and code in production · security exposure, not just a quality one

**What we recommend**
1. Isolate the evaluation harness: the agent under test must have no path to grader files, gold labels or harness configuration. Treat this as an access-control boundary, not a convention.
2. Review traces, not just scores: sample runs and check how the result was reached. Flag any access outside the task's declared scope.
3. Score task performance separately from outcome match, so "arrived at the right answer by the wrong route" is visible.
4. Vary held-out cases so a memorised or located answer cannot pass.
5. Treat eval-time exploration as a security signal: an agent that looks for evaluator-adjacent files in testing gets least-privilege scoping before it goes anywhere near production data.
6. Re-run under Managed AI Operations whenever models or prompts change; gaming behaviour changes with the model.

**Our recommendation**: Before you act on an eval number, ask two questions: could the agent have reached the grader, and has anyone read the traces? If either answer is no or unknown, the number is not yet evidence.

---

## 8. `decisions-not-reasoning` — Most of your agent's model calls are decisions, not reasoning

- Category: Cost & architecture · 7 min · For: CTOs, heads of engineering, finance leads watching AI spend · Related: AI Opportunity Sprint, Agent MVP, Managed AI Operations
- Lede: In a typical agent loop, the large majority of model calls decide something (route this, is that tool call safe, how urgent is this ticket, did this output pass) rather than reason about it. Most teams pay frontier-model prices for all of them. How to separate the two, cut cost and latency, and keep control flow where it belongs.

**The exposure**
- Agent loops make two kinds of calls: reasoning calls (understand context, plan, write a response) and decision calls (route, classify, check, pass/fail). Practitioner estimates put decision calls at the large majority of volume.
- Almost all are served by a frontier model at frontier prices, multiplied by every iteration the agent runs. Cost compounds; latency does too.
- Cheaper, faster classification models (small models, fine-tuned classifiers, and newer calibrated decision models such as TypeSafe's Jev, one example among several) can take the decision calls, but only if the architecture is set up to use them safely.

**Where standard controls fall short** (table: Practice · Problem · Consequence)
- One frontier model for every call · paying reasoning prices for yes/no decisions · cost and latency scale with every loop iteration
- Bundled questions ("is this ticket a good automation candidate?") · the model judges a bundle of three checks as one and returns a plausible but low-confidence score · weighting hidden in the prompt rather than in code
- One confidence threshold for every action · a read-only lookup and an automated refund treated the same · either too timid or too dangerous
- Routing accuracy never measured · misrouting rarely throws an error, it just produces a worse result · drift goes unnoticed
- Classifier as the approver · text in context can sway a probability · a manipulated classification becomes an executed action

**What we recommend**
1. Audit your traces: count reasoning calls versus structured decisions. The split tells you how much cost is movable.
2. Route the four decision-heavy places (routing, pre-execution guardrails, output evaluation, triage classification) to a cheap calibrated classifier, with fallback to the frontier model when confidence is low. A wrong decision on the cheap side compounds; an extra frontier call costs cents.
3. Keep permission checks in code. The classifier recommends; the code decides. Nothing can talk an if-statement out of its answer.
4. Ask single questions and combine the results in code, where the weighting is visible and A/B-testable.
5. Match the confidence threshold to the cost of a mistake: a lookup can act at 0.5, an automated refund might need 0.9, below which it goes to a person or a heavier model.
6. Measure routing accuracy against a hand-labelled set, continuously; it is classification, and classifiers drift.
7. Treat classifier input as untrusted: these models run alongside existing security checks, never instead of them.

**Our recommendation**: Audit one week of agent traces. If more than half the calls are decisions, you are overpaying for them and probably under-measuring them. The fix is architectural, takes a few weeks, and usually pays for itself within a quarter.
