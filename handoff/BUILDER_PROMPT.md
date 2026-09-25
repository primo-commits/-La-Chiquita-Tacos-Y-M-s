# Prompt: La Chiquita Tacos Y Más — website + pickup ordering app

> Paste everything below the line into Base44 (or any AI app builder). Upload the files from `images/` and `videos/` in this package when it asks for assets. `menu.json` has the same menu data in structured form.

---

Build a website and pickup-ordering app for **La Chiquita Tacos Y Más**, a Latin street food spot in **Dieppe, New Brunswick, Canada**. It serves Mexican birria and al pastor tacos, Colombian empanadas and patacones, and Venezuelan tequeños. Their signature dish is **birria tacos served with a cup of consommé for dipping**. Customers love it, and they're rated 4.8★ on Google.

## Design direction: make it different from our first concept

We already have one concept, and I want this version to feel like a **different restaurant website**, not a remix. Our first concept was:
- dark and cinematic: near-black backgrounds with an orange accent
- elegant serif headings (Playfair Display) with italic serif taglines
- a tilted phone-style video frame in the hero next to the restaurant name
- sections alternating between dark and cream, with rounded cards over photos

**Avoid all of that.** Instead, go **bright, loud and joyful**, like a Latin street market on a sunny day:
- **Light, sunny base** (warm white, butter yellow or pale pink) with **bold saturated colours**: hot pink, turquoise, marigold, chili red, lime. Colour-blocked sections instead of dark ones.
- **Chunky, playful type**: a heavy rounded or grotesque display font for headings and a friendly sans for body text. No elegant serifs.
- **Hand-made touches**: sticker-style badges, papel picado-style borders or dividers, hand-drawn arrows or doodles, slightly tilted photos with thick outlines, marquee or ticker strips ("BIRRIA • EMPANADAS • TEQUEÑOS • CHURROS •").
- **Menu-first homepage**: food and a big "Order pickup" button should be visible right away, not below a large hero. Think "fun food truck menu board", not "fine dining".
- **Videos**: the 4 clips are **vertical phone videos (360×640)**. Don't stretch them into a wide background. Show them as a row of short "story" tiles, or as a small looping sticker. They're low-resolution, so keep them small.
- **Mobile first.** Most customers will be on their phones. Big tap targets, and a sticky "View order" bar.
- Keep it accessible: readable contrast (white text on light pink or yellow won't pass) and keyboard-friendly.

If you have a better bold idea that still feels fun, colourful and different from the dark/elegant version, go for it.

## Pages / sections
1. **Home**: name, "Open now / Closed · opens Thursday 10 AM" status based on hours, Order pickup button, favourites (birria tacos, patacón, empanada), video stories, Google rating, catering teaser, location and hours.
2. **Menu**: grouped by category, with photos, prices and a "Popular" tag. Tapping an item opens its options.
3. **Order for pickup** (most important, see below).
4. **Catering**: what they offer and a quote request form (name, phone, event date, number of guests, event type, message).
5. **About**: short story. Latin street food from across Latin America, house-made salsas, ají and hot sauce, cooked fresh on the griddle, proud to be part of Dieppe and Greater Moncton.
6. **Visit**: Google map, address, hours table with today highlighted, directions, call button, Instagram.

## Pickup ordering (the key feature)
- Customers add items to a cart, choosing required options (e.g. meat, sauce, "pick your 4 tacos"), quantity and special instructions.
- **Checkout**:
  - name, mobile number, optional email, and "text me when it's ready"
  - pickup time: **ASAP (about 20 min)** only while open, or a **scheduled** time in 15-minute slots within opening hours for the next open days
  - **pay now** (card) or **pay at pickup**
  - optional tip (0 / 10 / 15 / 18%)
  - **15% HST**, prices in **CAD**
- If the platform supports **Stripe**, connect it in test mode. Otherwise show a clearly labelled "Demo — no real payment" card section.
- After ordering, the customer sees an **order number** and a **live status tracker**: Received → Preparing → Ready for pickup → Picked up.
- **Store orders in the database** (Orders entity: number, customer, phone, items with options, notes, pickup time, payment method, subtotal, tax, tip, total, status, created time).

## Restaurant side (owner/staff only, behind login)
- **Kitchen screen** for a tablet at the counter: columns New / Preparing / Ready. New orders appear live with a sound and a visual flash. Buttons: *Accept & start* → *Mark ready* → *Picked up*. Updating the status updates the customer's tracker in real time.
- If the platform supports it, send the customer an **SMS or email when marked Ready**.
- **Menu manager**: owner can edit items, prices, photos and options, and toggle **sold out** (sold-out items show but can't be added).
- **Hours manager**: owner can edit hours and pause online ordering ("kitchen is busy").
- A simple daily summary: number of orders and total sales.

## Bilingual: English and French
Dieppe is majority francophone (Acadian). Add an **EN / FR toggle** that translates everything, including the menu. French translations are in `menu.json` (`name_fr`, `description_fr`, etc.). Use Canadian French (e.g. "déjeuner" for breakfast, "TVH" for HST, "courriel" for email).

## Business details
- **Name:** La Chiquita Tacos Y Más (always with the accent on "Más")
- **Address:** 232 Gauvin Rd, Dieppe, NB E1A 1M1, Canada
- **Phone:** (647) 804-3909
- **Hours:** Thursday & Friday 10:00 AM – 6:00 PM · Saturday 8:00 AM – 1:00 PM · closed Sunday–Wednesday
- **Instagram:** @cheekytacosnb — https://www.instagram.com/cheekytacosnb/
- **Also on:** DoorDash (https://www.doordash.com/store/la-chiquita-tacos-y-mas---232-gauvin-rd-dieppe-33367567/) and Uber Eats (https://www.ubereats.com/ca/store/la-chiquita-tacos-y-mas/GQajnP_QWLmP82k4YOs7yw). Show these as small "prefer delivery?" links. Direct pickup ordering is the main action.
- **Google rating:** 4.8★

## Menu (CAD)
**Tacos & Birria**
- Birria Tacos (4) with Consommé: $19.55 ★ popular. Slow-braised birria in griddle-crisped corn tortillas with cheese, onion and cilantro, with consommé for dipping.
- Mix & Match (any 4 tacos): $19.55 ★ popular. Options Taco 1–4, each: Birria / Al pastor / Pulled chicken / Pulled pork.
- Combination of All 4: $19.55. One of each taco, served with consommé.
- Birria Ramen: $18.40. Ramen noodles in birria consommé with birria, onion, cilantro and lime. *(no photo yet)*

**Breakfast**
- Texas-Style Breakfast Taco: $8.00. Option: Bacon / Chorizo. Eggs, potato, cheese and refried beans on a flour tortilla.

**Specialties**
- Gringa (quesadilla on flour tortilla): $10.35. Al pastor with pineapple, cheese, cilantro and onion.
- Patacón (2 pcs): $16.10 ★ popular. Option: Pulled chicken / Pulled pork / Mix. Fried smashed green plantains with pickled onions, cilantro, crema and house sauce.
- Nachos: $17.25. Homemade chips, refried beans, chorizo, cheese, cilantro, onion and Mexican crema.
- Chilaquiles: $13.80. Option: Red (spicy) / Green (mild). Homemade chips simmered in sauce, with cheese, cilantro, onion and crema.
- Enchiladas: $18.40. Option: Chicken / Cheese. Corn tortillas in mild green sauce with cheese, cilantro, onion and crema.

**Sides & Snacks**
- Colombian Empanada (each): $3.45 ★ popular. Option: Beef / Chicken. Crispy corn-flour turnover with potato, tomato and onion, served with house ají.
- Tequeños (4 pcs): $9.20. Venezuelan cheese sticks with salsa rosa and house sauce.

**Desserts**
- Churros (4 pcs): $6.75. Cinnamon sugar with homemade chocolate sauce.

## Assets provided
- `images/menu/`: dish photos, named after each dish (Birria-Tacos, Mix-and-Match-Tacos, Combination-Tacos, Texas-Style-Breakfast-Taco, Gringa…, Patacon…, Nachos, Chilaquiles, Enchiladas, Colombian-Empanadas, Tequenos…, Churros…)
- `images/stills/`: frames from the videos (griddle, ají, consommé, hot sauce), useful for the About page
- `videos/`: 4 vertical clips. `video4` dip & sip the consommé; `video3` quesabirria on the griddle (play it at about **0.7× speed**, it's sped up); `video2` ají for the empanadas; `video1` house-made hot sauce

## Placeholders are fine
This is a mockup to pitch to the owner. Where info is unknown, use sensible placeholders and don't invent reviews or testimonials: owner email, catering minimums, a second location ("Mountain Road, Moncton — coming soon" is optional).
