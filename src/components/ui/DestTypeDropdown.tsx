import { useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { ChevronDown } from '../icons';

const REGION_OPTIONS: { type: string; label: string; desc: string }[] = [
  { type: 'asean', label: 'ASEAN', desc: 'Covers Brunei, Cambodia, Indonesia, Laos, Malaysia, Myanmar, Philippines, Thailand and Vietnam' },
  { type: 'asia', label: 'Asia, Australia, New Zealand', desc: 'Covers ASEAN countries, Australia, China (excluding Tibet), Hong Kong, India, Japan, South Korea, Macau, New Zealand, Sri Lanka and Taiwan' },
  { type: 'worldwide', label: 'Worldwide', desc: 'Covers all countries outside Singapore except Afghanistan, Iran, Iraq, Libya, Nepal, North Korea, Sudan, Syria, Democratic Republic of Congo, Somalia and Yemen' },
];

const DEST_LABELS: Record<string, string> = {
  countries: 'One or more countries', asean: 'ASEAN', asia: 'Asia, Australia, New Zealand', worldwide: 'Worldwide',
};

const itemBtn: React.CSSProperties = { width: '100%', textAlign: 'left', border: 'none', background: '#fff', fontFamily: "'Noto Sans',sans-serif", color: '#212121', cursor: 'pointer', transition: 'background .1s' };

export default function DestTypeDropdown({ invalid }: { invalid?: boolean }) {
  const { destination, setDestination } = usePurchaseStore();
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(open, () => setOpen(false));

  const select = (type: string) => { setDestination(type); setOpen(false); };
  const borderColor = open ? '#005EB8' : invalid ? '#991B1B' : 'rgba(0,0,0,.09)';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)} id="dest-type-btn"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', border: `1px solid ${borderColor}`, borderRadius: 8, background: '#fff', fontFamily: "'Noto Sans',sans-serif", fontSize: 15, color: destination ? '#212121' : '#949494', cursor: 'pointer', textAlign: 'left', boxShadow: open ? '0 0 0 3px rgba(0,94,184,.2)' : 'none', transition: 'border-color .15s' }}>
        <span>{destination ? DEST_LABELS[destination] : 'Select destination(s)'}</span>
        <ChevronDown style={{ flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : undefined }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,.05)', zIndex: 200, overflow: 'hidden' }}>
          <div style={{ padding: '8px 0' }}>
            <div style={{ padding: '6px 14px 4px', fontSize: 12, color: '#949494' }}>Select Specific Countries</div>
            <button onClick={() => select('countries')} style={{ ...itemBtn, padding: '10px 14px', fontSize: 16, fontWeight: 400 }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#F6F8FC')} onMouseOut={(e) => (e.currentTarget.style.background = '#fff')}>One or more countries</button>
            <div style={{ padding: '10px 14px 4px', fontSize: 12, color: '#949494' }}>Select Region</div>
            {REGION_OPTIONS.map((o) => (
              <button key={o.type} onClick={() => select(o.type)} style={{ ...itemBtn, padding: '8px 14px', fontSize: 16 }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#F6F8FC')} onMouseOut={(e) => (e.currentTarget.style.background = '#fff')}>
                <div style={{ fontWeight: 500, fontSize: 16 }}>{o.label}</div>
                <div style={{ fontSize: 16, color: '#212121', lineHeight: 1.5, marginTop: 4 }}>{o.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
