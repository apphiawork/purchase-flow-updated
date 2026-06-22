import { useState } from 'react';
import { MONTH_NAMES, DAY_NAMES } from '../../data/constants';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { CalFieldIcon, ChevronDown } from '../icons';

const pad = (n: number) => String(n).padStart(2, '0');

/** Date-of-birth field with anchored popover (days / months / years views). */
export default function DobField({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(open, () => setOpen(false));

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const initYear = value ? Number(value.split('-')[0]) : today.getFullYear() - 30;
  const initMonth = value ? Number(value.split('-')[1]) - 1 : 0;
  const [nav, setNav] = useState({ year: initYear, month: initMonth, view: 'days' as 'days' | 'months' | 'years' });

  const openPicker = () => {
    setNav(value
      ? { year: Number(value.split('-')[0]), month: Number(value.split('-')[1]) - 1, view: 'days' }
      : { year: today.getFullYear() - 30, month: 0, view: 'days' });
    setOpen(true);
  };

  const stepMonth = (d: number) => setNav((s) => {
    let month = s.month + d, year = s.year;
    if (month < 0) { month = 11; year--; }
    if (month > 11) { month = 0; year++; }
    return { ...s, month, year };
  });

  const pick = (y: number, m: number, d: number) => { onChange(`${y}-${pad(m + 1)}-${pad(d)}`); setOpen(false); };

  const display = value ? `${value.split('-')[2]}/${value.split('-')[1]}/${value.split('-')[0]}` : 'Select Date';

  const { year, month, view } = nav;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div className="date-field" onClick={openPicker}>
        <span className={`date-val ${value ? 'filled' : ''}`}>{display}</span>
        <CalFieldIcon />
      </div>
      {open && (
        <div style={{ position: 'absolute', zIndex: 1200, top: 'calc(100% + 6px)', left: 0, background: '#fff', border: '3px solid rgba(0,94,184,.2)', borderRadius: 8, boxShadow: '0 8px 28px rgba(0,0,0,.16)', padding: 10, width: 288 }}
          onMouseDown={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#005EB8', borderRadius: 6, padding: '8px 8px', marginBottom: 8 }}>
            <button onClick={() => stepMonth(-1)} style={navBtn}>‹</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setNav((s) => ({ ...s, view: 'months' }))} style={headerBtn}>{MONTH_NAMES[month]} <ChevronDown stroke="#fff" size={11} /></button>
              <button onClick={() => setNav((s) => ({ ...s, view: 'years' }))} style={headerBtn}>{year} <ChevronDown stroke="#fff" size={11} /></button>
            </div>
            <button onClick={() => stepMonth(1)} style={navBtn}>›</button>
          </div>

          {view === 'months' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, padding: 4 }}>
              {MONTH_NAMES.map((mn, i) => (
                <button key={mn} onClick={() => setNav((s) => ({ ...s, month: i, view: 'days' }))} style={cellBtn(i === month)}>{mn.slice(0, 3)}</button>
              ))}
            </div>
          )}

          {view === 'years' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, padding: 4, maxHeight: 220, overflowY: 'auto' }}>
              {yearsDesc(today.getFullYear()).map((yr) => (
                <button key={yr} onClick={() => setNav((s) => ({ ...s, year: yr, view: 'months' }))} style={cellBtn(yr === year, 8)}>{yr}</button>
              ))}
            </div>
          )}

          {view === 'days' && <DaysGrid year={year} month={month} value={value} today={today} onPick={pick} />}
        </div>
      )}
    </div>
  );
}

function DaysGrid({ year, month, value, today, onPick }: {
  year: number; month: number; value: string; today: Date; onPick: (y: number, m: number, d: number) => void;
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} />);
  for (let d = 1; d <= days; d++) {
    const date = new Date(year, month, d); date.setHours(0, 0, 0, 0);
    const future = date > today;
    const isSel = value === `${year}-${pad(month + 1)}-${pad(d)}`;
    const st: React.CSSProperties = {
      width: 32, height: 32, margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '50%', fontSize: 13, cursor: future ? 'default' : 'pointer',
    };
    if (isSel) Object.assign(st, { background: '#005EB8', color: '#fff', fontWeight: 600 });
    else if (future) st.color = '#BDBDBD';
    else st.color = '#212121';
    cells.push(<div key={d} style={st} onClick={future ? undefined : () => onPick(year, month, d)}>{d}</div>);
  }
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', marginBottom: 4 }}>
        {DAY_NAMES.map((d) => <div key={d} style={{ fontSize: 11, color: '#949494', fontWeight: 600, padding: '3px 0' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>{cells}</div>
    </>
  );
}

function yearsDesc(nowY: number): number[] {
  const out: number[] = [];
  for (let yr = nowY; yr >= 1920; yr--) out.push(yr);
  return out;
}

const navBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 18, lineHeight: 1, padding: '2px 6px' };
const headerBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 };
const cellBtn = (sel: boolean, padV = 10): React.CSSProperties => ({
  padding: `${padV}px 4px`, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13,
  fontFamily: "'Noto Sans',sans-serif", background: sel ? '#005EB8' : '#fff', color: sel ? '#fff' : '#212121',
});
