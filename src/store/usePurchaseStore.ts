import { create } from 'zustand';
import type { Applicant, PlanKey, PurchaseState } from '../types';
import { ADDONS } from '../data/addons';
import {
  buildAddonSlots, buildInsuredPersons, getTotalTravellers, isSlotBlocked,
  prunedAddonPax, totalAdults, addonSlotsFor, generatePolicyNumber,
} from './selectors';

const emptyApplicant = (): Applicant => ({ name: '', dob: '', nric: '', phone: '', email: '', postal: '', address: '', unit: '' });

const initialState: PurchaseState = {
  currentScreen: 1,
  loading: false,
  tripType: 'single',
  destination: '',
  selectedCountries: [],
  departDate: '',
  returnDate: '',
  promoApplied: true, // raw renders the promo as applied by default
  planCounts: { value: { adult: 0, child: 0 }, plus: { adult: 0, child: 0 }, pro: { adult: 0, child: 0 } },
  addons: {},
  addonPax: {},
  petCount: 0,
  policyholderSlot: null,
  addonSlots: [],
  insuredPersons: [],
  applicant: emptyApplicant(),
  policyNumber: '',
  dialog: { open: false, title: '', msg: '' },
};

interface Actions {
  goToScreen: (n: number) => void;
  showDialog: (title: string, msg: string) => void;
  closeDialog: () => void;

  setTripType: (t: 'single' | 'annual') => void;
  setDestination: (type: string) => void;
  setSelectedCountries: (countries: string[]) => void;
  setDepartDate: (iso: string) => void;
  setReturnDate: (iso: string) => void;
  applyPromo: () => void;
  removePromo: () => void;

  goToScreen2: () => void;

  adjustCount: (plan: PlanKey, type: 'adult' | 'child', delta: number) => void;
  goToScreen3: () => void;

  toggleAddon: (key: string) => void;
  adjustPetCount: (delta: number) => void;
  toggleAddonTraveller: (key: string, slotId: string) => void;
  selectAllTravellers: (key: string) => void;
  goToScreen4: () => void;

  togglePersonAddon: (slotId: string, key: string) => void;
  togglePolicyholder: (idx: number, slotId: string) => void;
  updatePersonField: (idx: number, field: 'name' | 'dob' | 'nric', val: string) => void;
  updateApplicantField: (field: keyof Applicant, val: string) => void;
  goToScreen5: () => void;

  completePayment: () => void;
  resetFlow: () => void;
}

export const usePurchaseStore = create<PurchaseState & Actions>((set, get) => ({
  ...initialState,

  goToScreen: (n) => { set({ currentScreen: n }); window.scrollTo(0, 0); },
  showDialog: (title, msg) => set({ dialog: { open: true, title, msg } }),
  closeDialog: () => set((s) => ({ dialog: { ...s.dialog, open: false } })),

  setTripType: (tripType) => set({ tripType }),
  setSelectedCountries: (selectedCountries) => set({ selectedCountries }),
  setDepartDate: (departDate) => set({ departDate }),
  setReturnDate: (returnDate) => set({ returnDate }),
  setDestination: (type) =>
    set((s) => ({ destination: type, selectedCountries: type === 'countries' ? s.selectedCountries : [] })),
  applyPromo: () => set({ promoApplied: true }),
  removePromo: () => set({ promoApplied: false }),

  goToScreen2: () => {
    const s = get();
    if (!s.destination) { get().showDialog('Destination required', 'Please select a destination.'); return; }
    if (!s.departDate || !s.returnDate) { get().showDialog('Travel dates required', 'Please select your departure and return dates.'); return; }
    set({ loading: true, currentScreen: 0 });
    window.scrollTo(0, 0);
    setTimeout(() => set({ loading: false, currentScreen: 2 }), 2200);
  },

  adjustCount: (plan, type, delta) => {
    const s = get();
    if (delta > 0 && getTotalTravellers(s) >= 20) { get().showDialog('Group limit reached', 'Maximum group size is 20 travellers.'); return; }
    const next = Math.max(0, s.planCounts[plan][type] + delta);
    set({ planCounts: { ...s.planCounts, [plan]: { ...s.planCounts[plan], [type]: next } } });
  },

  goToScreen3: () => {
    const s = get();
    const total = getTotalTravellers(s);
    if (total === 0) { get().showDialog('No travellers selected', 'Please select at least one traveller to continue.'); return; }
    if (totalAdults(s) < 1) { get().showDialog('Adult required', 'At least 1 adult is required in the group.'); return; }
    if (total > 20) { get().showDialog('Group limit reached', 'Maximum group size is 20 travellers.'); return; }
    set({ addonSlots: buildAddonSlots(s), currentScreen: 3 });
    window.scrollTo(0, 0);
  },

  toggleAddon: (key) => set((s) => {
    const on = !s.addons[key];
    const addons = { ...s.addons, [key]: on };
    const addonPax = on ? s.addonPax : { ...s.addonPax, [key]: [] };
    const petCount = key === 'pet' ? (on ? Math.max(1, s.petCount) : 0) : s.petCount;
    return { addons, addonPax, petCount };
  }),

  adjustPetCount: (delta) => set((s) => ({ petCount: Math.min(20, Math.max(1, s.petCount + delta)) })),

  toggleAddonTraveller: (key, slotId) => {
    const s = get();
    const ao = ADDONS.find((a) => a.key === key)!;
    if (isSlotBlocked(s, ao, slotId)) return;
    const arr = [...(s.addonPax[key] || [])];
    const i = arr.indexOf(slotId);
    if (i < 0) arr.push(slotId); else arr.splice(i, 1);
    const withSel = { ...s, addonPax: { ...s.addonPax, [key]: arr } };
    set({ addonPax: prunedAddonPax(withSel) });
  },

  selectAllTravellers: (key) => {
    const s = get();
    const ao = ADDONS.find((a) => a.key === key)!;
    const avail = addonSlotsFor(s, ao).filter((slot) => !isSlotBlocked(s, ao, slot.id));
    const sel = s.addonPax[key] || [];
    const allSel = avail.length > 0 && avail.every((slot) => sel.includes(slot.id));
    set({ addonPax: { ...s.addonPax, [key]: allSel ? [] : avail.map((slot) => slot.id) } });
  },

  goToScreen4: () => {
    const s = get();
    set({ insuredPersons: buildInsuredPersons(s), currentScreen: 4 });
    window.scrollTo(0, 0);
  },

  togglePersonAddon: (slotId, key) => {
    const s = get();
    const ao = ADDONS.find((a) => a.key === key)!;
    if (ao.unit === 'group') { set({ addons: { ...s.addons, [key]: !s.addons[key] } }); return; }
    if (isSlotBlocked(s, ao, slotId)) return;
    const arr = [...(s.addonPax[key] || [])];
    const i = arr.indexOf(slotId);
    if (i < 0) arr.push(slotId); else arr.splice(i, 1);
    const addons = { ...s.addons, [key]: arr.length > 0 };
    const withSel = { ...s, addons, addonPax: { ...s.addonPax, [key]: arr } };
    set({ addons, addonPax: prunedAddonPax(withSel) });
  },

  togglePolicyholder: (idx, slotId) => set((s) => {
    if (s.policyholderSlot === slotId) return { policyholderSlot: null };
    // Auto-populate this traveller from applicant details
    const persons = s.insuredPersons.map((p, i) =>
      i === idx ? { ...p, name: s.applicant.name, dob: s.applicant.dob, nric: s.applicant.nric } : p);
    return { policyholderSlot: slotId, insuredPersons: persons };
  }),

  updatePersonField: (idx, field, val) => set((s) => ({
    insuredPersons: s.insuredPersons.map((p, i) => (i === idx ? { ...p, [field]: val } : p)),
  })),

  updateApplicantField: (field, val) => set((s) => ({ applicant: { ...s.applicant, [field]: val } })),

  goToScreen5: () => {
    const { applicant } = get();
    if (!applicant.name) { get().showDialog('Name required', 'Please enter the applicant full name.'); return; }
    if (!applicant.email) { get().showDialog('Email required', 'Please enter the applicant email address.'); return; }
    set({ currentScreen: 5 });
    window.scrollTo(0, 0);
  },

  completePayment: () => { set({ policyNumber: generatePolicyNumber(), currentScreen: 6 }); window.scrollTo(0, 0); },

  resetFlow: () => { set({ ...initialState, applicant: emptyApplicant() }); window.scrollTo(0, 0); },
}));
