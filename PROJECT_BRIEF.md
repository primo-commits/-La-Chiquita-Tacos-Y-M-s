# La Chiquita Tacos Y Más — Website Project Brief

## Overview
**Client:** La Chiquita Tacos Y Más — 232 Gauvin Rd, Dieppe, NB E1A 1M1
**Project:** Marketing website + direct pickup ordering (mockup for client pitch)
**Stage:** Clickable mockup. The design and flows are complete; ordering and payments are simulated.

---

## How to view it

| Option | How |
|---|---|
| **Single-file preview** (easiest to share) | `python3 tools/build_preview.py` → open `dist/la-chiquita-preview.html`. Everything, including videos and photos, is embedded (~7 MB). |
| **Local server** | `python3 -m http.server 8000` in the repo root → http://localhost:8000 |
| **Hosted** | Drag the repo onto Netlify Drop, or import it in Vercel as a static site. No build step. |

---

## File structure

```
index.html            ← page shell, SEO meta, schema.org Restaurant data
assets/
  styles.css          ← all styling (design tokens at the top)
  data.js             ← business info, hours, menu, EN/FR text  ← edit content here
  app.js              ← router, menu, cart, checkout, order status, kitchen demo
public/
  images/menu/        ← dish photos (3 taco photos are stills from the owner's videos)
  images/stills/      ← video poster frames
  video/              ← 4 vertical (9:16) hero clips
tools/build_preview.py ← builds the single-file preview into dist/
```

Pages (hash routes): `#/` home · `#/menu` · `#/order` · `#/checkout` · `#/status/<id>` · `#/about` · `#/catering` · `#/visit` · `#/kitchen` (restaurant dashboard demo).

---

## What the mockup demonstrates

- **Hero:** vertical phone clips play in a "reel" frame on desktop and full-screen on mobile, with a live open/closed badge
- **EN / FR toggle:** Dieppe is majority francophone, so the whole site, including the menu, is translated
- **Menu:** colour-coded sections; any item opens an options popup (meat, sauce, choose-4 tacos, special instructions)
- **Pickup ordering:** cart → checkout (contact info, ASAP or scheduled time slots based on real hours, pay now or at pickup, tip, 15% NB HST) → order confirmation with a live status tracker
- **Kitchen dashboard (`#/kitchen`):** incoming orders chime and flash; staff tap Accept → Mark ready → Picked up, and the customer's status page updates live. "Send a test order" is there for demos.
- The cart, orders and language setting are saved in the browser (localStorage) purely to simulate a backend

**Demo tip:** place an order, click "Open kitchen dashboard" on the confirmation page, accept it, and switch back to watch the status change.

---

## Building the real ordering system later

The mockup marks where each real integration plugs in:

1. **Payments** — replace the demo card fields in checkout (`checkoutView` in `assets/app.js`) with the processor's hosted card field (Square Web Payments SDK, Clover iframe, or Stripe Elements). Payment is taken server-side.
2. **Orders backend** — replace `getOrders` / `saveOrders` with API calls. Simplest paths:
   - *Square:* create the order through the Square Orders API; it shows up on their Square POS / KDS automatically, with no custom kitchen screen needed.
   - *Clover:* Clover Ecommerce API + Clover Online Ordering webhooks.
   - *Custom:* a small serverless API (Vercel/Netlify functions) + database (Supabase/Firebase) + the `#/kitchen` screen on a tablet.
3. **Notifications** — kitchen: POS/KDS alert or a push to the dashboard; customer: SMS via Twilio when staff tap "Mark ready".
4. **Menu sync** — load `LC.MENU` from the POS catalog so prices and sold-out items stay in sync.

---

## Needs confirmation from the owner

- [ ] **Hours** — currently Thu–Fri 10–6, Sat 8–1 (from public listings; they vary slightly) → `LC.BUSINESS.hours` in `assets/data.js`
- [ ] **Phone** — (647) 804-3909 from public listings
- [ ] **Prices** — current prices match DoorDash, which is usually marked up (~15%). Confirm in-store/pickup prices.
- [ ] **Taco lineup** — the 4 taco types (birria, al pastor, pulled chicken, pulled pork) and the "Combination of All 4" description are assumptions
- [ ] **Birria Ramen** — needs a photo
- [ ] **Mountain Road (Moncton) "coming soon"** — is a second location actually planned?
- [ ] **Catering** — min headcount, drop-off vs on-site, 24-hour reply promise
- [ ] **Dine-in?** — copy currently avoids promising seating
- [ ] **Email address** and **Facebook** (Instagram is @cheekytacosnb)
- [ ] **Real photos** of the storefront/stand, the team, and higher-resolution dish photos (the hero clips are 360×640)
- [ ] **Google review link** — the "Leave a review" button needs their Place ID link from the Google Business Profile

## Naming consistency
Use exactly **La Chiquita Tacos Y Más** (with the accent) on every listing: Google, DoorDash, Uber Eats, Instagram.
