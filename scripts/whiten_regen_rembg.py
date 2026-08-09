#!/usr/bin/env python3
"""Composite regen frames onto pure white via rembg cutout.

Skips frames whose corners are already near-white unless --force.
Flags likely failures (cutout ate light chassis) for manual regen.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[1]
REGEN = ROOT / "public" / "img" / "regen"
WHITE = (255, 255, 255, 255)


def corner_luma(rgb: np.ndarray) -> float:
    patches = [
        rgb[:10, :10],
        rgb[:10, -10:],
        rgb[-10:, :10],
        rgb[-10:, -10:],
    ]
    return float(np.concatenate([p.reshape(-1, 3) for p in patches], 0).mean())


def validate_cutout(alpha: np.ndarray, rgb_orig: np.ndarray) -> tuple[bool, str]:
    h, w = alpha.shape
    opaque = alpha > 128
    frac = float(opaque.mean())
    if frac < 0.05:
        return False, f"opaque_frac={frac:.3f}"
    if frac > 0.92:
        return False, f"opaque_frac_too_high={frac:.3f}"

    # Center band should keep product if there was a solid subject
    cy, cx = h // 2, w // 2
    band = alpha[max(0, cy - h // 5) : cy + h // 5, max(0, cx - w // 6) : cx + w // 6]
    center_a = float(band.mean()) if band.size else 0.0

    # Lower third often holds base/legs — if original lower third was mid-bright
    # but cutout emptied it, white chassis was eaten.
    lower_orig = rgb_orig[int(h * 0.65) :, :].mean()
    lower_a = float(alpha[int(h * 0.65) :, :].mean())
    upper_a = float(alpha[: int(h * 0.45), :].mean())

    if center_a < 40 and frac < 0.25:
        return False, f"center_empty a={center_a:.1f}"

    # Classic white-body fail: upper OK, lower nearly gone while original lower wasn't dark
    if lower_orig > 160 and lower_a < 25 and upper_a > 80:
        return False, f"lower_eaten lower_a={lower_a:.1f} lower_orig={lower_orig:.1f}"

    return True, f"ok opaque={frac:.3f} center_a={center_a:.1f} lower_a={lower_a:.1f}"


def whiten_one(path: Path, session, force: bool) -> dict:
    orig = Image.open(path).convert("RGBA")
    rgb = np.asarray(orig.convert("RGB"))
    cl = corner_luma(rgb)
    if cl >= 248 and not force:
        # Normalize near-white corners to pure white without rembg
        arr = rgb.astype(np.float32)
        dist = np.linalg.norm(arr - 255.0, axis=2)
        mask = dist < 18
        arr[mask] = 255
        Image.fromarray(arr.astype(np.uint8)).save(path, "PNG", optimize=True)
        return {"file": path.name, "status": "normalize", "corner": cl}

    cut = remove(orig, session=session)
    alpha = np.asarray(cut)[:, :, 3]
    ok, reason = validate_cutout(alpha, rgb)
    if not ok:
        return {"file": path.name, "status": "fail", "corner": cl, "reason": reason}

    bg = Image.new("RGBA", cut.size, WHITE)
    out = Image.alpha_composite(bg, cut).convert("RGB")
    out.save(path, "PNG", optimize=True)
    return {"file": path.name, "status": "ok", "corner": cl, "reason": reason}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--only", nargs="*", help="Optional filenames")
    args = ap.parse_args()

    session = new_session("u2net")
    files = (
        [REGEN / n for n in args.only]
        if args.only
        else sorted(p for p in REGEN.glob("*-frame-*.png") if not p.name.startswith("_"))
    )

    report = []
    for i, path in enumerate(files, 1):
        if not path.exists():
            report.append({"file": path.name, "status": "missing"})
            continue
        row = whiten_one(path, session, force=args.force)
        report.append(row)
        print(f"[{i}/{len(files)}] {row['status']:10} {path.name} {row.get('reason','')}")

    out_json = REGEN / "_whiten_report.json"
    out_json.write_text(json.dumps(report, indent=2, ensure_ascii=False))
    fails = [r for r in report if r["status"] == "fail"]
    print(f"\nDone: ok={sum(r['status']=='ok' for r in report)} "
          f"normalize={sum(r['status']=='normalize' for r in report)} "
          f"fail={len(fails)}")
    if fails:
        print("FAILS:")
        for r in fails:
            print(f"  {r['file']}: {r.get('reason')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
