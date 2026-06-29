"""Export a CDN-ready HD stage-deep icon from the embedded raster in stage-deep-icon-hd.svg."""
from __future__ import annotations

import base64
import io
import re
import struct
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC_SVG = ROOT / 'static' / 'assets' / 'auth' / 'stage-deep-icon-hd.svg'
OUT_DIR = ROOT.parent / 'UniPrism_New-main' / 'public' / 'images' / 'explore' / 'discover' / 'figma'
OUT_PNG = OUT_DIR / 'stage-deep-icon-transparent-20260615-hd.png'
SUBPKG_OUT = ROOT / 'static' / 'assets' / 'discover' / 'stage-deep-icon-hd.webp'
TARGET_EDGE = 544  # ~3x for 272rpx * 1.18 display on 375px-wide phones


def extract_png(svg_path: Path) -> Image.Image:
    text = svg_path.read_text(encoding='utf-8')
    match = re.search(r'href="data:image/png;base64,([^"]+)"', text)
    if not match:
        raise SystemExit(f'No embedded PNG found in {svg_path}')
    data = base64.b64decode(match.group(1))
    return Image.open(io.BytesIO(data)).convert('RGBA')


def main() -> None:
    if not SRC_SVG.exists():
        raise SystemExit(f'Missing source asset: {SRC_SVG}')

    image = extract_png(SRC_SVG)
    print(f'source: {image.width}x{image.height}')

    resized = image.resize((TARGET_EDGE, TARGET_EDGE), Image.Resampling.LANCZOS)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    resized.save(OUT_PNG, format='PNG', optimize=True)
    SUBPKG_OUT.parent.mkdir(parents=True, exist_ok=True)
    resized.save(SUBPKG_OUT, format='WEBP', quality=92, method=6)

    size_kb = OUT_PNG.stat().st_size / 1024
    subpkg_kb = SUBPKG_OUT.stat().st_size / 1024
    print(f'wrote: {OUT_PNG}')
    print(f'wrote: {SUBPKG_OUT}')
    print(f'output: {TARGET_EDGE}x{TARGET_EDGE}, png {size_kb:.1f} KB, static webp {subpkg_kb:.1f} KB')
    print('CDN path: /images/explore/discover/figma/stage-deep-icon-transparent-20260615-hd.png')
    print('static path: /static/assets/discover/stage-deep-icon-hd.webp')


if __name__ == '__main__':
    main()
