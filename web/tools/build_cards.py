"""Convert teacher card PNGs to web-ready WebP with transparent rounded corners.

Usage: python tools/build_cards.py <source_dir>
Output: assets/cards/<same-name>.webp (720x1080)
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("../iSMART_Teacher_Cards/iSMART_Teacher_Cards")
OUT = Path(__file__).resolve().parent.parent / "assets" / "cards"
W, H = 720, 1080
RADIUS = 66  # card corner radius at 720px wide (~92px on 1024 source)

OUT.mkdir(parents=True, exist_ok=True)
for png in sorted(SRC.glob("*.png")):
    im = Image.open(png).convert("RGB").resize((W, H), Image.LANCZOS)
    # 4x supersampled mask for smooth corners
    mask = Image.new("L", (W * 4, H * 4), 0)
    ImageDraw.Draw(mask).rounded_rectangle((2 * 4, 2 * 4, (W - 2) * 4, (H - 2) * 4), RADIUS * 4, fill=255)
    im.putalpha(mask.resize((W, H), Image.LANCZOS))
    dst = OUT / (png.stem + ".webp")
    im.save(dst, "WEBP", quality=84, method=6)
    print(f"{png.name} -> {dst.name} ({dst.stat().st_size // 1024} KB)")
