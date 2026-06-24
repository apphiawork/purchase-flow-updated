import { usePurchaseStore } from '../../store/usePurchaseStore';
import { formatDateDisplay, fmt, getDestinationLabel, getTripDays, totalCost } from '../../store/selectors';
import { PROMO_RATE } from '../../data/constants';
import { PlaneIcon, PinIcon, CalSmIcon } from '../icons';

/** showTotal renders a live running total (Select Plan page) that updates with plan choices. */
export default function QuoteBar({ showTotal = false }: { showTotal?: boolean }) {
  const s = usePurchaseStore();
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
      {showTotal && (
        <div className="quote-bar-total">
          <span className="qbt-label">Total amount</span>
          <span className="qbt-amount">{fmt(total)}</span>
        </div>
      )}
      <button className="btn-edit-sm" onClick={() => s.goToScreen(1)}>Edit</button>
    </div>
  );
}
