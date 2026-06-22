import { useState } from 'react';
import { MONTH_NAMES, DAY_NAMES } from '../../data/constants';
import { ChevronDown } from '../icons';

function parseISO(iso: string): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
}
const toISO = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

/** Custom depart/return calendar popover with depart→return range tint (return only).
 *  Header month/year open picker views; days are zero-padded to match the design. */
export default function DateRangeCalendar({ which, departISO, selectedISO, onSelect }: {
  which: 'depart' | 'return';
  departISO: string;
  selectedISO: string;
  onSelect: (iso: string) => void;
}) {
  const now = new Date();
  const [view, setView] = useState<{ year: number; month: number; mode: 'days' | 'months' | 'years' }>(
    { year: now.getFullYear(), month: now.getMonth(), mode: 'days' });

  const nav = (dir: number) => setView((v) => {
    let month = v.month + dir, year = v.year;
    if (month > 11) { month = 0; year++; }
    if (month < 0) { month = 11; year--; }
    return { ...v, year, month };
  });

  const { year, month, mode } = view;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const depDate = which === 'return' ? parseISO(departISO) : null;
  const selected = parseISO(selectedISO);

  const cells: React.ReactNode[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} />);
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day); date.setHours(0, 0, 0, 0);
    const isPast = date < today;
    const isSel = !!selected && date.getTime() === selected.getTime();
    const isDepart = !!depDate && date.getTime() === depDate.getTime();
    const hasRange = !!depDate && !!selected && selected > depDate;
    const inRange = hasRange && date > depDate! && date < selected!;

    let cellBg: React.CSSProperties = {};
    if (inRange) cellBg = { background: '#E8F1FB' };
    else if (hasRange && isDepart) cellBg = { background: 'linear-gradient(90deg,transparent 50%,#E8F1FB 50%)' };
    else if (hasRange && isSel) cellBg = { background: 'linear-gradient(90deg,#E8F1FB 50%,transparent 50%)' };

    const inner: React.CSSProperties = {
      width: 34, height: 34, margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '50%', fontSize: 13, cursor: isPast ? 'default' : 'pointer',
    };
    if (isSel || isDepart) Object.assign(inner, { background: '#005EB8', color: '#fff', fontWeight: 600 });
    else if (isPast) inner.color = '#BDBDBD';
    else inner.color = '#212121';

    const clickable = !isPast && !isDepart;
    cells.push(
      <div key={day} style={{ ...cellBg, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 34 }}>
        <div style={inner} onClick={clickable ? () => onSelect(toISO(year, month, day)) : undefined}>{String(day).padStart(2, '0')}</div>
      </div>,
    );
  }

  const years: number[] = [];
  for (let y = now.getFullYear(); y <= now.getFullYear() + 11; y++) years.push(y);

  return (
    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 300, background: '#fff', border: '3px solid rgba(0,94,184,.2)', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,.05)', padding: 10, width: 268 }}
      onMouseDown={(e) => e.stopPropagation()}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#005EB8', borderRadius: 6, padding: '8px 10px', marginBottom: 8 }}>
        <button onClick={() => nav(-1)} style={navBtn}>‹</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={() => setView((v) => ({ ...v, mode: v.mode === 'months' ? 'days' : 'months' }))} style={headerBtn}>{MONTH_NAMES[month]} <ChevronDown stroke="#fff" size={12} /></button>
          <button onClick={() => setView((v) => ({ ...v, mode: v.mode === 'years' ? 'days' : 'years' }))} style={headerBtn}>{year} <ChevronDown stroke="#fff" size={12} /></button>
        </div>
        <button onClick={() => nav(1)} style={navBtn}>›</button>
      </div>

      {mode === 'months' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, padding: 4 }}>
          {MONTH_NAMES.map((mn, i) => (
            <button key={mn} onClick={() => setView((v) => ({ ...v, month: i, mode: 'days' }))} style={cellBtn(i === month)}>{mn.slice(0, 3)}</button>
          ))}
        </div>
      )}

      {mode === 'years' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, padding: 4, maxHeight: 220, overflowY: 'auto' }}>
          {years.map((y) => (
            <button key={y} onClick={() => setView((v) => ({ ...v, year: y, mode: 'months' }))} style={cellBtn(y === year, 8)}>{y}</button>
          ))}
        </div>
      )}

      {mode === 'days' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', marginBottom: 4 }}>
            {DAY_NAMES.map((d) => <div key={d} style={{ fontSize: 11, color: '#949494', fontWeight: 600, padding: '3px 0' }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px 0' }}>{cells}</div>
        </>
      )}
    </div>
  );
}

const navBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 18, lineHeight: 1, padding: '0 4px' };
const headerBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 };
const cellBtn = (sel: boolean, padV = 10): React.CSSProperties => ({
  padding: `${padV}px 4px`, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13,
  fontFamily: "'Noto Sans',sans-serif", background: sel ? '#005EB8' : '#fff', color: sel ? '#fff' : '#212121',
});
