# EonAI website — build brief

## 1. What this is

EonAI Private Limited (Hyderabad, India; CIN U62011TS2025PTC203906) is an AI engineering
consultancy. Positioning: **evaluation-first AI engineering** — "AI that works beyond the demo."
Four service lines: Build (agentic AI & GenAI engineering), Assure (AI quality & verifiable
assurance), Transform (AI & engineering transformation), Scale (fractional leadership &
capability centres). Target clients: startups and enterprises worldwide.

The site's job is to get a qualified prospect to book a 30-minute working session or email
hello@eonai.ai. It is deliberately a firm-level site: no people, no size signals, no prices.

Domain `eonai.ai` is registered at Namecheap; DNS stays at Namecheap. Email is on Zoho
(MX/SPF/DKIM/DMARC already configured — **do not touch any existing DNS record**; the site
adds A/CNAME records only, see `deploy/DNS.md`).

## 2. Approved design and copy

`reference/index.html`, `reference/notes.html`, `reference/note-refunds-agent.html` are
static exports of the approved prototype. They are **content- and design-complete** but
**technically rough** (inline styles, no responsive rules, duplicated nav). Rebuild them with
a proper stylesheet and components; keep every word, section, order and colour.

## 2a. Logo

The approved logo is the lowercase wordmark **eonai** with the `o` replaced by an open loop and a dot ("hybrid H2", approved 2026-10-07). Light `eon`, bold `ai`; the dot and `ai` are in the accent colour. Final artwork and the generator script are in the repo: `src/static/brand/` and `src/brand/make-logo.py`. Full rules are in `CLAUDE.md` § Logo. Any rebuild of the site must use these files in the header, footer, favicon, Open Graph image and `Organization` JSON-LD.

## 3. Site tree

| URL | Source | Notes |
|---|---|---|
| `/` | `reference/index.html` | Home. Anchors: `#problems #services #usecases #approach #offers #notes #about #contact` |
| `/notes/` | `reference/notes.html` | Engineering notes index |
| `/notes/refunds-agent/` | `reference/note-refunds-agent.html` | First full note. This page is the **template** for all notes. |
| `/notes/<slug>/` × 8 | `content/notes-outline.md` | Remaining notes. Build the pages from the template with the outline content; mark body sections "Draft — to be completed" where the outline gives only bullets. Slugs below. |
| `/privacy/` | `content/privacy.md` | Privacy policy (DPDP Act + GDPR-aware). Draft provided; owner will review. |
| `/404.html` | — | Plain, on-brand. One line + link home. |

Note slugs: `measure-before-you-ship`, `guardrails-in-the-architecture`, `deterministic-orchestrator`,
`grounded-answers`, `fairness-is-a-test`, `build-on-real-data`, `when-a-high-score-means-nothing`,
`decisions-not-reasoning`. The notes index and home "Engineering notes" section list the first six;
add the last two to the index as additional cards (categories: Evaluation; Cost & architecture).

Navigation (all pages): Problems we solve · Services · How we work · Engagements · Engineering notes · **Book a call** (button).
Footer (all pages): company legal line + registered address, Company links, Contact (hello@eonai.ai, LinkedIn, Privacy policy), copyright.

## 4. Content rules (apply everywhere)

- Nothing on the site states or implies headcount, founder identities, years of experience as a
  headline number, or prices. The About block is a company statement only.
- "Seen before" figures on use-case cards stay, with their footnote. No other numbers may be added.
- The talk link is `https://www.youtube.com/watch?v=xwoiaOAfZRA`, title
  "The Future of Quality in AI-Generated Software". Link out; do not embed the player. You may
  show the YouTube thumbnail (`https://img.youtube.com/vi/xwoiaOAfZRA/hqdefault.jpg`) as the card image.
- Placeholders that stay as visible TODOs until the owner supplies them:
  - `BOOKING_URL` — every "Book a call" / "Book a 30-minute working session" / "Request an AI readiness workshop" link. Until supplied, point them to `#contact`.
  - `FORMSPREE_ENDPOINT` — contact form action.
  - `LINKEDIN_COMPANY_URL` — footer LinkedIn link.
- Engineering notes carry the provenance sentence exactly as in the reference ("Findings are from EonAI's reference systems, built and tested on synthetic data…"). Keep it on every note.

## 5. Components to extract

- Site header (dark) with the eonai logo (see § 2a) and responsive nav.
- Section header: mono eyebrow + Space Grotesk h2 (+ optional lede).
- Card (light), card (dark), card (highlight `#EEF2FF`).
- Problem card (eyebrow "Usually raised by…", quote, body, engagement tag).
- Use-case card (dark) with "What usually breaks" line and note link.
- Engagement card with "You walk away with" list and "How it runs" footer.
- Numbered step (How we work).
- Trust card with inline SVG icon.
- Pull-quote block (dark).
- FAQ: `<details>/<summary>` with styled marker; no JS required.
- Contact form + "What happens next" list.
- Note page: title band, breadcrumb, two-column body (article + sticky sidebar), scenario table, numbered recommendations, recommendation block, provenance line.
- Notes index: filter pills (static for v1 — all notes shown; filtering is a later enhancement), featured card spanning full width, note cards, talk card.

## 6. SEO and metadata

- Home `<title>`: "EonAI — Evaluation-first AI engineering for startups and enterprises".
- Home meta description: "EonAI builds, tests and runs AI systems that work in production. Agentic AI engineering, AI quality and verifiable assurance, AI transformation and fractional technology leadership."
- Notes index title: "Engineering notes — EonAI". Note titles: "<note title> — EonAI".
- JSON-LD: `Organization` (name EonAI Private Limited, url, email hello@eonai.ai, address Madhapur, Hyderabad) on home; `Article` with `headline`, `datePublished` (2026-10-07), `author` {"@type":"Organization","name":"EonAI"} on notes.
- Open Graph image: one simple on-brand 1200×630 PNG (dark navy, the eonai logo from `src/static/brand/`, tagline). No photos. Source: `src/static/assets/og.svg`.
- `sitemap.xml` listing all pages; `robots.txt` allowing all.

## 7. Analytics (free, privacy-respecting)

Add Cloudflare Web Analytics **only if** the owner supplies a token (`CF_ANALYTICS_TOKEN` placeholder). It is cookieless. No Google Analytics.

## 8. Deployment

GitHub Pages from the `main` branch. Static output in `/docs` (chosen; see README → Deploy). Include `CNAME` with `eonai.ai`. Enforce HTTPS in repo settings (owner does this in the UI; note it in README). DNS records to add at Namecheap are in `deploy/DNS.md`.

## 9. Acceptance checklist

Status at launch, 2026-10-07. Open owner items are listed in README → "Owner to-do".

- [x] All pages render correctly at 375 / 768 / 1440 px. _(Checked at 375, 768 and 1440 px; no horizontal scroll.)_
- [x] Lighthouse mobile: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. _(Home 99/100/100/100; other pages 100.)_
- [x] No phone number, no names, no headcount, no prices anywhere (grep for `+91`, `Rajshiva`, `founder`, `₹`, `$` in copy). _(Remaining hits come from the approved copy: "founder" as a role, and dollar figures in the refunds note scenarios. See README → "Copy issues".)_
- [x] Every "Book a call" link points to `BOOKING_URL` or `#contact`. _(Currently `/#contact` until the booking link is supplied.)_
- [x] Contact form posts to `FORMSPREE_ENDPOINT`, required consent enforced, honeypot present, success state shown. _(Endpoint still a placeholder.)_
- [x] `/notes/refunds-agent/` matches the reference content exactly; other eight notes exist with outline content and a "Draft" marker.
- [x] `/privacy/` and `/404.html` present. `sitemap.xml`, `robots.txt`, `favicon.svg`, `CNAME` present.
- [x] README explains: edit copy, add a note, deploy, where the placeholders are.
