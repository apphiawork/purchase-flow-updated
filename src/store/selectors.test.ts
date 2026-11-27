import { describe, expect, it } from 'vitest';
import type { PurchaseState } from '../types';
import {
  addonLines, buildInsuredPersons, destinationShort, isAseanTrip, planBase, planUnitPrices, maskDateInput, parseDisplayDate, totals,
  tripDurationDays, visiblePlans,
} from './selectors';

function makeState(over: Partial<PurchaseState> = {}): PurchaseState {
  const base: PurchaseState = {
    currentScreen: 2, loading: false, tripType: 'single', destination: 'countries', selectedCountries: ['Malaysia', 'Thailand'],
    departDate: '2027-01-05', returnDate: '2027-01-11', coverType: 'standard', adults: 2, children: 2, plan: 'plus',
    addons: { cfar: false, ski: false, adv: false, golf: false }, rentalCount: 0, petCount: 0,
    insuredPersons: [], policyholderId: null,
    applicant: { name: '', dob: '', nric: '', phone: '', email: '', postal: '', address: '', unit: '' },
    singpassFilled: false, declarationChecked: false, policyNumber: '',
    dialog: { open: false, title: '', msg: '' }, toast: { open: false, msg: '' },
  };
  return { ...base, ...over };
}

describe('pricing (TRAVEL60 = 60% off the whole subtotal)', () => {
  it('2 adults, 2 children on Plus', () => {
    expect(totals(makeState())).toEqual({ subtotal: 126, discount: 75.6, total: 50.4 });
  });

  it('adds policy-level add-ons and counters before the discount', () => {
    const s = makeState({ addons: { cfar: true, ski: false, adv: false, golf: true }, rentalCount: 1 });
    expect(addonLines(s).map((l) => [l.label, l.amount])).toEqual([['Cancel for any reason', 15], ['Golf play', 24], ['Rental vehicle (x1)', 10]]);
    expect(totals(s)).toEqual({ subtotal: 175, discount: 105, total: 70 });
  });

  it('a Pre-existing Conditions plan costs 30% more and has no pre-ex add-on', () => {
    const s = makeState({ coverType: 'prex' });
    expect(planUnitPrices(s, 'plus')).toEqual({ adult: 54.6, child: 27.3 });
    expect(addonLines(s)).toEqual([]);
    // 2 x 54.60 + 2 x 27.30 = 163.80, less 60%
    expect(totals(s)).toEqual({ subtotal: 163.8, discount: 98.28, total: 65.52 });
    expect(totals(makeState({ coverType: 'prex', adults: 1, children: 0 })).total).toBe(21.84);
  });

  it('annual trips are always priced as Standard', () => {
    expect(planBase(makeState({ tripType: 'annual', coverType: 'prex' }), 'plus')).toBe(126);
  });
});

describe('plans', () => {
  it('offers Lite only for ASEAN single trips on Standard cover', () => {
    expect(isAseanTrip(makeState())).toBe(true);
    expect(visiblePlans(makeState())).toEqual(['lite', 'value', 'plus', 'pro']);
    expect(visiblePlans(makeState({ coverType: 'prex' }))).toEqual(['value', 'plus', 'pro']);
    expect(visiblePlans(makeState({ selectedCountries: ['Japan'] }))).toEqual(['value', 'plus', 'pro']);
    expect(visiblePlans(makeState({ tripType: 'annual', destination: 'asia' }))).toEqual(['value', 'plus', 'pro']);
  });
});

describe('travellers and dates', () => {
  it('builds adults then children and keeps entered details', () => {
    const s = makeState({ insuredPersons: [{ id: 'adult-0', type: 'adult', label: 'Adult 1', name: 'Chris', dob: '', nric: '' }] });
    const people = buildInsuredPersons(s);
    expect(people.map((p) => p.label)).toEqual(['Adult 1', 'Adult 2', 'Child 1', 'Child 2']);
    expect(people[0].name).toBe('Chris');
  });

  it('shortens long destination lists for the trip bar', () => {
    expect(destinationShort(makeState())).toBe('Malaysia, Thailand');
    expect(destinationShort(makeState({ selectedCountries: ['Malaysia', 'Thailand', 'Japan', 'Spain'] }))).toBe('Malaysia, Thailand +2 more');
  });

  it('counts both travel days', () => {
    expect(tripDurationDays(makeState())).toBe(7);
  });

  it('parses typed dates', () => {
    expect(maskDateInput('05012027')).toBe('05/01/2027');
    expect(parseDisplayDate('05/01/2027')).toBe('2027-01-05');
    expect(parseDisplayDate('31/02/2027')).toBeNull();
  });
});
