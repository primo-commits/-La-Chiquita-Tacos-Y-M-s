#!/usr/bin/env python3
"""Bundle the site into one self-contained HTML file for sharing a preview.

Inlines assets/styles.css, assets/data.js and assets/app.js, and embeds every
image and video under public/ so the file works when opened on its own
(emailed, AirDropped, opened from Downloads, etc.).

Usage:  python3 tools/build_preview.py  [output path]
Default output: dist/la-chiquita-preview.html
"""
import base64
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'dist' / 'la-chiquita-preview.html'
MIME = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.webp': 'image/webp'}


def read(rel):
    return (ROOT / rel).read_text(encoding='utf-8')


def main():
    html = read('index.html')
    css = read('assets/styles.css')
    data_js = read('assets/data.js')
    app_js = read('assets/app.js')

    assets = {}
    for f in sorted((ROOT / 'public').rglob('*')):
        if f.suffix.lower() in MIME:
            rel = f.relative_to(ROOT).as_posix()
            assets[rel] = [MIME[f.suffix.lower()], base64.b64encode(f.read_bytes()).decode('ascii')]

    # Decode embedded files into blob: URLs once, so each is stored in the page only one time.
    loader = (
        '<script>window.LC_ASSETS={};(function(a){for(var k in a){try{var b=atob(a[k][1]),u=new Uint8Array(b.length);'
        'for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);'
        'window.LC_ASSETS[k]=URL.createObjectURL(new Blob([u],{type:a[k][0]}));}catch(e){}}})('
        + json.dumps(assets) + ');</script>'
    )

    html = html.replace('<link rel="stylesheet" href="assets/styles.css">', '<style>\n' + css + '\n</style>')
    html = html.replace('<script src="assets/data.js"></script>', loader + '\n<script>\n' + data_js + '\n</script>')
    html = html.replace('<script src="assets/app.js"></script>', '<script>\n' + app_js + '\n</script>')
    assert 'assets/' not in html.split('<style>')[0], 'stylesheet link was not inlined'

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding='utf-8')
    print(f'Wrote {OUT} ({OUT.stat().st_size / 1e6:.1f} MB, {len(assets)} embedded files)')


if __name__ == '__main__':
    main()
