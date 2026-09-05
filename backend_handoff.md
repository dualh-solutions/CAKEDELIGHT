# Attock Cake Delight - Backend Developer Handoff

Welcome to the **Attock Cake Delight** project! This document outlines the current state of the Next.js application, the frontend architecture, and exactly what needs to be implemented on the Firebase backend side.

## 1. Project Overview
- **Tech Stack:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Zustand (State Management).
- **Goal:** A premium bakery e-commerce storefront with a complex "Custom Cake Builder".
- **Order Flow:** Currently, orders are compiled into a formatted text string and sent directly to the bakery's WhatsApp. **The new goal** is a hybrid approach: save the order to Firebase Firestore (for the Admin Panel) AND continue redirecting the user to WhatsApp.

## 2. What's Already Done (Frontend)
- **UI/UX:** The entire storefront is fully designed, branded, and responsive.
- **State Management:** `Zustand` is managing the Cart (`src/store/cartStore.ts`), Wishlist (`src/store/wishlistStore.ts`), and Branch selection (`src/lib/store/branchStore.ts`).
- **Custom Cake Builder:** The `/custom-cake` page has a complex multi-step form that perfectly captures all custom cake parameters (occasion, custom flavors, weight, shape, inspiration image, etc.) and adds a dynamically generated product to the cart.
- **WhatsApp Integration:** The `/checkout` page compiles all cart items (standard and custom) into a clean, bulleted WhatsApp message and redirects the user.

## 3. Your Tasks (Firebase Integration)

### A. Firebase Initialization
1. Create a Firebase project and enable **Firestore Database** and **Firebase Storage** (for gallery/product images).
2. Get the web configuration keys and add them to the `.env.local` file.
3. Verify or set up the initialization logic in `src/lib/firebase/client.ts`.

### B. Products Collection
- **Current State:** `src/store/productStore.ts` is likely using mock data or hardcoded arrays to supply products to the `/shop` and homepage components.
- **Your Job:** Update `productStore.ts` to fetch products dynamically from a `products` collection in Firestore. 
- **Expected Schema:** 
  - `name` (string)
  - `description` (string)
  - `price` (number)
  - `images` (array of strings/URLs)
  - `category` (string)
  - `flavorOptions`, `weightOptions`, `sizeOptions` (arrays of strings/objects)

### C. Gallery Collection
- **Current State:** The owner wants to upload/remove gallery images from an Admin Panel.
- **Your Job:** Connect `src/components/home/InstagramGallery.tsx` and `src/app/(storefront)/gallery/page.tsx` to fetch images from a `gallery` collection in Firestore. 

### D. Orders Collection (The Hybrid Flow)
- **Current State:** In `src/app/(storefront)/checkout/page.tsx`, the `handlePlaceOrder` function compiles the WhatsApp message and redirects the user.
- **Your Job:** Inside `handlePlaceOrder`, before the `window.open(whatsappUrl)` triggers, add logic to save the complete order (customer details, items array, total price, delivery method) into an `orders` collection in Firestore. This allows the Admin Panel to track orders while still keeping the WhatsApp notification flow intact.

### E. Reviews & Contact Messages
- **Reviews:** In `src/app/(storefront)/product/[id]/page.tsx`, the UI is already set up to read from and write to a `reviews` collection (status: pending/approved). Ensure Firestore security rules allow this.
- **Contact:** In `src/app/(storefront)/contact/page.tsx`, the contact form writes to a `messages` collection. Ensure this works properly.

## 4. Admin Panel Notes
The frontend storefront assumes the existence of an Admin Panel where the bakery owner can:
1. Add/Edit/Delete products in the `products` collection.
2. Upload images to the `gallery` collection.
3. View incoming orders in the `orders` collection.
4. Approve/Reject product reviews in the `reviews` collection.

*If the Admin Panel isn't built yet, you will need to scaffold a simple protected route (e.g., `/admin`) or a separate dashboard to handle these CRUD operations.*

---
**Good luck! The frontend UI is waiting for your database connections to come alive.**
