import { useCallback, useEffect, useRef, useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { dayLabel, prexAvailable, tripDetailsComplete, tripDurationDays } from '../../store/selectors';
import { MAX_TRAVELLERS } from '../../data/constants';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import SiteHeader from '../flow/SiteHeader';
import DateInput from '../flow/DateInput';
import Footer from '../layout/Footer';
import DestTypeDropdown from '../ui/DestTypeDropdown';
import CountryMultiSelect from '../ui/CountryMultiSelect';
import DateRangeCalendar from '../ui/DateRangeCalendar';
import Stepper from '../ui/Stepper';

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const PlaneIcon = ({ on }: { on: boolean }) => (
  <svg width="18" height="18" viewBox="28 25 19 16" fill={on ? '#005EB8' : '#6E6E6E'} aria-hidden="true"><path d="M30.4997 40.5V38.8333H45.4997V40.5H30.4997ZM31.958 36.3333L28.833 31.125L30.833 30.5833L33.1663 32.5417L36.083 31.7708L31.7705 26.0208L34.1872 25.375L40.4163 30.6042L43.958 29.6458C44.4025 29.5208 44.8227 29.5728 45.2188 29.8017C45.615 30.0306 45.8752 30.3675 45.9997 30.8125C46.1241 31.2575 46.0722 31.6778 45.8438 32.0733C45.6155 32.4689 45.2786 32.7292 44.833 32.8542L31.958 36.3333Z" /></svg>
);
const CalendarIcon = ({ on }: { on: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={on ? '#005EB8' : '#6E6E6E'} aria-hidden="true"><path d="M4 1h1.5v1.5h5V1H12v1.5h1.5A1.5 1.5 0 0 1 15 4v9.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5V4a1.5 1.5 0 0 1 1.5-1.5H4V1Zm-1.5 5v7.5h11V6h-11Z" /></svg>
);

/** One date field with its calendar popover; the popover closes on outside click. */
function TripDate({ which, label }: { which: 'depart' | 'return'; label: string }) {
  const s = usePurchaseStore();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useOutsideClick<HTMLDivElement>(open, close);
  const annualReturn = which === 'return' && s.tripType === 'annual';
  const iso = which === 'depart' ? s.departDate : s.returnDate;
  const set = which === 'depart' ? s.setDepartDate : s.setReturnDate;
  const validate = (v: string) => {
    if (which === 'depart') return v < todayISO() ? 'Departure date can’t be in the past' : null;
    return s.departDate && v < s.departDate ? 'Return date can’t be earlier than the departure date' : null;
  };
  // Picking a departure date moves straight on to the return date (single trips).
  useEffect(() => {
    const h = () => { if (which === 'return' && !annualReturn) setOpen(true); };
    window.addEventListener('uf:open-return', h);
    return () => window.removeEventListener('uf:open-return', h);
  }, [which, annualReturn]);
  const pick = (v: string) => {
    set(v); setOpen(false);
    if (which === 'depart' && s.tripType === 'single' && !s.returnDate) setTimeout(() => window.dispatchEvent(new Event('uf:open-return')), 0);
  };
  return (
    <div className="f-field" ref={ref}>
      <label className="f-label" htmlFor={`date-${which}`}>{label}</label>
      <DateInput id={`date-${which}`} value={iso} onChange={pick} validate={validate} disabled={annualReturn}
        open={open} onOpen={() => setOpen(true)} onToggle={() => setOpen((o) => !o)} />
      {open && !annualReturn && <DateRangeCalendar which={which} departISO={s.departDate} selectedISO={iso} onSelect={pick} />}
    </div>
  );
}

/** Get Quote (Figma 7318:110631 → 7286:37920). Trip details first; once complete, Cover and travellers
 *  appears and the page scrolls to it. Standard cover with 1 adult is the default. */
export default function Screen1Quote() {
  const s = usePurchaseStore();
  const single = s.tripType === 'single';
  const ready = tripDetailsComplete(s);
  const coverRef = useRef<HTMLElement>(null);
  const wasReady = useRef(ready);
  const days = tripDurationDays(s);

  useEffect(() => {
    if (ready && !wasReady.current && coverRef.current) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      requestAnimationFrame(() => coverRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' }));
    }
    wasReady.current = ready;
  }, [ready]);

  const total = s.adults + s.children;
  return (
    <div className="f-screen">
      <SiteHeader />
      <section className="f-hero">
        <img src="/bg-image.jpg" alt="" />
        <div className="f-wide">
          <h1>Travel worry-free with UniTravel</h1>
          <p>Get an instant quote and buy in about 5 minutes</p>
          <div className="f-badges">
            <span className="f-badge-promo">🎉 60% off auto-applied | Ends 31 Dec</span>
            <span className="f-badge-trust">
              <span className="f-rating">
                <img className="g" src="/icons/google-g.png" alt="Google" />
                4.3
                <span className="f-stars" role="img" aria-label="Rated 4.3 out of 5">
                  {[0, 1, 2, 3].map((i) => <img key={i} src="/icons/star.svg" alt="" />)}
                  <img src="/icons/star-partial.svg" alt="" />
                </span>
              </span>
              <span className="f-sep" />
              <span className="f-member"><img src="/icons/uob-shield.svg" alt="" />Member of the UOB Group</span>
            </span>
          </div>
        </div>
      </section>

      <div className="f-wrap f-stack">
        <section className="f-card">
          <h2 className="f-card-title">Trip details</h2>
          <div className="f-seg" role="radiogroup" aria-label="Trip type">
            <button type="button" role="radio" aria-checked={single} className={single ? 'on' : ''} onClick={() => s.setTripType('single')}><PlaneIcon on={single} /> Single trip</button>
            <button type="button" role="radio" aria-checked={!single} className={!single ? 'on' : ''} onClick={() => s.setTripType('annual')}><CalendarIcon on={!single} /> Annual trip</button>
          </div>
          <div className="f-row">
            <div className="f-field"><span className="f-label">Where are you travelling?</span><DestTypeDropdown /></div>
            {single && s.destination === 'countries' && <div className="f-field"><span className="f-label">Which countries?</span><CountryMultiSelect /></div>}
          </div>
          <div>
            <div className="f-row">
              <TripDate which="depart" label="When are you departing Singapore?" />
              <TripDate which="return" label="When are you arriving in Singapore?" />
            </div>
            <p className="f-hint" style={{ marginTop: 8 }}>
              {single ? `Total trip duration: ${days != null ? dayLabel(days) : '0 day(s)'}` : 'Return date is auto-set to 365 days from departure for annual cover'}
            </p>
          </div>
        </section>

        {ready && (
          <section className="f-card f-reveal f-anchor" ref={coverRef}>
            <h2 className="f-card-title">Cover and travellers</h2>
            <div className="f-field">
              <span className="f-label">Choose your cover</span>
              <div className="f-seg" role="radiogroup" aria-label="Cover">
                <button type="button" role="radio" aria-checked={s.coverType === 'standard'} className={s.coverType === 'standard' ? 'on' : ''} onClick={() => s.setCoverType('standard')}>Standard</button>
                <button type="button" role="radio" aria-checked={s.coverType === 'prex'} className={s.coverType === 'prex' ? 'on' : ''} disabled={!prexAvailable(s)} onClick={() => s.setCoverType('prex')}>Pre-existing Conditions</button>
              </div>
              <p className="f-hint">
                {prexAvailable(s)
                  ? <>Standard and Pre-existing Conditions are separate plans. If you need both, buy each one separately. View list of conditions <a href="https://www.uoi.com.sg/" target="_blank" rel="noreferrer" className="f-link">here</a>.</>
                  : 'Pre-existing Conditions cover is only available for Single Trip policies'}
              </p>
            </div>
            <div className="f-field">
              <span className="f-label">How many travellers?</span>
              <div className="f-row">
                <div className="f-field">
                  <span className="f-label">Adult(s)</span>
                  <div className="f-wide-stepper"><Stepper value={s.adults} minusDisabled={s.adults <= 1} plusDisabled={total >= MAX_TRAVELLERS}
                    onMinus={() => s.adjustTravellers('adults', -1)} onPlus={() => s.adjustTravellers('adults', 1)} /></div>
                </div>
                <div className="f-field">
                  <span className="f-label">Child(ren) <span style={{ color: 'var(--f-muted)' }}>(&lt;16 years old)</span></span>
                  <div className="f-wide-stepper"><Stepper value={s.children} minusDisabled={s.children <= 0} plusDisabled={total >= MAX_TRAVELLERS}
                    onMinus={() => s.adjustTravellers('children', -1)} onPlus={() => s.adjustTravellers('children', 1)} /></div>
                </div>
              </div>
            </div>
          </section>
        )}
        {ready && <div className="f-cta-row f-reveal"><button type="button" className="f-btn f-btn-primary" onClick={s.checkPrice}>Check Price</button></div>}
      </div>
      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  );
}
