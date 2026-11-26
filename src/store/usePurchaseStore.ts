import { create } from 'zustand';
import type { Applicant, CoverType, PlanKey, PurchaseState, ToggleAddonKey } from '../types';
import { ANNUAL_TRIP_DAYS, MAX_TRAVELLERS } from '../data/constants';
import { buildInsuredPersons, generatePolicyNumber, tripDetailsComplete, visiblePlans } from './selectors';

const emptyApplicant = (): Applicant => ({ name: '', dob: '', nric: '', phone: '', email: '', postal: '', address: '', unit: '' });

/** Demo Myinfo profile returned by the Singpass flow. */
const SINGPASS_PROFILE: Applicant = {
  name: 'Chris Wong', dob: '1991-01-05', nric: 'S9111012B', phone: '9123 4567',
  email: 'chriswong@gmail.com', postal: '612345', address: 'Blk 345 East Coast St 23', unit: '#09-124',
};

const addDays = (iso: string, n: number): string => {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
};

const noAddons = (): Record<ToggleAddonKey, boolean> => ({ cfar: false, ski: false, adv: false, golf: false });

const initialState: PurchaseState = {
  currentScreen: 1,
  loading: false,
  tripType: 'single',
  destination: 'countries',
  selectedCountries: [],
  departDate: '',
  returnDate: '',
  coverType: 'standard',
  adults: 1,
  children: 0,
  plan: 'plus',
  addons: noAddons(),
  rentalCount: 0,
  petCount: 0,
  insuredPersons: [],
  policyholderId: null,
  applicant: emptyApplicant(),
  singpassFilled: false,
  declarationChecked: false,
  policyNumber: '',
  dialog: { open: false, title: '', msg: '' },
  toast: { open: false, msg: '' },
};

interface Actions {
  goToScreen: (n: number) => void;
  showDialog: (title: string, msg: string) => void;
  closeDialog: () => void;
  showToast: (msg: string) => void;
  hideToast: () => void;

  setTripType: (t: 'single' | 'annual') => void;
  setDestination: (type: string) => void;
  setSelectedCountries: (countries: string[]) => void;
  setDepartDate: (iso: string) => void;
  setReturnDate: (iso: string) => void;
  setCoverType: (t: CoverType) => void;
  adjustTravellers: (who: 'adults' | 'children', delta: number) => void;
  checkPrice: () => void;

  selectPlan: (p: PlanKey) => void;
  goToAddons: () => void;

  toggleAddon: (key: ToggleAddonKey) => void;
  adjustCounter: (key: 'rentalCount' | 'petCount', delta: number) => void;
  goToTravellers: () => void;

  togglePolicyholder: (id: string) => void;
  updatePersonField: (idx: number, field: 'name' | 'dob' | 'nric', val: string) => void;
  updateApplicantField: (field: keyof Applicant, val: string) => void;
  retrieveSingpass: () => void;
  clearSingpass: () => void;
  goToReview: () => void;

  setDeclaration: (v: boolean) => void;
  completePayment: () => void;
  resetFlow: () => void;
}

export const usePurchaseStore = create<PurchaseState & Actions>((set, get) => ({
  ...initialState,

  goToScreen: (n) => { set({ currentScreen: n }); window.scrollTo(0, 0); },
  showDialog: (title, msg) => set({ dialog: { open: true, title, msg } }),
  closeDialog: () => set((s) => ({ dialog: { ...s.dialog, open: false } })),
  showToast: (msg) => set({ toast: { open: true, msg } }),
  hideToast: () => set((s) => ({ toast: { ...s.toast, open: false } })),

  // Annual trips are area-only, return 365 days after departure, and can't be Pre-existing Conditions cover.
  setTripType: (tripType) => set((s) => {
    if (tripType === 'single') return { tripType, destination: 'countries', returnDate: s.tripType === 'annual' ? '' : s.returnDate };
    return {
      tripType,
      coverType: 'standard',
      ...(s.destination === 'countries' || s.destination === 'asean' ? { destination: '', selectedCountries: [] } : {}),
      returnDate: s.departDate ? addDays(s.departDate, ANNUAL_TRIP_DAYS) : '',
    };
  }),
  setDestination: (type) => set((s) => ({ destination: type, selectedCountries: type === 'countries' ? s.selectedCountries : [] })),
  setSelectedCountries: (selectedCountries) => set({ selectedCountries }),
  setDepartDate: (departDate) => set((s) => (s.tripType === 'annual'
    ? { departDate, returnDate: addDays(departDate, ANNUAL_TRIP_DAYS) }
    : { departDate, returnDate: s.returnDate && s.returnDate < departDate ? '' : s.returnDate })),
  setReturnDate: (returnDate) => set({ returnDate }),
  setCoverType: (coverType) => set({ coverType }),
  // Each policy needs at least 1 adult.
  adjustTravellers: (who, delta) => set((s) => {
    const next = Math.max(who === 'adults' ? 1 : 0, s[who] + delta);
    if (delta > 0 && s.adults + s.children >= MAX_TRAVELLERS) return {};
    return { [who]: next } as Partial<PurchaseState>;
  }),

  checkPrice: () => {
    const s = get();
    if (!tripDetailsComplete(s)) { get().showDialog('Trip details required', 'Please choose your destination and travel dates.'); return; }
    // Plus is the default; fall back to it if the previous plan isn't offered for this trip (e.g. Lite outside ASEAN).
    const plan = visiblePlans(s).includes(s.plan) ? s.plan : 'plus';
    set({ plan, loading: true, currentScreen: 0 });
    window.scrollTo(0, 0);
    setTimeout(() => set({ loading: false, currentScreen: 2 }), 1800);
  },

  selectPlan: (plan) => set({ plan }),
  goToAddons: () => { set({ currentScreen: 3 }); window.scrollTo(0, 0); },

  toggleAddon: (key) => set((s) => ({ addons: { ...s.addons, [key]: !s.addons[key] } })),
  adjustCounter: (key, delta) => set((s) => ({ [key]: Math.min(20, Math.max(0, s[key] + delta)) }) as Partial<PurchaseState>),
  goToTravellers: () => {
    const s = get();
    const insuredPersons = buildInsuredPersons(s);
    const policyholderId = insuredPersons.some((p) => p.id === s.policyholderId) ? s.policyholderId : null;
    set({ insuredPersons, policyholderId, currentScreen: 4 });
    window.scrollTo(0, 0);
  },

  // "I am the policyholder" copies the applicant's name, DOB and NRIC into that adult (one adult at a time).
  togglePolicyholder: (id) => set((s) => {
    if (s.policyholderId === id) return { policyholderId: null };
    const insuredPersons = s.insuredPersons.map((p) => (p.id === id
      ? { ...p, name: s.applicant.name, dob: s.applicant.dob, nric: s.applicant.nric } : p));
    return { policyholderId: id, insuredPersons };
  }),
  updatePersonField: (idx, field, val) => set((s) => ({
    insuredPersons: s.insuredPersons.map((p, i) => (i === idx ? { ...p, [field]: val } : p)),
  })),
  updateApplicantField: (field, val) => set((s) => ({ applicant: { ...s.applicant, [field]: val } })),
  retrieveSingpass: () => set({ applicant: { ...SINGPASS_PROFILE }, singpassFilled: true }),
  clearSingpass: () => set({ applicant: emptyApplicant(), singpassFilled: false }),
  goToReview: () => {
    const { applicant } = get();
    if (!applicant.name) { get().showDialog('Name required', 'Please enter the applicant’s full name.'); return; }
    if (!applicant.email) { get().showDialog('Email required', 'Please enter the applicant’s email address.'); return; }
    set({ currentScreen: 5 });
    window.scrollTo(0, 0);
  },

  setDeclaration: (declarationChecked) => set({ declarationChecked }),
  completePayment: () => { set({ policyNumber: generatePolicyNumber(), currentScreen: 6 }); window.scrollTo(0, 0); },

  // "Buy another policy": a fresh quote.
  resetFlow: () => { set({ ...initialState, addons: noAddons(), applicant: emptyApplicant() }); window.scrollTo(0, 0); },
}));
