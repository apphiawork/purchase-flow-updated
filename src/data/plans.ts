import type { PlanKey } from '../types';

/** Base (pre-discount) per-traveller premiums. */
export const PLAN_PRICES: Record<PlanKey, { adult: number; child: number }> = {
  lite: { adult: 21, child: 13 },
  value: { adult: 31, child: 15.5 },
  plus: { adult: 42, child: 21 },
  pro: { adult: 56, child: 28 },
};

/** Display order + labels. Lite is only offered for single-trip ASEAN Standard cover (see visiblePlans). */
export const PLAN_META: { key: PlanKey; name: string; popular?: boolean; note?: string }[] = [
  { key: 'lite', name: 'Lite', note: 'ASEAN trips only' },
  { key: 'value', name: 'Value' },
  { key: 'plus', name: 'Plus', popular: true },
  { key: 'pro', name: 'Pro' },
];

/** Key benefit(s) table on Select Plan (Figma 7272:31893). */
export const KEY_BENEFITS: { title: string; desc: string; values: Record<PlanKey, string> }[] = [
  { title: 'Trip cancellation', desc: 'Covers prepaid bookings you lose if your trip is cancelled',
    values: { lite: 'S$2,000', value: 'S$5,000', plus: 'S$10,000', pro: 'S$15,000' } },
  { title: 'Overseas medical expenses', desc: 'Hospital and medical bills if you fall sick or get hurt abroad',
    values: { lite: 'S$150,000', value: 'S$250,000', plus: 'S$500,000', pro: 'S$1,000,000' } },
  { title: 'Baggage & personal effects', desc: 'Bags and belongings that are lost, stolen or damaged',
    values: { lite: 'S$2,000', value: 'S$3,000', plus: 'S$5,000', pro: 'S$7,500' } },
  { title: 'Travel delay', desc: 'A payout if your flight or transport is delayed',
    values: { lite: 'S$200', value: 'S$360', plus: 'S$600', pro: 'S$1,200' } },
];
