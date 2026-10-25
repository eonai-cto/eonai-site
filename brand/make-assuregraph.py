"""Generate the AssureGraph product mark and wordmark from Space Grotesk outlines.

AssureGraph is EonAI's product, so the mark borrows the EonAI logo's grammar:
  - the open loop: a ring open at the top right, with a solid dot outside the gap
  - inside the loop, three nodes joined by two edges form a tick: the coverage graph
  - a two-weight lowercase wordmark, like "eonai": "assure" Light (300), "graph" Bold (700) in the accent
  - the "g" of "graph" IS the loop: the ring is the bowl of a single-storey g, its right side runs
    down into the descender, the dot sits where the ear would be and the tick sits in the bowl
  - the tick is green: the "pass" signal, the one place the brand uses green (plus the hero demo's
    pass marks on the site, so the logo is not the only green thing on a page)
    (chosen by the owner 2026-10-25; in running text the product is "AssureGraph")

Run:  pip install fonttools && python3 brand/make-assuregraph.py
Writes brand/logo/assuregraph-*.svg. The constants below are the specification.
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

NAVY, INK, WHITE = "#0B1220", "#0E1726", "#FFFFFF"
ACCENT, ACCENT_LIGHT = "#2B5BFF", "#8FB0FF"
GREEN_DARK, GREEN_LIGHT = "#3DDC97", "#0E9F6E"   # the tick: on dark surfaces / on light surfaces (4.5:1 on #F5F6F8)

STROKE = 60          # EonAI Light stem weight (font units, 1000/em), used by the standalone icon
TRACK = -10
TOP = 760            # baseline from the top of the drawing
GAP = (-46, 254)     # the loop's opening, SVG angles (0 = right, -90 = up): same as the EonAI loop
G_STROKE = 124       # Bold stem weight of Space Grotesk 700, so the g matches "raph"
G_R = 226            # bowl radius of the g
G_DESCENDER = 235    # how far the hook reaches below the baseline (the font's own descender depth)
TICK_W, TICK_R = 58, 56          # tick stroke and node radius in the standalone icon ("one step bolder", owner 2026-10-25)
G_TICK_W, G_TICK_R = 54, 50      # the same tick inside the g


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


def text(face, s, x):
    parts = []
    for ch in s:
        d, w = glyph(face, ch, x)
        parts.append(d)
        x += w + TRACK
    return parts, x


def arc(cx, cy, r, a0, a1):
    x0, y0 = cx + r * math.cos(math.radians(a0)), cy + r * math.sin(math.radians(a0))
    x1, y1 = cx + r * math.cos(math.radians(a1)), cy + r * math.sin(math.radians(a1))
    return f"M{x0:.1f} {y0:.1f}A{r:.1f} {r:.1f} 0 1 1 {x1:.1f} {y1:.1f}"


def tick(cx, cy, k, colour, w=44, nr=46):
    """Three nodes and two edges shaped as a tick, scaled by k about (cx, cy)."""
    n1, n2, n3 = (cx - 150 * k, cy + 10 * k), (cx - 40 * k, cy + 150 * k), (cx + 170 * k, cy - 110 * k)
    edges = (f'<path d="M{n1[0]:.1f} {n1[1]:.1f} L{n2[0]:.1f} {n2[1]:.1f} L{n3[0]:.1f} {n3[1]:.1f}" '
             f'fill="none" stroke-width="{w * k:.1f}" stroke-linecap="round" stroke-linejoin="round"/>')
    nodes = "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{nr * k:.1f}"/>' for x, y in (n1, n2, n3))
    return f'<g stroke="{colour}" fill="{colour}">{edges}{nodes}</g>'


ICON_R = 370 - STROKE / 2   # the standalone icon's ring, in an 800-unit box


def mark(fg, accent, green, ox=0, oy=0):
    """The standalone icon: the open loop with the dot, the green tick inside."""
    cx, cy = ox + 400, oy + 400
    body = f'<path d="{arc(cx, cy, ICON_R, *GAP)}" fill="none" stroke="{fg}" stroke-width="{STROKE}" stroke-linecap="round"/>'
    d = ICON_R + 1.65 * STROKE
    body += (f'<circle cx="{cx + d * math.cos(math.radians(-50)):.1f}" cy="{cy + d * math.sin(math.radians(-50)):.1f}" '
             f'r="{0.95 * STROKE:.0f}" fill="{accent}"/>')
    return body + tick(cx, cy, 1.0, green, w=TICK_W, nr=TICK_R)


def loop_g(x, accent, fg, green):
    """The g of "graph": the loop as the bowl, stem into the descender, dot at the ear, tick in the bowl."""
    r, st = G_R, G_STROKE
    cx, cy = x + r + st / 2, TOP - 250
    body = f'<path d="{arc(cx, cy, r, *GAP)}" fill="none" stroke="{accent}" stroke-width="{st}" stroke-linecap="round"/>'
    sx = cx + r
    bottom = TOP + G_DESCENDER
    body += (f'<path d="M{sx:.0f} {cy:.0f} L{sx:.0f} {TOP + 100:.0f} '
             f'C{sx:.0f} {bottom + 20:.0f} {cx - 30:.0f} {bottom + 20:.0f} {cx - r + 30:.0f} {bottom - 40:.0f}" '
             f'fill="none" stroke="{accent}" stroke-width="{st}" stroke-linecap="round" stroke-linejoin="round"/>')
    d = r + 0.92 * st
    body += (f'<circle cx="{cx + d * math.cos(math.radians(-52)):.1f}" cy="{cy + d * math.sin(math.radians(-52)):.1f}" '
             f'r="{0.44 * st:.0f}" fill="{fg}"/>')
    body += tick(cx, cy, r / ICON_R, green, w=G_TICK_W, nr=G_TICK_R)
    return body, x + 2 * r + st + 60


def wordmark(fg, accent, green):
    x = 0
    a, x = text(LIGHT, "assure", x)
    body = f'<g fill="{fg}">' + "".join(f'<path d="{d}"/>' for d in a) + "</g>"
    seg, x = loop_g(x + 26, accent, fg, green)
    body += seg
    g, x = text(BOLD, "raph", x)
    body += f'<g fill="{accent}">' + "".join(f'<path d="{d}"/>' for d in g) + "</g>"
    return body, x


def svg(view_box, body, label="AssureGraph"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}" role="img" aria-label="{label}">'
            f'{body}</svg>\n')


def tile(bg, fg, accent, green, size=64, radius=14):
    scale = size * 0.62 / 800
    ox = (size / scale - 800 - 90) / 2
    oy = (size / scale - 800) / 2
    return svg(f"0 0 {size} {size}",
               f'<rect width="{size}" height="{size}" rx="{radius}" fill="{bg}"/>'
               f'<g transform="scale({scale:.5f})">{mark(fg, accent, green, ox, oy)}</g>')


def main():
    os.makedirs(OUT, exist_ok=True)
    files = {}
    # The whole word stays inside the box: from above the ascenders to below the g's hook.
    top, bottom = -20, TOP + G_DESCENDER + 90
    for name, fg, accent, green in (("on-light", INK, ACCENT, GREEN_LIGHT), ("on-dark", WHITE, ACCENT_LIGHT, GREEN_DARK)):
        body, w = wordmark(fg, accent, green)
        files[f"assuregraph-logo-{name}.svg"] = svg(f"-20 {top} {w + 40:.0f} {bottom - top}", body)
        files[f"assuregraph-mark-{name}.svg"] = svg("-40 -70 940 910", mark(fg, accent, green))
    files["assuregraph-icon.svg"] = tile(NAVY, WHITE, ACCENT_LIGHT, GREEN_DARK)
    files["assuregraph-icon-accent.svg"] = tile(ACCENT, WHITE, WHITE, GREEN_DARK)
    for fn, content in files.items():
        with open(os.path.join(OUT, fn), "w") as f:
            f.write(content)
        print("wrote", fn)


if __name__ == "__main__":
    main()
