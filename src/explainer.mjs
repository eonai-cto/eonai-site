// "From demo to production": six numbered panels shown together (no animation, no player).
// Each panel is a small inline SVG; captions come from the site copy.

const scenes = [
  {
    label: 'A presentation slide with a rising chart and a tick',
    caption: 'The pilot looks good in the meeting.',
    svg: `<rect x="58" y="34" width="220" height="124" rx="8" fill="#111A2E" stroke="#22304A"/>
<g fill="#8FB0FF"><rect x="84" y="120" width="22" height="20" rx="2"/><rect x="116" y="106" width="22" height="34" rx="2"/><rect x="148" y="90" width="22" height="50" rx="2"/><rect x="180" y="68" width="22" height="72" rx="2"/></g>
<g><circle cx="244" cy="62" r="16" fill="#2B5BFF"/><path d="M236 62 L242 68 L253 56" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g>`,
  },
  {
    label: 'Rows of real data, some of them broken or unexpected',
    caption: 'Then real data arrives, with edge cases the demo never saw.',
    svg: `<g fill="#22304A"><rect x="60" y="40" width="160" height="14" rx="3"/><rect x="60" y="64" width="210" height="14" rx="3"/><rect x="60" y="88" width="120" height="14" rx="3"/><rect x="60" y="112" width="190" height="14" rx="3"/><rect x="60" y="136" width="150" height="14" rx="3"/></g>
<g fill="none" stroke="#FFFFFF" stroke-dasharray="4 4"><rect x="60" y="64" width="210" height="14" rx="3"/><rect x="60" y="112" width="190" height="14" rx="3"/></g>
<g><circle cx="286" cy="71" r="9" fill="#8FB0FF"/><text x="286" y="75" text-anchor="middle" fill="#0B1220" font-size="12" font-weight="600">?</text></g>
<g><circle cx="266" cy="119" r="9" fill="#8FB0FF"/><text x="266" y="123" text-anchor="middle" fill="#0B1220" font-size="12" font-weight="600">?</text></g>`,
  },
  {
    label: 'A checklist labelled test set',
    caption: 'Define success first: the test set the system has to pass.',
    svg: `<text x="92" y="44" fill="#8FB0FF" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="1.2">TEST SET</text>
<g fill="none" stroke="#8FB0FF" stroke-width="1.75"><rect x="92" y="58" width="14" height="14" rx="3"/><rect x="92" y="84" width="14" height="14" rx="3"/><rect x="92" y="110" width="14" height="14" rx="3"/><rect x="92" y="136" width="14" height="14" rx="3"/></g>
<g fill="#22304A"><rect x="118" y="60" width="130" height="10" rx="3"/><rect x="118" y="86" width="100" height="10" rx="3"/><rect x="118" y="112" width="140" height="10" rx="3"/><rect x="118" y="138" width="90" height="10" rx="3"/></g>`,
  },
  {
    label: 'Four results measured against a line; the last falls short and is held',
    caption: 'Test it properly. Below the bar, it does not ship.',
    svg: `<g fill="#8FB0FF"><rect x="60" y="48" width="190" height="12" rx="3"/><rect x="60" y="74" width="190" height="12" rx="3"/><rect x="60" y="100" width="190" height="12" rx="3"/></g>
<rect x="60" y="126" width="120" height="12" rx="3" fill="#FFFFFF"/>
<path d="M220 36 V152" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="4 4"/>
<g><rect x="236" y="122" width="52" height="22" rx="4" fill="#8FB0FF"/><text x="262" y="137" text-anchor="middle" fill="#0B1220" font-family="IBM Plex Mono, monospace" font-size="11">HOLD</text></g>`,
  },
  {
    label: 'A loop arrow around the system',
    caption: 'Fix it and test again, until it clears the bar you set.',
    svg: `<g><path d="M118 94 A50 50 0 1 1 168 144" fill="none" stroke="#8FB0FF" stroke-width="3" stroke-linecap="round"/><path d="M160 136 L168 144 L160 152" fill="none" stroke="#8FB0FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>
<circle cx="168" cy="94" r="18" fill="#111A2E" stroke="#22304A"/><circle cx="168" cy="94" r="5" fill="#8FB0FF"/>`,
  },
  {
    label: 'A monitoring line, and code, tests and documentation handed over',
    caption: 'Ship with monitoring, then hand over the code, tests and documentation.',
    svg: `<path d="M40 70 H110 L124 46 L142 96 L158 58 L170 70 H296" fill="none" stroke="#8FB0FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<g><rect x="88" y="118" width="150" height="44" rx="6" fill="#111A2E" stroke="#22304A"/><text x="163" y="144" text-anchor="middle" fill="#DCE3EF" font-family="IBM Plex Mono, monospace" font-size="10">CODE · TESTS · DOCS</text></g>
<g stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M246 140 H288"/><path d="M280 132 L288 140 L280 148"/></g>`,
  },
];

export const explainer = () => `
<ol class="storyboard">
${scenes.map((sc, i) => `<li class="storyboard__item">
<svg class="storyboard__art" viewBox="0 0 336 189" role="img" aria-label="${sc.label}" focusable="false">${sc.svg}</svg>
<p class="storyboard__caption"><span class="storyboard__num">${String(i + 1).padStart(2, '0')}</span>${sc.caption}</p>
</li>`).join('\n')}
</ol>`;
