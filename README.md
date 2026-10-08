# EonAI website (eonai.ai)

**Live:** https://eonai.ai (and https://www.eonai.ai, which redirects to it) · **Repo:** https://github.com/eonai-cto/eonai-site (public; GitHub Pages needs that on the free plan)

Static site. Source lives in `src/`; `npm run build` renders it into `docs/`, which GitHub Pages serves. No dependencies.

```
src/config.mjs        owner placeholders (see below)
src/layout.mjs        header, footer, <head> metadata
src/pages/            home, notes index, note template, privacy, 404
src/notes-data.mjs    content of all nine engineering notes
src/assets/           site.css (single stylesheet), site.js (mobile nav, form)
brand/logo/           logo files and favicon (copied to docs/brand/ and docs/favicon.svg)
brand/fonts/          self-hosted woff2 fonts (copied to docs/assets/fonts/)
brand/og/             Open Graph image og.png and its source og.svg
brand/make-logo.py    logo generator; brand/source/ holds the font it reads
docs/                 build output, committed; do not edit by hand
reference/, content/  original approved copy
```

Commands: `npm run build`, `npm run check` (links, anchors, h1 count, required files), `npm run serve` (http://localhost:8080). Node 18+ and Python 3 (for `serve`) are the only requirements.

Typical change: edit a file in `src/`, run `npm run build && npm run check`, preview with `npm run serve`, then commit and push to `main`. GitHub Pages republishes in one to two minutes.

## Placeholders (src/config.mjs)

| Constant | Effect while unset |
|---|---|
| `BOOKING_URL` | every "Book a call" link points to `/#contact` |
| `FORM_TARGET` | set to `hello@eonai.ai`; the form works once FormSubmit is activated. Optionally replace with FormSubmit's random alias to keep the address out of the HTML |
| `LINKEDIN_COMPANY_URL` | footer LinkedIn link points to `/#contact` |
| `CF_ANALYTICS_TOKEN` | no analytics beacon (optional) |

After setting a value, run `npm run build`, then commit and push.

## Owner to-do before announcing the site

- [ ] `BOOKING_URL`: Zoho Bookings or Calendly link (src/config.mjs)
- [x] Contact form (FormSubmit): activated 2026-10-07; enquiries arrive at hello@eonai.ai. Activation is one-time; it is needed again only if `FORM_TARGET` changes to a new address or the form moves to another domain. Optional: paste FormSubmit's random alias into `FORM_TARGET` to keep the address out of the HTML.
- [ ] `LINKEDIN_COMPANY_URL` (src/config.mjs)
- [ ] Privacy policy: review with your advisor, set the date (`[DATE]`), and remove the "It is a draft…" sentence. Edit both `src/pages/privacy.mjs` (what is published) and `content/privacy.md` (the source draft).
- [ ] Engineering notes 2 to 9 carry a visible "Draft — to be completed" marker; finish the prose in `src/notes-data.mjs` and remove `draft: true`.
- [ ] Optional: `CF_ANALYTICS_TOKEN` for Cloudflare Web Analytics (cookieless, free).
- [ ] Send a test email to hello@eonai.ai to confirm mail still works after the DNS change.

## Copy issues carried over from the approved reference

Copy was used verbatim, as instructed. These lines in the approved copy conflict with BRIEF § 4 and need an owner decision:

- "twenty years" (home hero) and "two decades" (About) read as years-of-experience headline numbers.
- The refunds note contains dollar amounts ($250, $2,500, $1,899, ...). They are scenario figures, not prices, but a literal grep for `$` will flag them.
- The refunds note is labelled 9 min on the index cards and 8 min on its own page.
- The "measure before you ship" lede differs between the notes index card ("Adding planning to...") and the note page ("An upgrade to...").

## Logo

The logo files live in `brand/logo/` and are published at `https://eonai.ai/brand/`:

| File | Use |
|---|---|
| `eonai-logo-on-dark.svg` | wordmark on navy or dark backgrounds (site header and footer) |
| `eonai-logo-on-light.svg` / `.png` | wordmark on white or light backgrounds (documents, decks, email) |
| `eonai-mark-on-dark.svg`, `eonai-mark-on-light.svg` | the loop on its own |
| `eonai-app-icon.svg` / `.png` | square icon for LinkedIn and social avatars |
| `eonai-logo-square.png` | wordmark on a white square, for square logo slots (e.g. Zoho Bookings) |
| `favicon.svg` | browser tab icon (published at `/favicon.svg`) |

To change the logo, edit the constants at the top of `brand/make-logo.py` and run `python3 brand/make-logo.py` (needs `pip install fonttools`), then `npm run build`. Also re-render `brand/og/og.png` from `og.svg` and `brand/logo/eonai-logo-on-light.png` (open in Chrome and screenshot). The rules are in `CLAUDE.md` § Logo.

## Edit copy

| What | File |
|---|---|
| Home page sections | `src/pages/home.mjs` |
| Header, footer, `<head>` tags | `src/layout.mjs` |
| Notes index | `src/pages/notes-index.mjs` |
| Note pages (all nine) | `src/notes-data.mjs` (content), `src/pages/note.mjs` (template) |
| Privacy policy | `src/pages/privacy.mjs` (keep `content/privacy.md` in step) |
| 404 page | `src/pages/not-found.mjs` |
| Styles | `src/assets/site.css` (design tokens at the top) |

Copy is final: change it only on the owner's instruction. Then `npm run build`.

## Add a note

Add an object to the `notes` array in `src/notes-data.mjs` (copy an existing one: slug, title, category, mins, lede, card, sections, recommendation, related). Remove `draft: true` from a section once its prose is final. The note page, index card and sitemap entry are generated. To show it on the home page, add a card in `src/pages/home.mjs`.

## Fonts

Space Grotesk, IBM Plex Sans and IBM Plex Mono (Google Fonts, SIL OFL) are self-hosted from `brand/fonts/` and preloaded. Do not switch back to fonts.googleapis.com: it caused layout shift and dropped Lighthouse performance below 95. All performance rules are in `CLAUDE.md` § Performance.

## Deploy

Deployment is set up and live. Pushing to `main` is all that is needed: GitHub Pages serves the `docs/` folder.

Current configuration (set 2026-10-07):

- GitHub: account `eonai-cto`, repo `eonai-site`, Settings → Pages: source "Deploy from a branch", `main`, `/docs`. Custom domain `eonai.ai` (`docs/CNAME` is generated by the build). Enforce HTTPS is on.
- `eonai.ai` is a verified domain on the `eonai-cto` account (Settings → Pages → Verified domains), so no other account can publish on it.
- DNS at Namecheap: see `deploy/DNS.md` for the exact records. Do not touch the mail records.
- The HTTPS certificate (Let's Encrypt, via GitHub) covers `eonai.ai` and `www.eonai.ai` and renews automatically.

If the site ever shows a 404 or a certificate error after a change, check Settings → Pages for the DNS check status first.

## Checks (last run 2026-10-07)

- `npm run check`: all internal links and anchors resolve, one `h1` per page, required files present.
- Lighthouse (mobile): home 99 / 100 / 100 / 100 (performance, accessibility, best practices, SEO) over six runs; every other page 100 across the board.
- Layout checked at 375, 768 and 1440 px; no horizontal scroll.
