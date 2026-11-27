import { usePurchaseStore } from '../../store/usePurchaseStore';
import { formatDateDisplay, getDestinationLabel, isPrexPolicy, travellersLabel, tripDatesLabel, tripTypeLabel } from '../../store/selectors';
import { POLICY_WORDING_URL, PRIVACY_NOTICE_URL } from '../../data/constants';
import SiteHeader from '../flow/SiteHeader';
import SummaryCard from '../flow/SummaryCard';
import Footer from '../layout/Footer';

function Card({ title, onEdit, children }: { title: string; onEdit?: () => void; children: React.ReactNode }) {
  return (
    <section className="f-panel">
      <div className="f-panel-head">
        <h2>{title}</h2>
        {onEdit && <button type="button" className="f-link" onClick={onEdit}>Edit</button>}
      </div>
      {children}
    </section>
  );
}

const KV = ({ items }: { items: [string, string][] }) => (
  <dl className="f-kv">{items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || '–'}</dd></div>)}</dl>
);

/** Review & Pay (Figma 7318:60496 / 61785). Confirm & Pay unlocks once the declaration is ticked */
export default function Screen5Review() {
  const s = usePurchaseStore();
  const a = s.applicant;
  return (
    <div className="f-screen">
      <SiteHeader step={4} />
      <div className="f-wrap" style={{ paddingTop: 32 }}><h1 className="f-title">Review &amp; Pay</h1></div>
      <div className="f-wrap f-page" style={{ paddingTop: 20 }}>
        <div className="f-main">
          <Card title="Trip details" onEdit={() => s.goToScreen(1)}>
            <KV items={[
              ['Trip type', tripTypeLabel(s)], ['Destination(s)', getDestinationLabel(s)],
              ['Trip duration', tripDatesLabel(s)], ['Travellers', travellersLabel(s)],
              ['Cover type', isPrexPolicy(s) ? 'Pre-existing Conditions' : 'Standard'],
            ]} />
          </Card>
          <Card title="Applicant details" onEdit={() => s.goToScreen(4)}>
            <KV items={[
              ['Full name as per NRIC/FIN', a.name], ['Date of birth', a.dob ? formatDateDisplay(a.dob) : ''],
              ['NRIC/FIN', a.nric], ['Mobile number', a.phone ? `+65 ${a.phone}` : ''],
              ['Email address', a.email], ['Postal code', a.postal],
              ['Address', a.address], ['Unit no.', a.unit],
            ]} />
          </Card>
          {s.insuredPersons.map((p) => (
            <Card key={p.id} title={`${p.label}${s.policyholderId === p.id ? ' (Policyholder)' : ''}`} onEdit={() => s.goToScreen(4)}>
              <KV items={[['Full name as per NRIC/FIN', p.name], ['Date of birth', p.dob ? formatDateDisplay(p.dob) : ''], ['NRIC/FIN', p.nric]]} />
            </Card>
          ))}
          <Card title="Terms & conditions">
            <div className="f-tnc">
              <p>I confirm that:</p>
              <ul>
                <li>I am residing in Singapore</li>
                <li>I am purchasing this travel insurance before my trip has commenced</li>
                <li>I am not travelling against medical advice</li>
                <li>I agree to the Terms and Conditions set in the <a href={POLICY_WORDING_URL} target="_blank" rel="noopener noreferrer">policy wording</a></li>
                <li>I consent to United Overseas Insurance (“UOI”) in collecting, using, disclosing, and processing my personal data in accordance with UOI's <a href={PRIVACY_NOTICE_URL} target="_blank" rel="noopener noreferrer">privacy notice</a></li>
              </ul>
            </div>
            <label className="f-check lg">
              <input type="checkbox" checked={s.declarationChecked} onChange={(e) => s.setDeclaration(e.target.checked)} />
              I have read and agree to the above declarations and the policy terms &amp; conditions
            </label>
          </Card>
          <div className="f-actions">
            <button type="button" className="f-btn f-btn-back" onClick={() => s.goToScreen(4)}>Back</button>
            <button type="button" className="f-btn f-btn-primary f-push" disabled={!s.declarationChecked} onClick={s.completePayment}>Confirm &amp; Pay</button>
          </div>
        </div>
        <div className="f-side"><SummaryCard /></div>
      </div>
      <Footer />
    </div>
  );
}
