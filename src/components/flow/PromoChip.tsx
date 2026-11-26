import { PROMO_CODE } from '../../data/constants';

/** Applied promo-code chip (green, as in the summary card and landing). */
export default function PromoChip({ onRemove }: { onRemove?: () => void }) {
  return (
    <span className="f-chip">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M14.67 1.33 15.21 8.34 7.92 15.62.38 8.08 7.66.79l7.01.54ZM8.86 4.31a1.99 1.99 0 1 0 2.82 2.82 1.99 1.99 0 0 0-2.82-2.82Z" fill="#fff" /></svg>
      {PROMO_CODE}
      <button type="button" onClick={onRemove} aria-label="Remove promo code">×</button>
    </span>
  );
}
