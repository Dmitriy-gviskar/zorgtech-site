#!/usr/bin/env python3
"""Studio-frame ingest for unpublished kiosk CAD / photos.

Copies sources to public/img/regen/_precut, keys the backdrop to white,
pads to the same 1024×1536 canvas as existing regen frames. Does not invent
product names or specs.
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
REGEN = ROOT / "public" / "img" / "regen"
PRECUT = REGEN / "_precut"
PRODUCTS_IMG = ROOT / "public" / "img" / "products"
ASSETS = Path(
    "/Users/dmitri/.cursor/projects/Users-dmitri-zorgtech-site/assets"
)

CANVAS = (1024, 1536)
MARGIN = 0.09
TINY_MAX_EDGE = 640


def find_asset(stamp: str) -> Path:
    matches = sorted(ASSETS.glob(f"IMAGE_2026-08-13_{stamp}-*.png"))
    if not matches:
        raise FileNotFoundError(f"no asset for {stamp}")
    return matches[0]


def crop_gallery_chrome(rgb: np.ndarray) -> np.ndarray:
    """Keep the largest non-black blob (the CAD), drop messenger chrome."""
    h, w, _ = rgb.shape
    luma = rgb.mean(axis=2)
    obj = ndimage.binary_closing(luma > 14, iterations=2)
    labeled, n = ndimage.label(obj)
    if n == 0:
        return rgb
    sizes = ndimage.sum(obj, labeled, range(1, n + 1))
    best = 1 + int(np.argmax(sizes))
    ys, xs = np.where(labeled == best)
    pad = 12
    y0, y1 = max(0, int(ys.min()) - pad), min(h, int(ys.max()) + pad + 1)
    x0, x1 = max(0, int(xs.min()) - pad), min(w, int(xs.max()) + pad + 1)
    return rgb[y0:y1, x0:x1]


def background_mask(rgb: np.ndarray) -> np.ndarray:
    h, w, _ = rgb.shape
    luma = rgb.mean(axis=2)
    corners = np.stack(
        [
            rgb[:8, :8].reshape(-1, 3).mean(0),
            rgb[:8, -8:].reshape(-1, 3).mean(0),
            rgb[-8:, :8].reshape(-1, 3).mean(0),
            rgb[-8:, -8:].reshape(-1, 3).mean(0),
        ]
    )
    cl = float(corners.mean())
    dist = np.sqrt(
        ((rgb[:, :, None, :].astype(np.float32) - corners[None, None, :, :]) ** 2).sum(-1)
    ).min(-1)
    dist_white = np.linalg.norm(rgb.astype(np.float32) - 255.0, axis=2)

    if cl < 40:
        seed = (luma < 20) | (dist < 18)
    else:
        seed = (dist < 38) | (dist_white < 22)

    labeled, _n = ndimage.label(seed)
    border = np.zeros((h, w), dtype=bool)
    border[0, :] = True
    border[-1, :] = True
    border[:, 0] = True
    border[:, -1] = True
    touch = np.unique(labeled[border])
    bg = np.isin(labeled, touch[touch > 0])
    fg = ndimage.binary_fill_holes(~bg)
    bg = ~fg
    bg = ndimage.binary_dilation(bg, iterations=1)
    fg = ndimage.binary_fill_holes(~bg)
    return ~fg


def whiten(rgb: np.ndarray) -> np.ndarray:
    out = rgb.copy()
    out[background_mask(rgb)] = 255
    return out


def fit_canvas(rgb: np.ndarray) -> Image.Image:
    luma = rgb.mean(axis=2)
    ys, xs = np.where(luma < 250)
    if ys.size == 0:
        canvas = Image.new("RGB", CANVAS, (255, 255, 255))
        return canvas
    y0, y1 = int(ys.min()), int(ys.max()) + 1
    x0, x1 = int(xs.min()), int(xs.max()) + 1
    crop = Image.fromarray(rgb[y0:y1, x0:x1], "RGB")
    bw, bh = crop.size
    max_w = CANVAS[0] * (1 - 2 * MARGIN)
    max_h = CANVAS[1] * (1 - 2 * MARGIN)
    scale = min(max_w / bw, max_h / bh)
    if scale > 1 and max(bw, bh) >= TINY_MAX_EDGE:
        scale = 1.0
    nw, nh = max(1, int(round(bw * scale))), max(1, int(round(bh * scale)))
    resample = Image.Resampling.LANCZOS if scale != 1 else Image.Resampling.NEAREST
    fitted = crop.resize((nw, nh), resample) if (nw, nh) != (bw, bh) else crop
    canvas = Image.new("RGB", CANVAS, (255, 255, 255))
    canvas.paste(fitted, ((CANVAS[0] - nw) // 2, (CANVAS[1] - nh) // 2))
    return canvas


def process_studio(src: Path, dest: Path, crop_chrome: bool) -> dict:
    rgb = np.asarray(Image.open(src).convert("RGB"))
    if crop_chrome:
        rgb = crop_gallery_chrome(rgb)
    white = whiten(rgb)
    frame = fit_canvas(white)
    dest.parent.mkdir(parents=True, exist_ok=True)
    frame.save(dest, "PNG", optimize=True)
    arr = np.asarray(frame)
    corner = float(
        np.concatenate(
            [
                arr[:10, :10],
                arr[:10, -10:],
                arr[-10:, :10],
                arr[-10:, -10:],
            ],
            0,
        ).mean()
    )
    fg = float((arr.mean(axis=2) < 250).mean())
    return {
        "file": dest.name,
        "src": src.name,
        "size": list(frame.size),
        "corner": round(corner, 1),
        "fg_frac": round(fg, 3),
        "crop_chrome": crop_chrome,
    }


STUDIO = [
    ("novinka-1", "frame-34", "15_42_14", False),
    ("novinka-1", "frame-rear", "15_42_12", False),
    ("novinka-2", "frame-34", "15_42_16", False),
    ("novinka-3", "frame-front", "15_42_17", False),
    ("novinka-3", "frame-rear", "15_42_18", False),
    ("novinka-4", "frame-34", "15_42_19", False),
    ("novinka-5", "frame-34", "15_42_21", False),
    ("novinka-6", "frame-34", "15_42_22", False),
    ("novinka-7", "frame-34", "15_42_23", False),
    ("novinka-8", "frame-34", "15_42_26", False),
    ("novinka-8", "frame-rear", "15_42_28", False),
    ("novinka-9", "frame-34", "15_42_30", False),
    ("novinka-9", "frame-side", "15_42_31", True),
    ("novinka-9", "frame-front", "15_42_35", True),
]

LIVE = [
    ("novinka-4-live-front.png", "15_42_36"),
    ("novinka-4-live-side.png", "15_42_37"),
]


def main() -> None:
    PRECUT.mkdir(parents=True, exist_ok=True)
    PRODUCTS_IMG.mkdir(parents=True, exist_ok=True)
    report = {"studio": [], "live": []}

    for slug, frame, stamp, crop in STUDIO:
        src = find_asset(stamp)
        precut = PRECUT / f"{slug}-{frame}.png"
        shutil.copy2(src, precut)
        dest = REGEN / f"{slug}-{frame}.png"
        rec = process_studio(src, dest, crop)
        report["studio"].append(rec)
        print(f"{rec['file']:32} fg={rec['fg_frac']:.3f} corner={rec['corner']:.1f}")

    for name, stamp in LIVE:
        src = find_asset(stamp)
        dest = PRODUCTS_IMG / name
        shutil.copy2(src, dest)
        report["live"].append({"file": name, "src": src.name})
        print(f"live {name}")

    out = REGEN / "_novinki_ingest_report.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print("wrote", out)


if __name__ == "__main__":
    main()
