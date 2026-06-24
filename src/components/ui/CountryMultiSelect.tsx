import { useMemo, useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { ALL_COUNTRIES, POPULAR_COUNTRIES } from '../../data/countries';
import { ChevronDown } from '../icons';

const sectionLabel: React.CSSProperties = { padding: '6px 12px 4px', fontSize: 11, color: '#949494', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' };

export default function CountryMultiSelect() {
  const { selectedCountries, setSelectedCountries } = usePurchaseStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useOutsideClick<HTMLDivElement>(open, () => setOpen(false));

  const q = query.toLowerCase();
  const popular = useMemo(() => POPULAR_COUNTRIES.filter((c) => !q || c.toLowerCase().includes(q)), [q]);
  const all = useMemo(() => ALL_COUNTRIES.filter((c) => !POPULAR_COUNTRIES.includes(c) && (!q || c.toLowerCase().includes(q))), [q]);

  const toggle = (c: string) => {
    const i = selectedCountries.indexOf(c);
    setSelectedCountries(i === -1 ? [...selectedCountries, c] : selectedCountries.filter((x) => x !== c));
  };

  const hasSel = selectedCountries.length > 0;
  const label = hasSel ? selectedCountries.join(', ') : 'Select countries';

  const item = (c: string) => {
    const sel = selectedCountries.includes(c);
    return (
      <div key={c} onClick={() => toggle(c)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, cursor: 'pointer', background: '#fff' }}
        onMouseOver={(e) => (e.currentTarget.style.background = '#F6F8FC')} onMouseOut={(e) => (e.currentTarget.style.background = '#fff')}>
        <div style={{ width: 20, height: 20, borderRadius: 4, border: `1px solid ${sel ? '#005EB8' : 'rgba(0,0,0,.09)'}`, background: sel ? '#005EB8' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {sel && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="1 6 4.5 9.5 11 2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </div>
        <span style={{ fontSize: 16, color: '#212121' }}>{c}</span>
      </div>
    );
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', minWidth: 0 }}>
      <button onClick={() => setOpen((o) => !o)}
        style={{ width: '100%', minWidth: 0, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '0 14px', border: `1px solid ${open ? '#005EB8' : 'rgba(0,0,0,.09)'}`, borderRadius: 8, background: '#fff', fontFamily: "'Noto Sans',sans-serif", fontSize: 15, color: hasSel ? '#212121' : '#949494', cursor: 'pointer', textAlign: 'left', boxShadow: open ? '0 0 0 3px rgba(0,94,184,.2)' : 'none', transition: 'border-color .15s' }}>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        <ChevronDown style={{ flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : undefined }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,.05)', zIndex: 200, overflow: 'hidden' }}>
          <div style={{ padding: '0 12px', borderBottom: '1px solid #F6F8FC' }}>
            <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} autoFocus
              style={{ width: '100%', height: 48, border: 'none', outline: 'none', fontSize: 14, fontFamily: "'Noto Sans',sans-serif", color: '#212121', background: 'transparent' }} />
          </div>
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {!q && popular.length > 0 && <div style={sectionLabel}>Popular Destinations</div>}
            {!q && popular.map(item)}
            {all.length > 0 && !q && <div style={sectionLabel}>All Destinations (A to Z)</div>}
            {all.map(item)}
            {!popular.length && !all.length && <div style={{ padding: 12, fontSize: 14, color: '#949494', textAlign: 'center' }}>No destinations found</div>}
          </div>
        </div>
      )}
    </div>
  );
}
