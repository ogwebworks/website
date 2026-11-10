"""Remap brand hues: lime (~75deg) -> cyan (~190deg), violet (~255deg) -> blue (~215deg).
Weighted by saturation so neutrals (wood, skin, greys) are untouched; plant greens (>100deg) mostly kept."""
import sys
import numpy as np
from PIL import Image

def rgb_to_hsv(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(-1); mn = a.min(-1); d = mx - mn
    h = np.zeros_like(mx)
    m = d > 1e-6
    rm = m & (mx == r); gm = m & (mx == g) & ~rm; bm = m & ~rm & ~gm
    h[rm] = ((g - b)[rm] / d[rm]) % 6
    h[gm] = (b - r)[gm] / d[gm] + 2
    h[bm] = (r - g)[bm] / d[bm] + 4
    h = h * 60
    s = np.where(mx > 0, d / np.maximum(mx, 1e-6), 0)
    return h, s, mx

def hsv_to_rgb(h, s, v):
    h = (h % 360) / 60; i = np.floor(h).astype(int) % 6; f = h - np.floor(h)
    p = v * (1 - s); q = v * (1 - s * f); t = v * (1 - s * (1 - f))
    out = np.zeros(h.shape + (3,))
    for k, (r, g, b) in enumerate([(v, t, p), (q, v, p), (p, v, t), (p, q, v), (t, p, v), (v, p, q)]):
        sel = i == k
        out[sel] = np.stack([r[sel], g[sel], b[sel]], -1)
    return out

def window(h, lo, hi, feather):
    w = np.clip((h - (lo - feather)) / feather, 0, 1) * np.clip(((hi + feather) - h) / feather, 0, 1)
    return w

def recolor(path, out):
    a = np.asarray(Image.open(path).convert("RGB")).astype(float) / 255
    h, s, v = rgb_to_hsv(a)
    satw = np.clip((s - 0.25) / 0.35, 0, 1)
    lime = window(h, 58, 92, 14) * satw            # lime/yellow-green neon
    viol = window(h, 238, 300, 18) * satw          # violet/purple
    h2 = h + lime * (190 - 75) + viol * (214 - 262)
    # violet -> blue: also lift brightness slightly (blue reads darker than violet)
    v2 = np.clip(v * (1 + 0.06 * viol), 0, 1)
    rgb = hsv_to_rgb(h2, s, v2)
    Image.fromarray((rgb * 255).round().astype("uint8")).save(out, quality=95)

if __name__ == "__main__":
    for src, dst in zip(sys.argv[1::2], sys.argv[2::2]):
        recolor(src, dst); print("✓", dst)
