"""Generate the AssureGraph product mark and wordmark from Space Grotesk outlines.

AssureGraph is EonAI's product, so the mark borrows the EonAI logo's grammar:
  - the same stroke weight (the Space Grotesk Light stem), round ends
  - an opening at the top right with a solid dot outside it, like the open loop
  - a two-weight lowercase wordmark, like "eonai": "assure" Light (300), "graph" Bold (700) in the accent colour
    (chosen by the owner 2026-10-25 over the capitalised version; in running text the product is "AssureGraph")
Inside the shield, three nodes joined by two edges form a tick: the coverage graph.

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

STROKE = 60          # EonAI Light stem weight (font units, 1000/em)
TRACK = -10
TOP = 760            # baseline from the top of the drawing
MARK_W, MARK_H = 700, 800   # shield box; bottom tip sits on the baseline + 40

def instance(weight):
    font = instantiateVariableFont(TTFont(FONT), {"wght": weight})
    return font.getGlyphSet(), font.getBestCmap()

LIGHT, BOLD = instance(300), instance(700)

def glyph(face, ch, x, top=TOP):
    gs, cmap = face
    name = cmap[ord(ch)]
    pen = SVGPathPen(gs)
    gs[name].draw(TransformPen(pen, (1, 0, 0, -1, x, top)))
    return pen.getCommands(), gs[name].width

def text(face, s, x):
    parts = []
    for ch in s:
        d, w = glyph(face, ch, x); parts.append(d); x += w + TRACK
    return parts, x

def shield_path(ox, oy):
    """Shield outline, open at the top-right corner. Drawn clockwise from the gap."""
    w, h = MARK_W, MARK_H
    s = STROKE / 2
    L, R, T = ox + s, ox + w - s, oy + s
    side_end = oy + 400          # where the straight sides end
    tip = (ox + w / 2, oy + h - s)
    gap_x = ox + 480             # the top edge ends here
    gap_y = oy + 180             # the right side starts here
    return (f"M{R:.0f} {gap_y:.0f} L{R:.0f} {side_end:.0f} "
            f"C{R:.0f} {side_end + 230:.0f} {tip[0] + 120:.0f} {tip[1] - 90:.0f} {tip[0]:.0f} {tip[1]:.0f} "
            f"C{tip[0] - 120:.0f} {tip[1] - 90:.0f} {L:.0f} {side_end + 230:.0f} {L:.0f} {side_end:.0f} "
            f"L{L:.0f} {T:.0f} L{gap_x:.0f} {T:.0f}")

def graph_tick(ox, oy):
    """Three nodes and two edges inside the shield, shaped as a tick."""
    n1, n2, n3 = (ox + 215, oy + 390), (ox + 320, oy + 520), (ox + 520, oy + 280)
    r, e = 46, 44
    edges = f'<path d="M{n1[0]} {n1[1]} L{n2[0]} {n2[1]} L{n3[0]} {n3[1]}" fill="none" stroke-width="{e}" stroke-linecap="round" stroke-linejoin="round"/>'
    nodes = "".join(f'<circle cx="{x}" cy="{y}" r="{r}"/>' for x, y in (n1, n2, n3))
    return edges, nodes

def mark(fg, accent, ox=0, oy=0):
    dot = (ox + MARK_W + 10, oy + 40)
    edges, nodes = graph_tick(ox, oy)
    return (f'<path d="{shield_path(ox, oy)}" fill="none" stroke="{fg}" stroke-width="{STROKE}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<circle cx="{dot[0]}" cy="{dot[1]}" r="{0.95 * STROKE:.0f}" fill="{accent}"/>'
            f'<g stroke="{accent}" fill="{accent}">{edges}{nodes}</g>')

def lockup(fg, accent):
    oy = TOP + 40 - MARK_H       # shield tip 40 below the baseline
    body = mark(fg, accent, 0, oy)
    x = MARK_W + 190
    a, x = text(LIGHT, "assure", x)
    g, x2 = text(BOLD, "graph", x + 20)
    body += f'<g fill="{fg}">' + "".join(f'<path d="{d}"/>' for d in a) + "</g>"
    body += f'<g fill="{accent}">' + "".join(f'<path d="{d}"/>' for d in g) + "</g>"
    return body, x2 + 20

def svg(view_box, body, label="AssureGraph"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}" role="img" aria-label="{label}">'
            f'{body}</svg>\n')

def tile(bg, fg, accent, size=64, radius=14):
    scale = size * 0.62 / MARK_H
    ox = (size / scale - MARK_W - 70) / 2 ; oy = (size / scale - MARK_H) / 2
    inner = mark(fg, accent, ox, oy)
    return svg(f"0 0 {size} {size}",
               f'<rect width="{size}" height="{size}" rx="{radius}" fill="{bg}"/>'
               f'<g transform="scale({scale:.5f})">{inner}</g>')

def main():
    os.makedirs(OUT, exist_ok=True)
    files = {}
    for name, fg, accent in (("on-light", INK, ACCENT), ("on-dark", WHITE, ACCENT_LIGHT)):
        body, w = lockup(fg, accent)
        files[f"assuregraph-logo-{name}.svg"] = svg(f"-20 -60 {w + 40:.0f} 900", body)
        files[f"assuregraph-mark-{name}.svg"] = svg(f"-40 -70 {MARK_W + 140} {MARK_H + 110}", mark(fg, accent))
    files["assuregraph-icon.svg"] = tile(NAVY, WHITE, ACCENT_LIGHT)
    files["assuregraph-icon-accent.svg"] = tile(ACCENT, WHITE, WHITE)
    for fn, content in files.items():
        with open(os.path.join(OUT, fn), "w") as f: f.write(content)
        print("wrote", fn)

if __name__ == "__main__":
    main()
