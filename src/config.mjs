// Owner-supplied values. Replace the placeholders, then run `npm run build`.
export const SITE_URL = 'https://eonai.ai';

// Booking link: the Zoho Bookings share link for the "30-minute working session" event (free plan).
// While null, every "Book a call" link points to #contact. When set, booking links open it in a new tab
// and the privacy policy lists Zoho Bookings.
export const BOOKING_URL = 'https://eonaiai.zohobookings.in/487872000000029049'; // Zoho Bookings, "30-minute working session" (free plan, set up 2026-10-08)

// Contact form delivery via FormSubmit (formsubmit.co: free, no account, no published submission limit).
// The form posts to https://formsubmit.co/ajax/<FORM_TARGET>. Use the email address until FormSubmit's
// activation email supplies a random alias, then paste the alias here so the address is not in the HTML.
export const FORM_TARGET = 'hello@eonai.ai'; // TODO (optional): replace with the FormSubmit alias

// Footer LinkedIn link. While null, the link points to #contact.
export const LINKEDIN_COMPANY_URL = null; // TODO: LINKEDIN_COMPANY_URL

// Cloudflare Web Analytics token. Optional; leave null to omit the beacon.
export const CF_ANALYTICS_TOKEN = null; // TODO: CF_ANALYTICS_TOKEN (optional)

export const TALK_URL = 'https://www.youtube.com/watch?v=xwoiaOAfZRA';
// No thumbnail: the video's thumbnail shows a person's name and photo, which the site must not (CLAUDE.md).
export const TALK_TITLE = 'The Future of Quality in AI-Generated Software';
