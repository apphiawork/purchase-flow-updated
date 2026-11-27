import { useState } from 'react';
import type { Applicant, InsuredPerson } from '../../types';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import SiteHeader from '../flow/SiteHeader';
import MobileSummary from '../flow/MobileSummary';
import TripBar from '../flow/TripBar';
import SummaryCard from '../flow/SummaryCard';
import SingpassFlow from '../flow/SingpassFlow';
import Footer from '../layout/Footer';
import DobField from '../ui/DobField';

const Chevron = ({ up }: { up: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ transform: up ? undefined : 'rotate(180deg)', transition: 'transform .2s' }} aria-hidden="true"><path d="M12 8.5 6 14.5 7.41 15.91 12 11.33 16.59 15.91 18 14.5z" fill="#6E6E6E" /></svg>
);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="f-field"><span className="f-label"><span className="f-req">*</span>{label}</span>{children}</label>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="f-panel">
      <div className="f-panel-head">
        <h2>{title}</h2>
        <button type="button" className="f-collapse" aria-expanded={open} aria-label={open ? `Collapse ${title}` : `Expand ${title}`} onClick={() => setOpen((o) => !o)}><Chevron up={open} /></button>
      </div>
      {open && children}
    </section>
  );
}

function ApplicantInput({ field, placeholder, type = 'text', disabled = false }: { field: keyof Applicant; placeholder: string; type?: string; disabled?: boolean }) {
  const s = usePurchaseStore();
  return <input className="f-input" type={type} placeholder={placeholder} disabled={disabled || s.singpassFilled}
    value={s.applicant[field]} onChange={(e) => s.updateApplicantField(field, e.target.value)} />;
}

function PersonCard({ person, idx }: { person: InsuredPerson; idx: number }) {
  const s = usePurchaseStore();
  const isPh = s.policyholderId === person.id;
  const phTaken = !!s.policyholderId && !isPh;
  return (
    <Panel title={person.label}>
      <div className="f-form-grid">
        <div className="f-field" style={{ gap: 10 }}>
          <Field label="Full name as per NRIC/FIN">
            <input className="f-input" placeholder="Enter full name" value={person.name} onChange={(e) => s.updatePersonField(idx, 'name', e.target.value)} />
          </Field>
          {person.type === 'adult' && (
            <label className={`f-check ${phTaken ? 'disabled' : ''}`}>
              <input type="checkbox" checked={isPh} disabled={phTaken} onChange={() => s.togglePolicyholder(person.id)} /> I am the policyholder
            </label>
          )}
        </div>
        <Field label="Date of birth"><DobField value={person.dob} onChange={(v) => s.updatePersonField(idx, 'dob', v)} /></Field>
        <Field label="NRIC/FIN">
          <input className="f-input" placeholder="Enter NRIC/FIN" value={person.nric} onChange={(e) => s.updatePersonField(idx, 'nric', e.target.value)} />
        </Field>
      </div>
    </Panel>
  );
}

/** Enter Traveller Details (Figma 7318:52300 / 55311; Singpass 7318:59660). Applicant first, then one card per traveller. */
export default function Screen4Travellers() {
  const s = usePurchaseStore();
  const [noUnit, setNoUnit] = useState(false);
  const [singpass, setSingpass] = useState(false);
  return (
    <div className="f-screen">
      <SiteHeader step={3} />
      <TripBar />
      <MobileSummary />
      <div className="f-wrap" style={{ paddingTop: 32 }}><h1 className="f-title">Enter Traveller Details</h1></div>
      <div className="f-wrap f-page" style={{ paddingTop: 20 }}>
        <div className="f-main">
          <div className="f-sp">
            <div>
              <strong>Speed up application process with Singpass</strong>
              <p>Retrieve your personal details securely from Singpass or fill form manually</p>
            </div>
            {s.singpassFilled
              ? <button type="button" className="f-btn f-btn-back" onClick={s.clearSingpass}>Clear Form</button>
              : <button type="button" className="f-sp-btn" onClick={() => setSingpass(true)} aria-label="Retrieve with Singpass"><img src="/singpass-btn.png" alt="" /></button>}
          </div>

          <Panel title="Applicant details">
            <div className="f-form-grid">
              <Field label="Full name as per NRIC/FIN"><ApplicantInput field="name" placeholder="Enter full name" /></Field>
              <Field label="Date of birth"><DobField value={s.applicant.dob} onChange={(v) => s.updateApplicantField('dob', v)} disabled={s.singpassFilled} /></Field>
              <Field label="NRIC/FIN"><ApplicantInput field="nric" placeholder="Enter NRIC/FIN" /></Field>
              <Field label="Phone no.">
                <div className="f-phone"><input className="f-input" value="+65" readOnly disabled={s.singpassFilled} aria-label="Country code" /><ApplicantInput field="phone" placeholder="Enter phone no." /></div>
              </Field>
              <Field label="Email address"><ApplicantInput field="email" placeholder="Enter email address" type="email" /></Field>
              <Field label="Postal code"><ApplicantInput field="postal" placeholder="Enter postal code" /></Field>
              <Field label="Address"><ApplicantInput field="address" placeholder="Enter address" /></Field>
              <div className="f-field" style={{ gap: 10 }}>
                <Field label="Unit no."><ApplicantInput field="unit" placeholder="Enter unit no." disabled={noUnit} /></Field>
                {!s.singpassFilled && (
                  <label className="f-check"><input type="checkbox" checked={noUnit} onChange={(e) => { setNoUnit(e.target.checked); if (e.target.checked) s.updateApplicantField('unit', ''); }} /> I don't have unit no.</label>
                )}
              </div>
            </div>
          </Panel>

          {s.insuredPersons.map((p, i) => <PersonCard person={p} idx={i} key={p.id} />)}

          <div className="f-actions">
            <button type="button" className="f-btn f-btn-back" onClick={() => s.goToScreen(3)}>Back</button>
            <button type="button" className="f-btn f-btn-primary f-push" onClick={s.goToReview}>Next: Review &amp; Pay</button>
          </div>
        </div>
        <div className="f-side"><SummaryCard /></div>
      </div>
      <Footer />
      {singpass && <SingpassFlow onCancel={() => setSingpass(false)} onAgree={() => { s.retrieveSingpass(); setSingpass(false); window.scrollTo(0, 0); }} />}
    </div>
  );
}
