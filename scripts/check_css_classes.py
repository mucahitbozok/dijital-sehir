import pathlib
import re

root = pathlib.Path(__file__).resolve().parent.parent
css = (root / "src" / "styles" / "global.css").read_text(encoding="utf-8")
defined = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", css))

used = set()
for path in (root / "src").rglob("*.tsx"):
    text = path.read_text(encoding="utf-8")
    for match in re.finditer(r"className=(?:\{`([^`]*)`\}|\"([^\"]*)\")", text):
        value = match.group(1) or match.group(2) or ""
        for token in re.findall(r"[a-zA-Z][a-zA-Z0-9_-]*", value):
            if len(token) > 2:
                used.add(token)

missing = sorted(used - defined)
print("\n".join(missing) or "Eksik sınıf yok.")
