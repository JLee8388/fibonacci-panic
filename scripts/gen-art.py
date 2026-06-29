#!/usr/bin/env python3
"""Generate the App Store icon and splash artwork for Short Fuse.

Reproducible source-of-truth for the brand art. Outputs:
  resources/icon.png          1024x1024  (App Store / home-screen icon source)
  resources/splash.png        2732x2732  (launch screen, light)
  resources/splash-dark.png   2732x2732  (launch screen, dark)

On a Mac, `npx @capacitor/assets generate` expands these into every iOS size.
Run: python3 scripts/gen-art.py
"""
import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES = os.path.join(ROOT, "resources")
os.makedirs(RES, exist_ok=True)

NEUTRAL_900 = (23, 23, 23)
ROSE_400 = (251, 113, 133)
ORANGE_500 = (249, 115, 22)
AMBER = (251, 191, 36)
FONT_BOLD = "/mnt/skills/examples/canvas-design/canvas-fonts/BigShoulders-Bold.ttf"
FONT_FALLBACK = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def load_font(size):
    for path in (FONT_BOLD, FONT_FALLBACK):
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()


def diagonal_gradient(size, c1, c2):
    """Diagonal (top-left -> bottom-right) gradient image."""
    img = Image.new("RGB", (size, size))
    px = img.load()
    maxd = (size - 1) * 2
    for y in range(size):
        for x in range(size):
            t = (x + y) / maxd
            px[x, y] = (
                int(c1[0] + (c2[0] - c1[0]) * t),
                int(c1[1] + (c2[1] - c1[1]) * t),
                int(c1[2] + (c2[2] - c1[2]) * t),
            )
    return img


def draw_bomb(base, cx, cy, r, glow=True):
    """Draw a stylized bomb centered at (cx, cy) with body radius r."""
    size = base.size[0]
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)

    # Soft drop shadow under the bomb.
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse([cx - r, cy - r + int(r * 0.12), cx + r, cy + r + int(r * 0.12)], fill=(0, 0, 0, 150))
    shadow = shadow.filter(ImageFilter.GaussianBlur(r * 0.06))
    overlay = Image.alpha_composite(overlay, shadow)
    d = ImageDraw.Draw(overlay)

    # Bomb body.
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(15, 15, 17, 255))
    # Rim light.
    d.arc([cx - r, cy - r, cx + r, cy + r], start=120, end=260, fill=(80, 80, 90, 255), width=max(3, r // 28))
    # Soft specular highlight (blurred on its own layer so it reads as a shine).
    hl = Image.new("RGBA", base.size, (0, 0, 0, 0))
    hd = ImageDraw.Draw(hl)
    hl_r = int(r * 0.30)
    hx, hy = cx - int(r * 0.34), cy - int(r * 0.36)
    hd.ellipse([hx - hl_r, hy - hl_r, hx + hl_r, hy + hl_r], fill=(255, 255, 255, 90))
    hl = hl.filter(ImageFilter.GaussianBlur(r * 0.09))
    overlay = Image.alpha_composite(overlay, hl)
    d = ImageDraw.Draw(overlay)

    # Cap / neck on top.
    cap_w, cap_h = int(r * 0.42), int(r * 0.30)
    cap_x, cap_y = cx - cap_w // 2, cy - r - int(cap_h * 0.55)
    d.rounded_rectangle([cap_x, cap_y, cap_x + cap_w, cap_y + cap_h], radius=cap_h // 4, fill=(60, 60, 66, 255))

    # Curved fuse.
    fuse_pts = []
    fx, fy = cx, cap_y
    for i in range(28):
        t = i / 27
        px = fx + int(math.sin(t * math.pi * 1.4) * r * 0.42)
        py = fy - int(t * r * 0.62)
        fuse_pts.append((px, py))
    d.line(fuse_pts, fill=(168, 162, 158, 255), width=max(4, r // 22), joint="curve")

    # Spark glow at the fuse tip.
    tipx, tipy = fuse_pts[-1]
    spark = Image.new("RGBA", base.size, (0, 0, 0, 0))
    sp = ImageDraw.Draw(spark)
    for rad, col in ((int(r * 0.22), (251, 191, 36, 120)), (int(r * 0.12), (255, 237, 160, 220))):
        sp.ellipse([tipx - rad, tipy - rad, tipx + rad, tipy + rad], fill=col)
    spark = spark.filter(ImageFilter.GaussianBlur(r * 0.02))
    overlay = Image.alpha_composite(overlay, spark)
    d = ImageDraw.Draw(overlay)
    # Spark rays.
    for ang in range(0, 360, 45):
        rr = int(r * 0.20)
        ex = tipx + int(math.cos(math.radians(ang)) * rr)
        ey = tipy + int(math.sin(math.radians(ang)) * rr)
        d.line([tipx, tipy, ex, ey], fill=(255, 240, 180, 230), width=max(2, r // 60))

    if glow:
        base.alpha_composite(overlay)
    else:
        base.alpha_composite(overlay)
    return base


def make_icon():
    size = 1024
    bg = diagonal_gradient(size, ROSE_400, ORANGE_500).convert("RGBA")
    # Vignette for depth.
    vig = Image.new("L", (size, size), 0)
    vd = ImageDraw.Draw(vig)
    vd.ellipse([-size * 0.25, -size * 0.25, size * 1.25, size * 1.25], fill=80)
    vig = vig.filter(ImageFilter.GaussianBlur(size * 0.2))
    dark = Image.new("RGBA", (size, size), (0, 0, 0, 60))
    bg = Image.composite(bg, Image.alpha_composite(bg, dark), vig)
    draw_bomb(bg, size // 2, int(size * 0.57), int(size * 0.275))
    bg.convert("RGB").save(os.path.join(RES, "icon.png"))
    print("Wrote resources/icon.png (1024x1024)")


def make_splash(name, bg_color, title_color):
    size = 2732
    img = Image.new("RGBA", (size, size), bg_color + (255,))
    # Rose glow behind the bomb.
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gr = int(size * 0.22)
    gd.ellipse([size // 2 - gr, int(size * 0.42) - gr, size // 2 + gr, int(size * 0.42) + gr], fill=ROSE_400 + (90,))
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.05))
    img = Image.alpha_composite(img, glow)

    draw_bomb(img, size // 2, int(size * 0.42), int(size * 0.16))

    d = ImageDraw.Draw(img)
    title_font = load_font(300)
    sub_font = load_font(80)
    title = "SHORT FUSE"
    tb = d.textbbox((0, 0), title, font=title_font)
    d.text(((size - (tb[2] - tb[0])) / 2, size * 0.58), title, font=title_font, fill=title_color)
    sub = "4 PLAYERS . PURE RANDOM CHAOS"
    sb = d.textbbox((0, 0), sub, font=sub_font)
    d.text(((size - (sb[2] - sb[0])) / 2, size * 0.745), sub, font=sub_font, fill=(163, 163, 163))
    img.convert("RGB").save(os.path.join(RES, name))
    print(f"Wrote resources/{name} (2732x2732)")


if __name__ == "__main__":
    make_icon()
    make_splash("splash.png", NEUTRAL_900, (245, 245, 245))
    make_splash("splash-dark.png", (10, 10, 10), (245, 245, 245))
    print("Done.")
