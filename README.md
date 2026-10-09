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
| `BOOKING_URL` | set (Zoho Bookings, free plan). Booking links open it in a new tab; if set to `null`, they fall back to `/#contact` and the privacy policy drops the Bookings line |
| `FORM_TARGET` | set to `hello@eonai.ai`; the form works once FormSubmit is activated. Optionally replace with FormSubmit's random alias to keep the address out of the HTML |
| `LINKEDIN_COMPANY_URL` | set to linkedin.com/company/eonai-ai (opens in a new tab). Note: `/company/eonai` belongs to an unrelated company |
| `CF_ANALYTICS_TOKEN` | no analytics beacon (optional) |

After setting a value, run `npm run build`, then commit and push.

## Owner to-do before announcing the site

- [x] `BOOKING_URL`: Zoho Bookings "30-minute working session" (free plan, Zoho Meeting link, Zoho Calendar sync), set 2026-10-08. Managed in the Zoho Bookings admin account; notifications go to hello@eonai.ai.
- [x] Contact form (FormSubmit): activated 2026-10-07; enquiries arrive at hello@eonai.ai. Activation is one-time; it is needed again only if `FORM_TARGET` changes to a new address or the form moves to another domain. Optional: paste FormSubmit's random alias into `FORM_TARGET` to keep the address out of the HTML.
- [x] `LINKEDIN_COMPANY_URL`: https://www.linkedin.com/company/eonai-ai/ (set 2026-10-09). Cover banner files are in `brand/social/`.
- [ ] Privacy policy: published (dated 8 October 2026). Optional: have an advisor review it; edit both `src/pages/privacy.mjs` (published) and `content/privacy.md` (source draft).
- [x] Engineering notes 2 to 9 written up as prose from the outline (2026-10-08). The owner may refine them in `src/notes-data.mjs`.
- [ ] Optional: `CF_ANALYTICS_TOKEN` for Cloudflare Web Analytics (cookieless, free).
- [ ] Send a test email to hello@eonai.ai to confirm mail still works after the DNS change.

## Editorial pass (2026-10-08)

An independent review removed lines that broke BRIEF § 4 ("twenty years", "two decades", "EonAI's CTO"), fixed mismatched read times and ledes, finished notes 2 to 9 as prose using only facts from `content/notes-outline.md`, and rewrote phrasing that read as AI-generated. `src/` is now the source of truth for copy (see `CLAUDE.md`). Still for the owner: the refunds note's dollar figures are scenario amounts, not prices, but a literal grep for `$` will flag them; the BCG estimate and the QuantumBlack quotation on the home page are the only third-party figures, so confirm their wording against the sources once.

## Logo

The logo files live in `brand/logo/` and are published at `https://eonai.ai/brand/`:

| File | Use |
|---|---|
| `eonai-logo-on-dark.svg` | wordmark on navy or dark backgrounds (site header and footer) |
| `eonai-logo-on-light.svg` / `.png` | wordmark on white or light backgrounds (documents, decks, email) |
| `eonai-mark-on-dark.svg`, `eonai-mark-on-light.svg` | the loop on its own |
| `eonai-app-icon.svg` / `.png` | square icon for LinkedIn and social avatars |
| `eonai-icon-square.png` | full-bleed square icon: use this for the LinkedIn company logo |
| `eonai-logo-square.png` | wordmark on a white square, for square logo slots (e.g. Zoho Bookings) |
| `favicon.svg` | browser tab icon (published at `/favicon.svg`) |
| `brand/social/linkedin-cover.png` (1128×191) and `@2x` | LinkedIn company page cover; source `linkedin-cover.html` (open in Chrome headless at 1128×191 to re-render) |

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

Copy is final: change it only on the owner's instruction, and follow the house style in `CLAUDE.md`. Then `npm run build`.

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
