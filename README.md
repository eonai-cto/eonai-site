# EonAI website (eonai.ai)

Static site. Source lives in `src/`; `npm run build` renders it into `docs/`, which GitHub Pages serves. No dependencies.

```
src/config.mjs        owner placeholders (see below)
src/layout.mjs        header, footer, <head> metadata
src/pages/            home, notes index, note template, privacy, 404
src/notes-data.mjs    content of all nine engineering notes
src/assets/           site.css (single stylesheet), site.js (mobile nav, form), fonts/ (self-hosted woff2)
src/static/           favicon.svg, brand/ (logo files), assets/og.png (copied to docs/)
src/brand/            logo generator script and the Space Grotesk font it reads
docs/                 build output, committed; do not edit by hand
reference/, content/  original approved copy
```

Commands: `npm run build`, `npm run check` (links, anchors, h1 count, required files), `npm run serve` (http://localhost:8080).

## Placeholders (src/config.mjs)

| Constant | Effect while unset |
|---|---|
| `BOOKING_URL` | every "Book a call" link points to `/#contact` |
| `FORMSPREE_ENDPOINT` | form shows "not connected yet, email us" on submit. Set to e.g. `https://formspree.io/f/xxxx` |
| `LINKEDIN_COMPANY_URL` | footer LinkedIn link points to `/#contact` |
| `CF_ANALYTICS_TOKEN` | no analytics beacon (optional) |

Also open items: the privacy policy date (`[DATE]` in `src/pages/privacy.mjs`) and the owner review of its text.

## Logo

The logo files live in `src/static/brand/` and are published at `https://eonai.ai/brand/`:

| File | Use |
|---|---|
| `eonai-logo-on-dark.svg` | wordmark on navy or dark backgrounds (site header and footer) |
| `eonai-logo-on-light.svg` / `.png` | wordmark on white or light backgrounds (documents, decks, email) |
| `eonai-mark-on-dark.svg`, `eonai-mark-on-light.svg` | the loop on its own |
| `eonai-app-icon.svg` | square icon for LinkedIn and social avatars |
| `../favicon.svg` | browser tab icon |

To change the logo, edit the constants at the top of `src/brand/make-logo.py` and run `python3 src/brand/make-logo.py` (needs `pip install fonttools`), then `npm run build`. The rules are in `CLAUDE.md` § Logo. If you change the logo, also re-render `src/static/assets/og.png` from `og.svg` (open it in Chrome and screenshot at 1200×630) and `eonai-logo-on-light.png`.

## Edit copy

Home page: `src/pages/home.mjs`. Header/footer: `src/layout.mjs`. Privacy: `src/pages/privacy.mjs`. Then `npm run build`.

## Add a note

Add an object to the `notes` array in `src/notes-data.mjs` (copy an existing one: slug, title, category, mins, lede, card, sections, recommendation, related). Remove `draft: true` from a section once its prose is final. The note page, index card and sitemap entry are generated. To show it on the home page, add a card in `src/pages/home.mjs`.

## Deploy

1. Push to GitHub, `main` branch.
2. Settings, Pages: source `main`, folder `/docs`. Custom domain `eonai.ai` (`docs/CNAME` is generated).
3. After the DNS check passes, tick Enforce HTTPS.
4. DNS records at Namecheap: see `deploy/DNS.md`. Do not touch the mail records.
