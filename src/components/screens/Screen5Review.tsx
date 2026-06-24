import { useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { addonsForSlot, cap, fmt, formatDateDisplay, personAddonLabel } from '../../store/selectors';
import { ADDON_PRICE } from '../../data/addons';
import TopNav from '../layout/TopNav';
import QuoteBar from '../layout/QuoteBar';
import Footer from '../layout/Footer';
import ActionBar from '../layout/ActionBar';
import PriceCard from '../Sidebar/PriceCard';
import PaymentModal from '../modals/PaymentModal';
import SaveDraftModal from '../modals/SaveDraftModal';

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="review-field">
    <div className="rf-label">{label}</div>
    <div className="rf-value">{value}</div>
  </div>
);

export default function Screen5Review() {
  const s = usePurchaseStore();
  const [agree, setAgree] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [draftOpen, setDraftOpen] = useState(false);
  const ap = s.applicant;

  const confirmPay = () => {
    if (!agree) { s.showDialog('Confirmation needed', 'Please confirm the declarations before proceeding.'); return; }
    setPayOpen(true);
  };

  return (
    <div className="screen active">
      <TopNav stepNum={4} />
      <QuoteBar />
      <div className="page-body">
        <div className="page-main">
          <h1 className="page-title">Review &amp; Pay</h1>

          <div className="review-section">
            <div className="review-section-header">
              <h3>Applicant Details</h3>
              <button className="text-link" onClick={() => s.goToScreen(4)}>Edit</button>
            </div>
            <div className="review-grid">
              <Field label="Full Name as per NRIC/FIN" value={ap.name || '–'} />
              <Field label="Date of Birth" value={formatDateDisplay(ap.dob)} />
              <Field label="NRIC/FIN" value={ap.nric || '–'} />
              <Field label="Mobile Number" value={ap.phone ? '+65 ' + ap.phone : '–'} />
              <Field label="Email Address" value={ap.email || '–'} />
              <Field label="Postal Code" value={ap.postal || '–'} />
              <Field label="Address" value={ap.address || '–'} />
              <Field label="Unit No." value={ap.unit || '–'} />
            </div>
          </div>

          {s.insuredPersons.map((p, i) => {
            const addons = addonsForSlot(s, p.id).map(personAddonLabel);
            return (
              <div className="review-section" key={p.id}>
                <div className="review-section-header">
                  <h3>Insured Person {i + 1} – {p.type === 'adult' ? 'Adult' : 'Child'} ({cap(p.plan)})</h3>
                  <button className="text-link" onClick={() => s.goToScreen(4)}>Edit</button>
                </div>
                <div className="review-grid">
                  <Field label="Full Name as per NRIC/FIN" value={p.name || '–'} />
                  <Field label="Date of Birth" value={formatDateDisplay(p.dob)} />
                  <Field label="NRIC/FIN" value={p.nric || '–'} />
                  <Field label="Add-On(s)" value={addons.join(', ') || 'None'} />
                </div>
              </div>
            );
          })}

          {s.addons['pet'] && (
            <div className="review-section">
              <div className="review-section-header">
                <h3>Additional Add-On(s)</h3>
                <button className="text-link" onClick={() => s.goToScreen(3)}>Edit</button>
              </div>
              <div>
                <Field label="Pet Care Support" value={`1 Pet — ${fmt(ADDON_PRICE)}`} />
              </div>
            </div>
          )}

          <div className="review-section">
            <div className="tac-section">
              <p>I confirm that:</p>
              <ul>
                <li>I am residing in Singapore</li>
                <li>I am purchasing this travel insurance before my trip has commenced</li>
                <li>I am not travelling against medical advice</li>
                <li>I agree to the Terms and Conditions set in the <a href="#" onClick={(e) => e.preventDefault()}>policy wording</a></li>
                <li>I consent to United Overseas Insurance ("UOI") in collecting, using, disclosing, and processing my personal data in accordance with UOI's <a href="#" onClick={(e) => e.preventDefault()}>privacy notice</a></li>
              </ul>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 14, color: 'var(--gray-700)' }}>
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: 2, accentColor: 'var(--blue-700)' }} />
                <span>I have read and agree to the above declarations and the policy terms &amp; conditions.</span>
              </label>
            </div>
          </div>
        </div>

        <div className="page-sidebar"><PriceCard /></div>
      </div>

      <ActionBar narrow onBack={() => s.goToScreen(4)} onSaveDraft={() => setDraftOpen(true)}>
        <button className="btn-primary" onClick={confirmPay} style={{ background: 'linear-gradient(135deg,#005EB8,#5C55EB)', fontSize: 15, padding: '14px 36px' }}>Confirm &amp; Pay →</button>
      </ActionBar>
      <Footer />

      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)} />
      <SaveDraftModal open={draftOpen} onClose={() => setDraftOpen(false)} />
    </div>
  );
}
