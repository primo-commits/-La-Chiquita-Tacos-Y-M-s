# CLAUDE.md — La Chiquita Tacos Y Más website

Read `PROJECT_BRIEF.md` first: it has the structure, demo flow, integration plan and the owner-confirmation checklist.

## Key facts
- Business: **La Chiquita Tacos Y Más**, 232 Gauvin Rd, **Dieppe, New Brunswick** E1A 1M1 (Canada, not the US). Prices in CAD, 15% NB HST.
- Bilingual site (EN/FR). Every user-facing string lives in `LC.STR` in `assets/data.js`. Add both languages when adding text; use Canadian spelling in English and Canadian French.
- Static site, no build step: `index.html` + `assets/{styles.css,data.js,app.js}`. Hash routing in `app.js`.
- Content (hours, phone, menu, prices) is edited in `assets/data.js`.
- Ordering, payment and the kitchen dashboard are **simulated** with localStorage. Keep the "Demo mode" notice on checkout until a real processor is connected.

## Checks before committing
- `node --check assets/app.js && node --check assets/data.js`
- Serve with `python3 -m http.server` and click through home → menu → order → checkout → status → kitchen at desktop and 390px width
- `python3 tools/build_preview.py` still builds `dist/la-chiquita-preview.html`

## Design tokens
Orange `#FF6B35` (accent on dark), orange-ink `#C8471A` (buttons and links on light backgrounds, meets AA contrast), night `#0f0d0c`, cream `#faf6f0`. Fonts: Playfair Display (headings), Source Sans 3 (body), Instrument Serif italic (taglines).
