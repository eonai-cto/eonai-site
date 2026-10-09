# EonAI website — project instructions for Claude Code

You are building the public website for EonAI (eonai.ai), an AI engineering consultancy.
Read `BRIEF.md` first. The approved design and copy are in `reference/` — treat them as the
source of truth for content, structure, colours, type and tone. Rebuild them properly; do not
ship the reference files as-is.

Inputs you must use, not recreate: `reference/` (design and copy), `content/` (notes outline,
privacy draft) and `brand/` (logo, fonts, Open Graph image). Everything in `src/` and `docs/`
can be rebuilt; nothing in `brand/` should be regenerated except with `brand/make-logo.py`.

## Non-negotiables

- Static site. No CMS, no server, no build step more complex than a single `npm run build`.
- Hosting: GitHub Pages from this repo (see `deploy/`). Must work at `https://eonai.ai` and `https://www.eonai.ai`.
- Zero recurring cost: no paid services, no paid fonts, no paid form backends beyond free tiers.
- Copy is final. As of 2026-10-08 the **source of truth for copy is `src/`** (`src/pages/*.mjs`, `src/notes-data.mjs`), not `reference/`: the owner approved an editorial pass that removed rule-breaking lines (years-of-experience figures, role references), finished the eight notes as prose, and rewrote AI-sounding phrasing. Where `src/` and `reference/` differ, `src/` wins. Do not add, reword or "improve" content without the owner's instruction. Fix typos only.
- House style for any new text: write like a person, not a model. Avoid "X, not Y" antithesis and slogan-style paragraph endings, rule-of-three lists used for rhythm, filler such as "quietly", "seamless", "leverage", "journey", and repeating the same point in consecutive sentences. Use British spelling, no em dashes in running copy, and concrete facts over abstractions.
- No phone number anywhere on the site. No founder names, bios, photos, or headcount anywhere on the site.
- No prices anywhere on the site.
- Tone of any text you must write yourself (alt text, meta descriptions, 404 page): plain, direct, professional. No exclamation marks, no marketing superlatives, no emoji.
- Do not invent clients, client logos, testimonials, statistics or case studies. Placeholders in the reference marked with [square brackets] stay as clearly-marked TODOs.

## Stack

- Plain HTML + CSS (+ minimal vanilla JS only where needed: FAQ accordion fallback, mobile nav, form handling). No frameworks.
- One shared stylesheet. Move the inline styles from the reference into classes. Keep the design tokens exactly:
  - Fonts: Space Grotesk (headings, weights 500–700), IBM Plex Sans (body, 400–600), IBM Plex Mono (eyebrows/labels, 400–500). Free Google Fonts families, **self-hosted** from `brand/fonts/` — see § Performance.
  - Colours: ink `#0E1726`, navy `#0B1220`, panel `#111A2E`, border-dark `#22304A`, ground `#F5F6F8`, card `#FFFFFF`, border `#E1E5EC`, body-grey `#475266`, caption-grey `#5B6678`, accent `#2B5BFF`, accent-light `#8FB0FF`, link `#1E3FBF`.
- Responsive: must read well at 375px, 768px and 1440px. Grids collapse to one column on phones; tables scroll horizontally inside their container; nav collapses to a simple menu.
- Accessibility: semantic HTML, one `h1` per page, real `<button>`/`<a>`/`<label>` elements, visible focus states, 4.5:1 contrast, `aria-label` on icon-only controls. Lighthouse accessibility ≥ 95.
  - Accent `#2B5BFF` fails contrast on ink/navy/panel. On any dark surface (dark cards, dark bands, hero, use cases) eyebrows and links use accent-light `#8FB0FF` or white.
  - Headings must not skip levels: card titles directly under the page `h1` (notes index) are `h2`; under a section `h2` they are `h3`.
  - Grid columns use `minmax(min(100%, Npx), 1fr)` so nothing overflows at 375px.
- Performance: no raster images except the logo/favicon files in `brand/` and the Open Graph PNG; Lighthouse performance ≥ 95 on mobile. Follow § Performance exactly. Illustrations are inline SVG (see § Visuals).
- **No YouTube thumbnail.** The talk's thumbnail shows a person's name, photo and title, which breaks the no-names/no-photos rule; the talk card is text only (decided 2026-10-08).
- External links (the YouTube talk, the Zoho Bookings page) open in a new tab with `target="_blank" rel="noopener"`; the talk card adds visually hidden text "(opens in a new tab)".

## Logo (approved 2026-10-07 — "hybrid H2")

The logo is final. Use the files in `brand/logo/` as they are. Never redraw it by hand, set it as live text, swap the font, recolour it, or bring back the old circle-and-cross mark from `reference/`.

**Design**
- Lowercase wordmark `eonai` in Space Grotesk, as outlines (no font needed to render it).
- `e` and `n`: Light (300). `ai`: Bold (700).
- The `o` is replaced by the **open loop**: a ring the size of the Light `o`, stroked at the Light stem weight with round ends, open at the top right, with a solid dot just outside the end of the gap.
- The dot and `ai` share the accent colour; everything else is the foreground colour.

**Files** (`brand/logo/`, published to `/brand/` and `/favicon.svg` by the build)

| File | Colours | Use |
|---|---|---|
| `eonai-logo-on-dark.svg` | white; dot and `ai` `#8FB0FF` | site header and footer, any dark background |
| `eonai-logo-on-light.svg`, `.png` | ink `#0E1726`; dot and `ai` `#2B5BFF` | light backgrounds, documents, `Organization.logo` (PNG) |
| `eonai-mark-on-dark.svg`, `eonai-mark-on-light.svg` | as above | the loop and dot alone |
| `eonai-app-icon.svg`, `.png` (512×512) | white loop on `#2B5BFF` rounded square | LinkedIn and social avatars |
| `eonai-icon-square-dark.svg`, `.png` (400×400) | favicon colours on a full-bleed navy square: white loop, `#8FB0FF` dot, no rounded corners | **LinkedIn company logo** (chosen 2026-10-09) and any platform that adds its own frame |
| `eonai-icon-square.svg`, `.png` (400×400) | white loop on a full-bleed `#2B5BFF` square, no rounded corners | alternative square icon |
| `eonai-logo-square.png` (512×512) | light wordmark centred on white | square logo slots such as the Zoho Bookings business logo |
| `favicon.svg` | white loop, `#8FB0FF` dot, navy rounded square | browser tab → `docs/favicon.svg` |

**Placement on the site**
- Header: inline the contents of `eonai-logo-on-dark.svg` (not an `<img>`) at 36px tall, `aria-hidden="true"` on the SVG, inside `<a href="/" aria-label="EonAI home">`. Inlining avoids an extra request and a layout shift.
- Footer: same file, 30px tall, also linked home.
- Open Graph / Twitter image: `brand/og/og.png` (1200×630: logo, tagline, eyebrow on navy; source `brand/og/og.svg`). `og:image:alt` is "eonai logo. AI that works beyond the demo" (the headline has no full stop anywhere: hero, OG image, LinkedIn cover)
- Home JSON-LD `Organization.logo`: `https://eonai.ai/brand/eonai-logo-on-light.png`.
- In running text the company is always "EonAI" / "EonAI Private Limited". The lowercase form is for the logo only.

**Changing the logo** (owner decision only): edit the constants at the top of `brand/make-logo.py` (they are the specification), run `pip install fonttools && python3 brand/make-logo.py`, then re-render `brand/logo/eonai-logo-on-light.png` and `brand/og/og.png` (open the SVG in Chrome headless and screenshot), then `npm run build`. The script reads the bundled `brand/source/SpaceGrotesk[wght].ttf` (SIL OFL).

## Performance (Lighthouse mobile ≥ 95 on every page; target CLS 0)

These rules come from measured failures. Each one was needed to get from 88 to 99–100.

- **Fonts are self-hosted.** Use the latin-subset woff2 files in `brand/fonts/` (copied to `/assets/fonts/`): `space-grotesk.woff2` and `plex-sans.woff2` are variable (declare `font-weight: 300 700` and `100 700`), Plex Mono is two static files (400, 500). `font-display: swap`. Do **not** link fonts.googleapis.com: its CSS-then-font chain is render-blocking if loaded normally (performance 88) and causes layout shift if loaded async.
- **Preload** `plex-sans.woff2`, `space-grotesk.woff2` and `plex-mono-400.woff2` in `<head>` with `<link rel="preload" as="font" type="font/woff2" crossorigin>`, before the stylesheet.
- **Metric-matched fallbacks** to keep text from reflowing when the fonts arrive: in `site.css`, declare `'Space Grotesk Fallback'` (`local('Arial')`, `size-adjust: 102%`), `'IBM Plex Sans Fallback'` (`local('Arial')`, `size-adjust: 101.8%`) and `'IBM Plex Mono Fallback'` (`local('Courier New')`), and list each straight after its web font in the font stacks.
- **Set `html.js` inline in `<head>`**: `<script>document.documentElement.classList.add('js')</script>` straight after the viewport meta. The mobile nav is hidden only under `.js`; adding the class from the deferred `site.js` collapsed the nav after first paint and shifted the whole page (CLS 0.16, intermittent).
- **No third-party requests** on page load: no external images, fonts, scripts or embeds (unless `CF_ANALYTICS_TOKEN` is set).
- One stylesheet (`/assets/site.css`) and one deferred script (`/assets/site.js`). No frameworks, no analytics unless `CF_ANALYTICS_TOKEN` is set.
- **Verify** with Lighthouse mobile at least three times on the home page (layout shift was intermittent) and once on every other page. Every run must be ≥ 95 with CLS 0.

## Visuals (added 2026-10-09, owner-approved)

The site uses diagrams and pictograms instead of photos or stock imagery (no people may appear). All are inline SVG or HTML/CSS: no image files, no icon fonts, no third-party players.

- **Line icons** (`src/icons.mjs`): one style, 32px grid, 1.75 stroke, round caps, `currentColor`. Used on the four service cards (`build`, `assure`, `transform`, `scale`) and the eight use-case cards. Tinted tile on light cards, panel tile with `#8FB0FF` stroke on dark cards. New icons follow the same grid and stroke.
- **Where clients usually start** (`paths` in `src/pages/home.mjs`, top of § Engagements): three routes as HTML chips joined by arrows. Starting with AI: Sprint → Agent MVP → Managed AI Operations. Already running AI: Reliability Audit → Managed AI Operations. Startups: Agent MVP + Fractional CTO alongside. Routes come from the FAQ and the who-we-serve copy. On phones each route stacks vertically with downward arrows.
- **"From demo to production"** (`src/explainer.mjs`, section `#explainer` after "Why pilots stall"): six **static** numbered panels in a grid (3 across on desktop), each a small inline SVG on navy with a one-line caption below. The owner rejected an animated, click-to-play version on 2026-10-09 as distracting: do not add motion, autoplay or a player. If a produced video is ever added, it must be self-hosted and load only on click.

- **Hero background** (`src/hero-bg.mjs`, styles under `.hero-bg` in `site.css`, requested by the owner 2026-10-09): the logo's open loop repeated as five concentric rings, each with its dot, turning slowly (38–180 s per turn, alternating direction) behind the right of the hero, plus one white pulse on the second ring, a masked dot grid and a breathing accent glow. Inline SVG and CSS transforms only, `aria-hidden`, no video file, no JS. Motion stops under `prefers-reduced-motion`. Measured after adding it: Lighthouse mobile 99/100/100/100, CLS 0. Keep it this quiet; this is the one place on the site with ambient motion.
- **Services → engagements** (`services` in `src/pages/home.mjs`): each service card ends with a "HOW WE DELIVER IT" row of chips linking to engagement cards (`#eng-<slug>`, ids from `engId()`): Build → Agent MVP, Larger programmes; Assure → AI Reliability Audit, QE Health Check, Managed AI Operations; Transform → AI Opportunity Sprint, Team Workshops; Scale → Fractional CTO, Larger programmes. The targeted engagement card gets an accent outline (`:target`).

**Content decisions (2026-10-09, owner)**
- Use cases: only the original seven from the reference (Support and complaint handling, Knowledge assistants, Document processing, AI-assisted testing, Data matching and identity resolution, Compliance and review workflows, Multi-model orchestration). **Defect and incident triage is removed.** No "Seen before" figures and no results footnote in this section. The eighth grid slot is a dashed "Something else?" card linking to the contact form.
- No third-party quotations (the QuantumBlack / McKinsey pull quote is removed). Do not add quotes from other firms.
- Avoid "honest"/"honestly" in copy; it reads as defensive on a corporate site.
- **Results figures are permanently out** (300K→12K backlog, 92%, 93%+, 80%, and the "prior roles" footnote). They describe work at the owner's former employers and may be confidential to those companies. Never re-add them anywhere: site, notes, OG image, LinkedIn assets or `reference/`.
- Headings are sentence case everywhere, including service titles ("Agentic AI & GenAI engineering"). Engagement names (AI Reliability Audit, Agent MVP…) are product names and keep their capitals.

## Pages and URLs

See `BRIEF.md` § Site tree. Every page gets: `<title>`, meta description, canonical URL, Open Graph + Twitter card tags, and JSON-LD (`Organization` on home, `Article` on notes).

## Forms

**Email address.** Every visible `hello@eonai.ai` link (contact section, footer) uses `mailto:hello@eonai.ai?subject=Enquiry%20from%20eonai.ai` and is followed by a small **Copy** button (`.copy-email`, shown only under `html.js`) for visitors without a mail app. It copies the address via the Clipboard API with an `execCommand` fallback, shows "Copied" for two seconds, and updates its `aria-label`. Markup comes from `emailWithCopy()` in `src/layout.mjs`.

Contact form posts to **FormSubmit** (formsubmit.co): free, no account, no published submission limit. Chosen over Formspree on 2026-10-07 because Formspree's free tier caps submissions. The single config constant is `FORM_TARGET` in `src/config.mjs` (`hello@eonai.ai`, or the random alias FormSubmit sends after activation). The form's `action` is `https://formsubmit.co/<FORM_TARGET>` (no-JS fallback, with `_next` back to `/#contact`) and `site.js` posts to `https://formsubmit.co/ajax/<FORM_TARGET>` with `Accept: application/json`, treating anything but `success: "true"` as an error. Hidden fields: `_subject`, `_template=table`, `_captcha=false`. The honeypot field is named `_honey`. Name and email are `required`. Result messages appear at the **top of the form box**, not below the button: the status element (`role="status"`, `tabindex="-1"`) is the form's first child, is scrolled to the centre of the viewport and receives focus. On success the fields are hidden and the whole form panel becomes a centred confirmation (check icon in a tinted circle, "Message sent", one line of text, and a "Send another message →" text link); no box inside the panel and no focus ring on the message. On error a bordered message sits above the fields, which stay filled. Both consent checkboxes are real inputs; the first is `required`. Honeypot field for spam. On success, show an inline confirmation (no redirect).

## Definition of done

- `npm run build` (or equivalent) produces `/dist` (or the site builds directly from `/docs`) that GitHub Pages can serve.
- All internal links resolve; no `#top`/placeholder hrefs remain except the ones listed as TODO in `BRIEF.md`.
- `robots.txt`, `sitemap.xml`, `404.html`, `favicon.svg`, `CNAME` file (content: `eonai.ai`) present.
- HTML validates (no unclosed elements); CSS has no unused tokens.
- A `README.md` in the repo explains how to edit copy, add a note, and deploy.
- Header, footer, favicon, Open Graph image and `Organization.logo` use the files in `brand/` (§ Logo).
- Lighthouse mobile passes § Performance: ≥ 95 in all four categories on every page, CLS 0, home page checked at least three times.
