from pathlib import Path
import base64
import gzip

root = Path(__file__).resolve().parent
site = root / "_site"
site.mkdir(exist_ok=True)

generator = gzip.decompress(base64.b64decode((root / "site_generator.py.gz.b64").read_text())).decode("utf-8")
generator = generator.replace("OUT = Path('/mnt/data/fixora-base-site')", "OUT = Path('_site')")
runtime = root / "_generate_runtime.py"
runtime.write_text(generator, encoding="utf-8")

exec(compile(generator, str(runtime), "exec"), {"__name__": "__main__"})

css = gzip.decompress(base64.b64decode((root / "styles.css.gz.b64").read_text()))
(site / "styles.css").write_bytes(css)
(site / "premium.css").write_bytes((root / "premium.css").read_bytes())
(site / "app.js").write_bytes((root / "app.js").read_bytes())

for html_file in site.glob("*.html"):
    html = html_file.read_text(encoding="utf-8")
    if 'premium.css' not in html:
        html = html.replace(
            '<link rel="stylesheet" href="styles.css">',
            '<link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="premium.css">'
        )
    html_file.write_text(html, encoding="utf-8")

assert (site / "index.html").exists()
assert (site / "styles.css").exists()
assert (site / "premium.css").exists()
assert (site / "app.js").exists()
assert len(list(site.glob("*.html"))) >= 15
print("FIXORA Base site built:", len(list(site.glob("*.html"))), "HTML pages")
