"""Batch-generate photorealistic FLUX 3 images for the Latin America city expansion.

Reads scripts/latam-cities-spec.json ([iso, city, slug, spots, caption]) and writes
public/cities/<iso>/<slug>-0.jpg (1920x1080, JPEG q88). Resumable via a progress file.

Usage:
  python scripts/latam_generate.py --generate [--workers 4] [--only ar] [--limit N]
  python scripts/latam_generate.py --register
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPEC = os.path.join(REPO, "scripts", "latam-cities-spec.json")
COUNTRIES = os.path.join(REPO, "src", "data", "countries.json")
PHOTOS = os.path.join(REPO, "src", "data", "city-photos.json")
OUTDIR = os.path.join(REPO, "AI_Documentation", "qa", "latam-cities")
PROGRESS = os.path.join(OUTDIR, "progress.json")
MANIFEST = os.path.join(OUTDIR, "MANIFEST.json")

API = "https://api.bfl.ai/v1/flux-3-image"
CREDIT = "Imagem gerada por IA (FLUX 3) para o FolkGlobe."
W, H = 1920, 1080

_lock = threading.Lock()


def api_key() -> str:
    """Prefer the Hermes .env file: a backgrounded shell can carry a redacted key."""
    env = os.path.join(os.path.expanduser("~"), "AppData", "Local", "hermes", ".env")
    try:
        for line in open(env, encoding="utf-8", errors="ignore"):
            s = line.strip()
            if s.startswith("BFL_API_KEY="):
                val = s.split("=", 1)[1].strip().strip('"').strip("'")
                if len(val) > 20 and "*" not in val:
                    return val
    except OSError:
        pass
    key = os.environ.get("BFL_API_KEY")
    if key and len(key) > 20 and "*" not in key:
        return key
    raise SystemExit("BFL_API_KEY missing or redacted")


LEADS = [
    "the main square and surrounding streets",
    "the waterfront promenade",
    "a busy street in the historic centre",
]


def build_prompt(city: str, country: str, spots: str, idx: int) -> str:
    lead = LEADS[idx % len(LEADS)]
    return (
        f"{city}, {country}. View of {lead} near {spots}, with the buildings, "
        f"terrain and local street life that belong to {city}.\n"
        "Photorealistic travel photograph, shot on a full-frame DSLR with a 35mm lens at f/8, "
        "natural daylight, crisp realistic detail, true-to-life colours, documentary "
        "travel-photography look, natural dynamic range, no HDR halos.\n"
        "Real tourists and local people going about their day in the middle distance, "
        "natural candid poses, nobody looking at the camera or posing.\n"
        "This is a photograph, not an illustration: no painting, no drawing, no cartoon, "
        "no CGI, no 3D render, no stylisation, no oversaturated colours, no plastic skin.\n"
        "No text, no letters, no words, no captions, no signage lettering, no logos, "
        "no watermark, no borders, no frame."
    )


def load_json(p):
    with open(p, encoding="utf-8") as fh:
        return json.load(fh)


def save_json(p, data, crlf=False):
    out = json.dumps(data, ensure_ascii=False, indent=2)
    if crlf:
        out = out.replace("\n", "\r\n")
    out += "\r\n" if crlf else "\n"
    tmp = p + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="") as fh:
        fh.write(out)
    os.replace(tmp, p)


def generate_one(row, country_name, key, progress, idx):
    iso, city, slug, spots, caption = row
    rel = f"/cities/{iso}/{slug}-0.jpg"
    dest = os.path.join(REPO, "public", "cities", iso, f"{slug}-0.jpg")

    if progress.get(f"{iso}/{slug}", {}).get("status") == "done" and os.path.exists(dest):
        return f"{iso}/{slug}", True, "cached"

    os.makedirs(os.path.dirname(dest), exist_ok=True)
    payload = {"prompt": build_prompt(city, country_name, spots, idx), "width": W, "height": H}
    headers = {"accept": "application/json", "x-key": key, "Content-Type": "application/json"}

    last_err = ""
    for attempt in range(1, 6):
        try:
            r = requests.post(API, headers=headers, json=payload, timeout=90)
            if r.status_code == 402:
                return f"{iso}/{slug}", False, "402 out of credits"
            if r.status_code in (422, 429):
                # BFL returns 422 (not 429) when the account's concurrent-task cap is hit.
                body = (r.text or "")[:200]
                time.sleep(5 * attempt)
                last_err = f"{r.status_code}: {body}"
                continue
            r.raise_for_status()
            data = r.json()
            poll = data.get("polling_url")
            if not poll:
                return f"{iso}/{slug}", False, f"no polling_url: {data}"
            url = None
            deadline = time.time() + 240
            while time.time() < deadline:
                time.sleep(1.5)
                res = requests.get(poll, headers={"accept": "application/json", "x-key": key}, timeout=30).json()
                st = res.get("status")
                if st == "Ready":
                    url = res["result"]["sample"]
                    break
                if st in ("Error", "Failed", "Content Moderated"):
                    return f"{iso}/{slug}", False, f"status {st}: {str(res)[:200]}"
            if not url:
                continue
            raw = requests.get(url, timeout=120).content
            img = Image.open(__import__("io").BytesIO(raw)).convert("RGB")
            if img.size != (W, H):
                img = img.resize((W, H), Image.LANCZOS)
            img.save(dest, "JPEG", quality=88, optimize=True)
            with _lock:
                progress[f"{iso}/{slug}"] = {"status": "done", "path": rel, "prompt": payload["prompt"]}
                save_json(PROGRESS, progress)
            return f"{iso}/{slug}", True, f"{os.path.getsize(dest)//1024} KB"
        except Exception as exc:  # noqa: BLE001
            if attempt == 3:
                return f"{iso}/{slug}", False, f"{type(exc).__name__}: {exc}"
            time.sleep(3 * attempt)
    return f"{iso}/{slug}", False, f"retries exhausted ({last_err})"


def do_generate(only, limit, workers):
    key = api_key()
    spec = load_json(SPEC)
    countries = load_json(COUNTRIES)
    os.makedirs(OUTDIR, exist_ok=True)
    progress = load_json(PROGRESS) if os.path.exists(PROGRESS) else {}

    rows = [(i, r) for i, r in enumerate(spec) if not only or r[0] == only]
    if limit:
        rows = rows[:limit]

    ok = fail = 0
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futs = {
            pool.submit(generate_one, r, countries.get(r[0], {}).get("name", r[0]), key, progress, i): r
            for i, r in rows
        }
        for fut in as_completed(futs):
            row = futs[fut]
            name, success, info = fut.result()
            ok += success
            fail += (not success)
            print(f"[{'OK ' if success else 'ERR'}] {name} — {info}", flush=True)
    print(f"\ndone: {ok} ok, {fail} failed, of {len(rows)}")
    return 0 if fail == 0 else 1


def do_register():
    spec = load_json(SPEC)
    countries = load_json(COUNTRIES)
    photos = load_json(PHOTOS)
    progress = load_json(PROGRESS) if os.path.exists(PROGRESS) else {}

    added_cities = added_photos = 0
    manifest, failures = [], []
    for iso, city, slug, spots, caption in spec:
        rel = f"/cities/{iso}/{slug}-0.jpg"
        dest = os.path.join(REPO, "public", "cities", iso, f"{slug}-0.jpg")
        if not os.path.exists(dest):
            failures.append({"iso": iso, "city": city, "reason": "image missing"})
            continue

        cities = countries.setdefault(iso, {}).setdefault("cities", [])
        if not any(c.get("city") == city for c in cities):
            cities.append({"city": city, "spots": spots})
            added_cities += 1

        entry = {"src": rel, "caption": caption, "credit": CREDIT, "kind": "ai"}
        bucket = photos.setdefault(iso, {}).setdefault(city, [])
        if not any(p.get("src") == rel for p in bucket):
            bucket.append(entry)
            added_photos += 1

        manifest.append({
            "iso": iso,
            "country": countries[iso].get("name", iso),
            "city": city,
            "spots": spots,
            "image": dest,
            "caption": caption,
        })

    errors = []
    for path, data, crlf in ((COUNTRIES, countries, True), (PHOTOS, photos, False)):
        try:
            save_json(path, data, crlf=crlf)
            load_json(path)
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{path}: {exc}")

    os.makedirs(OUTDIR, exist_ok=True)
    save_json(MANIFEST, {"images": manifest, "failures": failures})
    print(f"registered: {added_cities} cities, {added_photos} photos, {len(manifest)} images, "
          f"{len(failures)} missing; json errors: {errors or 'none'}")
    return 0 if not errors else 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--generate", action="store_true")
    ap.add_argument("--register", action="store_true")
    ap.add_argument("--only", default=None)
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--workers", type=int, default=4)
    a = ap.parse_args()
    if a.generate:
        sys.exit(do_generate(a.only, a.limit, a.workers))
    if a.register:
        sys.exit(do_register())
    ap.print_help()


if __name__ == "__main__":
    main()
