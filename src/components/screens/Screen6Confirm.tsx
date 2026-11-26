import { usePurchaseStore } from '../../store/usePurchaseStore';
import { fmt, getDestinationLabel, planLabel, totals, travellersLabel, tripDatesLabel, tripTypeLabel } from '../../store/selectors';
import SiteHeader from '../flow/SiteHeader';
import Footer from '../layout/Footer';

/** Confirmation (Figma 7318:62662). A traveller with different pre-ex needs buys a separate policy from here. */
export default function Screen6Confirm() {
  const s = usePurchaseStore();
  return (
    <div className="f-screen">
      <SiteHeader />
      <div className="f-wrap f-done">
        <div>
          <p className="f-done-ok">Payment successful</p>
          <h1 className="f-title">Your policy is confirmed</h1>
          <p className="f-sub">We've sent your policy documents to {s.applicant.email || 'your email'}.</p>
        </div>
        <section className="f-panel">
          <div className="f-panel-head"><h2>Policy no. {s.policyNumber}</h2></div>
          <dl className="f-kv">
            {([
              ['Plan', planLabel(s)], ['Trip type', tripTypeLabel(s)], ['Destination', getDestinationLabel(s)],
              ['Travel dates', tripDatesLabel(s)], ['Travellers', travellersLabel(s)], ['Total paid (incl. GST)', fmt(totals(s).total)],
            ] as [string, string][]).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </section>
        <div className="f-banner">
          <div>
            <h2>Travelling with others who need different cover?</h2>
            <p>Travellers with and without pre-existing conditions are covered under separate policies.</p>
          </div>
          <button type="button" className="f-btn" onClick={s.resetFlow}>Buy another policy</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
