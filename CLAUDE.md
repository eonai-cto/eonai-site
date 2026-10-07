# EonAI website — project instructions for Claude Code

You are building the public website for EonAI (eonai.ai), an AI engineering consultancy.
Read `BRIEF.md` first. The approved design and copy are in `reference/` — treat them as the
source of truth for content, structure, colours, type and tone. Rebuild them properly; do not
ship the reference files as-is.

## Non-negotiables

- Static site. No CMS, no server, no build step more complex than a single `npm run build`.
- Hosting: GitHub Pages from this repo (see `deploy/`). Must work at `https://eonai.ai` and `https://www.eonai.ai`.
- Zero recurring cost: no paid services, no paid fonts, no paid form backends beyond free tiers.
- Copy is final. Use it verbatim from `reference/`. Do not add, reword or "improve" content. Fix typos only.
- No phone number anywhere on the site. No founder names, bios, photos, or headcount anywhere on the site.
- No prices anywhere on the site.
- Tone of any text you must write yourself (alt text, meta descriptions, 404 page): plain, direct, professional. No exclamation marks, no marketing superlatives, no emoji.
- Do not invent clients, logos, testimonials, statistics or case studies. Placeholders in the reference marked with [square brackets] stay as clearly-marked TODOs.

## Stack

- Plain HTML + CSS (+ minimal vanilla JS only where needed: FAQ accordion fallback, mobile nav, form handling). No frameworks.
- One shared stylesheet. Move the inline styles from the reference into classes. Keep the design tokens exactly:
  - Fonts: Space Grotesk (headings), IBM Plex Sans (body), IBM Plex Mono (eyebrows/labels) via Google Fonts, with system fallbacks.
  - Colours: ink `#0E1726`, navy `#0B1220`, panel `#111A2E`, border-dark `#22304A`, ground `#F5F6F8`, card `#FFFFFF`, border `#E1E5EC`, body-grey `#475266`, caption-grey `#5B6678`, accent `#2B5BFF`, accent-light `#8FB0FF`, link `#1E3FBF`.
- Responsive: must read well at 375px, 768px and 1440px. Grids collapse to one column on phones; tables scroll horizontally inside their container; nav collapses to a simple menu.
- Accessibility: semantic HTML, one `h1` per page, real `<button>`/`<a>`/`<label>` elements, visible focus states, 4.5:1 contrast, `aria-label` on icon-only controls. Lighthouse accessibility ≥ 95.
- Performance: no images except the favicon/logo SVGs (see Logo) and the YouTube thumbnail; Lighthouse performance ≥ 95 on mobile.

## Logo (approved 2026-10-07 — "hybrid H2")

Use only the files in `src/static/brand/` (published at `/brand/`). Never redraw the logo by hand, set it as live text, or substitute the old circle-and-cross mark.

- **Wordmark:** lowercase `eonai` in Space Grotesk. `e` and `n` are Light (300); the `o` is replaced by the **open loop** (a ring drawn at the Light stem weight, open at the top right, with a solid dot just outside the gap); `ai` is Bold (700). The dot and `ai` share the accent colour.
- **Colours:** on dark backgrounds, white letters and loop, with the dot and `ai` in accent-light `#8FB0FF` (`eonai-logo-on-dark.svg`). On light backgrounds, ink `#0E1726`, with the dot and `ai` in accent `#2B5BFF` (`eonai-logo-on-light.svg`, plus `.png`).
- **Mark / icon:** the loop and dot on their own (`eonai-mark-on-*.svg`). Favicon (`src/static/favicon.svg`) is the loop on a navy rounded square; `eonai-app-icon.svg` is the white loop on an accent square for social avatars.
- **Usage:** site header (36px tall, inlined) and footer (30px), Open Graph image, JSON-LD `Organization.logo`. The legal name in text stays "EonAI Private Limited"; the lowercase form is for the logo only.
- **Regenerating:** `python3 src/brand/make-logo.py` (needs `pip install fonttools`) rebuilds every SVG from the bundled font outlines (`src/brand/SpaceGrotesk[wght].ttf`, SIL OFL). The geometry constants at the top of that script are the specification; change them there, not in the SVGs.

## Pages and URLs

See `BRIEF.md` § Site tree. Every page gets: `<title>`, meta description, canonical URL, Open Graph + Twitter card tags, and JSON-LD (`Organization` on home, `Article` on notes).

## Forms

Contact form posts to Formspree (free tier). Use the endpoint placeholder `FORMSPREE_ENDPOINT` in a single config constant; the owner will supply the real one. Both consent checkboxes are real inputs; the first is `required`. Honeypot field for spam. On success, show an inline confirmation (no redirect).

## Definition of done

- `npm run build` (or equivalent) produces `/dist` (or the site builds directly from `/docs`) that GitHub Pages can serve.
- All internal links resolve; no `#top`/placeholder hrefs remain except the ones listed as TODO in `BRIEF.md`.
- `robots.txt`, `sitemap.xml`, `404.html`, `favicon.svg`, `CNAME` file (content: `eonai.ai`) present.
- HTML validates (no unclosed elements); CSS has no unused tokens.
- A `README.md` in the repo explains how to edit copy, add a note, and deploy.
