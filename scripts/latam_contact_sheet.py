"""Build contact sheets from the Latin America city manifest for quick visual QC.

Usage: python scripts/latam_contact_sheet.py [--per-sheet 6]
Writes AI_Documentation/qa/latam-cities/sheet-<n>.jpg
"""
from __future__ import annotations

import argparse
import json
import math
import os

from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, "AI_Documentation", "qa", "latam-cities")
MANIFEST = os.path.join(OUT, "MANIFEST.json")

TW, TH = 640, 360
PAD = 8
LABEL_H = 26


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--per-sheet", type=int, default=6)
    a = ap.parse_args()

    data = json.load(open(MANIFEST, encoding="utf-8"))
    images = [m for m in data["images"] if os.path.exists(m["image"])]
    per = a.per_sheet
    sheets = []
    for start in range(0, len(images), per):
        chunk = images[start:start + per]
        cols = 2 if len(chunk) > 1 else 1
        rows = math.ceil(len(chunk) / cols)
        canvas = Image.new("RGB", (cols * (TW + PAD) + PAD, rows * (TH + LABEL_H + PAD) + PAD), (18, 18, 18))
        draw = ImageDraw.Draw(canvas)
        for i, item in enumerate(chunk):
            img = Image.open(item["image"]).convert("RGB").resize((TW, TH), Image.LANCZOS)
            x = PAD + (i % cols) * (TW + PAD)
            y = PAD + (i // cols) * (TH + LABEL_H + PAD)
            canvas.paste(img, (x, y + LABEL_H))
            draw.text((x + 4, y + 6), f"{item['city']}, {item['country']}", fill=(235, 235, 235))
        path = os.path.join(OUT, f"sheet-{len(sheets) + 1}.jpg")
        canvas.save(path, "JPEG", quality=85)
        sheets.append(path)
    print(f"built {len(sheets)} sheets for {len(images)} images")
    for s in sheets:
        print(s)


if __name__ == "__main__":
    main()
