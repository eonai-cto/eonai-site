import { page } from '../layout.mjs';

const body = `
<section class="page-title on-dark">
<div class="container page-title__inner">
<div class="eyebrow">LEGAL</div>
<h1>Privacy policy</h1>
</div>
</section>

<div class="container">
<div class="prose">
<p><strong>EonAI Private Limited</strong> (“EonAI”, “we”) operates eonai.ai. This policy explains what we collect, why, and your rights. It is drafted to meet India’s Digital Personal Data Protection Act, 2023 and the EU/UK GDPR. It is a draft; the owner should review it with their advisor before publication.</p>

<h2>What we collect</h2>
<ul>
<li><strong>Contact form:</strong> name, work email, your selections (interest, stage), your message, and your consent choices. Submitted to our form provider (FormSubmit) and delivered to hello@eonai.ai.</li>
<li><strong>Email:</strong> anything you send to an eonai.ai address, processed on Zoho Mail.</li>
<li><strong>Analytics (if enabled):</strong> aggregate, cookieless page statistics via Cloudflare Web Analytics. No personal identifiers.</li>
<li><strong>No cookies</strong> are set by this site for tracking. Fonts are served from this site; no third-party font service is used.</li>
</ul>

<h2>Why we process it</h2>
<ul>
<li>To respond to your enquiry (consent and legitimate interest).</li>
<li>To send occasional notes if you opted in (consent; withdraw any time by replying “unsubscribe”).</li>
<li>To understand how the site is used, in aggregate.</li>
</ul>

<h2>Retention</h2>
<p>Enquiries are kept for as long as needed to respond and for up to 24 months thereafter unless an engagement follows. Marketing consent is kept until withdrawn.</p>

<h2>Sharing</h2>
<p>We do not sell personal data. Processors: FormSubmit (form delivery), Zoho (email), Cloudflare (analytics, if enabled), GitHub (hosting). Each processes data under its own terms.</p>

<h2>Your rights</h2>
<p>Access, correction, erasure, withdrawal of consent, and grievance redressal. Write to hello@eonai.ai. Under the DPDP Act you may also nominate a representative. We respond within 30 days.</p>

<h2>Contact</h2>
<p>EonAI Private Limited, Plot No 4, Doc Bhavan, 4th &amp; 5th Floor, Madhapur, Hyderabad 500081, India. hello@eonai.ai.</p>

<p><em>Last updated: <span class="todo">[DATE]</span></em></p>
</div>
</div>
`;

export default page({
  title: 'Privacy policy — EonAI',
  description: 'How EonAI collects and uses personal data on eonai.ai, and your rights under India’s DPDP Act and the GDPR.',
  path: '/privacy/',
}, body);
