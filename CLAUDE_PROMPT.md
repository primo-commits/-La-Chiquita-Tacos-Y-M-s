# CLAUDE.md — La Chiquita Tacos Y Más Website

## Context
You are working on a website project for **La Chiquita Tacos Y Más**, a Latin fusion restaurant in Rockford, IL. Your job is to complete, refine, deploy, and/or hand off this project based on the client's goals.

---

## Project Overview

**Client:** La Chiquita Tacos Y Más, 1505 S. Main St., Rockford, IL 61102
**What:** Full marketing website with rolling hero video, colorful menu page, and online ordering integration
**Stage:** Dev preview is complete. Deployment to Vercel is pending.

**Two versions exist:**
1. **Standalone HTML** (`*.html` files) — open directly in browser, no build step. PRIMARY PREVIEW.
2. **Next.js version** (`src/app/`) — scaffolded but dependencies not installed

---

## Design

- **Brand Colors:** Orange `#FF6B35` primary, Dark `#1a1a1a`, Near-Black `#0f0f0f`, Off-White `#faf8f5`
- **Typography:** Playfair Display (headings) + Source Sans 3 (body) + Instrument Serif (taglines)
- **Hero:** Full-viewport rolling video (4 MP4s, 8-second rotation)
- **Nav:** Fixed, transparent → dark on scroll. Logo left, links center, "Order Online" right. Mobile hamburger → full-screen overlay
- **Menu page:** Color-coded by section — Breakfast (red), Specialties (orange), Sides (green), Desserts (gold)
- **Sections:** Burrito Libre-style segmentation — dark/light alternating sections

---

## File Structure

```
la-chiquita/
├── dev-index.html          ← PRIMARY PREVIEW FILE
├── menu.html               ← Full colorful menu page
├── about.html              ← About page
├── catering.html           ← Catering page (placeholder)
├── locations.html          ← Locations page with Google Maps embed
├── public/
│   ├── images/menu/        ← 9 dish photos (all confirmed real)
│   └── video/              ← 4 hero MP4s (all confirmed real)
├── src/                    ← Next.js version (scaffold only)
│   ├── app/
│   └── components/
├── package.json
├── next.config.js
├── tsconfig.json
└── PROJECT_BRIEF.md        ← Full project details, menu data, design specs
```

---

## Confirmed Real Menu Data

| Dish | Price | Section |
|------|-------|---------|
| Texas Style Breakfast Taco | $8.00 | Breakfast |
| Gringa (Quesadilla with Flour Tortilla) | $10.35 | Specialties |
| Tequenos — Venezuelan Cheese Sticks (4 pcs) | $9.20 | Sides & Snacks |
| Churros (4 Pcs) | $6.75 | Desserts |
| Colombian Empanadas | $3.45 | Sides & Snacks |
| Chilaquiles | $13.80 | Specialties |
| Enchiladas | $18.40 | Specialties |
| Nachos | $17.25 | Specialties |
| Patacón (2 Pcs) | $16.10 | Specialties |

---

## What Exists and Works

- `dev-index.html` — full single-page home, SPA-style page switching via JS
- `menu.html` — full colorful menu with all 9 dishes
- `about.html` — restaurant story, quote block, sign-off
- `catering.html` — placeholder (needs real content from owner)
- `locations.html` — Google Maps embed for Main St. location, "Coming Soon" for Mountain Rd.
- All 4 hero MP4s wired into hero rotation
- All 9 dish photos wired into menu preview grid and menu page
- Navbar with mobile hamburger menu
- Footer with 4-column layout

---

## What Needs to Change Before Launch

### Must fix (placeholder content)
- **Phone number:** `(815) 555-1234` is 100% fake — replace with real number
- **Hours:** "Open Daily — Hours Vary" — replace with real hours
- **Email:** `info@lachiquitarockford.com` — replace with real email
- **Catering section:** Placeholder only — real content needed from owner (min headcount, pricing, menu options)
- **Doordash link:** Currently goes to generic DoorDash landing page — replace with real restaurant storefront when POS is connected

### Must add
- **Restaurant exterior photo** — not yet provided
- **Restaurant interior photo** — not yet provided
- **Social media links** — Instagram, Facebook, etc. (not yet provided)
- **POS / ordering integration** — Clover preferred; until then DoorDash link is placeholder

### Deployment
1. Push to GitHub private repo
2. Connect repo to Vercel
3. Vercel auto-detects Next.js and deploys
4. Add custom domain

### Naming consistency
- Exact business name across all listings: **La Chiquita Tacos Y Más**
- Both "Y Más" and "Y Mas" appear in wild — use "Y Más" with accent

---

## Video Autoplay Note
Chrome/Edge block autoplay when opening HTML files directly from disk (file://). The hero video rotation works correctly once deployed to Vercel — this is a local browser restriction only.

---

## Brand Voice
- AI-assisted, human-led — not "AI-powered" or "AI-first"
- Real people, real professionals, real experience
- Show the humans behind the business

---

## If Deploying to Vercel (Next.js version)

```bash
cd la-chiquita
npm install
npm run build
vercel --prod
```

The Next.js version is scaffolded but not yet configured. The standalone HTML files are the primary deliverable and production-ready.

---

## Starting Point

If you're picking this up cold: read `PROJECT_BRIEF.md` first for the full picture, then open `dev-index.html` in a browser to see what exists. Work through the pending items above. Deploy to Vercel when ready.
