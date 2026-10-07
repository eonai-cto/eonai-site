import { SITE_URL, BOOKING_URL, LINKEDIN_COMPANY_URL, CF_ANALYTICS_TOKEN } from './config.mjs';

export const BOOK = BOOKING_URL || '/#contact';
export const LINKEDIN = LINKEDIN_COMPANY_URL || '/#contact';

export const FONTS =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&amp;family=IBM+Plex+Sans:wght@400;500;600&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const logoSvg = (size = 28) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 28 28" fill="none" stroke="#FFFFFF" stroke-width="2" aria-hidden="true"><circle cx="14" cy="14" r="11"></circle><path d="M8 14h12M14 8v12" stroke="#8FB0FF"></path></svg>`;

const NAV = [
  ['Problems we solve', '/#problems'],
  ['Services', '/#services'],
  ['How we work', '/#approach'],
  ['Engagements', '/#offers'],
  ['Engineering notes', '/notes/'],
];

function header(current) {
  const links = NAV.map(([label, href]) => {
    const cur = current === 'notes' && href === '/notes/' ? ' aria-current="page"' : '';
    return `<a href="${href}"${cur}>${label}</a>`;
  }).join('\n');
  return `<header class="site-header">
<div class="site-header__inner">
<a class="brand" href="/" aria-label="EonAI home">${logoSvg()}<span class="brand__name">EonAI</span></a>
<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
<nav class="nav" id="site-nav" aria-label="Main">
${links}
<a class="btn btn--primary" href="${BOOK}">Book a call</a>
</nav>
</div>
</header>`;
}

function footer() {
  const todo = LINKEDIN_COMPANY_URL ? '' : '<!-- TODO: LINKEDIN_COMPANY_URL (src/config.mjs) -->';
  return `<footer class="site-footer">
<div class="site-footer__inner">
<div class="site-footer__brand">
<span class="site-footer__name">EonAI</span>
<span>Evaluation-first AI engineering for startups and enterprises.</span>
<span class="site-footer__legal">EonAI Private Limited · CIN U62011TS2025PTC203906<br>Plot No 4, Doc Bhavan, 4th &amp; 5th Floor, Madhapur, Hyderabad 500081, India</span>
</div>
<div class="site-footer__cols">
<div class="site-footer__col">
<strong>Company</strong>
<a href="/#problems">Problems we solve</a>
<a href="/#services">Services</a>
<a href="/#approach">How we work</a>
<a href="/#offers">Engagements</a>
<a href="/#about">About</a>
</div>
<div class="site-footer__col">
<strong>Contact</strong>
<a href="mailto:hello@eonai.ai">hello@eonai.ai</a>
${todo}<a href="${LINKEDIN}">LinkedIn</a>
<a href="/privacy/">Privacy policy</a>
</div>
</div>
</div>
<div class="site-footer__copy">© 2026 EonAI Private Limited. All rights reserved.</div>
</footer>`;
}

/**
 * Wrap page content in the shared document shell.
 * opts: title, description, path (e.g. '/notes/'), current ('notes'), jsonLd (object|null), noindex, ogType
 */
export function page(opts, body) {
  const url = SITE_URL + opts.path;
  const jsonLd = opts.jsonLd ? `\n<script type="application/ld+json">${JSON.stringify(opts.jsonLd)}</script>` : '';
  const analytics = CF_ANALYTICS_TOKEN
    ? `\n<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${CF_ANALYTICS_TOKEN}"}'></script>`
    : '';
    const canonical = opts.noCanonical ? '' : `\n<link rel="canonical" href="${url}">`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description)}">${canonical}
<meta property="og:site_name" content="EonAI">
<meta property="og:type" content="${opts.ogType || 'website'}">
<meta property="og:title" content="${esc(opts.title)}">
<meta property="og:description" content="${esc(opts.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}/assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="EonAI. AI that works beyond the demo.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(opts.title)}">
<meta name="twitter:description" content="${esc(opts.description)}">
<meta name="twitter:image" content="${SITE_URL}/assets/og.png">
<meta name="theme-color" content="#0B1220">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<link rel="stylesheet" href="${FONTS}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>${jsonLd}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${header(opts.current)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/site.js" defer></script>${analytics}
</body>
</html>
`;
}
