import type { AddonKey, InsuredPerson, PlanKey, PurchaseState } from '../types';
import { ADDONS } from '../data/addons';
import { PLAN_META, PLAN_PRICES } from '../data/plans';
import { ASEAN_COUNTRIES, DEST_TYPE_LABELS } from '../data/countries';
import { PREX_LOADING, PROMO_RATE } from '../data/constants';

export const PLANS: PlanKey[] = ['lite', 'value', 'plus', 'pro'];

const round2 = (n: number) => Math.round(n * 100) / 100;
export const fmt = (n: number) => 'S$' + n.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const planName = (p: PlanKey) => PLAN_META.find((m) => m.key === p)!.name;

// ── Trip & cover ──
export const travellerCount = (s: Pick<PurchaseState, 'adults' | 'children'>) => s.adults + s.children;

/** Pre-existing Conditions cover is only sold for single trips. */
export const prexAvailable = (s: Pick<PurchaseState, 'tripType'>) => s.tripType === 'single';
export const isPrexPolicy = (s: Pick<PurchaseState, 'tripType' | 'coverType'>) => prexAvailable(s) && s.coverType === 'prex';

/** ASEAN region, or every selected country is in ASEAN. Single trips only. */
export function isAseanTrip(s: Pick<PurchaseState, 'tripType' | 'destination' | 'selectedCountries'>): boolean {
  if (s.tripType !== 'single') return false;
  if (s.destination === 'asean') return true;
  return s.destination === 'countries' && s.selectedCountries.length > 0
    && s.selectedCountries.every((c) => ASEAN_COUNTRIES.includes(c));
}

/** Plans offered: Lite only for ASEAN single trips on Standard cover. */
export const visiblePlans = (s: PurchaseState): PlanKey[] =>
  (isAseanTrip(s) && !isPrexPolicy(s) ? PLANS : PLANS.filter((p) => p !== 'lite'));

/** True once the trip-details card is complete, which reveals Cover and travellers. */
export function tripDetailsComplete(s: PurchaseState): boolean {
  if (!s.destination || !s.departDate || !s.returnDate) return false;
  return s.destination !== 'countries' || s.selectedCountries.length > 0;
}

// ── Pricing (base = before TRAVEL60) ──
type PricingInput = Pick<PurchaseState, 'adults' | 'children' | 'tripType' | 'coverType'>;

/** Per-traveller prices before TRAVEL60. Pre-existing Conditions plans cost 30% more than Standard. */
export function planUnitPrices(s: Pick<PurchaseState, 'tripType' | 'coverType'>, plan: PlanKey) {
  const k = isPrexPolicy(s) ? 1 + PREX_LOADING : 1;
  return { adult: round2(PLAN_PRICES[plan].adult * k), child: round2(PLAN_PRICES[plan].child * k) };
}

export function planBase(s: PricingInput, plan: PlanKey): number {
  const p = planUnitPrices(s, plan);
  return round2(s.adults * p.adult + s.children * p.child);
}

export function addonSelected(s: PurchaseState, key: AddonKey): boolean {
  if (key === 'rental') return s.rentalCount > 0;
  if (key === 'pet') return s.petCount > 0;
  return !!s.addons[key];
}

/** Selected add-ons with their base amounts, in display order. */
export function addonLines(s: PurchaseState): { key: AddonKey; label: string; amount: number }[] {
  return ADDONS.filter((ao) => addonSelected(s, ao.key)).map((ao) => {
    if (ao.unit === 'vehicle') return { key: ao.key, label: `${ao.name} (x${s.rentalCount})`, amount: ao.price * s.rentalCount };
    if (ao.unit === 'pet') return { key: ao.key, label: `${ao.name} (x${s.petCount})`, amount: ao.price * s.petCount };
    return { key: ao.key, label: ao.name, amount: ao.price };
  });
}

/** Any add-on chosen. Drives Skip vs Next. */
export const hasOptionalAddon = (s: PurchaseState) => addonLines(s).length > 0;

/** TRAVEL60 takes 60% off the whole subtotal (plan + add-ons). */
export function totals(s: PurchaseState) {
  const subtotal = round2(planBase(s, s.plan) + addonLines(s).reduce((a, l) => a + l.amount, 0));
  const discount = round2(subtotal * PROMO_RATE);
  return { subtotal, discount, total: round2(subtotal - discount) };
}

// ── Travellers ──
/** Adults first, then children; keeps details already entered, matched by id. */
export function buildInsuredPersons(s: PurchaseState): InsuredPerson[] {
  const prev: Record<string, InsuredPerson> = {};
  for (const p of s.insuredPersons) prev[p.id] = p;
  const make = (type: 'adult' | 'child', i: number): InsuredPerson => {
    const id = `${type}-${i}`;
    const old = prev[id];
    return { id, type, label: `${type === 'adult' ? 'Adult' : 'Child'} ${i + 1}`, name: old?.name ?? '', dob: old?.dob ?? '', nric: old?.nric ?? '' };
  };
  return [
    ...Array.from({ length: s.adults }, (_, i) => make('adult', i)),
    ...Array.from({ length: s.children }, (_, i) => make('child', i)),
  ];
}

// ── Display helpers ──
export function formatDateDisplay(d: string): string {
  if (!d) return '–';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

/** Trip length counting both the departure and return days (05/01–11/01 = 7 days). null until both dates are valid. */
export function tripDurationDays(s: Pick<PurchaseState, 'departDate' | 'returnDate'>): number | null {
  if (!s.departDate || !s.returnDate) return null;
  const diff = Math.round((new Date(s.returnDate).getTime() - new Date(s.departDate).getTime()) / 86400000);
  return diff >= 0 ? diff + 1 : null;
}

export const dayLabel = (n: number) => `${n} day${n === 1 ? '' : 's'}`;

export function tripDatesLabel(s: Pick<PurchaseState, 'departDate' | 'returnDate'>): string {
  const days = tripDurationDays(s);
  return `${formatDateDisplay(s.departDate)} – ${formatDateDisplay(s.returnDate)}${days != null ? ` (${dayLabel(days)})` : ''}`;
}

export const tripTypeLabel = (s: Pick<PurchaseState, 'tripType'>) => (s.tripType === 'single' ? 'Single Trip' : 'Annual Trip');

export function getDestinationLabel(s: Pick<PurchaseState, 'destination' | 'selectedCountries'>): string {
  if (s.destination === 'countries' && s.selectedCountries.length) return s.selectedCountries.join(', ');
  return DEST_TYPE_LABELS[s.destination] || (s.destination || '–');
}

/** "2 adult(s), 2 child(ren)" as written in the designs. */
export function travellersLabel(s: Pick<PurchaseState, 'adults' | 'children'>): string {
  return [`${s.adults} adult(s)`, s.children ? `${s.children} child(ren)` : null].filter(Boolean).join(', ');
}

/** "Plus" or "Plus (Pre-existing Conditions)". */
export const planLabel = (s: PurchaseState) => `${planName(s.plan)}${isPrexPolicy(s) ? ' (Pre-existing Conditions)' : ''}`;

export const generatePolicyNumber = () => 'DHOF' + Date.now().toString().slice(-12);

// ── Typed dates (DD/MM/YYYY) ──
export function maskDateInput(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function parseDisplayDate(text: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!m) return null;
  const [day, month, year] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(year, month - 1, day);
  if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}
