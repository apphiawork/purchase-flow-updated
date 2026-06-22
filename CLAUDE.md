# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Requires **Node 18+** (Vite 5). This machine pins Node 12 by default — run `nvm use 24` first or commands will fail with a parse error.

```bash
npm run dev                              # dev server
npm run build                            # tsc --noEmit + vite build
npm test                                 # vitest run (all tests)
npx vitest run src/store/selectors.test.ts   # single test file
npx vitest                               # watch mode
```

There is no linter configured; `tsc --noEmit` (part of `npm run build`) is the type gate. `tsconfig` has `strict`, `noUnusedLocals`, and `noUnusedParameters` on, so unused imports/params fail the build.

## Architecture

This is a 6-screen travel-insurance purchase wizard (UOI UniTravel), converted from a single-file prototype in `raw/index.html` (kept untouched as the reference spec — consult it when behavior is ambiguous).

**State lives in one Zustand store, screens switch in memory.** There is no router. `usePurchaseStore` holds the entire flow state plus a `currentScreen` number; `App.tsx` renders the matching screen. Navigation happens by calling store actions (`goToScreen2`…`goToScreen5`, `goToScreen`), which also run validation and the screen-entry builders. The loading interstitial is `loading: true` + `currentScreen: 0`.

**Business logic is pure functions in `src/store/selectors.ts`, not in the store or components.** Every derived value (pricing, traveller counts, conflict checks, slot/person builders, display formatting) is a pure function taking `PurchaseState`. Components call them in render; store actions call them to compute next state. When adding logic, put the pure part here and keep the store action thin. This is the file with the test coverage.

**Two derived structures are rebuilt on screen entry, not stored continuously:**
- `addonSlots` — one slot per traveller, derived from `planCounts` (adults first), built in `goToScreen3` via `buildAddonSlots`. Slot IDs (`plus-adult-0`) key the per-traveller add-on selections in `addonPax`.
- `insuredPersons` — built in `goToScreen4` via `buildInsuredPersons`, which **preserves already-entered name/dob/nric by slot ID** so re-entering the screen doesn't wipe data.

**Add-on conflict rules** live in `ADDON_CONFLICTS` (`src/data/addons.ts`) and are enforced through `isSlotBlocked`/`conflictReason`. A pregnant traveller can't also take pre-existing/ski/adventure/golf. After any selection change, `prunedAddonPax` drops now-conflicting selections. Add-ons can be toggled on two screens (the Add-Ons page and per-person on Traveller Details) and both paths must keep `addons`/`addonPax` consistent — see `toggleAddonTraveller` vs `togglePersonAddon`.

**Constant data tables are in `src/data/`** (`plans.ts`, `addons.ts`, `countries.ts`, `constants.ts`) — pricing, plan/comparison tables, add-on definitions, country lists. These were copied verbatim from `raw/`; edit here, not in components.

### Intentional quirks (preserved from the original — do not "fix")

- The sidebar (`Sidebar/PriceCard.tsx`) **always** applies the 60% promo discount regardless of promo state.
- The payment modal shows the **undiscounted** `totalCost`, not the discounted sidebar total.
- `promoApplied` only drives Screen 1's promo UI; it does not affect the sidebar discount.

### Conventions

- Styling is one global stylesheet (`src/styles/global.css`, ported verbatim) plus inline styles for one-off layout matching `raw/`. No CSS modules, no Tailwind.
- Reusable widgets in `src/components/ui/` are controlled (value + onChange); dropdown/popover close-on-outside-click uses the `useOutsideClick` hook.
- Add-on icons are inline SVG strings (`AO_ICONS`) rendered via `dangerouslySetInnerHTML`.
