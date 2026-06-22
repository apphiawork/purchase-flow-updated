# UniTravel Insurance – Purchase Flow

UOI travel-insurance purchase wizard. Vite + React + TypeScript (CSR).
Ported from the original single-file prototype in [`raw/`](raw/) (kept for reference).

## Requirements

Node **18+** (Vite 5). The repo also has older Node installed via nvm — use `nvm use 22`.

## Scripts

```bash
npm install
npm run dev      # dev server
npm run build    # typecheck + production build
npm test         # vitest (selectors)
```

## Structure

- `src/store/` — Zustand store (`usePurchaseStore`) + pure `selectors` (pricing, conflicts, builders)
- `src/data/` — constant tables (plans, add-ons, countries)
- `src/components/screens/` — one component per screen (1–6 + loading)
- `src/components/ui/` — reusable widgets (calendar, DOB picker, dropdowns, stepper, toggle, modal)
- `src/components/layout/`, `Sidebar/` — nav, quote bar, action bar, price card

State flow mirrors the original: a single store with `currentScreen` switching screens in
memory (no router). The 60% promo discount is always applied in the sidebar, and the payment
modal shows the undiscounted total — both preserved from the original.
