# Cakoo Bakery - Developer Handover & Firebase Integration Plan

Welcome to the Cakoo Bakery project! This document outlines the current state of the frontend, the architecture, and the step-by-step requirements for the **Backend Developer** to integrate the Firebase Menu System.

---

## 🏗️ Project Architecture Overview

This project is built using modern web standards to ensure a fast, premium user experience.

### Tech Stack
* **Framework:** Next.js 14 (App Router)
* **Styling:** TailwindCSS + Framer Motion (for micro-animations)
* **State Management:** Zustand
* **Icons:** Lucide React
* **Ordering System:** WhatsApp deep-linking (no complex payment gateways required)

### How State Management Works
The application relies heavily on **Zustand** for global state. You will find these stores in `src/store/` and `src/lib/store/`:
* `productStore.ts`: Manages the fetching and caching of the menu catalog.
* `cartStore.ts`: Manages the user's shopping cart, calculating totals, and passing items to checkout.
* `branchStore.ts`: Manages the currently selected bakery branch (e.g., Wah Cantt vs. RWP) for pickup/delivery calculations.

### How the Menu Fetching Works
Currently, when the app loads, `productStore.ts` calls `GET /api/products` to fetch the menu. 
* Previously, this API route fetched data from a Google Sheet.
* **Now, the Google Sheets integration has been completely removed.** 
* The route `src/app/api/products/route.ts` has been stubbed out and is temporarily returning static `mockData.ts` so the frontend doesn't break. 

---

## 🔥 Your Task: Firebase Backend Integration

Your goal is to build a secure `/admin` dashboard where the bakery owner can manage products, and to wire up the frontend to read these products from Firestore.

### Phase 1: Firebase Setup
1. **Initialize Firebase:** Create a Firebase project and add the configuration variables to `.env.local` (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`, etc.).
2. **Setup Firestore:** Create a `products` collection.
3. **Setup Firebase Storage:** For handling image uploads from the admin dashboard.
4. **Setup Firebase Auth:** Enable Email/Password authentication for the admin users.

### Phase 2: The Admin Dashboard
You will need to build the UI for the owner to manage the menu.
1. Create a protected route grouping: `src/app/(admin)/layout.tsx` that checks for Firebase Auth session.
2. Build a Login page: `src/app/(admin)/login/page.tsx`.
3. Build the Dashboard: `src/app/(admin)/dashboard/page.tsx` displaying a table of all products.
4. Build a Product Form: A component to Create/Edit/Delete products. It must handle uploading images to Firebase Storage and saving the download URL into the Firestore document.

### Phase 3: Wire up the Public Storefront
You need to connect the live website to your new Firestore database.
1. Open `src/app/api/products/route.ts`.
2. Delete the `local_mock_data` logic.
3. Use the Firebase Admin SDK to fetch all documents from the `products` collection.
4. **CRITICAL:** Ensure the returned JSON matches the exact shape the frontend expects:
   ```typescript
   { 
     products: Product[], // See src/lib/mockData.ts for the Product type signature
     categories: string[], 
     source: 'firebase' 
   }
   ```
5. Once this API route returns real Firestore data, the entire frontend (Shop page, Product Details, Category filtering) will automatically work perfectly without any further frontend changes!

---

> **To the Backend Developer:** The frontend is completely decoupled from the data source. As long as you maintain the API contract in `/api/products` and return the `Product` type properly, you won't need to touch any UI components! Good luck!
