import { useEffect, useState } from 'react';
import { formatDateDisplay, maskDateInput, parseDisplayDate } from '../../store/selectors';
import { CalFieldIcon } from '../icons';

/** Typeable DD/MM/YYYY box with a calendar toggle. A complete, valid date is committed as you type;
 *  an invalid one shows `validate`'s message and reverts on blur. */
export default function DateInput({ value, onChange, validate, open, onOpen, onToggle, disabled = false, id }: {
  value: string;
  onChange: (iso: string) => void;
  validate?: (iso: string) => string | null;
  open: boolean;
  onOpen: () => void;
  onToggle: () => void;
  disabled?: boolean;
  id?: string;
}) {
  const shown = value ? formatDateDisplay(value) : '';
  const [draft, setDraft] = useState(shown);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { setDraft(shown); setError(null); }, [shown]);

  const check = (text: string): string | null => {
    if (text.length < 10) return null;
    const iso = parseDisplayDate(text);
    if (!iso) return 'Enter a valid date in DD/MM/YYYY';
    return validate?.(iso) ?? null;
  };
  const onType = (raw: string) => {
    const text = maskDateInput(raw);
    setDraft(text);
    const msg = check(text);
    setError(msg);
    const iso = parseDisplayDate(text);
    if (iso && !msg && iso !== value) onChange(iso);
  };
  const onBlur = () => { if (draft.length < 10 || check(draft)) { setDraft(shown); setError(null); } };

  return (
    <>
      <div className={`f-box ${open ? 'open' : ''} ${disabled ? 'disabled' : ''}`}>
        <input id={id} type="text" inputMode="numeric" placeholder="DD/MM/YYYY" value={draft} disabled={disabled} maxLength={10} autoComplete="off"
          onFocus={disabled ? undefined : onOpen} onClick={disabled ? undefined : onOpen}
          onChange={(e) => onType(e.target.value)} onBlur={onBlur} />
        <button type="button" className="f-icon-btn" onClick={onToggle} disabled={disabled} tabIndex={-1} aria-label={open ? 'Close calendar' : 'Open calendar'}><CalFieldIcon /></button>
      </div>
      {error && <span className="f-error">{error}</span>}
    </>
  );
}
