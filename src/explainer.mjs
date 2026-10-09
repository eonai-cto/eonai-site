// "From demo to production" explainer: six animated scenes, click to play.
// Built from inline SVG and CSS; no video file and no third-party player.
// Without JavaScript the scenes show as a static grid. Animations are CSS keyframes that
// run only on the active scene and are switched off for prefers-reduced-motion.

const scenes = [
  {
    label: 'A presentation slide with a rising chart and a tick',
    caption: 'The pilot looks good in the meeting.',
    svg: `<rect x="58" y="34" width="220" height="124" rx="8" fill="#111A2E" stroke="#22304A"/>
<g fill="#8FB0FF"><rect class="a-rise" style="--d:.1s" x="84" y="120" width="22" height="20" rx="2"/><rect class="a-rise" style="--d:.25s" x="116" y="106" width="22" height="34" rx="2"/><rect class="a-rise" style="--d:.4s" x="148" y="90" width="22" height="50" rx="2"/><rect class="a-rise" style="--d:.55s" x="180" y="68" width="22" height="72" rx="2"/></g>
<g class="a-pop" style="--d:1s"><circle cx="244" cy="62" r="16" fill="#2B5BFF"/><path d="M236 62 L242 68 L253 56" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g>`,
  },
  {
    label: 'Rows of real data, some of them broken or unexpected',
    caption: 'Then real data arrives, with edge cases the demo never saw.',
    svg: `<g fill="#22304A"><rect class="a-grow" style="--d:.1s" x="60" y="40" width="160" height="14" rx="3"/><rect class="a-grow" style="--d:.2s" x="60" y="64" width="210" height="14" rx="3"/><rect class="a-grow" style="--d:.3s" x="60" y="88" width="120" height="14" rx="3"/><rect class="a-grow" style="--d:.4s" x="60" y="112" width="190" height="14" rx="3"/><rect class="a-grow" style="--d:.5s" x="60" y="136" width="150" height="14" rx="3"/></g>
<g class="a-fade" style="--d:1s" fill="none" stroke="#FFFFFF" stroke-dasharray="4 4"><rect x="60" y="64" width="210" height="14" rx="3"/><rect x="60" y="112" width="190" height="14" rx="3"/></g>
<g class="a-pop" style="--d:1.3s"><circle cx="286" cy="71" r="9" fill="#8FB0FF"/><text x="286" y="75" text-anchor="middle" fill="#0B1220" font-size="12" font-weight="600">?</text></g>
<g class="a-pop" style="--d:1.5s"><circle cx="266" cy="119" r="9" fill="#8FB0FF"/><text x="266" y="123" text-anchor="middle" fill="#0B1220" font-size="12" font-weight="600">?</text></g>`,
  },
  {
    label: 'A checklist labelled test set',
    caption: 'Define success first: the test set the system has to pass.',
    svg: `<text class="a-fade" style="--d:.1s" x="92" y="44" fill="#8FB0FF" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="1.2">TEST SET</text>
<g fill="none" stroke="#8FB0FF" stroke-width="1.75"><rect class="a-pop" style="--d:.3s" x="92" y="58" width="14" height="14" rx="3"/><rect class="a-pop" style="--d:.5s" x="92" y="84" width="14" height="14" rx="3"/><rect class="a-pop" style="--d:.7s" x="92" y="110" width="14" height="14" rx="3"/><rect class="a-pop" style="--d:.9s" x="92" y="136" width="14" height="14" rx="3"/></g>
<g fill="#22304A"><rect class="a-grow" style="--d:.35s" x="118" y="60" width="130" height="10" rx="3"/><rect class="a-grow" style="--d:.55s" x="118" y="86" width="100" height="10" rx="3"/><rect class="a-grow" style="--d:.75s" x="118" y="112" width="140" height="10" rx="3"/><rect class="a-grow" style="--d:.95s" x="118" y="138" width="90" height="10" rx="3"/></g>`,
  },
  {
    label: 'Four results measured against a line; the last falls short and is held',
    caption: 'Test it properly. Below the bar, it does not ship.',
    svg: `<g fill="#8FB0FF"><rect class="a-grow" style="--d:.1s" x="60" y="48" width="190" height="12" rx="3"/><rect class="a-grow" style="--d:.3s" x="60" y="74" width="190" height="12" rx="3"/><rect class="a-grow" style="--d:.5s" x="60" y="100" width="190" height="12" rx="3"/></g>
<rect class="a-grow" style="--d:.7s" x="60" y="126" width="120" height="12" rx="3" fill="#FFFFFF"/>
<path d="M220 36 V152" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="4 4"/>
<g class="a-pop" style="--d:1.4s"><rect x="236" y="122" width="52" height="22" rx="4" fill="#8FB0FF"/><text x="262" y="137" text-anchor="middle" fill="#0B1220" font-family="IBM Plex Mono, monospace" font-size="11">HOLD</text></g>`,
  },
  {
    label: 'A loop arrow around the system',
    caption: 'Fix it and test again, until it clears the bar you set.',
    svg: `<g class="a-spin" style="--d:.1s"><path d="M118 94 A50 50 0 1 1 168 144" fill="none" stroke="#8FB0FF" stroke-width="3" stroke-linecap="round"/><path d="M160 136 L168 144 L160 152" fill="none" stroke="#8FB0FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>
<circle cx="168" cy="94" r="18" fill="#111A2E" stroke="#22304A"/><circle class="a-pop" style="--d:.9s" cx="168" cy="94" r="5" fill="#8FB0FF"/>`,
  },
  {
    label: 'A monitoring line, and code, tests and documentation handed over',
    caption: 'Ship with monitoring, then hand over the code, tests and documentation.',
    svg: `<path class="a-draw" style="--d:.1s" pathLength="1" d="M40 70 H110 L124 46 L142 96 L158 58 L170 70 H296" fill="none" stroke="#8FB0FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<g class="a-fade" style="--d:1s"><rect x="118" y="118" width="100" height="44" rx="6" fill="#111A2E" stroke="#22304A"/><text x="168" y="145" text-anchor="middle" fill="#DCE3EF" font-family="IBM Plex Mono, monospace" font-size="10">CODE · TESTS · DOCS</text></g>
<g class="a-grow" style="--d:1.5s" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M226 140 H272"/><path d="M264 132 L272 140 L264 148"/></g>`,
  },
];

export const explainer = () => `
<div class="player" data-player>
<div class="player__stage">
${scenes.map((s, i) => `<figure class="scene${i === 0 ? ' is-active' : ''}" data-scene="${i}">
<svg class="scene__art" viewBox="0 0 336 189" role="img" aria-label="${s.label}" focusable="false">${s.svg}</svg>
<figcaption class="scene__caption"><span class="scene__num">${i + 1}/${scenes.length}</span> ${s.caption}</figcaption>
</figure>`).join('\n')}
</div>
<div class="player__bar">
<button class="player__play" type="button" aria-pressed="false"><span class="player__play-icon" aria-hidden="true"></span><span class="player__play-label">Play</span></button>
<div class="player__dots">
${scenes.map((s, i) => `<button class="player__dot${i === 0 ? ' is-active' : ''}" type="button" data-go="${i}" aria-label="Scene ${i + 1}: ${s.caption}"${i === 0 ? ' aria-current="true"' : ''}><span></span></button>`).join('')}
</div>
</div>
<p class="visually-hidden" aria-live="polite" data-player-live></p>
</div>`;
