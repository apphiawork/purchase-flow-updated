// The "add-small" stepper from raw (Figma 4021:9547).
const MinusIcon = () => (
  <svg viewBox="0 0 16 16" fill="none"><path d="M3.333 8h9.334" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 16 16" fill="none"><path d="M8 3.333v9.334M3.333 8h9.334" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
);

export default function Stepper({ value, onMinus, onPlus, minusDisabled, plusDisabled }: {
  value: number;
  onMinus: () => void;
  onPlus: () => void;
  minusDisabled?: boolean;
  plusDisabled?: boolean;
}) {
  return (
    <div className="add-small">
      <button className="as-btn as-minus" disabled={minusDisabled} onClick={onMinus} aria-label="decrease"><MinusIcon /></button>
      <span className="as-val">{value}</span>
      <button className="as-btn as-plus" disabled={plusDisabled} onClick={onPlus} aria-label="increase"><PlusIcon /></button>
    </div>
  );
}
