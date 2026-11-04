from PIL import Image

im = Image.open("Dijital Öğretmen Bozok Karakteri.png")
print(im.mode, im.size)
a = im.getchannel("A")
print("alpha corners:", [a.getpixel(p) for p in [(0,0),(5,5),(20,20),(1023,0),(0,1535)]])
print("alpha extrema:", a.getextrema())
# bounding box of non-transparent
print("alpha bbox:", a.getbbox())

logo = Image.open("Öğretmen Bozok Teknoloji Logosu.png").convert("RGB")
w, h = logo.size
# flood fill from edges removing light gray/white background
from collections import deque
import numpy as np

arr = np.array(logo).astype(np.int16)
# background: near-neutral (channel spread small) and bright
spread = arr.max(axis=2) - arr.min(axis=2)
bright = arr.min(axis=2) >= 200
candidate = (spread <= 12) & bright
print("candidate bg fraction:", candidate.mean())
# flood fill connected from border using BFS on candidate mask
visited = np.zeros((h, w), dtype=bool)
dq = deque()
for x in range(w):
    for y in (0, h-1):
        if candidate[y, x] and not visited[y, x]:
            visited[y, x] = True; dq.append((y, x))
for y in range(h):
    for x in (0, w-1):
        if candidate[y, x] and not visited[y, x]:
            visited[y, x] = True; dq.append((y, x))
while dq:
    y, x = dq.popleft()
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny, nx = y+dy, x+dx
        if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and candidate[ny, nx]:
            visited[ny, nx] = True; dq.append((ny, nx))
print("flood bg fraction:", visited.mean())
rgba = np.dstack([arr.astype(np.uint8), np.where(visited, 0, 255).astype(np.uint8)])
out = Image.fromarray(rgba)
# crop to content with small padding
bbox = out.getchannel("A").getbbox()
print("content bbox:", bbox)
out = out.crop(bbox)
print("new size:", out.size)
out.save("scripts/logo-transparent.png")
