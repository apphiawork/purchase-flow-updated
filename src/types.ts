export type PlanKey = 'lite' | 'value' | 'plus' | 'pro';
export type CoverType = 'standard' | 'prex';
/** Policy-level add-ons switched on/off; rental and pet are counters. Pre-ex is fixed by the cover type. */
export type ToggleAddonKey = 'cfar' | 'ski' | 'adv' | 'golf';
export type AddonKey = ToggleAddonKey | 'rental' | 'pet' | 'prex';

export interface Addon {
  key: AddonKey;
  name: string;
  desc: string;
  /** Base (pre-discount) price. Per vehicle / per pet for counters, per traveller for pre-ex. */
  price: number;
  unit: 'policy' | 'vehicle' | 'pet' | 'traveller';
}

/** An insured person on Traveller Details: adults first, then children. */
export interface InsuredPerson {
  id: string;
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
  coverType: CoverType;
  adults: number;
  children: number;

  plan: PlanKey;

  addons: Record<ToggleAddonKey, boolean>;
  rentalCount: number;
  petCount: number;

  insuredPersons: InsuredPerson[];
  policyholderId: string | null;
  applicant: Applicant;
  singpassFilled: boolean;
  declarationChecked: boolean;
  policyNumber: string;

  dialog: DialogState;
  toast: { open: boolean; msg: string };
}
