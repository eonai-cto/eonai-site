// Line icons for services and use cases (one style: 32px grid, 1.75 stroke, round joins).
// Colour comes from CSS (`currentColor`), so the same icon works on light and dark cards.
const paths = {
  build: '<path d="M11 9 L4 16 L11 23"/><path d="M21 9 L28 16 L21 23"/><path d="M18 6 L14 26"/>',
  assure: '<path d="M16 3 L27 7 V15 C27 22 22 27 16 29 C10 27 5 22 5 15 V7 Z"/><path d="M11 16 L15 20 L21 12"/>',
  transform: '<path d="M6 15 A10 10 0 0 1 24 9"/><path d="M25 3 V9 H19"/><path d="M26 17 A10 10 0 0 1 8 23"/><path d="M7 29 V23 H13"/>',
  scale: '<path d="M16 4 L28 10 L16 16 L4 10 Z"/><path d="M4 16 L16 22 L28 16"/><path d="M4 22 L16 28 L28 22"/>',
  support: '<path d="M5 6 H27 V21 H14 L8 26 V21 H5 Z"/><path d="M10 12 H22"/><path d="M10 16 H18"/>',
  knowledge: '<path d="M3 7 H13 C15 7 16 8 16 10 V26 C16 25 15 24 13 24 H3 Z"/><path d="M29 7 H19 C17 7 16 8 16 10 V26 C16 25 17 24 19 24 H29 Z"/>',
  documents: '<path d="M8 3 H19 L25 9 V29 H8 Z"/><path d="M19 3 V9 H25"/><path d="M12 19 L15 22 L21 15"/>',
  triage: '<ellipse cx="16" cy="19" rx="7" ry="9"/><path d="M16 10 V28"/><path d="M9 15 L4 13"/><path d="M9 21 H4"/><path d="M10 26 L6 29"/><path d="M23 15 L28 13"/><path d="M23 21 H28"/><path d="M22 26 L26 29"/><path d="M12 11 L10 6"/><path d="M20 11 L22 6"/>',
  testing: '<path d="M11 4 H21"/><path d="M13 4 V13 L6 25 C5 27 6 29 8 29 H24 C26 29 27 27 26 25 L19 13 V4"/><path d="M9 21 H23"/>',
  matching: '<circle cx="8" cy="9" r="4"/><circle cx="24" cy="9" r="4"/><circle cx="16" cy="24" r="4"/><path d="M12 9 H20"/><path d="M10 12.5 L14 20.5"/><path d="M22 12.5 L18 20.5"/>',
  compliance: '<path d="M11 4 H21 V8 H11 Z"/><path d="M11 6 H6 V29 H26 V6 H21"/><path d="M11 18 L15 22 L22 14"/>',
  routing: '<circle cx="6" cy="16" r="3"/><circle cx="26" cy="6" r="3"/><circle cx="26" cy="16" r="3"/><circle cx="26" cy="26" r="3"/><path d="M9 16 H23"/><path d="M14 16 C17 16 18 6 23 6"/><path d="M14 16 C17 16 18 26 23 26"/>',
};

export const icon = (name) =>
  `<span class="icon-tile" aria-hidden="true"><svg class="icon" viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" focusable="false">${paths[name]}</svg></span>`;
