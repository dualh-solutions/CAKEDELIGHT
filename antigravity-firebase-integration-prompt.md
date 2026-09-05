# Antigravity Prompt: Firebase Backend Integration for Cakoo Bakery

Copy everything below the line into Antigravity as your task prompt. Attach `BACKEND_HANDOVER.md` (and ideally the whole repo / `src/` folder) to the session first so the agent can read the actual code before touching anything.

---

## PROMPT START

You are acting as the backend developer for the **Cakoo Bakery** Next.js 14 project. A file called `BACKEND_HANDOVER.md` is attached/available in the repo root — **read it first, in full**, before writing any code. It explains the current architecture and exactly what needs to be built. Treat it as the source of truth for scope, but use your own judgement and ask me before making any assumption that isn't spelled out there.

Do not skip ahead. Work phase by phase, in the order below. After each phase, stop, summarize what you changed/created, and wait for my confirmation before moving to the next phase — unless I've told you to run autonomously through all phases.

### Ground rules before you start

1. **Investigate before you generate.** Before writing any Firebase code, open and actually read:
   - `src/lib/mockData.ts` — copy the exact `Product` type/interface. Do not invent your own shape.
   - `src/store/productStore.ts` and/or `src/lib/store/productStore.ts` — see exactly how the store calls `/api/products` and what fields it reads off the response.
   - `src/store/cartStore.ts` and `src/store/branchStore.ts` — so you understand what product fields (price, branch availability, images, etc.) are actually consumed downstream.
   - `src/app/api/products/route.ts` — the current stubbed route returning mock data.
   - Any existing `.env.local` / `.env.example` file, so you don't duplicate or clash with existing env vars.
2. **Don't touch UI/frontend components.** The handover doc is explicit: the frontend is fully decoupled and only expects `src/app/api/products/route.ts` to return `{ products: Product[], categories: string[], source: 'firebase' }`. Do not refactor Zustand stores, page components, or styling unless something is factually broken and you tell me why before changing it.
3. **Preserve the exact API contract.** Field names, casing, nested shapes, and types in the `Product` interface must match `mockData.ts` exactly, including optional fields. If Firestore data is missing a field the frontend expects, handle it with a safe default rather than changing the contract.
4. **Ask, don't assume, for anything ambiguous** — e.g., if `Product` has a field like `branch` or `availability` whose meaning isn't obvious from the mock data, ask me rather than guessing.
5. **Use official SDKs correctly**: `firebase` (client SDK) for Auth/Storage on the admin dashboard, and `firebase-admin` (Admin SDK) for the server-side `/api/products` route — never expose Admin SDK credentials to the client bundle.
6. **Security first**: write proper Firestore Security Rules and Storage Rules, not permissive "allow read, write: if true" rules, and gate the entire `(admin)` route group behind an auth check on both client and — where relevant — server (middleware or layout-level redirect).

---

### Phase 1 — Firebase Project & SDK Setup

1. Check whether Firebase packages (`firebase`, `firebase-admin`) are already installed; if not, install them.
2. Create the Firebase client config file (e.g. `src/lib/firebase/client.ts`) that initializes the Firebase app using `NEXT_PUBLIC_FIREBASE_*` env vars, and exports `auth`, `db` (Firestore), and `storage` instances for client-side use.
3. Create a separate Firebase **Admin** SDK init file (e.g. `src/lib/firebase/admin.ts`) for server-only use (in API routes), using a service account. Make sure this file is never imported from client components.
4. Generate/update `.env.local.example` (not `.env.local` itself, since that holds real secrets) listing every required variable with placeholder values:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
5. Tell me explicitly, in plain language, what I need to go do manually in the Firebase Console (create the project, enable Firestore in production mode, enable Storage, enable Email/Password sign-in under Authentication, generate a service account key) since you cannot do this part for me. Give me the exact console navigation steps.
6. Draft Firestore Security Rules for a `products` collection: public read access, write access restricted to authenticated admin users only (you can gate this with a custom claim like `admin: true` or a simple allow-list of admin UIDs — tell me which approach you're using and why).
7. Draft Storage Security Rules: public read for product images, write restricted to authenticated admin users.

Stop after this phase and show me the rules and file structure before continuing.

### Phase 2 — Admin Dashboard

1. Create the protected route group `src/app/(admin)/layout.tsx`:
   - Listens to Firebase Auth state.
   - Redirects unauthenticated users to `/admin/login`.
   - Shows a loading state while auth status is resolving (avoid a flash of protected content).
2. Build `src/app/(admin)/login/page.tsx`:
   - Simple email/password form using Firebase Auth's `signInWithEmailAndPassword`.
   - Clear error handling for wrong password / user not found / too many attempts.
   - Style it consistently with the existing Tailwind design system already used elsewhere in the app — reuse existing UI primitives/components if the project has any, rather than inventing a new visual style.
3. Build `src/app/(admin)/dashboard/page.tsx`:
   - Fetches all products directly from Firestore (client-side `onSnapshot` or `getDocs` — your call, tell me which and why).
   - Renders a table: image thumbnail, name, category, price, branch/availability, and Edit/Delete actions.
   - Includes a search/filter-by-category control and an "Add Product" button.
4. Build a reusable Product Form component (e.g. `src/components/admin/ProductForm.tsx`) used for both Create and Edit:
   - All fields must match the `Product` type from `mockData.ts` exactly — no extra or missing fields.
   - Image upload: user selects a file → upload to Firebase Storage under a sensible path like `products/{productId}/{filename}` → get the download URL → save that URL string into the Firestore document's image field.
   - Show upload progress and handle upload failure gracefully.
   - On save, write to the `products` Firestore collection (create a new doc or update the existing one).
   - Include a Delete action with a confirmation dialog, which deletes both the Firestore doc and its Storage image(s).
   - Validate required fields client-side before submit (name, price, category at minimum — confirm the full required field list against `mockData.ts`).

Stop after this phase and let me test the dashboard before continuing.

### Phase 3 — Wire the Public Storefront to Firestore

1. Open `src/app/api/products/route.ts`.
2. Remove the mock-data stub/local mock logic entirely.
3. Using the Firebase Admin SDK, fetch all documents from the `products` collection.
4. Derive the `categories` array as the de-duplicated set of category values across all products.
5. Return exactly:
   ```ts
   {
     products: Product[],
     categories: string[],
     source: 'firebase'
   }
   ```
6. Add sensible error handling: if Firestore is unreachable or returns an error, return a proper error response (don't silently fall back to mock data unless I explicitly ask for a fallback mode).
7. Confirm that `productStore.ts` does not need any changes — if it does need a change to work with the real response, tell me exactly what's broken and why before changing anything in the store.
8. Do a final pass: run the app, load the Shop/menu page, and verify products render, category filters work, and product detail pages work end-to-end against live Firestore data.

Stop after this phase and give me a final summary of every file created/changed, every manual Firebase Console step I still need to do, and any assumptions you made that I should double check.

### What NOT to do
- Do not add a payment gateway or touch the WhatsApp deep-linking checkout flow — that's explicitly out of scope per the handover doc.
- Do not restructure `productStore.ts`, `cartStore.ts`, or `branchStore.ts` beyond what's strictly required to consume real data.
- Do not commit real Firebase credentials or service account keys to the repo — only placeholders in `.env.local.example`.
- Do not change the visual design of the public-facing site.

## PROMPT END
