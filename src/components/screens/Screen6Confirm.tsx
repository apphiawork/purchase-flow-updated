import { usePurchaseStore } from '../../store/usePurchaseStore';
import { ADDONS } from '../../data/addons';
import { addonLines, getDestinationLabel, isPrexPolicy, planName, travellersLabel, tripDatesLabel, tripTypeLabel } from '../../store/selectors';
import SiteHeader from '../flow/SiteHeader';
import Footer from '../layout/Footer';

/** Confirmation (Figma 7318:62662; pre-ex 7344:34162). A traveller who needs different cover buys another policy from here. */
export default function Screen6Confirm() {
  const s = usePurchaseStore();
  // Add-on names without counts, as in Figma ("Cancel for any reason, Golf play, Rental vehicle")
  const chosen = new Set(addonLines(s).map((l) => l.key));
  const addons = ADDONS.filter((a) => chosen.has(a.key)).map((a) => a.name).join(', ');
  // Figma 7318:62662: two columns, in this order
  const rows: [string, string][] = [
    ['Certificate no.', s.policyNumber], ['Trip type', tripTypeLabel(s)],
    ['Destination(s)', getDestinationLabel(s)], ['Trip duration', tripDatesLabel(s)],
    ['Traveller(s)', travellersLabel(s)], ['Cover type', isPrexPolicy(s) ? 'Pre-existing Conditions' : 'Standard'],
    ['Plan', planName(s.plan)], ['Add-ons', addons || 'Not selected'],
  ];
  return (
    <div className="f-screen">
      <SiteHeader />
      <div className="f-wrap f-done">
        <div>
          <img className="f-done-gif" src="/success.gif" alt="" width={60} height={60} />
          <p className="f-done-ok">Payment successful</p>
          <h1 className="f-title">Your policy is confirmed</h1>
          <p className="f-sub">We’ve emailed your Certificate of Insurance to {s.applicant.email || 'your email address'}</p>
        </div>
        <section className="f-panel f-panel-summary">
          <div className="f-panel-head"><h2>Policy summary</h2></div>
          <dl className="f-kv f-kv-summary">
            {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </section>
        <div className="f-banner">
          <div>
            <h2>Booked another trip?</h2>
            <p>Get a new quote for a different destination or dates</p>
          </div>
          <button type="button" className="f-btn" onClick={s.resetFlow}>Buy another policy</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
