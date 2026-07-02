import { useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import {
  addonUnitCost, cap, formatDateDisplay, fmt, getDestinationLabel, getTripDays,
  paxCount, paxQtyLabel, totalCost,
} from '../../store/selectors';
import { PLAN_PRICES } from '../../data/plans';
import { ADDONS, addonTabFor } from '../../data/addons';
import { PROMO_RATE } from '../../data/constants';
import type { PlanKey } from '../../types';
import { useIsMobile } from '../../hooks/useIsMobile';
import { PlaneIcon, PinIcon, CalSmIcon } from '../icons';

const PLANS: PlanKey[] = ['value', 'plus', 'pro'];

/** Concise mobile-summary plan lines: "Plus x 2 Adults … S$84.00" (undiscounted, matches Figma 4658:13722). */
function PlanSummaryLines() {
  const s = usePurchaseStore();
  const rows: React.ReactNode[] = [];
  // Adults first (all plans), then children — matches the Figma summary order.
  for (const plan of PLANS) {
    const { adult } = s.planCounts[plan];
    if (adult > 0) rows.push(
      <div className="qb-line" key={`${plan}-a`}>
        <span className="lbl">{cap(plan)} x {adult} {adult > 1 ? 'Adults' : 'Adult'}</span>
        <span className="amt">{fmt(adult * PLAN_PRICES[plan].adult)}</span>
      </div>);
  }
  for (const plan of PLANS) {
    const { child } = s.planCounts[plan];
    if (child > 0) rows.push(
      <div className="qb-line" key={`${plan}-c`}>
        <span className="lbl">{cap(plan)} x {child} {child > 1 ? 'Children' : 'Child'}</span>
        <span className="amt">{fmt(child * PLAN_PRICES[plan].child)}</span>
      </div>);
  }
  if (!rows.length) return <div className="qb-empty">No travellers selected yet</div>;
  return <>{rows}</>;
}

function AddonSummaryLines() {
  const s = usePurchaseStore();
  const active = ADDONS.filter((ao) => s.addons[ao.key]);
  if (!active.length) return <div className="qb-empty">None selected yet</div>;
  return (
    <>
      {active.map((ao) => {
        let qty: string;
        let right: React.ReactNode;
        if (ao.unit === 'group') { qty = 'x Group'; right = fmt(addonUnitCost(s, ao)); }
        else if (ao.unit === 'pet') { const n = Math.max(1, s.petCount); qty = `x ${n} Pet${n > 1 ? 's' : ''}`; right = fmt(addonUnitCost(s, ao)); }
        else {
          const n = paxCount(s, ao.key);
          qty = n > 0 ? `x ${paxQtyLabel(s, ao.key)}` : 'x 0 selected';
          right = n > 0 ? fmt(addonUnitCost(s, ao)) : (
            <span className="qb-pick" onClick={() => { s.setAddonTab(addonTabFor(ao.key)); s.goToScreen(3); }}>Select traveller</span>
          );
        }
        return (
          <div className="qb-line" key={ao.key}>
            <span className="lbl">{ao.name} {qty}</span>
            <span className="amt">{right}</span>
          </div>
        );
      })}
    </>
  );
}

/** showTotal renders a live running total (Select Plan page) that updates with plan choices. */
export default function QuoteBar({ showTotal = false }: { showTotal?: boolean }) {
  const s = usePurchaseStore();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Mobile: concise, collapsible "Plan Summary" card (Figma 4658:13722) — undiscounted subtotal,
  // structured Trip Details / Your Plan / Add-On(s) sections, each independently editable.
  if (isMobile) {
    const subtotal = totalCost(s);
    const hasAddons = ADDONS.some((ao) => s.addons[ao.key]);
    return (
      <div className="quote-bar qb-mobile">
        <button className="qb-summary-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <span className="qb-summary-title">Plan Summary</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }}>
            <path d="M7 10l5 5 5-5" stroke="#6E6E6E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="qb-total-line">Total Amount: <strong>{fmt(subtotal)}</strong></div>

        {open && (
          <div className="qb-expand">
            <div className="qb-divider" />

            <div className="qb-sec-head">Trip Details <button className="text-link" onClick={() => s.goToScreen(1)}>Edit</button></div>
            <div className="qb-detail-line"><PlaneIcon /> {s.tripType === 'single' ? 'Single Trip' : 'Annual Trip'}</div>
            <div className="qb-detail-line"><PinIcon /> {getDestinationLabel(s)}</div>
            <div className="qb-detail-line"><CalSmIcon /> {formatDateDisplay(s.departDate)} – {formatDateDisplay(s.returnDate)}{getTripDays(s)}</div>

            <div className="qb-sec-head">Your Plan <button className="text-link" onClick={() => s.goToScreen(2)}>Edit</button></div>
            <PlanSummaryLines />

            <div className="qb-sec-head">Add-On(s) <button className={hasAddons ? 'text-link' : 'text-link qb-edit-off'} onClick={() => s.goToScreen(3)}>Edit</button></div>
            <AddonSummaryLines />
          </div>
        )}
      </div>
    );
  }

  const total = totalCost(s) * (1 - PROMO_RATE); // discounted, matches the sidebar Total Amount
  return (
    <div className="quote-bar">
      <div className="quote-bar-item"><PlaneIcon /> {s.tripType === 'single' ? 'Single Trip' : 'Annual Trip'}</div>
      <div className="quote-bar-sep" />
      <div className="quote-bar-item"><PinIcon /> {getDestinationLabel(s)}</div>
      <div className="quote-bar-sep" />
      <div className="quote-bar-item">
        <CalSmIcon /> {formatDateDisplay(s.departDate)} – {formatDateDisplay(s.returnDate)}{getTripDays(s)}
      </div>
      <button className="btn-edit-sm" onClick={() => s.goToScreen(1)}>Edit</button>
      {showTotal && (
        <div className="quote-bar-total">
          <span className="qbt-label">Total Amount:</span>
          <span className="qbt-amount">{fmt(total)}</span>
        </div>
      )}
    </div>
  );
}
