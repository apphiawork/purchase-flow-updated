import { usePurchaseStore } from '../../store/usePurchaseStore';
import { formatDateDisplay, getDestinationLabel, getTripDays } from '../../store/selectors';
import { PlaneIcon, PinIcon, CalSmIcon } from '../icons';

export default function QuoteBar() {
  const s = usePurchaseStore();
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
    </div>
  );
}
