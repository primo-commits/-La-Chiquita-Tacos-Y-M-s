# La Chiquita Tacos Y Más — Website Project Brief

## Overview
**Client:** La Chiquita Tacos Y Más, 1505 S. Main St., Rockford, IL 61102
**Project:** Marketing website + online ordering integration
**Stage:** Dev preview complete, not yet deployed to Vercel

---

## What Was Built

A full multi-page website with rolling hero video, colorful Burrito Libre-style menu, and SPA-style navigation. Two versions exist:

1. **Next.js version** (`src/app/`) — production build for Vercel deployment
2. **Standalone dev HTML version** (`*.html`) — no build step needed, open directly in browser

Both versions share the same design, content, and asset references.

---

## File Structure

```
la-chiquita/
├── dev-index.html          ← PRIMARY PREVIEW FILE — open this in browser
├── menu.html               ← Full menu page
├── about.html              ← About page
├── catering.html           ← Catering page
├── locations.html          ← Locations page with Google Maps
├── public/
│   ├── images/menu/        ← 9 dish photos (all wired up)
│   │   ├── Texas-Style-Breakfast-Taco.jpg
│   │   ├── Gringa-(Quesadilla-with-Flour-Tortilla).jpg
│   │   ├── Tequenos-(Venezuelan-Cheese-Sticks-4pcs).jpg
│   │   ├── Churros(4-Pcs).jpg
│   │   ├── Colombian-Empanadas.jpg
│   │   ├── Chilaquiles.jpg
│   │   ├── Enchiladas.jpg
│   │   ├── Nachos.jpg
│   │   └── Patacon(2-Pcs).jpg
│   └── video/              ← 4 hero MP4s (all wired up)
│       ├── video1.mp4
│       ├── video2.mp4
│       ├── video3.mp4
│       └── video4.mp4
├── src/                    ← Next.js version (not yet configured)
│   ├── app/
│   │   ├── page.tsx        ← Home page
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── menu/page.tsx
│   │   ├── about/page.tsx
│   │   ├── catering/page.tsx
│   │   └── locations/page.tsx
│   └── components/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── package.json
├── next.config.js
├── tsconfig.json
└── .gitignore
```

**Note:** The Next.js version is scaffolded but dependencies are not installed. The standalone HTML files are the primary preview deliverable.

---

## Design Specs

### Brand Colors
| Name       | Hex       | Use |
|------------|-----------|-----|
| Orange     | `#FF6B35` | Primary CTA, accents, logo mark |
| Dark       | `#1a1a1a` | Navbar, dark sections |
| Near-Black | `#0f0f0f` | Hero, menu preview background |
| Off-White  | `#faf8f5` | About page, light sections |
| Gold       | `#d4a017` | Desserts section accent |
| Green      | `#27ae60` | Sides section accent |
| Red        | `#c0392b` | Breakfast section accent |
| Orange2    | `#e67e22` | Specialties section accent |

### Typography
- **Headings:** `Playfair Display` (Google Fonts) — serif, weight 700/900
- **Body:** `Source Sans 3` (Google Fonts) — clean sans-serif
- **Taglines/quotes:** `Instrument Serif` (Google Fonts) — italic for flavor text

### Menu Section Colors
- Breakfast → red (`#fdf2f2` bg / `#c0392b` title)
- Specialties → orange (`#fef9f3` bg / `#e67e22` title)
- Sides & Snacks → green (`#f0fdf4` bg / `#27ae60` title)
- Desserts → gold (`#fffdf0` bg / `#d4a017` title)

---

## Menu Data (Confirmed, Real)

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

## Pages & Features

### Home (`dev-index.html`)
- **Hero:** Full-viewport video with rolling 4-video rotation (8s interval), overlay, restaurant name, tagline, dual CTA ("View Menu" / "Order Online")
- **Menu Preview:** Dark section with all 9 dishes in card grid — photo + name + description + price
- **Delivery Banner:** Orange band — DoorDash link
- **About Preview:** Light section — story split with image placeholder + text
- **Catering Preview:** Dark section — 3 feature cards + CTA
- **Footer:** 4-column with nav, order links, contact

### Menu (`menu.html`)
- Page hero with tagline
- 4 color-coded sections (Breakfast / Specialties / Sides / Desserts)
- Each item: photo thumbnail + name + description + price
- Bottom disclaimer about allergies and catering

### About (`about.html`)
- Page hero
- Restaurant story paragraphs
- Quote block
- Signature sign-off

### Catering (`catering.html`)
- Page hero
- Description paragraphs
- 4 feature cards (Occasion / Full Menu / Custom Packages / Full-Service Setup)
- Orange CTA box with phone link

### Locations (`locations.html`)
- Main Street card with live Google Maps embed
- Mountain Road "Coming Soon" card with placeholder

### Navbar (all pages)
- Fixed, transparent on load → dark on scroll
- Logo left, nav links center, "Order Online" CTA right
- Mobile: hamburger → full-screen overlay

---

## Asset Status

| Asset | Path | Status |
|-------|------|--------|
| Hero video 1 | `public/video/video1.mp4` | ✅ In place |
| Hero video 2 | `public/video/video2.mp4` | ✅ In place |
| Hero video 3 | `public/video/video3.mp4` | ✅ In place |
| Hero video 4 | `public/video/video4.mp4` | ✅ In place |
| Dish photo — Breakfast Taco | `public/images/menu/Texas-Style-Breakfast-Taco.jpg` | ✅ In place |
| Dish photo — Gringa | `public/images/menu/Gringa-(Quesadilla-with-Flour-Tortilla).jpg` | ✅ In place |
| Dish photo — Tequenos | `public/images/menu/Tequenos-(Venezuelan-Cheese-Sticks-4pcs).jpg` | ✅ In place |
| Dish photo — Churros | `public/images/menu/Churros(4-Pcs).jpg` | ✅ In place |
| Dish photo — Empanadas | `public/images/menu/Colombian-Empanadas.jpg` | ✅ In place |
| Dish photo — Chilaquiles | `public/images/menu/Chilaquiles.jpg` | ✅ In place |
| Dish photo — Enchiladas | `public/images/menu/Enchiladas.jpg` | ✅ In place |
| Dish photo — Nachos | `public/images/menu/Nachos.jpg` | ✅ In place |
| Dish photo — Patacón | `public/images/menu/Patacon(2-Pcs).jpg` | ✅ In place |
| Restaurant exterior photo | — | ❌ Not provided yet |
| Restaurant interior photo | — | ❌ Not provided yet |
| Mountain Road location photo | — | ❌ Not provided yet (coming soon anyway) |

---

## Pending Items (Needs Client Input)

### Must Confirm
- **Phone number** — currently `(815) 555-1234` as placeholder — confirm real number
- **Real hours of operation** — "Open Daily — Hours Vary" is placeholder
- **Catering** — confirm if owner offers it, min headcount, pricing structure, any catering-specific menu items
- **Email address** — `info@lachiquitarockford.com` is placeholder — confirm

### Not Yet Done
- **POS / ordering integration** — currently links to DoorDash generic page. Clover or other POS pending client decision
- **GitHub repo** — not created yet
- **Vercel deployment** — not done yet
- **Custom domain** — not registered/connected yet
- **Interior/exterior photos** — not provided yet
- **Mountain Road location details** — coming soon placeholder only

---

## Deployment Instructions

### Step 1 — Push to GitHub
```powershell
cd C:/Users/Primoz/minimax-agent/projects/la-chiquita
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/la-chiquita.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Add New → Project
2. Import the GitHub repo
3. Vercel auto-detects Next.js — click Deploy
4. Wait ~2 min → get `*.vercel.app` URL
5. Test before adding custom domain

### Step 3 — Custom Domain
1. Vercel → Project → Settings → Domains
2. Add domain (e.g., `lachiquitailrockford.com`)
3. Add DNS records at your registrar (Vercel provides them)
4. SSL auto-provisions once DNS propagates

---

## Video Autoplay Note

Chrome/Edge block autoplay videos when opening HTML files directly from disk (file:// protocol). The hero video rotation works correctly when deployed to Vercel — this is a local browser security restriction only.

---

## Key Constraints
- **Two entities** — make sure Google Business Profile, Yelp, and any future listings all match exactly: "La Chiquita Tacos Y Más", 1505 S. Main St., Rockford, IL 61102
- **Phone number** `(815) 555-1234` is 100% placeholder — update before going live
- **DoorDash link** goes to generic DoorDash landing page — replace with actual restaurant storefront when POS is connected
- **No social links** in footer yet (Instagram, Facebook, etc.) — add when client provides handles
