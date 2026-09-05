# Cakoo Bakery — Website Conversion Spec

A single reference doc to convert your existing bakery site into Cakoo's brand. Pull colors/fonts straight from here so nothing gets eyeballed inconsistently across pages.

---

## 1. Brand Identity

| Field | Value |
|---|---|
| Brand name | **Cakoo** (always lowercase in the logo — "cakoo") |
| Full name variants seen in use | "Cakoo", "Cakoo Shop", "Cakoo Bakery" — use "Cakoo" as primary, "Cakoo Bakery" in page titles/SEO |
| Tagline | *"Cakoo Shop – Where Cravings Meet Magic!"* |
| Bio / mission line | *"Delicious cakes & desserts made with heart. Joy in every bite."* |
| Logo mark | already placed as logo.png in project directory |
| Logo file | the full logo is saved as fulllogo.png |

---

## 2. Color Palette (extracted directly from the logo — exact pixel values, not guessed)

### Brand core
| Name | Hex | RGB | Use |
|---|---|---|---|
| **Cakoo Brown** | `#48341B` | 72, 52, 27 | Primary brand color — headers, footer, nav bg, primary buttons |
| **Cakoo Gold** | `#E4BF78` | 228, 191, 120 | Accent color — logo text, CTA highlights, icons, borders |

### Extended tonal scale (derived from the two core colors, for consistent UI states)
| Token | Hex | Suggested use |
|---|---|---|
| `--brown-900` (darkest) | `#322412` | Text on light bg, hover state for dark buttons |
| `--brown-700` | `#3D2C16` | Hover/active state for brown buttons |
| `--brown-600` (base) | `#48341B` | Primary brand color |
| `--brown-300` | `#7E705F` | Muted text, secondary borders |
| `--brown-100` | `#E3E0DC` | Section dividers on cream bg |
| `--gold-600` (base) | `#E4BF78` | Accent / logo gold |
| `--gold-700` | `#C1A266` | Gold hover/active state |
| `--gold-300` | `#ECD2A0` | Light gold backgrounds, badge fills |
| `--gold-100` | `#F1DFBB` | Very light gold tint — card backgrounds |
| `--cream-bg` | `#FBF4E4` | Body background (soft neutral that isn't stark white — pairs naturally with brown/gold) |
| `--white` | `#FFFFFF` | Cards, form fields |

### Ready-to-paste CSS variables
```css
:root {
  --brown-900: #322412;
  --brown-700: #3D2C16;
  --brown-600: #48341B; /* primary */
  --brown-300: #7E705F;
  --brown-100: #E3E0DC;
  --gold-700: #C1A266;
  --gold-600: #E4BF78; /* accent */
  --gold-300: #ECD2A0;
  --gold-100: #F1DFBB;
  --cream-bg: #FBF4E4;
  --white: #FFFFFF;
}
```

**Usage pattern:** dark brown for nav/footer/hero overlays, gold for CTAs and accents on dark backgrounds, cream for the main page background instead of pure white (matches the "dark elegant brown" bakery aesthetic — warmer, more premium feel than a bright pastel bakery site).

---

## 3. Typography

The logo font is a custom rounded lowercase display face — not a standard web font, so it shouldn't be used for body text. Match the *vibe* (rounded terminals, friendly, confident, slightly bold) with a Google Fonts pairing:

| Role | Recommended font | Why |
|---|---|---|
| Headings / logo-adjacent text | **Fredoka** (Semibold/Bold) or **Baloo 2** | Rounded, playful, closest visual match to the logo's soft geometric letterforms |
| Body text | **Poppins** (Regular/Medium) or **Nunito Sans** | Clean, highly legible, pairs well with rounded headers without competing |
| Prices / numeric callouts | **Poppins SemiBold** | Keeps pricing legible and distinct from decorative headings |

```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap');

h1, h2, h3, .logo-text { font-family: 'Fredoka', sans-serif; }
body, p, .menu-item { font-family: 'Poppins', sans-serif; }
```


## 4. Business Info

| Field | Value |
|---|---|
| WhatsApp / phone | attock branch **+92 329 9927777** | | wahcantt branch **+92 329 5115550** |
| Branch 1 | 3 Meela Chowk, opposite Total Parco Petrol Station, Attock City, Pakistan |
| Branch 2 | B-180 Minar Road, Lala Rukh, Wah Cantt |
| Category | Dessert Shop · Cake Shop · Bakery |
| Price positioning | Mid-range ($$) — customer reviews suggest they're seen as good value for portion size vs. local competitors |
| Hours | **Not publicly listed** — confirm directly with owner or their Facebook "About" tab |

---

## 5. Social Media

| Platform | Handle/URL | Stats |
|---|---|---|
| Instagram | instagram.com/cakoobakery | 2912 followers, 273 posts |
| Facebook | facebook.com/cakoobakery | 2 reviews, $$ price range |

Use the same tagline/bio text from Section 1 as homepage hero copy and meta description — it's already brand-approved language they use publicly.

---

## 6. Menu & Products

**Confirmed categories:** Custom cakes, pastries, artisan breads, desserts, premium coffee

**Specific items spotted in posts/reviews:** Molten Lava (with ice cream), Caramel Pastry

⚠️ **Gap:** No exact prices, sizes, or flavor lists were retrievable — Instagram/Facebook block automated content scraping. Someone needs to manually scroll their Instagram highlights/posts (look for "Menu" highlight if one exists) and note down item names + prices. This is the one section Antigravity's original plan still needs a human to do.

---

## 7. WhatsApp Ordering Setup

- Format number as: `923299927777`for attock and 923295115550 for wahcantt (no `+`, no spaces) for the `wa.me` link
- Example link: `https://wa.me/923299927777?text=Hi%2C%20I%27d%20like%20to%20order%3A%20`
- Suggested button copy: "Order on WhatsApp" (keep consistent with their bakery-casual tone, not overly corporate)
- Since they have 2 branches, consider a branch selector before the WhatsApp button opens, or two separate buttons ("Order from Attock" / "Order from Wah Cantt") if delivery zones differ


