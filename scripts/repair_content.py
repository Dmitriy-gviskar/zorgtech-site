#!/usr/bin/env python3
"""Repair empty static pages + project galleries after initial scrape."""

from __future__ import annotations

import json
import re
import time
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src" / "data"
IMG = ROOT / "public" / "img"

spec = importlib.util.spec_from_file_location("scrape_site", ROOT / "scripts" / "scrape_site.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

fetch = mod.fetch
parse_meta = mod.parse_meta
parse_h1 = mod.parse_h1
clean_text = mod.clean_text
to_hires = mod.to_hires
download = mod.download
write_json = mod.write_json
extract_links = mod.extract_links
BASE = mod.BASE

BODY_END = r'(?:class="[^"]*site-footer|class="[^"]*footer|</body>)'


def extract_body(html: str) -> str:
    patterns = [
        rf'class="[^"]*content-page[^"]*"[^>]*>([\s\S]*?){BODY_END}',
        rf'class="[^"]*content[^"]*"[^>]*>([\s\S]*?){BODY_END}',
        rf'<h1[^>]*>[\s\S]*?</h1>([\s\S]*?){BODY_END}',
    ]
    for pat in patterns:
        m = re.search(pat, html, re.I)
        if not m:
            continue
        chunk = m.group(1)
        chunk = re.sub(r"<(script|style|noscript)[^>]*>[\s\S]*?</\1>", "", chunk, flags=re.I)
        chunk = re.sub(r"<!--[\s\S]*?-->", "", chunk)
        # drop mega-menu leftovers if any
        if len(clean_text(chunk)) > 80:
            return chunk.strip()
    return ""


def repair_pages() -> dict:
    pages = json.loads((DATA / "pages.json").read_text(encoding="utf-8"))
    for key, path in mod.STATIC_PAGES.items():
        print(f"[page] {key}", flush=True)
        html = fetch(path)
        meta = parse_meta(html)
        h1 = parse_h1(html)
        body_html = extract_body(html)
        imgs = []
        for src in re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', body_html or html, re.I):
            if "/upload/" not in src and "http" not in src:
                continue
            if any(x in src.lower() for x in ["favicon", "logo", "icon", "menu"]):
                continue
            local = download(src, IMG / "pages", prefix=f"{key}_")
            if local and local not in imgs:
                imgs.append(local)
            if len(imgs) >= 24:
                break
        pages[key] = {
            "slug": key,
            "path": path,
            "title": h1 or meta["title"] or pages.get(key, {}).get("title", key),
            "lead": meta["description"] or pages.get(key, {}).get("lead", ""),
            "text": clean_text(body_html)[:12000],
            "html": body_html,
            "images": imgs,
            "meta": meta,
            "sourceUrl": BASE + path,
        }
        write_json("pages.json", pages)
        time.sleep(0.2)
    return pages


def repair_areas() -> list:
    html = fetch("/oblasti-primeneniya/")
    paths = extract_links(html, r'href="(/oblasti-primeneniya/[^"?#]+/)"')
    try:
        for ib in range(1, 6):
            sm = fetch(f"/sitemap-iblock-{ib}.xml")
            for loc in re.findall(r"<loc>(https://zorgtech\.com/oblasti-primeneniya/[^<]+)</loc>", sm):
                path = loc.replace(BASE, "")
                if path.rstrip("/") != "/oblasti-primeneniya" and path not in paths:
                    paths.append(path)
    except Exception:
        pass

    out = []
    for path in paths:
        slug = path.strip("/").split("/")[-1]
        print(f"[area] {slug}", flush=True)
        page = fetch(path)
        meta = parse_meta(page)
        h1 = parse_h1(page)
        body_html = extract_body(page)
        imgs = []
        for src in re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', body_html or page, re.I):
            if "/upload/" not in src:
                continue
            local = download(src, IMG / "pages", prefix=f"area-{slug[:20]}_")
            if local and local not in imgs:
                imgs.append(local)
            if len(imgs) >= 10:
                break
        out.append(
            {
                "slug": slug,
                "title": h1 or meta["title"],
                "lead": meta["description"],
                "text": clean_text(body_html)[:8000],
                "html": body_html,
                "images": imgs,
                "meta": meta,
                "sourceUrl": BASE + path,
            }
        )
        time.sleep(0.2)
    write_json("areas.json", out)
    return out


def repair_projects() -> list:
    projects = json.loads((DATA / "projects.json").read_text(encoding="utf-8"))
    for i, project in enumerate(projects):
        slug = project["slug"]
        print(f"[project {i+1}/{len(projects)}] {slug}", flush=True)
        html = fetch(project["sourceUrl"].replace(BASE, "") if project["sourceUrl"].startswith(BASE) else project["sourceUrl"])
        # all images inside slider-detail
        block = re.search(r'class="[^"]*slider-detail[^"]*"[^>]*>([\s\S]*?)</div>\s*</div>', html, re.I)
        remote = []
        scope = block.group(1) if block else html
        for src in re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', scope, re.I):
            if "/upload/" in src:
                remote.append(to_hires(src))
        # fallback: any upload in detail-left
        if len(remote) <= 1:
            left = re.search(r'class="[^"]*detail-left[^"]*"[^>]*>([\s\S]*?)</div>\s*<div class="[^"]*detail-right', html, re.I)
            scope = left.group(1) if left else html
            for src in re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', scope, re.I):
                if "/upload/" in src:
                    remote.append(to_hires(src))
        remote = list(dict.fromkeys(remote))
        images = []
        for u in remote[:30]:
            local = download(u, IMG / "projects", prefix=f"{slug[:30]}_")
            if local and local not in images:
                images.append(local)
        if images:
            project["images"] = images

        # richer text
        body = extract_body(html)
        if not body:
            m = re.search(r'class="[^"]*detail-left[^"]*"[^>]*>([\s\S]*?)</div>\s*<div class="[^"]*detail-right', html, re.I)
            if m:
                body = re.sub(r'class="[^"]*slider-detail[\s\S]*?</div>\s*</div>', "", m.group(1), count=1, flags=re.I)
        if body:
            project["html"] = body
            project["text"] = clean_text(body)[:8000]
        if (i + 1) % 5 == 0:
            write_json("projects.json", projects)
        time.sleep(0.15)
    write_json("projects.json", projects)
    return projects


def main() -> None:
    pages = repair_pages()
    areas = repair_areas()
    projects = repair_projects()
    print(
        "DONE repair",
        {
            "pages_with_text": sum(1 for p in pages.values() if len(p.get("text") or "") > 40),
            "areas": len(areas),
            "areas_with_text": sum(1 for a in areas if len(a.get("text") or "") > 40),
            "projects": len(projects),
            "project_imgs_avg": round(sum(len(p.get("images") or []) for p in projects) / max(len(projects), 1), 2),
        },
        flush=True,
    )


if __name__ == "__main__":
    main()
