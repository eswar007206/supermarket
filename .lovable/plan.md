# Supermarket Shopping App

A clean, modern supermarket web app built in React (TanStack Start) using your brand palette:
- Cream background `#FEFBF6`
- Soft blue `#A6D1E6`
- Plum accent `#7F5283`
- Charcoal text `#3D3C42`

## Pages

1. **Auth page** (`/auth`) — Email + password sign up and log in, single tab-switched form. Friendly supermarket-themed visual with basket illustration and brand colors.
2. **Shop** (`/`, protected) — Main storefront with top nav (logo, cart icon with item count, user menu/logout), 15 category sections each showing 20 product cards with image, name, price, and "Add to cart" button. Smooth scroll between categories via a sticky category chip bar.
3. **Cart** (`/cart`, protected) — Line items with quantity +/−, remove, running total, and a "Save cart" button to persist the current cart to the user's account. Auto-loads saved cart on login.

Unauthenticated users visiting `/` or `/cart` are redirected to `/auth`.

## Catalog (auto-generated, 300 items)

15 realistic supermarket categories, each with 20 items and an Unsplash image per product:
Fruits, Vegetables, Dairy & Eggs, Bakery, Meat & Poultry, Seafood, Pantry Staples, Snacks, Beverages, Frozen Foods, Breakfast & Cereal, Condiments & Sauces, Household & Cleaning, Personal Care, Baby Care.

Each product has: id, name, price, unit (e.g., "per kg", "500g"), image URL, category.

## Cart behavior

- Cart lives in React state + Supabase table per user.
- "Add to cart" updates state instantly with a toast.
- "Save cart" writes the full cart to `carts` table (upsert on user_id).
- On login, saved cart is fetched and hydrated automatically.
- Quantity edits and removal are local until the user hits Save (matches your "save option" phrasing).

## Design

- Warm cream canvas with plum headings, blue accent badges, charcoal body text.
- Rounded-2xl cards, soft shadows, subtle hover lift, image-forward product cards.
- Sticky translucent category bar with plum active pill.
- Responsive grid: 2 cols mobile, 3 tablet, 4–5 desktop.
- Toast notifications (sonner) for add/save/auth events.

## Technical notes

- Auth: Lovable Cloud (Supabase) email + password. Route guard via `_authenticated` layout route with `beforeLoad` redirect.
- DB tables:
  - `profiles` (id → auth.users, email, created_at) with trigger auto-create on signup and RLS "own row".
  - `carts` (user_id pk → auth.users, items jsonb, updated_at) with RLS "own row only".
- Catalog is a static TypeScript module (`src/data/catalog.ts`) — no DB round-trip, keeps the site snappy.
- Tailwind theme extended with the four brand tokens mapped onto the existing semantic variables.
- Routes: `src/routes/auth.tsx`, `src/routes/_authenticated.tsx`, `src/routes/_authenticated/index.tsx`, `src/routes/_authenticated/cart.tsx`.
- Cart state via a small `useCart` hook + React context provider mounted inside the authenticated layout.
