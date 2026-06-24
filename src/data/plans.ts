import type { PlanKey } from '../types';

export const PLAN_PRICES: Record<PlanKey, { adult: number; child: number }> = {
  value: { adult: 31, child: 15.5 },
  plus: { adult: 42, child: 21 },
  pro: { adult: 56, child: 28 },
};

/** Static Key Features table on Screen 2 (label, value, plus, pro, isGroupHeader). */
export interface FeatureRow {
  label: string;
  v: string;
  p: string;
  pro: string;
  header: boolean;
}
const F = (label: string, v: string, p: string, pro: string, header = false): FeatureRow =>
  ({ label, v, p, pro, header });

export const PLAN_FEATURES: FeatureRow[] = [
  F('Overseas Medical Expenses', '', '', '', true),
  F('Adult up to 70 years old', 'S$1,000,000', 'S$1,000,000', 'S$1,000,000'),
  F('Child below 16 years old', 'S$500,000', 'S$500,000', 'S$500,000'),
  F('Trip Cancellation', '', '', '', true),
  F('Adult up to 70 years old', 'S$15,000', 'S$15,000', 'S$15,000'),
  F('Child below 16 years old', 'S$10,000', 'S$10,000', 'S$10,000'),
  F('Baggage & Personal Effects', 'S$7,500', 'S$7,500', 'S$7,500', true),
  F('Travel Delay', 'S$2,000', 'S$2,000', 'S$2,000', true),
  F('Covid-19 Cover', 'Covered', 'Covered', 'Covered', true),
];

// ── Plan comparison modal ──
export const PC_TABS = ['Travel Inconvenience', 'Medical Coverage', 'Optional Benefits', 'Others'];

export interface PcRow {
  label: string;
  v: string;
  p: string;
  pro: string;
  g: boolean;
}
const R = (label: string, v: string, p: string, pro: string, g?: number): PcRow =>
  ({ label, v, p, pro, g: !!g });

export const PC_DATA: Record<string, PcRow[]> = {
  'Travel Inconvenience': [
    R('Trip Cancellation', '3,000', '10,000', '15,000', 1),
    R('Sub-limit: Trip Postponement', '500', '1,000', '1,500'),
    R('Sub-limit: Replacement of Traveller', 'No Cover', '100', '200'),
    R('Aggregate limit for Family Plan', '7,500', '25,000', '37,500'),
    R('Cancel for Any Reason', '', '', '', 1),
    R('Sub-limit per person (up to 50% incurred expenses)', 'No Cover', 'No Cover', '1,500'),
    R('Aggregate limit for Family Plan', 'No Cover', 'No Cover', '3,750'),
    R('Bankruptcy or Insolvency of Travel Agent', '3,000', '10,000', '15,000', 1),
    R('Aggregate limit for Family Plan', '7,500', '12,500', '18,750'),
    R('Baggage Delay', '3,000', '5,000', '5,000', 1),
    R('(a) Limit for each full 6 consecutive hours delay whilst overseas', '100', '200', '200'),
    R('(b) Lump sum limit after full 6 consecutive hours delay returning to Singapore', '100', '200', '200'),
    R('Aggregate limit for Family Plan', '2,500', '3,000', '5,000'),
    R('Travel Delay', '1,000', '1,200', '2,000', 1),
    R('(a) Limit for each full 6 consecutive hours delay whilst overseas', '50', '100', '100'),
    R('(b) Lump sum limit after full 6 consecutive hours delay returning to Singapore', '50', '100', '100'),
    R('Aggregate limit for Family Plan', '2,500', '3,000', '5,000'),
    R('Flight Deviation', '250', '1,000', '1,500', 1),
    R('Limit for each full 6 consecutive hours', '50', '100', '100'),
    R('Travel Misconnection', '50', '100', '200', 1),
    R('Aggregate limit for Family Plan', '100', '250', '500'),
    R('Overbooked Scheduled Public Conveyance whilst overseas', 'No Cover', '100', '200', 1),
    R('Trip Curtailment', '3,000', '5,000', '15,000', 1),
    R('Aggregate limit for Family Plan', '7,500', '12,500', '37,500'),
    R('Trip Disruption', '200', '1,000', '1,500', 1),
    R('Aggregate limit for Family Plan', '500', '2,500', '3,750'),
    R('Un-utilised Entertainment Ticket', 'No Cover', '200', '500', 1),
  ],
  'Medical Coverage': [
    R('Accidental Death and Permanent Total Disablement', '', '', '', 1),
    R('Each Adult below Age 70 years old', '50,000', '250,000', '500,000'),
    R('Each Adult Age 70 years old and above', '25,000', '100,000', '125,000'),
    R('Each Child', '25,000', '100,000', '125,000'),
    R('Aggregate limit for Family Plan', '125,000', '625,000', '1,250,000'),
    R('Medical, Dental and Other Expenses Incurred Overseas', '', '', '', 1),
    R('Each Adult below Age 70 years old', '50,000', '250,000', '500,000'),
    R('Each Adult Age 70 years old and above', '25,000', '100,000', '125,000'),
    R('Each Child', '25,000', '100,000', '125,000'),
    R('Sub-limit for Pregnancy related medical expenses', '25,000', '100,000', '125,000'),
    R('Emergency Medical Evacuation and Repatriation', '', '', '', 1),
    R('Each Adult below Age 70 years old', '50,000', '250,000', '500,000'),
    R('Each Adult Age 70 years old and above', '25,000', '100,000', '125,000'),
    R('Each Child', '25,000', '100,000', '125,000'),
    R('Mobile Phone Charges for Emergency Medical Assistance', '100', '200', '300', 1),
    R('Hospital Confinement Allowance', '3,000', '5,000', '5,000', 1),
    R('Limit for each complete Hospital Day stay', '2,500', '3,000', '5,000'),
    R('Aggregate limit for Family Plan', '2,500', '3,000', '5,000'),
  ],
  'Optional Benefits': [
    R('Sports Equipment', '5,000', '5,000', '5,000', 1),
    R('Aggregate limit for Family Plan', '12,500', '12,500', '12,500'),
    R('Adventure Sports', 'Covered', 'Covered', 'Covered', 1),
    R('Golf Holiday', '', '', '', 1),
    R('Loss of golfing equipment', 'No Cover', '2,000', '2,000'),
    R('Hole-in-one', 'No Cover', '1,000', '1,000'),
    R('Unused green fees', 'No Cover', '500', '500'),
  ],
  Others: [
    R('Cover Extensions', '', '', '', 1),
    R('COVID-19 Special Extension', 'Covered', 'Covered', 'Covered'),
    R('Automatic Extension on the Period of Insurance', 'Up to 14 days', 'Up to 14 days', 'Up to 14 days'),
    R('Compassionate Visit by a Relative or Friend', '3,000', '5,000', '5,000', 1),
    R('Child Caretaker', '3,000', '5,000', '5,000', 1),
  ],
};
