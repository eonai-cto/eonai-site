# DNS and go-live steps (Namecheap → GitHub Pages)

**Do not modify any existing record.** The MX, TXT (SPF, DKIM at `zmail._domainkey`, DMARC at `_dmarc`, zoho-verification) records carry live company email.

## 1. In the GitHub repo
- Settings → Pages → Source: `main` branch, folder `/docs` (or the Actions workflow the README describes).
- Custom domain: `eonai.ai`. Wait for the DNS check, then tick **Enforce HTTPS**.
- The repo must contain a `CNAME` file in the published folder with the single line `eonai.ai`.

## 2. In Namecheap → Domain List → eonai.ai → Manage → Advanced DNS
Delete these two placeholder records (they belong to Namecheap's parking page):
- `CNAME  www  parkingpage.namecheap.com.`
- `URL Redirect Record  @  http://www.eonai.ai/`

Add these records:

| Type | Host | Value | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | Automatic |
| A | `@` | `185.199.109.153` | Automatic |
| A | `@` | `185.199.110.153` | Automatic |
| A | `@` | `185.199.111.153` | Automatic |
| CNAME | `www` | `<github-username>.github.io.` | Automatic |

Replace `<github-username>` with the GitHub account or organisation that owns the repo.

## 3. Verify
- `https://eonai.ai` and `https://www.eonai.ai` both load with a valid certificate (can take up to an hour after DNS).
- Send a test email to hello@eonai.ai afterwards to confirm mail is unaffected.
- Check `https://eonai.ai/sitemap.xml` loads, then submit the site in Google Search Console (free).

## 4. Placeholders to fill before launch
- `BOOKING_URL` (Zoho Bookings or Calendly link)
- `FORMSPREE_ENDPOINT` (create a free form at formspree.io, send to hello@eonai.ai)
- `LINKEDIN_COMPANY_URL`
- Optional: `CF_ANALYTICS_TOKEN` (Cloudflare Web Analytics, free, no DNS change needed)
