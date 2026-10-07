import { page } from '../layout.mjs';

const body = `
<section class="on-dark">
<div class="container prose-404">
<div class="eyebrow">404</div>
<h1 class="h2">This page does not exist.</h1>
<p>The address may be wrong, or the page may have moved.</p>
<a class="btn btn--primary" href="/">Go to the home page</a>
</div>
</section>
`;

export default page({
  title: 'Page not found — EonAI',
  description: 'The page you requested does not exist. Return to the EonAI home page.',
  path: '/404.html',
  noCanonical: true,
}, body);
