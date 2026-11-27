import { Fragment, useLayoutEffect, useRef } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { destinationShort, getDestinationLabel, isPrexPolicy, travellersLabel, tripDatesLabel, tripTypeLabel } from '../../store/selectors';

/** Trip bar under the nav on Select Plan, Add-Ons and Traveller Details (Figma 7386:27453).
 *  Edit returns to Get Quote with everything still filled in. Long destination lists are shortened to
 *  "A, B +N more" (full list on hover); if the items still don't fit they wrap to a second line.
 *  On phones only destination and dates show. */
export default function TripBar() {
  const s = usePurchaseStore();
  // When the items wrap, hide any divider that ends up at the end or start of a line.
  const listRef = useRef<HTMLUListElement>(null);
  useLayoutEffect(() => {
    const ul = listRef.current;
    if (!ul) return;
    const tidy = () => ul.querySelectorAll<HTMLElement>('.f-trip-sep').forEach((sep) => {
      const prev = sep.previousElementSibling as HTMLElement | null, next = sep.nextElementSibling as HTMLElement | null;
      sep.style.visibility = prev && next && prev.offsetTop === next.offsetTop ? '' : 'hidden';
    });
    tidy();
    const ro = new ResizeObserver(tidy);
    ro.observe(ul);
    return () => ro.disconnect();
  });
  const items: { key: string; icon: string; text: string; full?: string }[] = [
    { key: 'type', icon: 'trip-type', text: tripTypeLabel(s) },
    { key: 'dest', icon: 'trip-destination', text: destinationShort(s), full: getDestinationLabel(s) },
    { key: 'dates', icon: 'trip-dates', text: tripDatesLabel(s) },
    { key: 'who', icon: 'trip-travellers', text: travellersLabel(s) },
    { key: 'cover', icon: 'trip-cover', text: isPrexPolicy(s) ? 'Pre-existing Conditions cover' : 'Standard cover' },
  ];
  return (
    <div className="f-tripbar">
      <div className="f-wrap">
        <ul className="f-trip-items" aria-label="Your trip" ref={listRef}>
          {items.map((it, i) => (
            <Fragment key={it.key}>
              {i > 0 && <li className={`f-trip-sep f-trip-${it.key}`} aria-hidden="true" />}
              <li className={`f-trip-item f-trip-${it.key}`} title={it.full && it.full !== it.text ? it.full : undefined}><img src={`/icons/${it.icon}.svg`} alt="" width={16} height={16} />{it.text}</li>
            </Fragment>
          ))}
        </ul>
        <button type="button" className="f-btn-sm" onClick={() => s.goToScreen(1)} aria-label="Edit trip details">Edit</button>
      </div>
    </div>
  );
}
