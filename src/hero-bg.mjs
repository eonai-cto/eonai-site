// Hero background: the logo's open loop, repeated as slowly turning rings, over a faint dot grid.
// Pure inline SVG + CSS transforms (GPU-composited, no requests, no layout shift).
// Motion stops under prefers-reduced-motion (see .hero-bg in site.css).
const C = 400; // centre of the 800×800 viewBox

// [radius, seconds per turn, direction, stroke opacity]
const rings = [
  [92, 38, 1, 0.55],
  [158, 64, -1, 0.42],
  [226, 90, 1, 0.32],
  [296, 130, -1, 0.22],
  [368, 180, 1, 0.14],
];

const GAP = 44; // degrees left open, as in the logo mark
const rad = (d) => (d * Math.PI) / 180;
const pt = (r, deg) => [(C + r * Math.cos(rad(deg))).toFixed(1), (C + r * Math.sin(rad(deg))).toFixed(1)];

const ring = ([r, s, dir, op], i) => {
  const len = 2 * Math.PI * r;
  const arc = (len * (360 - GAP)) / 360;
  const [dx, dy] = pt(r, 360 - GAP / 2 + 6);
  const pulse = i === 1
    ? `<circle class="hero-bg__pulse" cx="${C}" cy="${C}" r="${r}" stroke-dasharray="${(len * 0.07).toFixed(1)} ${(len * 0.93).toFixed(1)}"/>`
    : '';
  return `<g class="hero-bg__ring" style="--t:${s}s;--d:${dir === 1 ? 'normal' : 'reverse'};--o:${op}">
<circle cx="${C}" cy="${C}" r="${r}" stroke-dasharray="${arc.toFixed(1)} ${len.toFixed(1)}"/>
<circle class="hero-bg__dot" cx="${dx}" cy="${dy}" r="${i < 2 ? 6 : 5}"/>${pulse}
</g>`;
};

export const heroBg = () => `<div class="hero-bg" aria-hidden="true">
<div class="hero-bg__grid"></div>
<div class="hero-bg__glow"></div>
<svg class="hero-bg__rings" viewBox="0 0 800 800" focusable="false">
${rings.map(ring).join('\n')}
</svg>
</div>`;
