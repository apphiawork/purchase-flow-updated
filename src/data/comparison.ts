/** Compare Plans dialog content (Figma 7337:31584 / 33271 / 34966 / 36661). Values are S$ unless text. */
export interface PcLine { kind: 'B' | 'R'; label: string; values: [string, string, string, string] } // lite, value, plus, pro
export interface PcSection { title: string; tab: string; addon: boolean; lines: PcLine[] }

export const PC_TABS = ['Pre-Trip & Medical', 'Travel Inconvenience', 'Accident & Liability', 'Optional Add-Ons'];

type Row = [string, string?, string?, string?, string?];
const NC = 'Not covered', NA = 'Not available';
/** A row with no values is a benefit heading (B); the rows after it are its sub-rows (R). A row with values that
 *  follows nothing or another valued benefit is a single-line benefit (B with values). */
function lines(rows: Row[], subLabels: RegExp): PcLine[] {
  return rows.map(([label, l = '', v = '', p = '', pro = '']) => {
    const isSub = subLabels.test(label);
    return { kind: isSub ? 'R' : 'B', label, values: [l, v, p, pro] };
  });
}
const SUB = /^(Each |Aggregate limit|First visit|Cover period|Adult \/ senior|Child (payout|maximum)|Cover basis|Cover$|Sub-limit|Per article|Repayment|Free extension|Co-payment$|Purchase window|Applies$|Duration$|Trip type$|Excess)/;
const sec = (title: string, tab: string, rows: Row[], addon = false): PcSection => ({ title, tab, addon, lines: lines(rows, SUB) });

export const PC_SECTIONS: PcSection[] = [
  sec('Pre-Trip & Medical', PC_TABS[0], [
    ['Travel Agent Insolvency'], ['Each adult / senior', '1,000', '2,000', '4,000', '6,000'], ['Each child', '500', '1,000', '2,000', '3,000'], ['Aggregate limit for family plan', '3,000', '5,000', '12,000', '18,000'],
    ['Cancelling Your Trip'], ['Each adult / senior', '1,000', '5,000', '10,000', '15,000'], ['Each child', '500', '2,500', '5,000', '7,500'], ['Aggregate limit for family plan', '3,000', '15,000', '30,000', '45,000'],
    ['Postponing Your Trip'], ['Each adult / senior', '500', '1,000', '1,500', '2,000'], ['Each child', '250', '500', '750', '1,000'], ['Aggregate limit for family plan', '1,500', '3,000', '4,500', '6,000'],
    ['Replacement of Traveller'], ['Each adult / senior', NC, '500', '750', '1,000'], ['Each child', NC, '250', '375', '500'], ['Aggregate limit for family plan', NC, '1,500', '2,250', '3,000'],
    ['Unused Entertainment Tickets'], ['Each adult / senior', NC, '100', '200', '300'], ['Each child', NC, '50', '100', '150'], ['Aggregate limit for family plan', NC, '300', '600', '900'],
    ['Loss of Frequent Flyer Points'], ['Each adult / senior', NC, 'Covered', 'Covered', 'Covered'], ['Each child', NC, 'Covered', 'Covered', 'Covered'], ['Aggregate limit for family plan', NC, 'Covered', 'Covered', 'Covered'],
  ]),
  sec('Medical Benefits', PC_TABS[0], [
    ['Medical Expenses Overseas'], ['Each adult', '50,000', '250,000', '500,000', '1,000,000'], ['Each senior', '15,000', '75,000', '150,000', '300,000'], ['Each child', '15,000', '75,000', '150,000', '300,000'], ['Aggregate limit for family plan', '100,000', '500,000', '1,000,000', '2,000,000'],
    ['Medical Expenses in Singapore After Your Trip'], ['Each adult', NC, '10,000', '15,000', '20,000'], ['Each senior', NC, '3,000', '4,500', '6,000'], ['Each child', NC, '3,000', '4,500', '6,000'], ['Aggregate limit for family plan', NC, '20,000', '30,000', '40,000'], ['First visit after return', NC, '48 hours', '48 hours', '48 hours'], ['Cover period', NC, '30 days from return', '30 days from return', '30 days from return'],
    ['Alternative Treatment Expenses'], ['Each adult', NC, '$400 (Sub-limit $40/visit)', '$500 (Sub-limit $50/visit)', '$600 (Sub-limit $60/visit)'], ['Each senior', NC, '$200 (Sub-limit $20/visit)', '$250 (Sub-limit $25/visit)', '$300 (Sub-limit $30/visit)'], ['Each child', NC, '$200 (Sub-limit $20/visit)', '$250 (Sub-limit $25/visit)', '$300 (Sub-limit $30/visit)'], ['Aggregate limit for family plan', NC, '800', '1,000', '1,200'],
    ['Mobility Aid Support'], ['Each adult', '500', '500', '1,000', '1,500'], ['Each senior', '250', '150', '300', '450'], ['Each child', '250', '150', '300', '450'], ['Aggregate limit for family plan', '1,000', '1,000', '2,000', '3,000'],
    ['Emergency Dental Expenses'], ['Each adult', NC, '1,000', '3,000', '5,000'], ['Each senior', NC, '300', '300', '300'], ['Each child', NC, '300', '300', '300'], ['Aggregate limit for family plan', NC, '2,000', '6,000', '10,000'],
    ['Daily Hospital Allowance Overseas'], ['Each adult', NC, '$100 per full day; max $10,000', '$150 per full day; max $15,000', '$200 per full day; max $20,000'], ['Each senior', NC, '$30 per full day; max $3,000', '$45 per full day; max $4,500', '$60 per full day; max $6,000'], ['Each child', NC, '$30 per full day; max $3,000', '$45 per full day; max $4,500', '$60 per full day; max $6,000'], ['Aggregate limit for family plan', NC, '20,000', '30,000', '40,000'],
    ['24/7 UOI Medical & Travel Assist Hotline', NC, 'Covered', 'Covered', 'Covered'],
    ['Emergency Medical Evacuation & Repatriation of Mortal Remains'], ['Each adult', '100,000', '1,000,000', '1,000,000', '1,000,000'], ['Each senior', '100,000', '1,000,000', '1,000,000', '1,000,000'], ['Each child', '100,000', '1,000,000', '1,000,000', '1,000,000'], ['Aggregate limit for family plan', '200,000', '2,000,000', '2,000,000', '2,000,000'],
    ['Companion Support & Compassionate Visit', '1,000', '2,000', '3,000', '4,000'],
    ['Overseas Hospital and Compassionate Visit'], ['Aggregate limit for family plan', '2,000', '4,000', '6,000', '8,000'],
    ['Child Safe Return', '1,000', '2,000', '3,000', '4,000'],
    ['Emergency Assistance Call Charges'], ['Each insured person', '50', '100', '150', '200'], ['Aggregate limit for family plan', '100', '200', '300', '400'],
  ]),
  sec('Other Benefits', PC_TABS[0], [
    ['Hospital Stay Allowance in Singapore'], ['Aggregate limit for family plan', NA, 'Max $3,000', 'Max $4,500', 'Max $6,000'],
    ['Overseas Quarantine Allowance'], ['Aggregate limit for family plan', NA, NC, NC, NC],
    ['Singapore Quarantine Allowance'], ['Aggregate limit for family plan', NA, NC, NC, NC],
  ]),
  sec('Travel Inconvenience', PC_TABS[1], [
    ['Travel Delay'], ['Adult / senior payout', '$100 after 6 hours', '$60 per four hours', '$60 per four hours', '$60 per four hours'], ['Adult / senior maximum', NC, '360', '600', '1,200'], ['Child payout', NC, '$30 per four hours', '$30 per four hours', '$30 per four hours'], ['Child maximum', NC, '180', '300', '600'], ['Aggregate limit for family plan', NC, '720', '1,200', '2,400'], ['Cover basis', NC, 'All risk', 'All risk', 'All risk'],
    ['Cutting Your Trip Short'], ['Each adult / senior', '1,000', '5,000', '10,000', '15,000'], ['Each child', '500', '2,500', '5,000', '7,500'], ['Aggregate limit for family plan', '3,000', '10,000', '20,000', '30,000'],
    ['Disruption During Your Trip'], ['Each adult / senior', '500', '1,000', '2,000', '3,000'], ['Each child', '250', '500', '1,000', '1,500'], ['Aggregate limit for family plan', '1,500', '2,000', '4,000', '6,000'],
    ['Missing Your Connection'], ['Each adult / senior', NC, '400', '500', '600'], ['Each child', NC, '200', '250', '300'], ['Aggregate limit for family plan', NC, '800', '1,000', '1,200'],
    ['Your Flight Being Diverted'], ['Each adult / senior', NC, '500', '1,000', '1,500'], ['Each child', NC, '250', '500', '750'], ['Aggregate limit for family plan', NC, '1,000', '2,000', '3,000'],
    ['Overbooked Scheduled Transport'], ['Each adult / senior', NC, '200', '300', '400'], ['Each child', NC, '100', '150', '200'], ['Aggregate limit for family plan', NC, '400', '600', '800'],
    ['Delayed Baggage'], ['Adult / senior payout', NC, '$100 every 6 hrs', '$150 every 6 hrs', '$200 every 6 hrs'], ['Adult / senior maximum', NC, '300', '600', '1,000'], ['Child payout', NC, '$50 every 6 hrs', '$75 every 6 hrs', '$100 every 6 hrs'], ['Child maximum', NC, '150', '300', '500'], ['Aggregate limit for family plan', NC, '600', '1,200', '2,000'],
    ['Delayed Baggage in Singapore'], ['Cover', NC, NC, NC, NC],
  ]),
  sec('Personal Belongings', PC_TABS[1], [
    ['Loss or Damage to Your Baggage'], ['Each adult / senior', '1,000', '3,000', '5,000', '7,500'], ['Each child', '500', '1,500', '2,500', '3,750'], ['Aggregate limit for family plan', '2,000', '6,000', '10,000', '15,000'], ['Sub-limit per article / set / pair', '200', '500', '500', '500'], ['Sub-limit per mobile device', '200', '500', '500', '500'], ['Sub-limit per laptop', '200', '1,000', '1,000', '1,000'], ['Sub-limit for valuables (total)', NC, '300', '400', '500'],
    ['Loss of Travel Documents'], ['Each insured person', '500', '750', '1,000', '1,500'], ['Aggregate limit for family plan', '1,000', '1,500', '2,000', '3,000'],
    ['Losing Your Money'], ['Each adult / senior', NC, '100', '200', '300'], ['Each child', NC, '50', '100', '150'], ['Aggregate limit for family plan', NC, '200', '400', '600'],
    ['Protection for Overseas Purchases'], ['Each insured person', NC, '1,000', '2,500', '5,000'], ['Per article limit', NC, '500', '750', '1,000'], ['Aggregate limit for family plan', NC, '2,000', '5,000', '10,000'],
    ['Unauthorised Use of Credit Card'], ['Each adult / senior', NA, '100', '300', '500'],
    ['Repayment of Overseas Credit Card Charges'], ['Each adult / senior', NA, '100', '300', '500'],
  ]),
  sec('Accident & Liability', PC_TABS[2], [
    ['Accidental Death or Permanent Disability'], ['Each adult', '100,000', '200,000', '300,000', '500,000'], ['Each senior', '30,000', '40,000', '60,000', '80,000'], ['Each child', '50,000', '60,000', '90,000', '150,000'], ['Aggregate limit for family plan', '300,000', '400,000', '600,000', '1,000,000'],
    ['Terrorism Cover'], ['Each adult', '100,000', '200,000', '300,000', '500,000'], ['Each senior', '30,000', '40,000', '60,000', '80,000'], ['Each child', '50,000', '60,000', '90,000', '150,000'], ['Aggregate limit for family plan', '300,000', '400,000', '600,000', '1,000,000'],
    ['Liability to Others'], ['Each adult / senior', '300,000', '600,000', '800,000', '1,000,000'], ['Each child', '150,000', '300,000', '400,000', '500,000'], ['Aggregate limit for family plan', '300,000', '600,000', '800,000', '1,000,000'],
    ['Automatic Extension of Policy Period'], ['Free extension', '14 days / 30 days', '14 days / 30 days', '14 days / 30 days', '14 days / 30 days'],
  ]),
  sec('Flexi Trip Changes', PC_TABS[3], [
    ['Cancelling Your Trip (Flexi)', NA, '2,000', '4,000', '6,000'], ['Postponing Your Trip (Flexi)', NA, '300', '500', '1,000'], ['Replacement Traveller (Flexi)', NA, '300', '500', '1,000'],
    ['Cutting Your Trip Short (Flexi)', NA, '1,000', '2,000', '3,000'], ['Unused Entertainment Tickets (Flexi)', NA, '100', '200', '300'],
    ['Co-Payment'], ['Co-payment', NA, '50%', '50%', '50%'],
    ['Purchase Time Requirement'], ['Purchase window', NA, 'Within 14 days of first booking', 'Within 14 days of first booking', 'Within 14 days of first booking'],
    ['General Exclusions Apply'], ['Applies', NA, 'Yes (GE 13–18 apply)', 'Yes (GE 13–18 apply)', 'Yes (GE 13–18 apply)'],
  ], true),
  sec('Pre-existing Condition Cover', PC_TABS[3], [
    ['Overseas Medical Expenses for Pre-existing Condition'], ['Each adult / child', NA, '50,000', '75,000', '100,000'], ['Each senior', NA, '25,000', '37,500', '50,000'],
    ['Emergency Medical Evacuation & Return Home for Pre-existing Condition'], ['Each adult / child', NA, '100,000', '150,000', '200,000'], ['Each senior', NA, '100,000', '150,000', '200,000'],
    ['Overseas Hospital and Compassionate Visit for Pre-existing Condition', NA, '5,000', '7,500', '10,000'],
    ['Pre-existing Condition – Maximum Trip Duration'], ['Duration', NA, 'Up to 30 days per trip', 'Up to 30 days per trip', 'Up to 30 days per trip'],
    ['Pre-existing Condition – Treatment Duration After Onset'], ['Duration', NA, 'Up to 14 days', 'Up to 14 days', 'Up to 14 days'],
    ['Automatic Extension of Trip due to Pre-existing Condition'], ['Free extension', NA, 'Up to 7 days', 'Up to 7 days', 'Up to 7 days'],
    ['Pre-existing Condition Availability'], ['Trip type', NA, 'Single Trip only', 'Single Trip only', 'Single Trip only'],
  ], true),
  sec('Pregnancy Care', PC_TABS[3], [
    ['Medical Expenses Overseas for Pregnancy Related Conditions'], ['Each insured person', NA, '30,000', '60,000', '100,000'], ['Excess / co-payment', NA, '$300 / 15% co-pay', '$300 / 15% co-pay', '$300 / 15% co-pay'],
    ['Emergency Medical Evacuation & Return Home for Pregnancy Related Conditions', NA, '30,000', '60,000', '100,000'],
    ['Overseas Hospital and Compassionate Visit for Pregnancy Related Conditions', NA, '1,000', '3,000', '5,000'],
    ['Automatic Extension due to Pregnancy Related Conditions', NA, 'Up to 7 days', 'Up to 7 days', 'Up to 7 days'],
  ], true),
  sec('Ski & Snowboard Activities Cover', PC_TABS[3], [
    ['Ski & Snowboard Activities Cover', NA, 'Covered', 'Covered', 'Covered'], ['Unused Ski & Snowboard Activities', NA, '100', '300', '500'],
    ['Unused Ski & Snowboard Activities – Co-payment', NA, '30% co-payment', '30% co-payment', '30% co-payment'],
    ['Piste or Lift Closure', NA, '50 per 24h, max 5 days', '50 per 24h, max 5 days', '100 per 24h, max 5 days'],
    ['Avalanche-Related Travel Delay', NA, '50 per 24h, max 5 days', '50 per 24h, max 5 days', '100 per 24h, max 5 days'],
    ['Personal Accident Cover', NA, '50%', '50%', '50%'], ['Overseas Medical Expenses', NA, 'Covered', 'Covered', 'Covered'],
    ['Mountain Rescue', NA, '5,000', '5,000', '10,000'], ['Search & Rescue', NA, '5,000', '5,000', '10,000'],
    ['Own Gear Loss or Damage', NA, '1,000', '1,000', '2,000'], ['Own Gear Loss or Damage (Per Item Sub-limit)', NA, '250', '250', '500'], ['Own Gear Loss or Damage (Excess)', NA, '100', '100', '100'],
    ['Replacement Gear Hire', NA, '100/day, max 5 days', '100/day, max 5 days', '150/day, max 7 days'],
    ['Damage to Hired Gear', NA, '1,000', '1,000', '2,000'], ['Damage to Hired Gear – Excess', NA, '20% subject to min $100', '20% subject to min $100', '20% subject to min $100'],
    ['Personal Liability Extension', NA, '50%', '50%', '50%'],
  ], true),
  sec('Adventure and Sports Activities', PC_TABS[3], [
    ['Unused Prepaid Activity Expenses', NA, '30% co-payment', '30% co-payment', '30% co-payment'], ['Personal Accident Cover', NA, '50%', '50%', '50%'],
    ['Adventure and Sports Equipment Cover', NA, '100', '200', '300'],
  ], true),
  sec('Golf Play Cover', PC_TABS[3], [
    ['Loss or Damage to Golf Equipment', NA, '1,000', '1,000', '1,000'], ['Hired Golf Equipment Costs', NA, '$300 (subj. $100/day)', '$300 (subj. $100/day)', '$300 (subj. $100/day)'],
    ['Unused Prepaid Golf Expenses', NA, '500', '500', '500'], ['Hole-in-One Celebration', NA, '500', '500', '500'],
    ['Golf Buggy Damage'], ['Each insured person (18 and above)', NA, '$200 / 50% co-payment', '$200 / 50% co-payment', '$200 / 50% co-payment'],
    ['Personal Liability During Golf'], ['Each insured person (18 and above)', NA, '5,000', '5,000', '5,000'],
  ], true),
  sec('Rental Vehicle Cover', PC_TABS[3], [
    ['Unused Rental Charges & Late Fees', NA, '300', '700', '700'], ['Rental Vehicle Return Assistance', NA, '300', '700', '700'], ['Rental Vehicle Damage Excess', NA, '500', '1,200', '1,200'],
  ], true),
  sec('Petcare Support', PC_TABS[3], [
    ['Pet Care Cancellation', NA, '300', '500', '700'], ['Pet Care Extension', NA, '300', '500', '700'], ['Get-Well Benefit for Pet Boarding Injury', NA, '100', '150', '200'],
  ], true),
];
