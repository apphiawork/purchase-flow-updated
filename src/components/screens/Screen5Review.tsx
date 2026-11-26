import { useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { formatDateDisplay, getDestinationLabel, planLabel, travellersLabel, tripDatesLabel, tripTypeLabel } from '../../store/selectors';
import { POLICY_WORDING_URL } from '../../data/constants';
import SiteHeader from '../flow/SiteHeader';
import SummaryCard from '../flow/SummaryCard';
import Footer from '../layout/Footer';
import SaveDraftModal from '../modals/SaveDraftModal';

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

/** Review & Pay (Figma 7318:60496 / 61785). Confirm & Pay unlocks once the declaration is ticked. */
export default function Screen5Review() {
  const s = usePurchaseStore();
  const [draft, setDraft] = useState(false);
  const a = s.applicant;
  return (
    <div className="f-screen">
      <SiteHeader step={4} />
      <div className="f-wrap" style={{ paddingTop: 32 }}><h1 className="f-title">Review &amp; Pay</h1></div>
      <div className="f-wrap f-page" style={{ paddingTop: 20 }}>
        <div className="f-main">
          <Card title="Trip details" onEdit={() => s.goToScreen(1)}>
            <KV items={[
              ['Trip type', tripTypeLabel(s)], ['Destination', getDestinationLabel(s)],
              ['Travel dates', tripDatesLabel(s)], ['Travellers', travellersLabel(s)],
              ['Plan', planLabel(s)],
            ]} />
          </Card>
          <Card title="Applicant details" onEdit={() => s.goToScreen(4)}>
            <KV items={[
              ['Full name as per NRIC/FIN', a.name], ['Date of birth', a.dob ? formatDateDisplay(a.dob) : ''],
              ['NRIC/FIN', a.nric], ['Phone no.', a.phone ? `+65 ${a.phone}` : ''],
              ['Email address', a.email], ['Address', [a.address, a.unit, a.postal && `Singapore ${a.postal}`].filter(Boolean).join(', ')],
            ]} />
          </Card>
          {s.insuredPersons.map((p) => (
            <Card key={p.id} title={`${p.label}${s.policyholderId === p.id ? ' (Policyholder)' : ''}`} onEdit={() => s.goToScreen(4)}>
              <KV items={[['Full name as per NRIC/FIN', p.name], ['Date of birth', p.dob ? formatDateDisplay(p.dob) : ''], ['NRIC/FIN', p.nric]]} />
            </Card>
          ))}
          <Card title="Terms & conditions">
            <div className="f-tnc">
              <ul>
                <li>I confirm that all travellers are Singapore residents and are in Singapore at the time of purchase.</li>
                <li>I confirm the information provided is true and complete, and I have not withheld any material facts.</li>
                <li>I have read and agree to the <a href={POLICY_WORDING_URL} target="_blank" rel="noopener noreferrer">policy wording</a>, including its exclusions.</li>
              </ul>
            </div>
            <label className="f-check">
              <input type="checkbox" checked={s.declarationChecked} onChange={(e) => s.setDeclaration(e.target.checked)} />
              I have read and agree to the declarations and terms &amp; conditions
            </label>
          </Card>
          <div className="f-actions">
            <button type="button" className="f-btn f-btn-back" onClick={() => s.goToScreen(4)}>Back</button>
            <button type="button" className="f-btn f-btn-outline f-push" onClick={() => setDraft(true)}>Save Draft</button>
            <button type="button" className="f-btn f-btn-primary" disabled={!s.declarationChecked} onClick={s.completePayment}>Confirm &amp; Pay</button>
          </div>
        </div>
        <div className="f-side"><SummaryCard /></div>
      </div>
      <Footer />
      <SaveDraftModal open={draft} onClose={() => setDraft(false)} />
    </div>
  );
}
