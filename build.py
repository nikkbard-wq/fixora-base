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
(site / "app.js").write_bytes((root / "app.js").read_bytes())

assert (site / "index.html").exists()
assert (site / "styles.css").exists()
assert (site / "app.js").exists()
print("FIXORA Base site built:", len(list(site.glob("*.html"))), "HTML pages")
