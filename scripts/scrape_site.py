#!/usr/bin/env python3
"""Full scrape of zorgtech.com into src/data + public/img."""

from __future__ import annotations

import json
import re
import time
import hashlib
import urllib.request
import urllib.error
from pathlib import Path
from html import unescape
from urllib.parse import urljoin, urlparse

BASE = "https://zorgtech.com"
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src" / "data"
IMG = ROOT / "public" / "img"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

CATEGORIES = [
    "napolnye",
    "stoly",
    "nastennyy",
    "mono-napolnye",
    "apriori",
    "ulichnye",
    "avtokassy",
    "dezinfektora-ruk",
    "otraslevye",
    "detskie-stoliki",
    "kioski-samoobsluzhivaniya",
    "unique",
]

STATIC_PAGES = {
    "about": "/about/",
    "contacts": "/contacts/",
    "delivery": "/dostavka-i-servis/",
    "support": "/support/",
    "rent": "/rent/",
    "areas": "/oblasti-primeneniya/",
    "policy": "/policy",
    "home": "/",
    "catalog": "/catalog/",
}

TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")


def fetch(url: str, retries: int = 3, allow_404: bool = False) -> str:
    if url.startswith("/"):
        url = BASE + url
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "ru-RU,ru;q=0.9"})
            with urllib.request.urlopen(req, timeout=40) as resp:
                return resp.read().decode("utf-8", "ignore")
        except urllib.error.HTTPError as e:
            last_err = e
            if e.code == 404 and allow_404:
                return ""
            if e.code == 404:
                break
            time.sleep(1.2 * (attempt + 1))
        except Exception as e:  # noqa: BLE001
            last_err = e
            time.sleep(1.2 * (attempt + 1))
    raise RuntimeError(f"fetch failed {url}: {last_err}")


def clean_text(s: str) -> str:
    s = unescape(TAG_RE.sub(" ", s))
    return WS_RE.sub(" ", s).strip()


def absolutize(src: str) -> str:
    if not src:
        return ""
    if src.startswith("//"):
        return "https:" + src
    return urljoin(BASE + "/", src)


def to_hires(src: str) -> str:
    """Convert Bitrix resize_cache URL to original upload path when possible."""
    src = absolutize(src)
    m = re.match(
        r"(https?://[^/]+)/upload/resize_cache/(iblock/[^/]+)/\d+_\d+_\d+/(.+)$",
        src,
    )
    if m:
        return f"{m.group(1)}/upload/{m.group(2)}/{m.group(3)}"
    return src


def local_name(url: str, prefix: str = "") -> str:
    path = urlparse(url).path
    ext = Path(path).suffix.lower() or ".jpg"
    if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}:
        ext = ".jpg"
    digest = hashlib.md5(url.encode()).hexdigest()[:16]
    base = Path(path).stem
    base = re.sub(r"[^a-zA-Z0-9_-]+", "-", base)[:40].strip("-") or "img"
    name = f"{prefix}{base}-{digest}{ext}"
    return name


def download(url: str, folder: Path, prefix: str = "") -> str | None:
    url = to_hires(url)
    if not url or "zorgtech.com" not in url:
        return None
    folder.mkdir(parents=True, exist_ok=True)
    name = local_name(url, prefix)
    dest = folder / name
    if dest.exists() and dest.stat().st_size > 0:
        return f"/img/{folder.relative_to(IMG).as_posix()}/{name}" if folder != IMG else f"/img/{name}"

    # try hires, then original resize url
    candidates = [url]
    if "/upload/iblock/" in url:
        # fallback not needed
        pass
    for candidate in candidates:
        try:
            req = urllib.request.Request(candidate, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = resp.read()
            if len(data) < 200:
                continue
            dest.write_bytes(data)
            rel = dest.relative_to(IMG).as_posix()
            return f"/img/{rel}"
        except Exception:
            continue
    return None


def extract_links(html: str, pattern: str) -> list[str]:
    return sorted(set(re.findall(pattern, html)))


def parse_meta(html: str) -> dict:
    def one(prop=None, name=None):
        if prop:
            m = re.search(rf'property=["\']{re.escape(prop)}["\']\s+content=["\']([^"\']*)["\']', html, re.I)
            if not m:
                m = re.search(rf'content=["\']([^"\']*)["\']\s+property=["\']{re.escape(prop)}["\']', html, re.I)
        else:
            m = re.search(rf'name=["\']{re.escape(name)}["\']\s+content=["\']([^"\']*)["\']', html, re.I)
            if not m:
                m = re.search(rf'content=["\']([^"\']*)["\']\s+name=["\']{re.escape(name)}["\']', html, re.I)
        return unescape(m.group(1)).strip() if m else ""

    title = one(prop="og:title") or clean_text(re.search(r"<title>(.*?)</title>", html, re.S | re.I).group(1) if re.search(r"<title>(.*?)</title>", html, re.S | re.I) else "")
    return {
        "title": title,
        "description": one(prop="og:description") or one(name="description"),
        "image": one(prop="og:image"),
    }


def parse_h1(html: str) -> str:
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    return clean_text(m.group(1)) if m else ""


def parse_specs(html: str) -> dict:
    specs = {}
    for key, val in re.findall(
        r'class="table-flex__td w40">(.*?)</div>\s*<div class="table-flex__td w60 value">(.*?)</div>',
        html,
        re.S,
    ):
        k, v = clean_text(key), clean_text(val)
        if k and v:
            specs[k] = v
    return specs


def parse_product(slug: str, html: str, category_slug: str) -> dict:
    meta = parse_meta(html)
    h1 = parse_h1(html) or meta["title"]

    # Prefer gallery + main slider images, convert to hires
    imgs = []
    for src in re.findall(
        r'(?:slider-product-main|product-gallery-item|slider-product-nav)[\s\S]{0,400}?<img[^>]+src=["\']([^"\']+)["\']',
        html,
        re.I,
    ):
        imgs.append(to_hires(src))
    # Also grab data-src / large images in product detail thumb
    for src in re.findall(r'product-detail-thumb[\s\S]{0,1200}?<img[^>]+src=["\']([^"\']+)["\']', html, re.I):
        imgs.append(to_hires(src))
    # Dedup preserve order
    seen = set()
    uniq = []
    for u in imgs:
        if u and u not in seen and "/upload/" in u:
            seen.add(u)
            uniq.append(u)

    local_images = []
    for u in uniq[:20]:
        local = download(u, IMG / "products", prefix=f"{slug}_")
        if local:
            local_images.append(local)

    desc_html = ""
    m = re.search(r'class="[^"]*product-description[^"]*"[^>]*>([\s\S]*?)</div>', html, re.I)
    if m:
        desc_html = m.group(1).strip()
    desc_text = clean_text(desc_html)

    # advantages / feature bullets
    features = []
    for block in re.findall(r'class="[^"]*product-advantages[^"]*"[^>]*>([\s\S]*?)</div>', html, re.I):
        for li in re.findall(r"<li[^>]*>([\s\S]*?)</li>", block, re.I):
            t = clean_text(li)
            if t and t not in features:
                features.append(t)

    price = ""
    pm = re.search(r"(Цена по запросу|от\s*[\d\s]+(?:руб|₽)?)", html)
    if pm:
        price = clean_text(pm.group(1))

    return {
        "slug": slug,
        "title": h1,
        "categorySlug": category_slug,
        # Keep full body text — hard [:400] cuts mid-sentence (see Apriori Print A4).
        "lead": desc_text or meta["description"],
        "description": desc_text,
        "descriptionHtml": desc_html,
        "features": features,
        "specs": parse_specs(html),
        "price": price or "Цена по запросу",
        "images": local_images,
        "sourceImages": uniq[:20],
        "meta": meta,
        "sourceUrl": f"{BASE}/catalog/product/{slug}/",
    }


def load_json(name: str, default):
    path = DATA / name
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return default
    return default


def scrape_categories() -> tuple[dict, dict]:
    categories = load_json("categories.json", {})
    products = load_json("products.json", {})
    print(f"[resume] products={len(products)} categories={len(categories)}", flush=True)
    catalog_html = fetch("/catalog/")
    for cat in CATEGORIES:
        url = f"/catalog/{cat}/"
        print(f"[cat] {cat}", flush=True)
        html = fetch(url, allow_404=True)
        if not html:
            print(f"  ! skip {cat}: 404", flush=True)
            categories[cat] = {
                "slug": cat,
                "name": cat,
                "title": cat,
                "description": "",
                "lead": "",
                "image": "",
                "productSlugs": [],
                "products": [],
                "sourceUrl": BASE + url,
                "missing": True,
            }
            continue

        meta = parse_meta(html)
        h1 = parse_h1(html)
        thumb = ""
        tm = re.search(
            rf'href="/catalog/{re.escape(cat)}/"[\s\S]{{0,500}}?<img[^>]+src=["\']([^"\']+)["\']',
            catalog_html,
            re.I,
        )
        if tm:
            thumb = download(tm.group(1), IMG / "pages", prefix=f"cat-{cat}_") or ""

        product_paths = extract_links(html, r'href="(/catalog/product/[^"?#]+/)"')
        cat_products = []
        for p in product_paths:
            slug = p.strip("/").split("/")[-1]
            if slug in products:
                cat_products.append({"slug": slug, "title": products[slug]["title"]})
                continue
            print(f"  [product] {slug}", flush=True)
            try:
                ph = fetch(p)
                item = parse_product(slug, ph, cat)
                products[slug] = item
                cat_products.append({"slug": slug, "title": item["title"]})
                # incremental save so a crash doesn't lose catalog work
                write_json("products.json", products)
                time.sleep(0.25)
            except Exception as e:  # noqa: BLE001
                print(f"    ! fail {slug}: {e}", flush=True)

        # Real category intros live in .section-text (not meta description)
        section_blocks = []
        for sm in re.finditer(
            r'<div[^>]*class="[^"]*\bsection-text\b[^"]*"[^>]*>([\s\S]*?)</div>',
            html,
            re.I,
        ):
            chunk = sm.group(1).strip()
            plain = clean_text(chunk)
            if len(plain) >= 40:
                section_blocks.append(chunk)
        lead_html = ""
        lead = ""
        body_html = ""
        if section_blocks:
            lead_html = section_blocks[0]
            lead = clean_text(lead_html)
            if len(section_blocks) > 1:
                body_html = "\n".join(section_blocks[1:])[:8000]

        categories[cat] = {
            "slug": cat,
            "name": h1 or cat,
            "title": meta["title"],
            "description": meta["description"],
            "lead": lead,
            "leadHtml": lead_html,
            "bodyHtml": body_html,
            "image": thumb,
            "productSlugs": [p["slug"] for p in cat_products],
            "products": cat_products,
            "sourceUrl": BASE + url,
        }
        write_json("categories.json", categories)
        time.sleep(0.2)
    return categories, products


def scrape_projects() -> list[dict]:
    projects = []
    # paginate listing
    urls = []
    for page in range(1, 10):
        list_url = "/realizovanye-proekty/" if page == 1 else f"/realizovanye-proekty/?PAGEN_1={page}"
        html = fetch(list_url)
        found = extract_links(html, r'href="(/realizovanye-proekty/[^"?#]+/)"')
        found = [u for u in found if u.rstrip("/") != "/realizovanye-proekty"]
        if not found:
            break
        before = len(urls)
        for u in found:
            if u not in urls:
                urls.append(u)
        if len(urls) == before:
            break
        time.sleep(0.2)

    # also sitemap
    try:
        sm = fetch("/sitemap-iblock-1.xml") + fetch("/sitemap-iblock-2.xml") + fetch("/sitemap-iblock-3.xml") + fetch("/sitemap-iblock-4.xml") + fetch("/sitemap-iblock-5.xml")
        for loc in re.findall(r"<loc>(https://zorgtech\.com/realizovanye-proekty/[^<]+)</loc>", sm):
            path = urlparse(loc).path
            if path.rstrip("/") != "/realizovanye-proekty" and path not in urls:
                urls.append(path)
    except Exception as e:  # noqa: BLE001
        print("sitemap projects warn", e)

    print(f"[projects] {len(urls)} urls")
    for path in urls:
        slug = path.strip("/").split("/")[-1]
        print(f"  [project] {slug}")
        try:
            html = fetch(path)
            meta = parse_meta(html)
            h1 = parse_h1(html)
            images_remote = []
            for src in re.findall(r'slider-detail[\s\S]*?<img[^>]+src=["\']([^"\']+)["\']', html, re.I):
                images_remote.append(to_hires(src))
            if not images_remote and meta.get("image"):
                images_remote.append(to_hires(meta["image"]))
            images = []
            for u in list(dict.fromkeys(images_remote))[:30]:
                local = download(u, IMG / "projects", prefix=f"{slug[:30]}_")
                if local:
                    images.append(local)

            # left column text after slider
            text = ""
            html_content = ""
            m = re.search(r'class="[^"]*detail-left[^"]*"[^>]*>([\s\S]*?)</div>\s*<div class="[^"]*detail-right', html, re.I)
            if not m:
                m = re.search(r'class="[^"]*detail-left[^"]*"[^>]*>([\s\S]*?)$', html, re.I)
            if m:
                chunk = re.sub(r"<(script|style)[^>]*>[\s\S]*?</\1>", "", m.group(1), flags=re.I)
                # remove slider block
                chunk = re.sub(r'class="[^"]*slider-detail[\s\S]*?</div>\s*</div>', "", chunk, count=1, flags=re.I)
                html_content = chunk.strip()
                text = clean_text(chunk)

            used = []
            for block in re.findall(r'class="[^"]*project-used[^"]*"[^>]*>([\s\S]*?)</div>', html, re.I):
                for a in re.findall(r'href="(/catalog/product/[^"]+/)"[^>]*>([\s\S]*?)</a>', block, re.I):
                    used.append({"slug": a[0].strip("/").split("/")[-1], "title": clean_text(a[1])})

            projects.append(
                {
                    "slug": slug,
                    "title": h1 or meta["title"],
                    "lead": meta["description"],
                    "text": text,
                    "html": html_content,
                    "images": images,
                    "usedProducts": used,
                    "meta": meta,
                    "sourceUrl": BASE + path,
                }
            )
            time.sleep(0.25)
        except Exception as e:  # noqa: BLE001
            print(f"    ! fail {slug}: {e}")
    return projects


def scrape_solutions() -> list[dict]:
    html = fetch("/gotovye-resheniya/")
    paths = extract_links(html, r'href="(/gotovye-resheniya/[^"?#]+/)"')
    paths = [p for p in paths if p.rstrip("/") != "/gotovye-resheniya"]
    # sitemap extras
    try:
        sm = fetch("/sitemap-iblock-2.xml")
        for loc in re.findall(r"<loc>(https://zorgtech\.com/gotovye-resheniya/[^<]+)</loc>", sm):
            path = urlparse(loc).path
            if path.rstrip("/") != "/gotovye-resheniya" and path not in paths:
                paths.append(path)
    except Exception:
        pass

    out = []
    print(f"[solutions] {len(paths)}")
    for path in paths:
        slug = path.strip("/").split("/")[-1]
        print(f"  [solution] {slug}")
        try:
            page = fetch(path)
            meta = parse_meta(page)
            h1 = parse_h1(page)
            imgs = []
            for src in re.findall(r'<img[^>]+src=["\']([^"\']+/upload/[^"\']+)["\']', page, re.I):
                if "favicon" in src or "logo" in src.lower():
                    continue
                local = download(src, IMG / "solutions", prefix=f"{slug[:24]}_")
                if local and local not in imgs:
                    imgs.append(local)
                if len(imgs) >= 12:
                    break
            body_html = ""
            m = re.search(
                r'class="[^"]*content-page[^"]*"[^>]*>([\s\S]*?)(?:class="[^"]*site-footer|<footer|</body>)',
                page,
                re.I,
            )
            if m:
                body_html = re.sub(r"<(script|style)[^>]*>[\s\S]*?</\1>", "", m.group(1), flags=re.I).strip()
            out.append(
                {
                    "slug": slug,
                    "title": h1 or meta["title"],
                    "lead": meta["description"],
                    "text": clean_text(body_html)[:5000],
                    "html": body_html,
                    "images": imgs,
                    "meta": meta,
                    "sourceUrl": BASE + path,
                }
            )
            time.sleep(0.25)
        except Exception as e:  # noqa: BLE001
            print(f"    ! fail {slug}: {e}")
    return out


def is_og_logo(url: str | None) -> bool:
    return bool(url and re.search(r"OG_logo_zorgtech", url, re.I))


def scrape_blog() -> list[dict]:
    paths = []
    list_thumbs: dict[str, str] = {}
    # listing may be long; also use sitemap
    try:
        for ib in range(1, 6):
            sm = fetch(f"/sitemap-iblock-{ib}.xml")
            for loc in re.findall(r"<loc>(https://zorgtech\.com/blog/[^<]+)</loc>", sm):
                path = urlparse(loc).path
                if path.count("/") >= 3 and path not in paths:
                    paths.append(path)
    except Exception as e:  # noqa: BLE001
        print("blog sitemap warn", e)

    # crawl listing pages too — thumbs live on .new-thumb background-image
    for page in range(1, 20):
        list_url = "/blog/" if page == 1 else f"/blog/?PAGEN_1={page}"
        try:
            html = fetch(list_url)
        except Exception:
            break
        found = extract_links(html, r'href="(/blog/[a-z0-9\-]+/[^"?#]+/)"')
        before = len(paths)
        for u in found:
            if u not in paths:
                paths.append(u)
        for m in re.finditer(
            r'<a href="(/blog/[^"]+)" class="new-thumb" style="background-image: url\(([^)]+)\);"',
            html,
        ):
            slug = m.group(1).rstrip("/").split("/")[-1]
            thumb = m.group(2).strip("'\"")
            if slug and thumb and slug not in list_thumbs:
                list_thumbs[slug] = thumb
        if len(paths) == before and page > 1:
            break
        time.sleep(0.2)

    out = []
    print(f"[blog] {len(paths)} posts, {len(list_thumbs)} list thumbs")
    for path in paths:
        parts = [p for p in path.split("/") if p]
        slug = parts[-1]
        category = parts[1] if len(parts) > 2 else ""
        print(f"  [post] {slug}")
        try:
            page = fetch(path)
            meta = parse_meta(page)
            h1 = parse_h1(page)
            date = ""
            dm = re.search(r'datetime=["\']([^"\']+)["\']', page) or re.search(
                r'class="[^"]*date[^"]*"[^>]*>([^<]+)', page, re.I
            )
            if dm:
                date = clean_text(dm.group(1))
            imgs = []
            # Prefer listing card thumb over generic OG logo
            if list_thumbs.get(slug):
                local = download(list_thumbs[slug], IMG / "blog", prefix=f"{slug[:24]}_")
                if local:
                    imgs.append(local)
            # Article body images (relative /upload/... must match)
            for src in re.findall(r'<img[^>]+src=["\']([^"\']*?/upload/[^"\']+)["\']', page, re.I):
                if is_og_logo(src):
                    continue
                local = download(src, IMG / "blog", prefix=f"{slug[:24]}_")
                if local and local not in imgs:
                    imgs.append(local)
                if len(imgs) >= 10:
                    break
            # Fallback OG only when nothing else exists
            if not imgs and meta.get("image"):
                local = download(meta["image"], IMG / "blog", prefix=f"{slug[:24]}_")
                if local:
                    imgs.append(local)
            body_html = ""
            m = re.search(r'class="[^"]*content-page[^"]*"[^>]*>([\s\S]*?)(?:class="[^"]*site-footer|<footer|</body>)', page, re.I)
            if m:
                body_html = re.sub(r"<(script|style)[^>]*>[\s\S]*?</\1>", "", m.group(1), flags=re.I).strip()
            out.append(
                {
                    "slug": slug,
                    "category": category,
                    "title": h1 or meta["title"],
                    "lead": meta["description"],
                    "date": date,
                    "text": clean_text(body_html)[:8000],
                    "html": body_html,
                    "images": imgs,
                    "meta": meta,
                    "sourceUrl": BASE + path,
                }
            )
            time.sleep(0.2)
        except Exception as e:  # noqa: BLE001
            print(f"    ! fail {slug}: {e}")
    return out


def scrape_static() -> dict:
    pages = {}
    print("[static]")
    for key, path in STATIC_PAGES.items():
        print(f"  [{key}] {path}")
        try:
            html = fetch(path)
            meta = parse_meta(html)
            h1 = parse_h1(html)
            body_html = ""
            m = re.search(r'class="[^"]*content-page[^"]*"[^>]*>([\s\S]*?)(?:class="[^"]*site-footer|<footer|</body>)', html, re.I)
            if m:
                body_html = re.sub(r"<(script|style)[^>]*>[\s\S]*?</\1>", "", m.group(1), flags=re.I).strip()
            imgs = []
            for src in re.findall(r'<img[^>]+src=["\']([^"\']+/upload/[^"\']+)["\']', html, re.I):
                if any(x in src.lower() for x in ["favicon", "logo", "icon"]):
                    continue
                local = download(src, IMG / "pages", prefix=f"{key}_")
                if local and local not in imgs:
                    imgs.append(local)
                if len(imgs) >= 20:
                    break
            pages[key] = {
                "slug": key,
                "path": path,
                "title": h1 or meta["title"],
                "lead": meta["description"],
                "text": clean_text(body_html)[:10000],
                "html": body_html,
                "images": imgs,
                "meta": meta,
                "sourceUrl": BASE + path,
            }
            time.sleep(0.2)
        except Exception as e:  # noqa: BLE001
            print(f"    ! fail {key}: {e}")
    return pages


def scrape_areas_detail(pages: dict) -> list[dict]:
    """Application areas nested pages if present."""
    html = pages.get("areas", {}).get("html") or fetch("/oblasti-primeneniya/")
    paths = extract_links(html if isinstance(html, str) and html.startswith("<") else fetch("/oblasti-primeneniya/"), r'href="(/oblasti-primeneniya/[^"?#]+/)"')
    # also from sitemap
    try:
        for ib in range(1, 6):
            sm = fetch(f"/sitemap-iblock-{ib}.xml")
            for loc in re.findall(r"<loc>(https://zorgtech\.com/oblasti-primeneniya/[^<]+)</loc>", sm):
                path = urlparse(loc).path
                if path.rstrip("/") != "/oblasti-primeneniya" and path not in paths:
                    paths.append(path)
    except Exception:
        pass

    out = []
    print(f"[areas] {len(paths)}")
    for path in paths:
        slug = path.strip("/").split("/")[-1]
        print(f"  [area] {slug}")
        try:
            page = fetch(path)
            meta = parse_meta(page)
            h1 = parse_h1(page)
            body_html = ""
            m = re.search(r'class="[^"]*content-page[^"]*"[^>]*>([\s\S]*?)(?:class="[^"]*site-footer|<footer|</body>)', page, re.I)
            if m:
                body_html = re.sub(r"<(script|style)[^>]*>[\s\S]*?</\1>", "", m.group(1), flags=re.I).strip()
            imgs = []
            for src in re.findall(r'<img[^>]+src=["\']([^"\']+/upload/[^"\']+)["\']', page, re.I):
                local = download(src, IMG / "pages", prefix=f"area-{slug[:20]}_")
                if local and local not in imgs:
                    imgs.append(local)
                if len(imgs) >= 8:
                    break
            out.append(
                {
                    "slug": slug,
                    "title": h1 or meta["title"],
                    "lead": meta["description"],
                    "text": clean_text(body_html)[:5000],
                    "html": body_html,
                    "images": imgs,
                    "meta": meta,
                    "sourceUrl": BASE + path,
                }
            )
            time.sleep(0.2)
        except Exception as e:  # noqa: BLE001
            print(f"    ! fail {slug}: {e}")
    return out


def write_json(name: str, data) -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    path = DATA / name
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)} ({path.stat().st_size // 1024} KB)")


def main() -> None:
    IMG.mkdir(parents=True, exist_ok=True)
    DATA.mkdir(parents=True, exist_ok=True)

    categories, products = scrape_categories()
    write_json("categories.json", categories)
    write_json("products.json", products)

    projects = scrape_projects()
    write_json("projects.json", projects)

    solutions = scrape_solutions()
    write_json("solutions.json", solutions)

    blog = scrape_blog()
    write_json("blog.json", blog)

    pages = scrape_static()
    write_json("pages.json", pages)

    areas = scrape_areas_detail(pages)
    write_json("areas.json", areas)

    manifest = {
        "source": BASE,
        "counts": {
            "categories": len(categories),
            "products": len(products),
            "projects": len(projects),
            "solutions": len(solutions),
            "blog": len(blog),
            "pages": len(pages),
            "areas": len(areas),
            "images": sum(1 for _ in IMG.rglob("*") if _.is_file() and _.name != ".gitkeep"),
        },
    }
    write_json("manifest.json", manifest)
    print("DONE", json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
