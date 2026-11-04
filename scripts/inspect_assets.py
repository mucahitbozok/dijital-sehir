from PIL import Image

for name in ["Öğretmen Bozok Teknoloji Logosu.png", "Dijital Öğretmen Bozok Karakteri.png"]:
    im = Image.open(name)
    print(name, im.mode, im.size)
    rgb = im.convert("RGB")
    w, h = rgb.size
    pts = [(0, 0), (5, 5), (20, 20), (40, 40), (w - 1, 0), (0, h - 1)]
    print("  corner pixels:", [rgb.getpixel(p) for p in pts])
    # sample top-left 80x80 unique-ish colors
    colors = {}
    for y in range(0, 80, 4):
        for x in range(0, 80, 4):
            c = rgb.getpixel((x, y))
            colors[c] = colors.get(c, 0) + 1
    print("  top-left common:", sorted(colors.items(), key=lambda kv: -kv[1])[:5])
