# EonAI website (eonai.ai)

Static site. Source lives in `src/`; `npm run build` renders it into `docs/`, which GitHub Pages serves. No dependencies.

```
src/config.mjs        owner placeholders (see below)
src/layout.mjs        header, footer, <head> metadata
src/pages/            home, notes index, note template, privacy, 404
src/notes-data.mjs    content of all nine engineering notes
src/assets/           site.css (single stylesheet), site.js (mobile nav, form)
src/static/           favicon.svg, og.png (copied to docs/)
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

## Edit copy

Home page: `src/pages/home.mjs`. Header/footer: `src/layout.mjs`. Privacy: `src/pages/privacy.mjs`. Then `npm run build`.

## Add a note

Add an object to the `notes` array in `src/notes-data.mjs` (copy an existing one: slug, title, category, mins, lede, card, sections, recommendation, related). Remove `draft: true` from a section once its prose is final. The note page, index card and sitemap entry are generated. To show it on the home page, add a card in `src/pages/home.mjs`.

## Deploy

1. Push to GitHub, `main` branch.
2. Settings, Pages: source `main`, folder `/docs`. Custom domain `eonai.ai` (`docs/CNAME` is generated).
3. After the DNS check passes, tick Enforce HTTPS.
4. DNS records at Namecheap: see `deploy/DNS.md`. Do not touch the mail records.
