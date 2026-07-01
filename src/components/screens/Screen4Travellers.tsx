import { useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { addonsForSlot, personAddonLabel } from '../../store/selectors';
import type { Applicant, InsuredPerson } from '../../types';
import TopNav from '../layout/TopNav';
import QuoteBar from '../layout/QuoteBar';
import Footer from '../layout/Footer';
import ActionBar from '../layout/ActionBar';
import PriceCard from '../Sidebar/PriceCard';
import DobField from '../ui/DobField';
import SaveDraftModal from '../modals/SaveDraftModal';
import { CloseIcon } from '../icons';

/** Read-only summary of the add-ons picked earlier; editing sends the user back to the Add-Ons page. */
function PersonAddons({ person }: { person: InsuredPerson }) {
  const s = usePurchaseStore();
  const addons = addonsForSlot(s, person.id).map(personAddonLabel);
  return (
    <div className="ro-addon-section">
      <div className="ro-addon-head">
        <span>Selected Add-On(s)</span>
        <button className="text-link" onClick={() => s.goToScreen(3)}>Edit</button>
      </div>
      <div className="ro-addon-list">{addons.length ? addons.join(', ') : 'None'}</div>
    </div>
  );
}

function InsuredPersonCard({ person, idx }: { person: InsuredPerson; idx: number }) {
  const s = usePurchaseStore();
  const [collapsed, setCollapsed] = useState(false);
  const phDisabled = !!s.policyholderSlot && s.policyholderSlot !== person.id;
  const phChecked = s.policyholderSlot === person.id;

  return (
    <div className="traveller-section">
      <div className="traveller-section-header" onClick={() => setCollapsed((c) => !c)}>
        <h3>{person.label}</h3>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transform: collapsed ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }}><polyline points="18 15 12 9 6 15" /></svg>
      </div>
      {!collapsed && (
      <div className="traveller-section-body">
        <div className="form-group-inline">
          <div className="form-group">
            <label className="form-label"><span className="req">*</span> Full Name as per NRIC/FIN</label>
            <input type="text" className="form-input" placeholder="Enter Full Name"
              value={person.name} onChange={(e) => s.updatePersonField(idx, 'name', e.target.value)} />
            {person.type === 'adult' && (
              <label className={`ph-check ${phDisabled ? 'disabled' : ''}`}>
                <input type="checkbox" checked={phChecked} disabled={phDisabled} onChange={() => s.togglePolicyholder(idx, person.id)} /> I am the policyholder
              </label>
            )}
          </div>
          <div className="form-group">
            <label className="form-label"><span className="req">*</span> Date of Birth</label>
            <DobField value={person.dob} onChange={(v) => s.updatePersonField(idx, 'dob', v)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label"><span className="req">*</span> NRIC/FIN</label>
          <input type="text" className="form-input" placeholder="Enter NRIC/FIN" style={{ maxWidth: 320 }}
            value={person.nric} onChange={(e) => s.updatePersonField(idx, 'nric', e.target.value)} />
        </div>
        <PersonAddons person={person} />
      </div>
      )}
    </div>
  );
}

function ApplicantInput({ field, placeholder, type = 'text', disabled = false }: { field: keyof Applicant; placeholder: string; type?: string; disabled?: boolean }) {
  const s = usePurchaseStore();
  return (
    <input type={type} className="form-input" placeholder={placeholder} disabled={disabled}
      style={disabled ? { background: 'var(--bg-disabled-field)', color: 'var(--text-disabled)', cursor: 'not-allowed' } : undefined}
      value={s.applicant[field]} onChange={(e) => s.updateApplicantField(field, e.target.value)} />
  );
}

export default function Screen4Travellers() {
  const s = usePurchaseStore();
  const [bannerOpen, setBannerOpen] = useState(true);
  const [draftOpen, setDraftOpen] = useState(false);
  const [noUnit, setNoUnit] = useState(false);

  return (
    <div className="screen active">
      <TopNav stepNum={3} />
      <QuoteBar />
      <div className="page-body">
        <div className="page-main">
          <h1 className="page-title">Enter Traveller Details</h1>
          <p className="page-subtitle">Enter the details for each traveller.</p>

          {bannerOpen && (
            <div className="login-banner">
              <span>Login to your customer portal to access your personal details and sync purchase! Not a member? <a href="#" onClick={(e) => e.preventDefault()}>Sign up now</a></span>
              <div className="lb-right">
                <button className="btn-secondary" style={{ padding: '8px 20px', fontSize: 14 }}>Login</button>
                <button className="lb-close" onClick={() => setBannerOpen(false)} aria-label="close">
                  <CloseIcon fill="#949494" size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="applicant-section">
            <h3>Applicant Details</h3>
            <div className="form-group-inline">
              <div className="form-group">
                <label className="form-label"><span className="req">*</span> Full Name as per NRIC/FIN</label>
                <ApplicantInput field="name" placeholder="Enter Full Name" />
              </div>
              <div className="form-group">
                <label className="form-label"><span className="req">*</span> Date of Birth</label>
                <DobField value={s.applicant.dob} onChange={(v) => s.updateApplicantField('dob', v)} />
              </div>
            </div>
            <div className="form-group-inline">
              <div className="form-group">
                <label className="form-label"><span className="req">*</span> NRIC/FIN</label>
                <ApplicantInput field="nric" placeholder="Enter NRIC/FIN" />
              </div>
              <div className="form-group">
                <label className="form-label"><span className="req">*</span> Phone No.</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" className="form-input" value="+65" readOnly style={{ width: 60, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}><ApplicantInput field="phone" placeholder="Enter Phone No." /></div>
                </div>
              </div>
            </div>
            <div className="form-group-inline">
              <div className="form-group">
                <label className="form-label"><span className="req">*</span> Email Address</label>
                <ApplicantInput field="email" placeholder="Enter Email Address" type="email" />
              </div>
              <div className="form-group">
                <label className="form-label"><span className="req">*</span> Postal Code</label>
                <div className="input-button-field">
                  <input className="ibf-input" type="text" placeholder="Enter Postal Code"
                    value={s.applicant.postal} onChange={(e) => s.updateApplicantField('postal', e.target.value)} />
                  <button className="btn-search">Search</button>
                </div>
              </div>
            </div>
            <div className="form-group-inline">
              <div className="form-group">
                <label className="form-label"><span className="req">*</span> Address</label>
                <ApplicantInput field="address" placeholder="Enter Address" />
              </div>
              <div className="form-group">
                <label className="form-label"><span className="req">*</span> Unit No.</label>
                <ApplicantInput field="unit" placeholder="Enter Unit No." disabled={noUnit} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-500)', marginTop: 6, cursor: 'pointer' }}>
                  <input type="checkbox" checked={noUnit} style={{ accentColor: 'var(--blue-700)' }}
                    onChange={(e) => { setNoUnit(e.target.checked); if (e.target.checked) s.updateApplicantField('unit', ''); }} /> I don't have unit no.
                </label>
              </div>
            </div>
          </div>

          {s.insuredPersons.map((person, idx) => <InsuredPersonCard key={person.id} person={person} idx={idx} />)}
        </div>

        <div className="page-sidebar"><PriceCard /></div>
      </div>

      <ActionBar narrow onBack={() => s.goToScreen(3)} onSaveDraft={() => setDraftOpen(true)}>
        <button className="btn-primary" onClick={() => s.goToScreen5()}>Next: Review &amp; Pay →</button>
      </ActionBar>
      <Footer />

      <SaveDraftModal open={draftOpen} onClose={() => setDraftOpen(false)} />
    </div>
  );
}
