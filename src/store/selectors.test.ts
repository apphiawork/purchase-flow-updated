import { describe, expect, it } from 'vitest';
import type { PurchaseState } from '../types';
import { ADDONS } from '../data/addons';
import { buildAddonSlots, isSlotBlocked, totalCost } from './selectors';

function makeState(over: Partial<PurchaseState> = {}): PurchaseState {
  const base: PurchaseState = {
    currentScreen: 2, loading: false, tripType: 'single', destination: 'asean', selectedCountries: [],
    departDate: '', returnDate: '', promoApplied: true,
    planCounts: { value: { adult: 0, child: 0 }, plus: { adult: 0, child: 0 }, pro: { adult: 0, child: 0 } },
    addons: {}, addonPax: {}, addonTab: 'recommended', petCount: 0, policyholderSlot: null, addonSlots: [], insuredPersons: [],
    applicant: { name: '', dob: '', nric: '', phone: '', email: '', postal: '', address: '', unit: '' },
    policyNumber: '', dialog: { open: false, title: '', msg: '' }, toast: { open: false, msg: '' },
  };
  return { ...base, ...over };
}

const get = (key: string) => ADDONS.find((a) => a.key === key)!;

describe('totalCost', () => {
  it('mixed cart: 2 Plus adults + 1 Plus child, CFAR + pre-existing×2 + 1 pet = S$127.40', () => {
    let s = makeState({ planCounts: { value: { adult: 0, child: 0 }, plus: { adult: 2, child: 1 }, pro: { adult: 0, child: 0 } } });
    const slots = buildAddonSlots(s);
    s = {
      ...s,
      addonSlots: slots,
      addons: { cfar: true, prex: true, pet: true },
      addonPax: { prex: [slots[0].id, slots[1].id] }, // two adults
      petCount: 1,
    };
    // plans 84+21=105; cfar 5.60; prex 5.60*2=11.20; pet 5.60 → 127.40
    expect(totalCost(s)).toBeCloseTo(127.4, 2);
  });

  it('empty cart costs nothing', () => {
    expect(totalCost(makeState())).toBe(0);
  });
});

describe('isSlotBlocked', () => {
  it('a pregnant traveller cannot also take ski/adventure/golf/pre-existing', () => {
    let s = makeState({ planCounts: { value: { adult: 0, child: 0 }, plus: { adult: 1, child: 0 }, pro: { adult: 0, child: 0 } } });
    const slots = buildAddonSlots(s);
    const pregnant = slots[0].id;
    s = { ...s, addonSlots: slots, addons: { preg: true }, addonPax: { preg: [pregnant] } };

    expect(isSlotBlocked(s, get('ski'), pregnant)).toBe(true);
    expect(isSlotBlocked(s, get('adv'), pregnant)).toBe(true);
    expect(isSlotBlocked(s, get('golf'), pregnant)).toBe(true);
    expect(isSlotBlocked(s, get('prex'), pregnant)).toBe(true);
    // rental has no conflict with pregnancy
    expect(isSlotBlocked(s, get('rental'), pregnant)).toBe(false);
  });
});
