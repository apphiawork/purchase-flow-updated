import { useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { fmt, totals } from '../../store/selectors';
import { SummaryBody } from './SummaryCard';
import { tripItems } from './TripBar';

/** Phones and tablets, below 1024px (Figma 7401:27824 collapsed, 7408:28185 expanded): a "Plan Summary · Total Amount" bar under the
 *  header that replaces both the trip bar and the order-summary sidebar. Opening it shows trip details (with Edit
 *  back to Get Quote), then the plan, add-ons, subtotal, discount and total. */
export default function MobileSummary() {
  const s = usePurchaseStore();
  const [open, setOpen] = useState(false);
  return (
    <section className={`f-msum${open ? ' open' : ''}`} aria-label="Plan summary">
      <button type="button" className="f-msum-head" aria-expanded={open} aria-controls="f-msum-body" onClick={() => setOpen((o) => !o)}>
        <span>
          <strong>Plan Summary</strong>
          <span className="f-msum-total">Total Amount: {fmt(totals(s).total)}</span>
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 9 7 7 7-7" stroke="#6E6E6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <div className="f-msum-body" id="f-msum-body">
          <div className="f-sum-sec">
            <div className="f-sum-title">Trip details <button type="button" className="f-link" onClick={() => s.goToScreen(1)}>Edit</button></div>
            <ul className="f-msum-trip">
              {tripItems(s).map((it) => <li key={it.key}><img src={`/icons/${it.icon}.svg`} alt="" width={16} height={16} />{it.full ?? it.text}</li>)}
            </ul>
          </div>
          <SummaryBody />
        </div>
      )}
    </section>
  );
}
