export type PlanKey = 'value' | 'plus' | 'pro';
export type AddonUnit = 'group' | 'pax' | 'pet';

export interface Addon {
  key: string;
  name: string;
  unit: AddonUnit;
  desc: string;
  badge?: { t: string; c: 'blue' | 'green' };
  adultsOnly?: boolean;
  noPregnant?: boolean;
}

export interface PlanCount {
  adult: number;
  child: number;
}

/** A traveller slot derived from plan counts (Screen 3+). */
export interface AddonSlot {
  id: string;
  plan: PlanKey;
  type: 'adult' | 'child';
  label: string;
}

/** An insured person (Screen 4) — slot data plus editable form fields. */
export interface InsuredPerson {
  id: string;
  plan: PlanKey;
  type: 'adult' | 'child';
  label: string;
  name: string;
  dob: string;
  nric: string;
}

export interface Applicant {
  name: string;
  dob: string;
  nric: string;
  phone: string;
  email: string;
  postal: string;
  address: string;
  unit: string;
}

export interface DialogState {
  open: boolean;
  title: string;
  msg: string;
}

export interface PurchaseState {
  currentScreen: number;
  loading: boolean;

  tripType: 'single' | 'annual';
  destination: string;
  selectedCountries: string[];
  departDate: string;
  returnDate: string;
  promoApplied: boolean;

  planCounts: Record<PlanKey, PlanCount>;

  addons: Record<string, boolean>;
  addonPax: Record<string, string[]>;
  addonTab: string;
  petCount: number;
  policyholderSlot: string | null;

  addonSlots: AddonSlot[];
  insuredPersons: InsuredPerson[];

  applicant: Applicant;
  policyNumber: string;

  dialog: DialogState;
  toast: { open: boolean; msg: string };
}
