import type { Addon, AddonSlot, InsuredPerson, PlanKey, PurchaseState } from '../types';
import { ADDONS, ADDON_CONFLICTS, ADDON_PRICE, PERSON_ADDON_LABEL } from '../data/addons';
import { PLAN_PRICES } from '../data/plans';
import { DEST_TYPE_LABELS } from '../data/countries';

const PLANS: PlanKey[] = ['value', 'plus', 'pro'];

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const fmt = (n: number) => 'S$' + n.toFixed(2);

export function paxCount(s: PurchaseState, key: string) {
  return (s.addonPax[key] || []).length;
}

export function addonUnitCost(s: PurchaseState, ao: Addon): number {
  if (ao.unit === 'pax') return ADDON_PRICE * paxCount(s, ao.key);
  if (ao.unit === 'pet') return ADDON_PRICE * Math.max(1, s.petCount);
  return ADDON_PRICE; // group flat
}

export function totalPlanCost(s: PurchaseState): number {
  let t = 0;
  for (const plan of PLANS) {
    t += s.planCounts[plan].adult * PLAN_PRICES[plan].adult;
    t += s.planCounts[plan].child * PLAN_PRICES[plan].child;
  }
  return t;
}

export function totalAddonCost(s: PurchaseState): number {
  let t = 0;
  for (const ao of ADDONS) if (s.addons[ao.key]) t += addonUnitCost(s, ao);
  return t;
}

export const totalCost = (s: PurchaseState) => totalPlanCost(s) + totalAddonCost(s);

export function getTotalTravellers(s: PurchaseState): number {
  let t = 0;
  for (const plan of PLANS) t += s.planCounts[plan].adult + s.planCounts[plan].child;
  return t;
}

export function totalAdults(s: PurchaseState): number {
  let a = 0;
  for (const p of PLANS) a += s.planCounts[p].adult;
  return a;
}

export function paxBreakdown(s: PurchaseState, key: string) {
  const ids = s.addonPax[key] || [];
  let a = 0, c = 0;
  for (const id of ids) {
    const slot = s.addonSlots.find((x) => x.id === id);
    if (slot) slot.type === 'adult' ? a++ : c++;
  }
  return { a, c, total: a + c };
}

export function paxQtyLabel(s: PurchaseState, key: string): string {
  const { a, c } = paxBreakdown(s, key);
  const parts: string[] = [];
  if (a) parts.push(`${a} Adult${a > 1 ? 's' : ''}`);
  if (c) parts.push(`${c} Child${c > 1 ? 'ren' : ''}`);
  return parts.join(', ');
}

/** "Adult 1 (Plus)" / "Child 1 (Value)" */
export const slotChipLabel = (slot: AddonSlot) => slot.label.replace(/\s*\(([^)]+) Plan\)/, ' ($1)');

export const personAddonLabel = (ao: Addon) => PERSON_ADDON_LABEL[ao.key] || ao.name;

// ── Conflicts ──
export function conflictReason(s: PurchaseState, ao: Addon, slotId: string): string | null {
  for (const [key, conflicts] of Object.entries(ADDON_CONFLICTS)) {
    if (conflicts.includes(ao.key) && (s.addonPax[key] || []).includes(slotId)) {
      return ADDONS.find((a) => a.key === key)!.name;
    }
  }
  return null;
}
export const isSlotBlocked = (s: PurchaseState, ao: Addon, slotId: string) => !!conflictReason(s, ao, slotId);

/** Slots applicable to an add-on (Pregnancy / Rental = adults only). */
export function addonSlotsFor(s: PurchaseState, ao: Addon): AddonSlot[] {
  return ao.adultsOnly ? s.addonSlots.filter((x) => x.type === 'adult') : s.addonSlots;
}

export interface PersonAddonOption {
  ao: Addon;
  checked: boolean;
  group: boolean;
  blocked: boolean;
  reason: string;
}

/** Editable add-on options for an insured person (Screen 4). Shows ALL add-ons so any can be
 *  toggled per traveller, independent of the Add-Ons page. Pet handled at trip level. */
export function personAddonOptions(s: PurchaseState, person: InsuredPerson): PersonAddonOption[] {
  const out: PersonAddonOption[] = [];
  for (const ao of ADDONS) {
    if (ao.unit === 'pet') continue;
    if (ao.unit === 'group') {
      out.push({ ao, checked: !!s.addons[ao.key], group: true, blocked: false, reason: '' });
      continue;
    }
    if (ao.adultsOnly && person.type !== 'adult') continue;
    const blocked = isSlotBlocked(s, ao, person.id);
    const checked = !blocked && !!s.addons[ao.key] && (s.addonPax[ao.key] || []).includes(person.id);
    out.push({ ao, checked, group: false, blocked, reason: blocked ? conflictReason(s, ao, person.id)! : '' });
  }
  return out;
}

/** Add-ons applicable to a given insured person (slot). */
export function addonsForSlot(s: PurchaseState, slotId: string): Addon[] {
  const out: Addon[] = [];
  for (const ao of ADDONS) {
    if (!s.addons[ao.key]) continue;
    if (ao.unit === 'group') { out.push(ao); continue; }
    if (ao.unit === 'pet') continue;
    if ((s.addonPax[ao.key] || []).includes(slotId)) out.push(ao);
  }
  return out;
}

// ── Builders (return new values; callers set state) ──
export function buildAddonSlots(s: PurchaseState): AddonSlot[] {
  const adults: AddonSlot[] = [], children: AddonSlot[] = [];
  let adultCount = 0, childCount = 0;
  for (const plan of PLANS) {
    for (let i = 0; i < s.planCounts[plan].adult; i++) {
      adultCount++;
      adults.push({ id: `${plan}-adult-${i}`, plan, type: 'adult', label: `Adult ${adultCount} (${cap(plan)} Plan)` });
    }
    for (let i = 0; i < s.planCounts[plan].child; i++) {
      childCount++;
      children.push({ id: `${plan}-child-${i}`, plan, type: 'child', label: `Child ${childCount} (${cap(plan)} Plan)` });
    }
  }
  return [...adults, ...children];
}

/** Build insured persons from slots, preserving existing name/dob/nric by id. */
export function buildInsuredPersons(s: PurchaseState): InsuredPerson[] {
  const prev: Record<string, InsuredPerson> = {};
  for (const p of s.insuredPersons) prev[p.id] = p;
  return s.addonSlots.map((slot) => {
    const old = prev[slot.id];
    return {
      id: slot.id, plan: slot.plan, type: slot.type, label: slot.label,
      name: old?.name || '', dob: old?.dob || '', nric: old?.nric || '',
    };
  });
}

/** Drop any now-conflicting traveller selections. Returns a new addonPax map. */
export function prunedAddonPax(s: PurchaseState): Record<string, string[]> {
  const next: Record<string, string[]> = { ...s.addonPax };
  for (const ao of ADDONS) {
    const arr = next[ao.key] || [];
    next[ao.key] = arr.filter((id) => !isSlotBlocked(s, ao, id));
  }
  return next;
}

// ── Display helpers ──
export function formatDateDisplay(d: string): string {
  if (!d) return '–';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

export function getTripDays(s: PurchaseState): string {
  if (!s.departDate || !s.returnDate) return '';
  const diff = (new Date(s.returnDate).getTime() - new Date(s.departDate).getTime()) / (1000 * 60 * 60 * 24);
  return diff > 0 ? ` (${diff} days)` : '';
}

export function getDestinationLabel(s: PurchaseState): string {
  if (s.destination === 'countries' && s.selectedCountries.length) {
    return s.selectedCountries.join(', ');
  }
  return DEST_TYPE_LABELS[s.destination] || (s.destination || '–');
}

export const generatePolicyNumber = () => 'DHOF' + Date.now().toString().slice(-11);
