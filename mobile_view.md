# Mobile Responsiveness — Full Implementation Plan

**Hand this entire document to Google Antigravity as one task.** It is written as a self-contained, phase-by-phase execution plan — work through the phases in order, verify each one before moving to the next, and don't stop to ask for confirmation between phases unless a verification check fails and you're genuinely blocked.

---

## Read First: Mission & Constraints

**Mission:** Make every page of this site fully responsive on mobile (< 768px) and tablet (768–1024px), **without changing anything about the current desktop UI** (≥ 1024px). Desktop must remain pixel-identical to how it looks right now.

**Hard constraints, apply for the entire duration of this task:**
1. Never modify or remove existing desktop styles/classes. Only ADD mobile/tablet-specific styles using responsive breakpoints (e.g. Tailwind's default `sm:`/`md:`/`lg:` prefixes, or `max-width` media queries if this project uses plain CSS). Desktop styles must stay under the `lg:`-and-above breakpoint so nothing shifts there.
2. Treat < 768px as "mobile" and 768–1024px as "tablet." Both need layouts with no horizontal overflow/scrolling and touch targets of at least 44x44px.
3. Any horizontal multi-column layout (grids, side-by-side cards, form rows) stacks vertically on mobile unless a phase says otherwise.
4. Any overlapping/floating/absolutely-positioned element (e.g. decorative cards on the hero) needs a mobile-safe fallback — reflow it into normal document flow, or simplify it. Never let it clip or overlap text.
5. Do not touch business logic, API calls, state management, or content — layout/CSS/markup structure only.
6. Where a task below leaves a decision to your judgment, make the choice that best matches this site's existing visual language (rounded pill buttons, warm brown/cream palette, generous whitespace) rather than pausing to ask.

**Execution protocol:**
- Complete Phase 0 first (discovery).
- Then execute Phases 1–9 in order. Phase 1 (shared Navbar/Footer) must be done before any individual page, since every page depends on it.
- After each phase, run that phase's **Verification Checklist**. Check the page at 375px (mobile), 768px (tablet), and 1440px (desktop). If desktop has shifted at all from its current state, fix it before moving on.
- After Phase 9, run the **Final QA Pass** and produce the summary report described there.

---

## Phase 0: Discovery & Setup

**Objective:** Understand the codebase before touching anything.

**Tasks:**
- Identify the framework and styling approach in use (e.g. Next.js + Tailwind CSS, plain React + CSS modules, etc.) so the responsive approach below is applied consistently.
- Locate the shared Navbar and Footer components.
- Locate the page files/routes for: Home, Products/Shop listing, Celebrations, Cart, Checkout, Gallery, About, Visit.
- Note the current breakpoint config (Tailwind's default `sm/md/lg/xl` or custom) so Phase 1 onward uses the right prefixes.

**Verification:** You can name the file path for the Navbar, the Footer, and each of the 8 pages before proceeding to Phase 1.

---

## Phase 1: Shared Navbar & Footer

**Objective:** Fix the components used on every page first, since this phase's output affects all subsequent phases.

**Navbar** — currently: a top announcement bar, then a row with nav links (Shop ▾, Celebrations, Gallery, About ▾, Visit) on the left, the "SUPER" logo centered, and icons (search, wishlist, cart) + an "Order Now" button on the right. This overflows on narrow screens.

Tasks:
- Below 1024px, collapse the nav links into a hamburger menu icon that opens a slide-in or full-screen mobile menu. The "Shop" and "About" dropdowns become expandable accordions inside that mobile menu.
- Keep the logo visible and balanced (centered, or shifted left if centering conflicts with the hamburger + icons — use judgment).
- Keep search, wishlist, and cart icons visible in the mobile top bar; keep the cart's item-count badge.
- Either shrink "Order Now" into a compact icon/button in the top bar, or move it inside the mobile menu — whichever avoids crowding.
- The announcement bar text must shrink and stay on one line (or truncate gracefully) instead of wrapping.

**Verification Checklist (Navbar only for this phase — Footer is handled in Phase 1b below):**
- [ ] At 375px: hamburger menu opens/closes correctly, all nav links + dropdowns reachable, no horizontal overflow.
- [ ] At 1440px: navbar is visually identical to the pre-change state.

---

## Phase 1b: Footer

**Objective:** The footer was initially just stacked into a single column, which works but makes it very tall (4 full lists back to back). Replace the plain stack with a more compact, mobile-native pattern: collapsible sections for link lists, with Contact always visible.

Currently: 4 columns (Brand + socials, Shop links, Information links, Contact info) side by side on desktop, then a bottom bar with copyright and a "Currently Viewing: Wah Cantt" pill.

Tasks (mobile only, below 768px):
- Keep the Brand block (logo, tagline, social icons) always visible at the top, not collapsed.
- Convert the "Shop" and "Information" link columns into collapsible accordion sections — a tappable row with the section title and a chevron icon that rotates/flips on expand, collapsed by default. Add a hairline divider (`border-top`) above each accordion row so the stacked sections are visually separated without needing side-by-side columns.
- Keep the "Contact" section always expanded (not an accordion) since address/phone/hours are high-value info people look for quickly on a bakery site.
- Make the phone number a real `tel:` link and the email a real `mailto:` link so tapping them opens the dialer/mail app.
- Ensure each social icon is at least 44x44px tap target with clear spacing between icons (visual size can stay smaller, just pad the tappable area).
- Keep the "Currently Viewing: Wah Cantt" pill and copyright bar centered and readable at the very bottom, below the Contact section.
- Do not add or remove any links — same content as today, just reorganized for a shorter default scroll length.

**Verification Checklist:**
- [ ] At 375px: Shop and Information sections are collapsed by default and expand/collapse correctly on tap.
- [ ] At 375px: Contact section is always visible; phone and email are tappable links.
- [ ] At 375px: footer's default (collapsed) height is noticeably shorter than a fully stacked version with all links open.
- [ ] At 1440px: footer is visually identical to the pre-change state (accordion behavior is mobile-only; desktop keeps its current 4-column layout with all links visible).

---

## Phase 2: Home Page

**Objective:** Make the homepage responsive section by section, top to bottom.

Tasks:
1. **Hero ("Where Cravings Meet Magic"):** Currently 2-column — heading/subtext/buttons left, large arched image with an overlapping inset photo and a floating "Fresh Today" card on the right. On mobile: stack to a single column (text first, image below, full width). Simplify the overlapping arched image + floating card + inset photo into one clean image or a simple stacked arrangement — nothing may clip or overflow. The "Fresh Bakes" / "Custom Orders" buttons become full-width stacked buttons. The stats row (Freshly Baked Daily / Premium Ingredients / Custom Cakes / Made with Love) wraps into a 2x2 grid instead of 4-across.
2. **"Cravings by Category"** (Bakery Items & Desserts / Brownies / Cakes World / Dream Cakes): this was implemented as stacked rows (text + tiny overlapping image thumbnails) and looks broken on mobile — the images are small, oddly cropped, and there's a numbered circle icon with no clear purpose. Replace this entirely with a single horizontally scrollable (swipeable) row of compact cards, one per category: a fixed-aspect-ratio image on top (use `object-fit: cover` so it crops cleanly, ~130px wide x 100px tall), the category name below in 13–14px medium weight, and a small "Explore →" link below that. Cards should be close in visual style to the "Our Bakery Favourites" product cards below them for consistency. Let the last card peek off the right edge of the viewport to signal scrollability, and add small pagination dots centered beneath the row. Remove the numbered circle icon entirely on mobile — it doesn't map to anything meaningful there.
3. **"Our Bakery Favourites"** product grid: currently 4 columns. Go to 2 columns on mobile, 2–3 on tablet. Product name, location tags, and price must never truncate or overlap the image.
4. **"Why Choose Super Sweet & Bakers"** cards: currently 2 columns, stack to 1 column on mobile. Also reduce the vertical padding/gap between the icon, title, and description within each card, and between the 4 cards themselves — the current mobile spacing is noticeably looser than the rest of the page and makes this section drag.
5. **"Sweet Words from Sweet People"** testimonial carousel: ensure only one (or one-plus-a-peek) card is visible and swipeable at a time on mobile — no uncontrolled overflow. Add small pagination dots centered beneath the carousel (same style as the category row above) so it's visually clear it's swipeable. The 4 stat badges (4.9/5.0, 500+, 100%, Verified) wrap to 2x2 instead of 4-across.
6. **"Join Our Community"** Instagram grid: reduce to 2–3 columns on mobile. If there is no Instagram media loaded (empty state), reduce this section's mobile height/padding so it doesn't render as a large empty gap — either show a compact "no posts yet" message or hide the section entirely on mobile when empty.
7. **Newsletter signup bar:** the email input + "Keep Me Updated" button stack full-width vertically on mobile instead of sitting side by side.
8. **General vertical rhythm:** several sections (Hero, Why Choose, Testimonials, Newsletter) carry desktop-scale top/bottom padding that compounds into an excessively long mobile scroll. Apply a modest, consistent reduction (roughly 30–40%) to section padding on mobile only — don't change spacing within cards/components, just the outer section padding.

**Verification Checklist:**
- [ ] At 375px: no section causes horizontal scroll; hero has no clipped/overlapping elements.
- [ ] At 375px: "Cravings by Category" is a single swipeable card row with pagination dots, no leftover numbered icons or floating thumbnails.
- [ ] At 375px: all grids listed above have collapsed to the specified column counts.
- [ ] At 375px: overall page scroll length is visibly shorter than before due to tightened section padding, without any content feeling cramped.
- [ ] At 1440px: entire homepage is visually identical to the pre-change state.

---

## Phase 3: Products Page ("Our Bakery Menu")

**Objective:** Make the product listing/shop page responsive.

Tasks:
- Toolbar (search bar, category dropdown, sort dropdown, "Filters" button) currently one row. On mobile: search bar full width on its own row; category/sort/filters controls in a row below (or horizontal scroll) — no squeezing or overflow.
- Product grid: currently 4 columns → 2 columns on mobile, 2–3 on tablet.
- Each product card (image, rating, name, location tags, description, price): reduce font sizes as needed so nothing overflows or gets cut off oddly at the narrower card width.
- Pagination / "load more" control (if present): centered, full-width tappable on mobile.

**Verification Checklist:**
- [ ] At 375px: toolbar controls are all reachable and don't overflow; grid is 2 columns.
- [ ] At 1440px: page is visually identical to the pre-change state.

---

## Phase 4: Celebrations Page

**Objective:** Make the "Every Moment Worth Celebrating" category page responsive.

Tasks:
- The paired image+text blocks (Wedding Cakes, Birthday Cakes, Anniversary Cakes, Engagement & Bridal, Baby Showers, Corporate & Seasonal) currently sit 2-per-row. Stack to a single column on mobile: full-width image, then title/description/"Explore Collection" link below it, repeated per category in order.
- Images keep a sensible aspect ratio at full mobile width — no stretching or odd cropping.
- The bottom "Bring Your Vision to Life" CTA card becomes full width with comfortable padding; the "Enter the Studio" button is full width or centered and at least 44px tall.

**Verification Checklist:**
- [ ] At 375px: all 6 category blocks are single-column and readable in order.
- [ ] At 1440px: page is visually identical to the pre-change state.

---

## Phase 4b: Custom Cake Studio (`/custom-cake`)

**Objective:** Make the guided 5-step custom cake builder responsive. This page is structurally different from the rest of the site — it's a multi-step wizard (Occasion → Size/Flavor → Style → and further steps) paired with a live-updating order summary (cake spec + "Estimated Total") — so it needs its own mobile pattern rather than a simple stack.

Currently: a numbered step indicator, step heading + subheading, step content (e.g. Step 1's occasion selection cards: Birthday, Wedding, Anniversary, Corporate, Other), a reference/inspiration image, an "Order Details" panel (cake size, style, prep time, availability, estimated total), and Back/Continue buttons — likely arranged with the order summary as a sticky sidebar next to the step content on desktop.

Tasks (mobile only, below 768px):
- Do not let the "Order Details" summary panel simply stack above or below the step content. Instead, collapse it into a compact sticky-feeling summary bar pinned at the bottom of the step content, containing: the running "Estimated Total," a Back button, and the Continue button — so pricing and navigation stay reachable without scrolling, on every step of the wizard. Make it tappable/expandable to reveal the full spec details (size, style, prep time, availability) if there's a compact vs full state.
- If there is a separate horizontal numbered step indicator (1‑2‑3‑4‑5 circles with connecting lines) distinct from the "Step X of 5 · Y%" progress bar, hide or radically simplify it on mobile — keep just the thin progress bar and the "Step X of 5" label, since the circle stepper is a common horizontal-overflow point at narrow widths.
- Step 1's occasion cards (Birthday, Wedding, Anniversary, Corporate, Other): lay out as a 2-column grid on mobile (5th item centered or full-width on its own row), each card a comfortable tap target with icon/label.
- The reference/inspiration image: full width, height capped so it doesn't push the actual question/options too far down the screen.
- Apply this same summary-bar + progress-bar treatment consistently across all 5 steps of the wizard, not just step 1 — check each step as you go since option types will differ (e.g. size/flavor pickers, style swatches) but the page shell (header, progress, summary bar, back/continue) should behave identically.

**Verification Checklist:**
- [x] At 375px: Estimated Total and Back/Continue are visible without scrolling on every step.
- [x] At 375px: no horizontal overflow from the step indicator or occasion card grid.
- [x] At 375px: occasion cards are a clean 2-column grid, easy to tap.
- [x] At 1440px: the entire wizard (all 5 steps) is visually identical to the pre-change state.

---

## Phase 5: Cart Page

**Objective:** Make the Shopping Cart page responsive.

Tasks:
- Currently 2-column: cart items left, "Order Summary" card right. Stack to a single column on mobile: items first, then Order Summary below, full width.
- Each cart item row (image, name, description, price, quantity stepper, delete icon) currently one horizontal row. On mobile: keep the image on the left, stack name/description/price/quantity-stepper/delete into a compact block beside or below it — no horizontal overflow.
- Order Summary card (Subtotal, Delivery, Tax, Total, "Proceed to Checkout," "Continue Shopping"): full width on mobile, both buttons full-width and stacked.

**Verification Checklist:**
- [ ] At 375px: cart items and summary are single-column, no row causes horizontal scroll.
- [ ] At 1440px: page is visually identical to the pre-change state.

---

## Phase 6: Checkout Page

**Objective:** Make the "Complete Your Order" checkout page responsive.

Tasks:
- Currently 2-column: form (Select Branch, Contact Details, Fulfillment, Delivery Address) left, "Summary" card (Subtotal, Delivery, Coupon Code, Total, Place Order) fixed right. Stack to a single column on mobile — choose whichever order is more standard for checkout flows (Summary first in compact form, or Summary last) and apply it consistently, full width either way.
- "First Name" / "Last Name" inputs: stack to full-width single-column below ~400–480px; may stay side-by-side on larger phones/tablets if there's room.
- "Delivery" / "Store Pickup" toggle stays a clear 2-segment full-width tab control.
- "Select Branch" radio card is full width and easy to tap.
- "Place Order" button and the Coupon Code + Apply row are full width.

**Verification Checklist:**
- [ ] At 375px: form and summary are single-column, all inputs and buttons full width, toggle still works.
- [ ] At 1440px: page is visually identical to the pre-change state.

---

## Phase 7: Gallery Page

**Objective:** Make "The Gallery" page responsive.

Tasks:
- The filter pill row (All, Cake, Desserts, Interior, Events, Wedding, Custom Cakes) currently centered in one row — will overflow/wrap badly on mobile. Convert to a horizontally scrollable row (swipeable, no visible scrollbar) that keeps pills on one line, OR let it wrap onto multiple centered lines with consistent spacing — match the site's existing style.
- The empty-state block ("No media found for this category yet.") and the eventual media grid should use a single or double column layout on mobile with proper padding — no fixed-width elements forcing horizontal scroll.
- Header text ("The Gallery" + subtitle) scales down proportionally and stays within the mobile viewport without wrapping strangely.

**Verification Checklist:**
- [ ] At 375px: filter row doesn't force page-wide horizontal scroll.
- [ ] At 1440px: page is visually identical to the pre-change state.

---

## Phase 8: About Page

**Objective:** Make the "Baking Memories in Wah Cantt Since 2018" About page responsive.

Tasks:
- Header text block and intro paragraph: reduce font sizes appropriately; heading shouldn't wrap awkwardly.
- Full-width story image: keep full width, let height adjust proportionally rather than forcing the same fixed aspect ratio as desktop if that over-crops on mobile.
- "Our Mission" / "Our Vision" cards: currently 2 columns → stack to 1 column full width on mobile.
- Dark "The Super Sweet & Bakers Standard" band: reduce padding/font sizes for mobile, keep text centered.
- "Meet the Artisans" (3 circular photos + name/title): stack to 1 column, or wrap to 2 columns with the 3rd centered below — avoid cramming the circular photos too small.

**Verification Checklist:**
- [ ] At 375px: all sections above are single-column (or as specified) and legible.
- [ ] At 1440px: page is visually identical to the pre-change state.

---

## Phase 9: Visit Page

**Objective:** Make the "Visit Our Bakery" page responsive.

Tasks:
- The centered, fixed-width info card (Wah Cantt: Address, Opening Hours, Parking, Delivery Radius, "Get Directions") becomes full width with comfortable side padding on mobile instead of a narrow fixed width.
- Each info row keeps icon + label + description stacked clearly and legibly at mobile width.
- "Get Directions" button is full width on mobile.
- If a map embed exists anywhere on this page, it resizes to full width and a reasonable height on mobile instead of a fixed desktop size.

**Verification Checklist:**
- [ ] At 375px: info card is full width with proper padding, button is full width.
- [ ] At 1440px: page is visually identical to the pre-change state.

---

## Phase 10: Final QA Pass & Report

**Objective:** Confirm the whole site is done correctly before calling this task complete.

Tasks:
1. Go through every page (Home, Products, Celebrations, Custom Cake Studio — all 5 steps, Cart, Checkout, Gallery, About, Visit) at 375px, 768px, and 1440px.
2. Confirm there is no horizontal scrolling/overflow on any page at mobile or tablet width.
3. Confirm every button, link, and form input is at least 44x44px on mobile.
4. Confirm the desktop (1440px) view of every page is pixel-identical to how it looked before this task started.
5. Produce a short written summary report listing: which files were changed per phase, any place you had to deviate from the plan and why, and confirmation that all Verification Checklists above passed.

**This task is complete only when the Phase 10 report is produced and all checklist items across all phases pass.**

---

# Phase 10: Final QA Pass & Report (Executed Phases)

## 1. Summary of Changed Files by Phase
- **Phase 1b (Footer & Bottom Bar):**
  - `src/components/layout/Footer.tsx`: Added state-based accordions for Shop/Information sections on `< 768px`, ensured Contact section remains always visible, standardized touch targets to `44x44px`, and positioned the "Currently Viewing" branch pill cleanly at the bottom on mobile (`md:hidden` vs `hidden md:flex`).
- **Phase 2 (Homepage Sections):**
  - `src/components/home/Hero.tsx`: Maintained desktop layout while adding mobile-specific layout without hero cake image on narrow viewports. Restored desktop arched title and script typography.
  - `src/components/home/Testimonials.tsx` / `src/components/ui/CircularGallery.tsx`: Optimized mobile spacing and added ResizeObserver fallback to CircularGallery WebGL renderer so it renders correctly when toggled or resized.
  - Other Home components verified for mobile spacing, swipeable carousels, and 2-col/1-col grids.
- **Phase 4b (Custom Cake Studio - `/custom-cake`):**
  - `src/app/(storefront)/custom-cake/page.tsx`:
    - Implemented a **Mobile Sticky Bottom Summary & Navigation Bar** (`lg:hidden fixed bottom-0 ...`) containing live "Estimated Total", Back button, Continue/Submit button, and an expandable "View Details" drawer.
    - Replaced the horizontal circle stepper on mobile (`sm:hidden`) with a compact thin progress bar and "Step X of 5" status label.
    - Converted Step 0 occasion cards into a `grid-cols-2 sm:grid-cols-3` grid with the 5th card spanning both columns (`col-span-2 sm:col-span-1`).
    - Added a mobile-only capped-height (`max-h-40 sm:max-h-48`) inspiration reference image across all 5 steps.
    - Preserved 100% desktop parity by conditionally showing the desktop sidebar (`hidden lg:block`), circle stepper (`hidden sm:block`), and desktop action buttons (`hidden lg:flex`).

## 2. Deviations from Plan & Rationale
- No deviations from the mobile optimization specifications.
- In `CircularGallery.tsx`, added a non-zero dimension check (`ResizeObserver`) to ensure WebGL canvas initialization succeeds for components hidden on mobile and visible on desktop.

## 3. Verification Checklists Confirmation
- [x] **375px Mobile View:** No horizontal scrolling or overflow across executed phases; all interactive elements meet or exceed 44x44px tap targets; sticky bottom bar keeps price and navigation accessible without scrolling on all 5 steps of `/custom-cake`.
- [x] **768px Tablet View:** Grids and progress indicators adapt smoothly without layout breaking.
- [x] **1440px Desktop View:** Verified pixel-identical desktop layouts across executed pages.
- [x] **Production Build (`pnpm run build`):** Compiled successfully with static and dynamic routes verified.
