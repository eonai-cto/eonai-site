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
- Copy is final. Use it verbatim from `reference/`. Do not add, reword or "improve" content. Fix typos only.
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
- Performance: no images except the logo/favicon files in `brand/`, the Open Graph PNG and the YouTube thumbnail; Lighthouse performance ≥ 95 on mobile. Follow § Performance exactly.

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
| `eonai-app-icon.svg` | white loop on `#2B5BFF` square | LinkedIn and social avatars |
| `favicon.svg` | white loop, `#8FB0FF` dot, navy rounded square | browser tab → `docs/favicon.svg` |

**Placement on the site**
- Header: inline the contents of `eonai-logo-on-dark.svg` (not an `<img>`) at 36px tall, `aria-hidden="true"` on the SVG, inside `<a href="/" aria-label="EonAI home">`. Inlining avoids an extra request and a layout shift.
- Footer: same file, 30px tall, also linked home.
- Open Graph / Twitter image: `brand/og/og.png` (1200×630: logo, tagline, eyebrow on navy; source `brand/og/og.svg`). `og:image:alt` is "eonai logo. AI that works beyond the demo."
- Home JSON-LD `Organization.logo`: `https://eonai.ai/brand/eonai-logo-on-light.png`.
- In running text the company is always "EonAI" / "EonAI Private Limited". The lowercase form is for the logo only.

**Changing the logo** (owner decision only): edit the constants at the top of `brand/make-logo.py` (they are the specification), run `pip install fonttools && python3 brand/make-logo.py`, then re-render `brand/logo/eonai-logo-on-light.png` and `brand/og/og.png` (open the SVG in Chrome headless and screenshot), then `npm run build`. The script reads the bundled `brand/source/SpaceGrotesk[wght].ttf` (SIL OFL).

## Performance (Lighthouse mobile ≥ 95 on every page; target CLS 0)

These rules come from measured failures. Each one was needed to get from 88 to 99–100.

- **Fonts are self-hosted.** Use the latin-subset woff2 files in `brand/fonts/` (copied to `/assets/fonts/`): `space-grotesk.woff2` and `plex-sans.woff2` are variable (declare `font-weight: 300 700` and `100 700`), Plex Mono is two static files (400, 500). `font-display: swap`. Do **not** link fonts.googleapis.com: its CSS-then-font chain is render-blocking if loaded normally (performance 88) and causes layout shift if loaded async.
- **Preload** `plex-sans.woff2`, `space-grotesk.woff2` and `plex-mono-400.woff2` in `<head>` with `<link rel="preload" as="font" type="font/woff2" crossorigin>`, before the stylesheet.
- **Metric-matched fallbacks** to keep text from reflowing when the fonts arrive: in `site.css`, declare `'Space Grotesk Fallback'` (`local('Arial')`, `size-adjust: 102%`), `'IBM Plex Sans Fallback'` (`local('Arial')`, `size-adjust: 101.8%`) and `'IBM Plex Mono Fallback'` (`local('Courier New')`), and list each straight after its web font in the font stacks.
- **Set `html.js` inline in `<head>`**: `<script>document.documentElement.classList.add('js')</script>` straight after the viewport meta. The mobile nav is hidden only under `.js`; adding the class from the deferred `site.js` collapsed the nav after first paint and shifted the whole page (CLS 0.16, intermittent).
- **No other third-party requests** on page load. The only external resource is the YouTube thumbnail: `loading="lazy"`, explicit `width`/`height`, CSS `aspect-ratio: 16 / 9`.
- One stylesheet (`/assets/site.css`) and one deferred script (`/assets/site.js`). No frameworks, no analytics unless `CF_ANALYTICS_TOKEN` is set.
- **Verify** with Lighthouse mobile at least three times on the home page (layout shift was intermittent) and once on every other page. Every run must be ≥ 95 with CLS 0.

## Pages and URLs

See `BRIEF.md` § Site tree. Every page gets: `<title>`, meta description, canonical URL, Open Graph + Twitter card tags, and JSON-LD (`Organization` on home, `Article` on notes).

## Forms

Contact form posts to **FormSubmit** (formsubmit.co): free, no account, no published submission limit. Chosen over Formspree on 2026-10-07 because Formspree's free tier caps submissions. The single config constant is `FORM_TARGET` in `src/config.mjs` (`hello@eonai.ai`, or the random alias FormSubmit sends after activation). The form's `action` is `https://formsubmit.co/<FORM_TARGET>` (no-JS fallback, with `_next` back to `/#contact`) and `site.js` posts to `https://formsubmit.co/ajax/<FORM_TARGET>` with `Accept: application/json`, treating anything but `success: "true"` as an error. Hidden fields: `_subject`, `_template=table`, `_captcha=false`. The honeypot field is named `_honey`. Name and email are `required`. Result messages appear at the **top of the form box**, not below the button: the status element (`role="status"`, `tabindex="-1"`) is the form's first child, is scrolled to the centre of the viewport and receives focus. On success the fields are hidden and replaced by "Message sent" plus a "Send another message" button; on error the fields stay filled. Both consent checkboxes are real inputs; the first is `required`. Honeypot field for spam. On success, show an inline confirmation (no redirect).

## Definition of done

- `npm run build` (or equivalent) produces `/dist` (or the site builds directly from `/docs`) that GitHub Pages can serve.
- All internal links resolve; no `#top`/placeholder hrefs remain except the ones listed as TODO in `BRIEF.md`.
- `robots.txt`, `sitemap.xml`, `404.html`, `favicon.svg`, `CNAME` file (content: `eonai.ai`) present.
- HTML validates (no unclosed elements); CSS has no unused tokens.
- A `README.md` in the repo explains how to edit copy, add a note, and deploy.
- Header, footer, favicon, Open Graph image and `Organization.logo` use the files in `brand/` (§ Logo).
- Lighthouse mobile passes § Performance: ≥ 95 in all four categories on every page, CLS 0, home page checked at least three times.
