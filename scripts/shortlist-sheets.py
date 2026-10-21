"""Build contact sheets from .shortlists/shortlists.json for visual review.

Usage: python scripts/shortlist-sheets.py [--per-slot 1] [--per-sheet 12] [--only iso]
Writes screenshots/sheets/sheet-XX.jpg and screenshots/sheets/index.json.
"""
import json, os, sys, math
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE = os.path.join(ROOT, ".shortlists", "shortlists.json")
OUT = os.path.join(ROOT, "screenshots", "sheets")
FONT = "C:/Windows/Fonts/arialbd.ttf"

args = sys.argv[1:]
def arg(name, default):
    for a in args:
        if a.startswith(f"--{name}="):
            return a.split("=", 1)[1]
    return default

per_slot = int(arg("per-slot", 1))
per_sheet = int(arg("per-sheet", 12))
only = arg("only", "")

state = json.load(open(STATE, encoding="utf-8"))
reviewed_path = os.path.join(ROOT, ".shortlists", "reviewed.json")
reviewed = json.load(open(reviewed_path, encoding="utf-8")) if os.path.exists(reviewed_path) else {}
items = []
for key, cands in sorted(state.items()):
    if reviewed.get(key):
        continue
    if only and not key.split("|")[0].startswith(only):
        continue
    iso, city = key.split("|", 1)
    for i, c in enumerate(cands[:per_slot]):
        path = os.path.join(ROOT, ".shortlists", c.get("preview") or "")
        if c.get("preview") and os.path.exists(path):
            items.append({"key": key, "iso": iso, "city": city, "idx": i, "title": c["title"],
                          "path": path, "w": c["w"], "h": c["h"]})

os.makedirs(OUT, exist_ok=True)
cols, W, H, cap = 4, 460, 345, 46
rows = per_sheet // cols
font = ImageFont.truetype(FONT, 21)
index = []
for s in range(math.ceil(len(items) / per_sheet)):
    chunk = items[s * per_sheet:(s + 1) * per_sheet]
    img = Image.new("RGB", (cols * W, rows * (H + cap)), (245, 242, 235))
    d = ImageDraw.Draw(img)
    meta = []
    for i, it in enumerate(chunk):
        x, y = (i % cols) * W, (i // cols) * (H + cap)
        try:
            im = Image.open(it["path"]).convert("RGB")
            im.thumbnail((W, H))
            canvas = Image.new("RGB", (W, H), (20, 16, 32))
            canvas.paste(im, ((W - im.width) // 2, (H - im.height) // 2))
            img.paste(canvas, (x, y))
        except Exception as e:
            d.text((x + 10, y + 10), "load fail", font=font, fill=(255, 0, 0))
        d.rectangle([x, y + H, x + W, y + H + cap], fill=(255, 217, 61))
        label = f"{len(index)*per_sheet + i + 1}. {it['iso'].upper()} {it['city']}"
        d.text((x + 8, y + H + 10), label[:42], font=font, fill=(20, 16, 32))
        meta.append({"n": len(index) * per_sheet + i + 1, "key": it["key"], "idx": it["idx"],
                     "title": it["title"], "w": it["w"], "h": it["h"]})
    name = f"sheet-{s+1:02d}.jpg"
    img.save(os.path.join(OUT, name), quality=86)
    index.append({"sheet": name, "items": meta})

json.dump(index, open(os.path.join(OUT, "index.json"), "w", encoding="utf-8"), indent=1)
print(f"slots {len(items)} sheets {len(index)} -> {OUT}")
