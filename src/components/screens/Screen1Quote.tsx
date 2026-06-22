import { useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { formatDateDisplay } from '../../store/selectors';
import Logo from '../Logo';
import { HelpIcon, CalFieldIcon } from '../icons';
import DestTypeDropdown from '../ui/DestTypeDropdown';
import CountryMultiSelect from '../ui/CountryMultiSelect';
import DateRangeCalendar from '../ui/DateRangeCalendar';

const fieldBtn = (open: boolean, filled: boolean): React.CSSProperties => ({
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px',
  border: `1px solid ${open ? '#005EB8' : 'rgba(0,0,0,.09)'}`, borderRadius: 8, background: '#fff',
  fontFamily: "'Noto Sans',sans-serif", fontSize: 15, color: filled ? '#212121' : '#949494', cursor: 'pointer',
  textAlign: 'left', boxShadow: open ? '0 0 0 3px rgba(0,94,184,.2)' : 'none', transition: 'border-color .15s',
});

export default function Screen1Quote() {
  const s = usePurchaseStore();
  const [openCal, setOpenCal] = useState<'depart' | 'return' | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);

  const tab = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 24px', borderRadius: 24, border: 'none', cursor: 'pointer',
    fontFamily: "'Noto Sans',sans-serif", fontSize: 16, fontWeight: active ? 500 : 400,
    color: active ? '#005EB8' : '#6E6E6E',
    background: active ? 'linear-gradient(90deg,rgba(51,133,230,.12),rgba(51,133,230,.12)),#fff' : 'transparent',
    position: 'relative', transition: '.15s',
  });

  const singleActive = s.tripType === 'single';

  const applyPromo = () => {
    if (promoInput.trim().toUpperCase() === 'TRAVEL60') { s.applyPromo(); setPromoError(false); }
    else { setPromoError(true); setTimeout(() => setPromoError(false), 2000); }
  };

  return (
    <div id="screen1" className="screen active" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,.09)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, height: 54 }}>
        <Logo />
        <a href="#" onClick={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: '#949494', textDecoration: 'none' }}>
          <HelpIcon /> Need Assistance?
        </a>
      </header>

      {/* Hero + form */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '52px 24px 64px' }}>
        <img src="/bg.png" alt="Travel" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1000, display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Banner */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'linear-gradient(90deg,#005EB8 0.618%,#5C55EB)', borderRadius: 24, padding: '4px 8px', width: 'fit-content' }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap' }}>🎉 60% off auto-applied! | Promo ends 31 May</span>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1.2, margin: 0 }}>Ready to protect your adventures with UniTravel?</h1>
            <p style={{ fontSize: 16, fontWeight: 500, color: '#fff', lineHeight: 1.5, margin: 0 }}>Travel with peace of mind with UOI, trusted protection with millions paid in claims.</p>
          </div>

          {/* Form card */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.08)', padding: 24, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-end' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Trip type toggle */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: 4, border: '1px solid rgba(0,0,0,.09)', borderRadius: 24, alignSelf: 'flex-start' }}>
                <button onClick={() => s.setTripType('single')} style={tab(singleActive)}>
                  <svg width="20" height="20" viewBox="28 25 19 16" fill={singleActive ? '#005EB8' : '#6E6E6E'}><path d="M30.4997 40.5V38.8333H45.4997V40.5H30.4997ZM31.958 36.3333L28.833 31.125L30.833 30.5833L33.1663 32.5417L36.083 31.7708L31.7705 26.0208L34.1872 25.375L40.4163 30.6042L43.958 29.6458C44.4025 29.5208 44.8227 29.5728 45.2188 29.8017C45.615 30.0306 45.8752 30.3675 45.9997 30.8125C46.1241 31.2575 46.0722 31.6778 45.8438 32.0733C45.6155 32.4689 45.2786 32.7292 44.833 32.8542L31.958 36.3333Z" /></svg>
                  Single Trip
                </button>
                <button onClick={() => s.setTripType('annual')} style={tab(!singleActive)}>
                  <svg width="20" height="20" viewBox="191 24 19 20" fill={!singleActive ? '#005EB8' : '#6E6E6E'}><path d="M206.5 32.9993V27.9993C206.5 27.0827 205.75 26.3327 204.833 26.3327H204V25.4993C204 25.041 203.625 24.666 203.167 24.666C202.708 24.666 202.333 25.041 202.333 25.4993V26.3327H195.667V25.4993C195.667 25.041 195.292 24.666 194.833 24.666C194.375 24.666 194 25.041 194 25.4993V26.3327H193.167C192.25 26.3327 191.5 27.0827 191.5 27.9993V39.666C191.5 40.5827 192.25 41.3327 193.167 41.3327H199V39.666H193.167V31.3327H204.833V32.9993H206.5ZM201.608 39.666C201.15 39.666 200.85 40.1327 201.042 40.5493C201.371 41.2795 201.903 41.8991 202.576 42.3337C203.249 42.7683 204.033 42.9994 204.833 42.9993C207.133 42.9993 209 41.1327 209 38.8327C209 36.5327 207.133 34.666 204.833 34.666C203.7 34.666 202.667 35.1243 201.917 35.8577V35.291C201.917 34.9493 201.633 34.666 201.292 34.666C200.95 34.666 200.667 34.9493 200.667 35.291V37.166C200.667 37.6243 201.042 37.9993 201.5 37.9993H203.375C203.717 37.9993 204 37.716 204 37.3743C204 37.0327 203.717 36.7493 203.375 36.7493H202.792C203.317 36.2327 204.042 35.916 204.833 35.916C206.442 35.916 207.75 37.2243 207.75 38.8327C207.75 40.441 206.442 41.7493 204.833 41.7493C203.65 41.7493 202.633 41.041 202.175 40.0327C202.126 39.9237 202.046 39.8313 201.945 39.7663C201.845 39.7013 201.728 39.6665 201.608 39.666Z" /></svg>
                  Annual Trip
                  <span style={{ position: 'absolute', top: -13, right: -4, background: '#6CD999', color: '#fff', fontSize: 12, fontWeight: 500, padding: '4px 8px', borderRadius: '12px 12px 12px 0', whiteSpace: 'nowrap', pointerEvents: 'none' }}>SAVE 40%</span>
                </button>
              </div>

              {/* Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Destination row */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
                    <label style={{ fontSize: 14, color: '#212121' }}>Where are you travelling?</label>
                    <DestTypeDropdown />
                  </div>
                  {s.destination === 'countries' && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
                      <label style={{ fontSize: 14, color: '#212121' }}>Select country(s)</label>
                      <CountryMultiSelect />
                    </div>
                  )}
                </div>

                {/* Date row */}
                <div style={{ display: 'flex', gap: 16, width: '100%' }}>
                  {(['depart', 'return'] as const).map((which) => {
                    const iso = which === 'depart' ? s.departDate : s.returnDate;
                    const setIso = which === 'depart' ? s.setDepartDate : s.setReturnDate;
                    return (
                      <div key={which} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
                        <label style={{ fontSize: 14, color: '#212121' }}>
                          {which === 'depart' ? 'When are you departing Singapore?' : 'When are you arriving in Singapore?'}
                        </label>
                        <button onClick={() => setOpenCal((o) => (o === which ? null : which))} style={fieldBtn(openCal === which, !!iso)}>
                          <span>{iso ? formatDateDisplay(iso) : 'DD/MM/YYYY'}</span>
                          <CalFieldIcon />
                        </button>
                        {openCal === which && (
                          <DateRangeCalendar which={which} departISO={s.departDate} selectedISO={iso}
                            onSelect={(v) => { setIso(v); setOpenCal(null); }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ width: '100%', height: 1, background: '#F6F8FC' }} />

            {/* Promo + agent */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', width: 320 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', width: '100%' }}>
                  {s.promoApplied ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 48, background: '#fff', border: '1px solid rgba(0,0,0,.09)', borderRadius: 8, padding: '0 8px 0 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F5F5F5', borderRadius: 8, padding: '4px 8px' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.9827 5.016C10.7951 4.8284 10.5406 4.72301 10.2753 4.72301C10.01 4.72301 9.7556 4.8284 9.568 5.016C9.3804 5.2036 9.27501 5.45803 9.27501 5.72333C9.27501 5.98863 9.3804 6.24307 9.568 6.43067C9.7556 6.61826 10.01 6.72365 10.2753 6.72365C10.5406 6.72365 10.7951 6.61826 10.9827 6.43067C11.1703 6.24307 11.2757 5.98863 11.2757 5.72333C11.2757 5.45803 11.1703 5.2036 10.9827 5.016Z" fill="#949494" /><path d="M14.6687 1.332L15.2073 8.33533L7.91933 15.6233L0.376667 8.08067L7.66467 0.793333L14.6687 1.332ZM8.86133 4.30933C8.67315 4.49452 8.5235 4.71512 8.42101 4.95843C8.31852 5.20174 8.26521 5.46293 8.26417 5.72694C8.26312 5.99096 8.31436 6.25256 8.41493 6.49667C8.51549 6.74078 8.6634 6.96257 8.85011 7.14923C9.03681 7.33589 9.25863 7.48374 9.50277 7.58425C9.7469 7.68476 10.0085 7.73594 10.2725 7.73483C10.5365 7.73373 10.7977 7.68036 11.041 7.57781C11.2843 7.47526 11.5049 7.32556 11.69 7.13733C12.06 6.76119 12.2663 6.25408 12.2641 5.72647C12.2619 5.19886 12.0513 4.6935 11.6782 4.32047C11.3051 3.94744 10.7997 3.73695 10.2721 3.73487C9.74445 3.73278 9.23739 3.93926 8.86133 4.30933Z" fill="#949494" /></svg>
                        <span style={{ fontSize: 14, color: '#212121' }}>TRAVEL60</span>
                        <button onClick={() => s.removePromo()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.3319 3.34596L12.651 2.66513L7.99853 7.31764L3.34605 2.66516L2.66521 3.34599L7.31769 7.99848L2.66544 12.6507L3.34627 13.3316L7.99853 8.67931L12.6508 13.3316L13.3317 12.6508L8.67937 7.99847L13.3319 3.34596Z" fill="#6E6E6E" /></svg>
                        </button>
                      </div>
                      <button style={promoApplyBtn}>Apply</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 48, background: '#fff', border: `1px solid ${promoError ? '#991B1B' : 'rgba(0,0,0,.09)'}`, borderRadius: 8, padding: '0 8px 0 16px' }}>
                      <input type="text" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Enter promo code"
                        style={{ border: 'none', outline: 'none', padding: 0, fontSize: 16, fontFamily: "'Noto Sans',sans-serif", color: '#212121', flex: 1, background: 'transparent', height: '100%' }} />
                      <button onClick={applyPromo} style={promoApplyBtn}>Apply</button>
                    </div>
                  )}
                  {s.promoApplied && <span style={{ fontSize: 12, color: '#08754F', fontWeight: 500 }}>Yay, 60% discount applied!</span>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#949494' }}>Have an agent ID?</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.5 8.5V13.3333H8.5V8.5H13.3333V7.5H8.5V2.66667H7.5V7.5H2.66667V8.5H7.5Z" fill="#949494" /></svg>
                </div>
              </div>
            </div>

            <button onClick={() => s.goToScreen2()}
              style={{ background: '#005EB8', color: '#fff', border: 'none', borderRadius: 8, padding: '13px 36px', fontSize: 16, fontWeight: 500, cursor: 'pointer', fontFamily: "'Noto Sans',sans-serif", transition: '.15s', flexShrink: 0 }}>
              Check Price
            </button>
          </div>
        </div>
      </div>

      <footer style={{ background: '#005EB8', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', fontSize: 12, flexShrink: 0 }}>
        <span>Copyright © 2026 United Overseas Insurance Limited Co. Reg. No. 197100152R.</span>
        <span>All Rights Reserved.</span>
      </footer>
    </div>
  );
}

const promoApplyBtn: React.CSSProperties = { border: '1px solid #005EB8', borderRadius: 8, background: '#fff', color: '#005EB8', fontSize: 14, fontWeight: 500, height: 32, padding: '8px 16px', cursor: 'pointer', fontFamily: "'Noto Sans',sans-serif", boxShadow: '0 1px 4px rgba(0,0,0,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
