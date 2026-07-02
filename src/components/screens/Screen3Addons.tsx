import { useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { ADDONS, AO_CATEGORIES, AO_ICONS, UNIT_LABEL } from '../../data/addons';
import { addonSlotsFor, conflictReason, isSlotBlocked, slotChipLabel } from '../../store/selectors';
import type { Addon } from '../../types';
import TopNav from '../layout/TopNav';
import QuoteBar from '../layout/QuoteBar';
import Footer from '../layout/Footer';
import ActionBar from '../layout/ActionBar';
import PriceCard from '../Sidebar/PriceCard';
import Toggle from '../ui/Toggle';
import Stepper from '../ui/Stepper';
import CoverageModal from '../modals/CoverageModal';
import SaveDraftModal from '../modals/SaveDraftModal';
import { Tick } from '../icons';

const WarnIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 1.667a8.333 8.333 0 1 0 0 16.666 8.333 8.333 0 0 0 0-16.666Z" fill="#FFA826" /><path d="M10 6v4.5M10 13.5h.008" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>
);

function PaxSelector({ ao }: { ao: Addon }) {
  const s = usePurchaseStore();
  const slots = addonSlotsFor(s, ao);
  const sel = s.addonPax[ao.key] || [];
  const disabled = slots.filter((slot) => isSlotBlocked(s, ao, slot.id));
  const avail = slots.filter((slot) => !isSlotBlocked(s, ao, slot.id));
  const allSel = avail.length > 0 && avail.every((slot) => sel.includes(slot.id));

  return (
    <div className="ao-traveller">
      <div className="ao-traveller-head">
        <span>Who needs this add-on?</span>
        <a className="ao-selectall" onClick={() => s.selectAllTravellers(ao.key)}>{allSel ? 'Unselect All' : 'Select All'}</a>
      </div>
      <div className="addon-chips">
        {slots.map((slot) => {
          const isDisabled = isSlotBlocked(s, ao, slot.id);
          const isSel = !isDisabled && sel.includes(slot.id);
          return (
            <button key={slot.id} className={`ao-chip ${isSel ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              disabled={isDisabled} onClick={isDisabled ? undefined : () => s.toggleAddonTraveller(ao.key, slot.id)}>
              {slotChipLabel(slot)}{isSel && <Tick className="chip-tick" width={16} />}
            </button>
          );
        })}
      </div>
      {disabled.length > 0 && (
        <div className="ao-warning">
          <WarnIcon />
          <span>{disabled.map(slotChipLabel).join(', ')} cannot be selected: {ao.name.replace(' Activities', '')} coverage cannot be combined with {conflictReason(s, ao, disabled[0].id)}</span>
        </div>
      )}
    </div>
  );
}

function PetStepper() {
  const s = usePurchaseStore();
  const n = Math.max(1, s.petCount);
  return (
    <div className="ao-traveller" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 14, color: '#212121' }}>No. of Pets</span>
      <Stepper value={n} minusDisabled={n <= 1} plusDisabled={n >= 20}
        onMinus={() => s.adjustPetCount(-1)} onPlus={() => s.adjustPetCount(1)} />
    </div>
  );
}

function AddonCard({ ao, onCoverage }: { ao: Addon; onCoverage: (key: string) => void }) {
  const s = usePurchaseStore();
  const on = !!s.addons[ao.key];
  const badge = ao.badge && (ao.badge.c === 'blue'
    ? <span className="badge badge-blue" style={{ fontSize: 12 }}>★ {ao.badge.t}</span>
    : <span className="badge badge-green" style={{ fontSize: 11 }}>{ao.badge.t}</span>);

  return (
    <div className={`addon-card ${on ? 'selected' : ''}`}>
      <div className="addon-top">
        <div className="addon-top-left">
          <div className="addon-icon" dangerouslySetInnerHTML={{ __html: AO_ICONS[ao.key] || '' }} />
          <div className="addon-title">{ao.name}{badge}</div>
        </div>
        <div className="addon-right">
          <div className="addon-price">S$5.60{UNIT_LABEL[ao.unit]}</div>
          <Toggle checked={on} onChange={() => s.toggleAddon(ao.key)} />
        </div>
      </div>
      <div className="addon-text">
        <div className="addon-desc">{ao.desc}</div>
        <a className="addon-link" href="#" onClick={(e) => { e.preventDefault(); onCoverage(ao.key); }}>View coverage details</a>
      </div>
      {on && ao.unit === 'pax' && <PaxSelector ao={ao} />}
      {on && ao.unit === 'pet' && <PetStepper />}
    </div>
  );
}

export default function Screen3Addons() {
  const s = usePurchaseStore();
  const [coverageKey, setCoverageKey] = useState<string | null>(null);
  const [draftOpen, setDraftOpen] = useState(false);
  const tab = s.addonTab;
  const anySelected = ADDONS.some((ao) => s.addons[ao.key]);

  const activeKeys = AO_CATEGORIES.find((t) => t.key === tab)!.keys;
  const visible = ADDONS.filter((ao) => activeKeys.includes(ao.key));

  return (
    <div className="screen active">
      <TopNav stepNum={2} />
      <QuoteBar />
      <div className="page-body">
        <div className="page-main">
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Select Add-Ons <span className="badge badge-green" style={{ fontSize: 11 }}>NEW</span></h1>
          <p className="page-subtitle">Tailor your travel insurance with highly customisable add-ons designed to fit your needs and preferences.</p>
          <div className="ao-tabs">
            {AO_CATEGORIES.map((t) => (
              <button key={t.key} className={`ao-tab ${tab === t.key ? 'active' : ''}`} onClick={() => s.setAddonTab(t.key)}>{t.label}</button>
            ))}
          </div>
          <div>
            {visible.map((ao) => <AddonCard key={ao.key} ao={ao} onCoverage={setCoverageKey} />)}
          </div>
        </div>
        <div className="page-sidebar"><PriceCard /></div>
      </div>

      <ActionBar narrow onBack={() => s.goToScreen(2)} onSaveDraft={() => setDraftOpen(true)}>
        <button className="btn-primary" onClick={() => s.goToScreen4()}>{anySelected ? 'Next: Traveller Details →' : 'Skip →'}</button>
      </ActionBar>
      <Footer />

      <CoverageModal coverageKey={coverageKey} onClose={() => setCoverageKey(null)} />
      <SaveDraftModal open={draftOpen} onClose={() => setDraftOpen(false)} />
    </div>
  );
}
