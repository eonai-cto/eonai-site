"""Generate the EonAI logo files from Space Grotesk outlines.

The logo ("hybrid H2") is the lowercase wordmark "eonai":
  - "e" and "n" in Space Grotesk Light (300)
  - the "o" replaced by the open loop: a ring drawn at the Light stem weight,
    open at the top right, with a solid dot just outside the gap
  - "ai" in Space Grotesk Bold (700), in the accent colour
  - the dot is the same accent colour as "ai"

Run:  pip install fonttools && python3 brand/make-logo.py
Writes the SVGs and favicon.svg into brand/logo/. The constants below are the logo specification.
"""
import math
import os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, "source", "SpaceGrotesk[wght].ttf")
OUT = os.path.join(HERE, "logo")

# Brand colours (see CLAUDE.md, "Logo")
NAVY, INK, WHITE = "#0B1220", "#0E1726", "#FFFFFF"
ACCENT, ACCENT_LIGHT = "#2B5BFF", "#8FB0FF"

# Loop geometry, in font units (1000/em). Matches the Light "o" box.
STROKE = 60            # Light stem weight
GAP_START, GAP_END = -106, -46   # degrees, SVG convention (0 = right, -90 = up)
DOT_ANGLE = -50        # degrees
DOT_OFFSET = 1.65      # dot centre sits r + DOT_OFFSET * STROKE from the centre
DOT_R = 0.95 * STROKE
TRACK = -12            # letter-spacing between glyphs (font units)
TOP = 760              # baseline position from the top of the drawing


def instance(weight):
    font = instantiateVariableFont(TTFont(FONT), {"wght": weight})
    return font.getGlyphSet(), font.getBestCmap()


LIGHT, BOLD = instance(300), instance(700)


def glyph(face, ch, x):
    gs, cmap = face
    name = cmap[ord(ch)]
    pen = SVGPathPen(gs)
    gs[name].draw(TransformPen(pen, (1, 0, 0, -1, x, TOP)))
    return pen.getCommands(), gs[name].width


def loop_geometry(x):
    # Centre and radius from the Light "o" bounds: x 64..556, y -14..500, advance 620
    cx, cy = x + 310, TOP - 243
    r = 257 - STROKE / 2
    return cx, cy, r


def loop_path(cx, cy, r):
    a0, a1 = math.radians(GAP_END), math.radians(GAP_START + 360)
    x0, y0 = cx + r * math.cos(a0), cy + r * math.sin(a0)
    x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
    return f"M{x0:.1f} {y0:.1f}A{r:.1f} {r:.1f} 0 1 1 {x1:.1f} {y1:.1f}"


def dot_centre(cx, cy, r):
    a = math.radians(DOT_ANGLE)
    d = r + DOT_OFFSET * STROKE
    return cx + d * math.cos(a), cy + d * math.sin(a)


def wordmark(fg, accent):
    x = 0
    parts = []
    e, w = glyph(LIGHT, "e", x); parts.append(("fg", e)); x += w + TRACK
    cx, cy, r = loop_geometry(x); x += 620 + TRACK
    n, w = glyph(LIGHT, "n", x); parts.append(("fg", n)); x += w + TRACK
    a, w = glyph(BOLD, "a", x); parts.append(("accent", a)); x += w + TRACK
    i, w = glyph(BOLD, "i", x); parts.append(("accent", i)); x += w
    dx, dy = dot_centre(cx, cy, r)
    width = x + 10
    top = min(dy - DOT_R, TOP - 714) - 10
    height = TOP + 24 - top
    fg_d = " ".join(d for k, d in parts if k == "fg")
    ac_d = " ".join(d for k, d in parts if k == "accent")
    body = (
        f'<path fill="{fg}" d="{fg_d}"/>'
        f'<path fill="none" stroke="{fg}" stroke-width="{STROKE}" stroke-linecap="round" d="{loop_path(cx, cy, r)}"/>'
        f'<circle fill="{accent}" cx="{dx:.1f}" cy="{dy:.1f}" r="{DOT_R:.1f}"/>'
        f'<path fill="{accent}" d="{ac_d}"/>'
    )
    return f"0 {top:.0f} {width:.0f} {height:.0f}", body


def mark(fg, accent, stroke_scale=1.0):
    """The loop alone, centred in a square viewBox."""
    cx, cy, r = loop_geometry(0)
    dx, dy = dot_centre(cx, cy, r)
    sw = STROKE * stroke_scale
    pad = 12
    left = cx - r - sw / 2 - pad
    top = dy - DOT_R - pad
    right = max(cx + r + sw / 2, dx + DOT_R) + pad
    bottom = cy + r + sw / 2 + pad
    size = max(right - left, bottom - top)
    left -= (size - (right - left)) / 2
    top -= (size - (bottom - top)) / 2
    body = (
        f'<path fill="none" stroke="{fg}" stroke-width="{sw:.1f}" stroke-linecap="round" d="{loop_path(cx, cy, r)}"/>'
        f'<circle fill="{accent}" cx="{dx:.1f}" cy="{dy:.1f}" r="{DOT_R * stroke_scale ** 0.5:.1f}"/>'
    )
    return (left, top, size), body


def svg(view_box, body, label="EonAI"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}" role="img" aria-label="{label}">'
            f'<title>{label}</title>{body}</svg>\n')


def tile(bg, fg, accent, size=64, radius=14, inset=0.18, stroke_scale=1.35):
    (left, top, s), body = mark(fg, accent, stroke_scale)
    scale = size * (1 - 2 * inset) / s
    tx = size * inset - left * scale
    ty = size * inset - top * scale
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
            f'<rect width="{size}" height="{size}" rx="{radius}" fill="{bg}"/>'
            f'<g transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f})">{body}</g></svg>\n')


os.makedirs(OUT, exist_ok=True)
files = {
    "eonai-logo-on-dark.svg": svg(*wordmark(WHITE, ACCENT_LIGHT)),
    "eonai-logo-on-light.svg": svg(*wordmark(INK, ACCENT)),
}
for name, (fg, ac) in {"eonai-mark-on-dark.svg": (WHITE, ACCENT_LIGHT), "eonai-mark-on-light.svg": (INK, ACCENT)}.items():
    (l, t, s), body = mark(fg, ac)
    files[name] = svg(f"{l:.0f} {t:.0f} {s:.0f} {s:.0f}", body)
files["eonai-app-icon.svg"] = tile(ACCENT, WHITE, WHITE, stroke_scale=1.05)
for name, content in files.items():
    with open(os.path.join(OUT, name), "w") as fh:
        fh.write(content)
with open(os.path.join(OUT, "favicon.svg"), "w") as fh:
    fh.write(tile(NAVY, WHITE, ACCENT_LIGHT, inset=0.14, stroke_scale=1.7))
print("Wrote", ", ".join(sorted(files)), "and favicon.svg")
