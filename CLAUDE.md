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

A 6-screen travel-insurance purchase wizard (UOI UniTravel). The current flow follows Figma file `ha44Vl566rUvuBidgVoXCM`, node `7340:116778`. `raw/index.html` is the original single-file prototype and is now only a historical reference: where it disagrees with the Figma flow, Figma wins.

Screens: 1 Get a Quote → 0 loading → 2 Select Plan → 3 Select Add-Ons → 4 Traveller Details (Singpass) → 5 Review & Pay → 6 Confirmation.

**State lives in one Zustand store, screens switch in memory.** There is no router. `usePurchaseStore` holds the whole flow plus `currentScreen`; `App.tsx` renders the matching screen. Navigation runs through store actions (`checkPrice`, `goToAddons`, `goToTravellers`, `goToReview`, `completePayment`, `goToScreen`), which also validate and build screen data. The loading interstitial is `loading: true` + `currentScreen: 0`.

**Business logic is pure functions in `src/store/selectors.ts`.** Pricing, plan availability, add-on lines, traveller builders and display formatting all take `PurchaseState`. Put new logic there, keep store actions thin, and add tests in `selectors.test.ts`.

### Product rules

- **One policy = one cover type.** Pre-existing conditions cannot be tagged to individual travellers. On the landing page the customer picks **Standard** or **Pre-existing Conditions** for everyone on the policy; travellers with and without pre-existing conditions buy separate policies (the confirmation page offers "Buy another policy").
- Travellers (adults ≥ 1, children, max 20 in total) are chosen on the landing page, and there is a single plan for the whole policy.
- Pre-existing Conditions cover is **single trip only** (`prexAvailable`). Switching to annual resets cover to Standard.
- **Lite** is only offered for ASEAN single trips on Standard cover (`visiblePlans`). Plus is the default plan.
- Pre-existing Conditions plans cost **30% more** than Standard (`PREX_LOADING`, applied in `planUnitPrices`). There is no pre-ex add-on: it never appears on Add-Ons or in the summary.
- Every add-on is policy-level (no per-traveller selection). Rental vehicle and pet care are counters; the rest are toggles.
- **TRAVEL60 takes 60% off the whole subtotal** (plan + add-ons), always applied.
- Below 1024px the mobile layout applies (Figma section "Mobile (393)", `7398:27509`): a numbers-only step bar on its own row, `MobileSummary` (a collapsible "Plan Summary · Total Amount" bar with trip details, plan, add-ons and totals) instead of `TripBar` and the sidebar, plan tabs plus one plan card instead of the comparison table, single-column forms and stacked full-width buttons (primary first).
- Select Plan, Add-Ons and Traveller Details show `TripBar` under the nav (trip type, destination, dates, travellers, cover) with Edit back to Get Quote; the order summary therefore doesn't repeat travellers.
- The UOI logo returns to Get Quote (from Confirmation it starts a fresh quote).
- Browser Back/Forward move between screens (`src/hooks/useBrowserHistory.ts`). The loading screen gets no history entry; Back from the confirmation page starts a fresh quote.
- `insuredPersons` is rebuilt in `goToTravellers` via `buildInsuredPersons`, keeping entered details by id (`adult-0`, `child-1`). "I am the policyholder" copies the applicant's name, DOB and NRIC into one adult.
- Singpass is a mock: `SingpassFlow` shows the login image (`public/singpass-login.jpg`; tapping anywhere logs in), then the consent screen; "I Agree" fills and locks the applicant form with a demo profile.

### Conventions

- Styling: `src/styles/flow.css` (`f-` prefixed classes) for all current screens, loaded after `src/styles/global.css`, which still provides the step bar, footer and a few shared widgets. No CSS modules, no Tailwind.
- Flow building blocks live in `src/components/flow/` (`SiteHeader`, `TripBar`, `MobileSummary`, `SummaryCard`, `FDialog`, `DateInput`, `PromoChip`, `SingpassFlow`). Reusable controlled widgets live in `src/components/ui/`; close-on-outside-click uses `useOutsideClick`.
- Constant tables are in `src/data/` (`plans.ts`, `addons.ts`, `comparison.ts`, `countries.ts`, `constants.ts`). Edit data there, not in components.
- Layout follows Figma: nav, banner, page content and footer all centre a container of max 1120px (`.f-wrap`, 32px side padding, 16px on phones). The footer is full-bleed blue with its text aligned to that container.
- Type scale (Figma): page title 32/600, panel titles 20/600, landing card titles 18/600, body 16, labels 14, captions 12. Below 1024px the library's Mobile styles apply: page title 28, panel titles 18, card titles 16.
- The page's own scrollbar is hidden; `FloatingScrollbar` draws one that floats over the content so the layout never shifts when a page becomes scrollable. Inner scroll areas keep slim native scrollbars.
- Brand copy rules: never use ALL CAPS (no `text-transform: uppercase`), and no full stop at the end of copy that is a single one-line sentence.
