import { usePurchaseStore } from '../../store/usePurchaseStore';
import { ADDONS, addonTabFor } from '../../data/addons';
import { PLAN_PRICES } from '../../data/plans';
import { PROMO_CODE, PROMO_RATE } from '../../data/constants';
import type { PlanKey } from '../../types';
import {
  addonUnitCost, cap, fmt, paxCount, paxQtyLabel, totalCost,
} from '../../store/selectors';

const PLANS: PlanKey[] = ['value', 'plus', 'pro'];

function PlanLines() {
  const s = usePurchaseStore();
  const lines: React.ReactNode[] = [];
  for (const plan of PLANS) {
    const { adult, child } = s.planCounts[plan];
    if (adult > 0) lines.push(
      <div className="price-line" key={`${plan}-a`}>
        <span className="line-label">{cap(plan)} x {adult} adult{adult > 1 ? 's' : ''}</span>
        <span>{fmt(adult * PLAN_PRICES[plan].adult)}</span>
      </div>);
    if (child > 0) lines.push(
      <div className="price-line" key={`${plan}-c`}>
        <span className="line-label">{cap(plan)} x {child} child{child > 1 ? 'ren' : ''}</span>
        <span>{fmt(child * PLAN_PRICES[plan].child)}</span>
      </div>);
  }
  if (!lines.length) return (
    <div className="price-line"><span className="line-label" style={{ color: 'var(--gray-400)' }}>No travellers selected yet</span></div>
  );
  return <>{lines}</>;
}

function AddonLines() {
  const s = usePurchaseStore();
  const active = ADDONS.filter((ao) => s.addons[ao.key]);
  if (!active.length) return <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>None selected yet</span>;
  return (
    <>
      {active.map((ao) => {
        let qty: string, right: React.ReactNode;
        if (ao.unit === 'group') { qty = 'x Group'; right = fmt(addonUnitCost(s, ao)); }
        else if (ao.unit === 'pet') { const n = Math.max(1, s.petCount); qty = `x ${n} Pet${n > 1 ? 's' : ''}`; right = fmt(addonUnitCost(s, ao)); }
        else {
          const n = paxCount(s, ao.key);
          qty = n > 0 ? `x ${paxQtyLabel(s, ao.key)}` : 'x [0 selected]';
          right = n > 0 ? fmt(addonUnitCost(s, ao)) : (
            <span onClick={() => { s.setAddonTab(addonTabFor(ao.key)); s.goToScreen(3); }} style={{ color: '#F09252', fontWeight: 500, fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>Select traveller</span>
          );
        }
        return (
          <div className="price-line" style={{ alignItems: 'flex-start' }} key={ao.key}>
            <span className="line-label">{ao.name} {qty}</span>
            <span style={{ whiteSpace: 'nowrap' }}>{right}</span>
          </div>
        );
      })}
    </>
  );
}

export default function PriceCard() {
  const s = usePurchaseStore();
  const subtotal = totalCost(s);
  const discount = subtotal * PROMO_RATE; // raw always applies the 60% promo in the sidebar
  const total = subtotal - discount;

  return (
    <div className="price-card">
      <div className="price-card-header">
        <div className="label">Total Amount</div>
        <div className="amount">{fmt(total)}</div>
        <div className="orig-amount">{fmt(subtotal)}</div>
      </div>
      <div className="price-card-body">
        <div className="price-section-title">Your Plan <button className="text-link" style={{ fontSize: 14 }} onClick={() => s.goToScreen(2)}>Edit</button></div>
        <PlanLines />
        <div className="price-section-title" style={{ marginTop: 20 }}>Add-On(s) <button className="text-link" style={{ fontSize: 14 }} onClick={() => s.goToScreen(3)}>Edit</button></div>
        <AddonLines />
        <hr className="price-divider" />
        <div className="price-line"><span className="line-label" style={{ fontWeight: 700, color: '#212121' }}>Subtotal</span><span style={{ fontWeight: 500 }}>{fmt(subtotal)}</span></div>
        <div className="price-line" style={{ marginTop: 8 }}><span className="line-label" style={{ fontWeight: 700, color: '#212121' }}>Discount Code</span><span className="savings-amt">–{fmt(discount)}</span></div>
        <div className="savings-row" style={{ marginTop: 8 }}>
          <div className="promo-pill">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.98 5.02a.75.75 0 1 0-1.06 1.06.75.75 0 0 0 1.06-1.06Z" fill="#949494" /><path d="M14.67 1.33 15.21 8.34 7.92 15.62 0.38 8.08 7.66 0.79l7.01.54ZM8.86 4.31a1.99 1.99 0 1 0 2.82 2.82 1.99 1.99 0 0 0-2.82-2.82Z" fill="#949494" /></svg>
            <span style={{ fontWeight: 400, color: '#212121' }}>{PROMO_CODE}</span>
            <span className="promo-remove" style={{ color: '#949494' }}>✕</span>
          </div>
        </div>
        <hr className="price-divider" />
        <div className="price-line"><span className="line-label" style={{ fontWeight: 700, color: '#212121', fontSize: 16 }}>Total (incl. GST)</span><span style={{ fontWeight: 700, fontSize: 16, color: '#212121' }}>{fmt(total)}</span></div>
      </div>
    </div>
  );
}
