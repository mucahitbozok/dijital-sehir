"""Kaynak logo ve karakter dosyalarını DEĞİŞTİRMEDEN işler.

- Logo dosyasındaki damalı arka planı, kenardan bağlantılı nötr-açık
  bölgeleri ve büyük kapalı sayaç alanlarını saydam yaparak temizler.
- Orijinal dosya adları korunur; çıktı src/assets/brand/ altına yazılır.
- PWA simgelerini üretir.
"""

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE_LOGO = ROOT / "Öğretmen Bozok Teknoloji Logosu.png"
SOURCE_CHARACTER = ROOT / "Dijital Öğretmen Bozok Karakteri.png"
BRAND_DIR = ROOT / "src" / "assets" / "brand"
ICON_DIR = ROOT / "public" / "icons"

TRANSPARENT_LOGO = BRAND_DIR / "ogretmen-bozok-logo.png"
TRANSPARENT_CHARACTER = BRAND_DIR / "ogretmen-bozok-karakter.png"

NEUTRAL_TOLERANCE = 4
BRIGHT_THRESHOLD = 205
MIN_HOLE_AREA = 400


def remove_checkerboard(image: Image.Image) -> Image.Image:
    rgb = np.array(image.convert("RGB")).astype(int)
    height, width = rgb.shape[:2]
    spread = rgb.max(axis=2) - rgb.min(axis=2)
    mask = (spread <= NEUTRAL_TOLERANCE) & (rgb.min(axis=2) >= BRIGHT_THRESHOLD)

    visited = np.zeros((height, width), dtype=bool)
    remove = np.zeros((height, width), dtype=bool)
    neighbors = ((1, 0), (-1, 0), (0, 1), (0, -1))

    for start_y in range(height):
        for start_x in range(width):
            if not mask[start_y, start_x] or visited[start_y, start_x]:
                continue
            queue = deque([(start_y, start_x)])
            visited[start_y, start_x] = True
            pixels: list[tuple[int, int]] = []
            touches_border = False
            while queue:
                y, x = queue.popleft()
                pixels.append((y, x))
                if x == 0 or y == 0 or x == width - 1 or y == height - 1:
                    touches_border = True
                for dy, dx in neighbors:
                    ny, nx = y + dy, x + dx
                    if (
                        0 <= ny < height
                        and 0 <= nx < width
                        and mask[ny, nx]
                        and not visited[ny, nx]
                    ):
                        visited[ny, nx] = True
                        queue.append((ny, nx))
            if touches_border or len(pixels) >= MIN_HOLE_AREA:
                for y, x in pixels:
                    remove[y, x] = True

    alpha = np.where(remove, 0, 255).astype(np.uint8)
    cleaned = image.convert("RGBA")
    cleaned.putalpha(Image.fromarray(alpha, mode="L"))

    bbox = cleaned.getbbox()
    if bbox:
        cleaned = cleaned.crop(bbox)
    return cleaned


def padded(image: Image.Image, size: int, background: tuple[int, int, int, int] | None) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), background or (0, 0, 0, 0))
    target = int(size * 0.72)
    ratio = min(target / image.width, target / image.height)
    resized = image.resize(
        (max(1, round(image.width * ratio)), max(1, round(image.height * ratio))),
        Image.LANCZOS,
    )
    canvas.alpha_composite(
        resized,
        ((size - resized.width) // 2, (size - resized.height) // 2),
    )
    return canvas


def main() -> None:
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    ICON_DIR.mkdir(parents=True, exist_ok=True)

    logo = remove_checkerboard(Image.open(SOURCE_LOGO))
    logo.save(TRANSPARENT_LOGO)
    print("logo:", TRANSPARENT_LOGO, logo.size)

    character = Image.open(SOURCE_CHARACTER).convert("RGBA")
    character.save(TRANSPARENT_CHARACTER)
    print("karakter:", TRANSPARENT_CHARACTER, character.size)

    padded(logo, 192, (255, 255, 255, 255)).convert("RGB").save(ICON_DIR / "icon-192.png")
    padded(logo, 512, (255, 255, 255, 255)).convert("RGB").save(ICON_DIR / "icon-512.png")
    maskable = Image.new("RGBA", (512, 512), (13, 148, 136, 255))
    inner = padded(logo, 512, None)
    maskable.alpha_composite(inner)
    maskable.convert("RGB").save(ICON_DIR / "icon-maskable-512.png")
    print("simgeler yazıldı:", ICON_DIR)


if __name__ == "__main__":
    main()
