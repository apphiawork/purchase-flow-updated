import { Fragment } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { getDestinationLabel, isPrexPolicy, travellersLabel, tripDatesLabel, tripTypeLabel } from '../../store/selectors';

/** Trip bar under the nav on Select Plan, Add-Ons and Traveller Details (Figma 7386:27453).
 *  Edit returns to Get Quote with everything still filled in. On phones only destination and dates show. */
export default function TripBar() {
  const s = usePurchaseStore();
  const items: { key: string; icon: string; text: string }[] = [
    { key: 'type', icon: 'trip-type', text: tripTypeLabel(s) },
    { key: 'dest', icon: 'trip-destination', text: getDestinationLabel(s) },
    { key: 'dates', icon: 'trip-dates', text: tripDatesLabel(s) },
    { key: 'who', icon: 'trip-travellers', text: travellersLabel(s) },
    { key: 'cover', icon: 'trip-cover', text: isPrexPolicy(s) ? 'Pre-existing Conditions cover' : 'Standard cover' },
  ];
  return (
    <div className="f-tripbar">
      <div className="f-wrap">
        <ul className="f-trip-items" aria-label="Your trip">
          {items.map((it, i) => (
            <Fragment key={it.key}>
              {i > 0 && <li className={`f-trip-sep f-trip-${it.key}`} aria-hidden="true" />}
              <li className={`f-trip-item f-trip-${it.key}`}><img src={`/icons/${it.icon}.svg`} alt="" width={16} height={16} />{it.text}</li>
            </Fragment>
          ))}
        </ul>
        <button type="button" className="f-btn-sm" onClick={() => s.goToScreen(1)} aria-label="Edit trip details">Edit</button>
      </div>
    </div>
  );
}
