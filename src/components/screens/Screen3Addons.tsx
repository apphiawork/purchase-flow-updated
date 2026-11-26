import { useState } from 'react';
import type { Addon, AddonKey, ToggleAddonKey } from '../../types';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { addonCardPrice, addonSelected, addonsShown, fmt, hasOptionalAddon } from '../../store/selectors';
import { AO_ICONS } from '../../data/addons';
import SiteHeader from '../flow/SiteHeader';
import SummaryCard from '../flow/SummaryCard';
import Footer from '../layout/Footer';
import Toggle from '../ui/Toggle';
import Stepper from '../ui/Stepper';
import CoverageModal from '../modals/CoverageModal';

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 7V5a4 4 0 1 1 8 0v2h.5A1.5 1.5 0 0 1 14 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5v-5A1.5 1.5 0 0 1 3.5 7H4Zm1.5 0h5V5a2.5 2.5 0 0 0-5 0v2Z" /></svg>
);

function AddonCard({ ao, onCoverage }: { ao: Addon; onCoverage: (k: AddonKey) => void }) {
  const s = usePurchaseStore();
  const counter = ao.unit === 'vehicle' ? 'rentalCount' : ao.unit === 'pet' ? 'petCount' : null;
  const per = ao.unit === 'vehicle' ? 'per vehicle' : ao.unit === 'pet' ? 'per pet' : '';
  return (
    <div className="f-ao">
      <div className="f-ao-head">
        <span className="f-ao-icon" dangerouslySetInnerHTML={{ __html: AO_ICONS[ao.key] }} />
        <h3>{ao.name}</h3>
      </div>
      <p>{ao.desc}</p>
      <button type="button" className="f-link f-link-sm" style={{ alignSelf: 'flex-start' }} onClick={() => onCoverage(ao.key)}>View coverage details</button>
      <div className="f-ao-foot">
        <div className="f-ao-price">{fmt(addonCardPrice(s, ao))}{per && <span>{per}</span>}</div>
        {ao.key === 'prex' ? <span className="f-included"><LockIcon /> Included</span>
          : counter ? <Stepper value={s[counter]} minusDisabled={s[counter] <= 0} plusDisabled={s[counter] >= 20}
              onMinus={() => s.adjustCounter(counter, -1)} onPlus={() => s.adjustCounter(counter, 1)} />
          : <Toggle checked={addonSelected(s, ao.key)} onChange={() => s.toggleAddon(ao.key as ToggleAddonKey)} />}
      </div>
    </div>
  );
}

/** Select Add-Ons (Figma 7286:41002 / 7318:48738; pre-ex 7358:29762). Every add-on covers the whole policy.
 *  On a Pre-existing Conditions policy, pre-ex cover is listed first, included and locked. */
export default function Screen3Addons() {
  const s = usePurchaseStore();
  const [coverage, setCoverage] = useState<AddonKey | null>(null);
  return (
    <div className="f-screen">
      <SiteHeader step={2} />
      <div className="f-wrap f-page">
        <div className="f-main">
          <div>
            <h1 className="f-title">Select Add-Ons</h1>
            <p className="f-sub">Tailor your travel insurance with add-ons designed to fit your needs and preferences</p>
          </div>
          <div className="f-ao-grid">
            {addonsShown(s).map((ao) => <AddonCard ao={ao} key={ao.key} onCoverage={setCoverage} />)}
          </div>
          <div className="f-actions">
            <button type="button" className="f-btn f-btn-back" onClick={() => s.goToScreen(2)}>Back</button>
            <button type="button" className="f-btn f-btn-primary f-push" onClick={s.goToTravellers}>{hasOptionalAddon(s) ? 'Next: Traveller Details' : 'Skip'}</button>
          </div>
        </div>
        <div className="f-side"><SummaryCard /></div>
      </div>
      <Footer />
      <CoverageModal coverageKey={coverage} onClose={() => setCoverage(null)} />
    </div>
  );
}
