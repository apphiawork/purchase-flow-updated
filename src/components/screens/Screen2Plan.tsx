import { useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { fmt, planBase, planUnitPrices, visiblePlans } from '../../store/selectors';
import { KEY_BENEFITS, PLAN_META } from '../../data/plans';
import { POLICY_WORDING_URL, PROMO_RATE } from '../../data/constants';
import SiteHeader from '../flow/SiteHeader';
import Footer from '../layout/Footer';
import PlanCompareModal from '../modals/PlanCompareModal';
import { ArrowRight } from '../icons';

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1l1.47 3.06 3.36.43-2.46 2.33.62 3.33L6 8.55 3.01 10.15l.62-3.33L1.17 4.49l3.36-.43z" fill="#fff" /></svg>
);

const disc = (n: number) => n * (1 - PROMO_RATE);

/** Select Plan (Figma 7272:31893). Prices are for the travellers chosen on Get Quote; Plus is preselected.
 *  Lite only shows for ASEAN single trips on Standard cover. */
export default function Screen2Plan() {
  const s = usePurchaseStore();
  const [compareOpen, setCompareOpen] = useState(false);
  const plans = PLAN_META.filter((p) => visiblePlans(s).includes(p.key));
  // Figma: 240px benefit column, 220px plan columns (scaled to fit)
  const cols = { gridTemplateColumns: `minmax(170px,240fr) repeat(${plans.length}, minmax(160px,220fr))` };

  return (
    <div className="f-screen">
      <SiteHeader step={1} />
      <div className="f-wrap" style={{ paddingBlock: '32px 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 className="f-title">Select Plan</h1>
          <p className="f-sub">Choose a travel insurance plan based on the level of cover you need, then customise it with add-ons</p>
        </div>

        <div className="f-plans" style={cols}>
          <div className="f-ph first">Key benefit(s)</div>
          {plans.map((p) => {
            const sel = s.plan === p.key, base = planBase(s, p.key), prices = planUnitPrices(s, p.key);
            return (
              <div className={`f-ph ${sel ? 'sel' : ''}`} key={p.key}>
                <div className="f-pinfo">
                  <div className="f-pname">{p.name}{p.popular && <span className="f-popular"><StarIcon /> Most popular</span>}{p.note && <span className="f-pnote">{p.note}</span>}</div>
                  <div className="f-pprices">
                    <div className="f-pprice">{fmt(disc(base))}</div>
                    <div className="f-pwas"><s>{fmt(base)}</s><span className="f-off">–60%</span></div>
                  </div>
                  <div className="f-pper"><span>{fmt(disc(prices.adult))} per adult</span><span>{fmt(disc(prices.child))} per child</span></div>
                </div>
                <button type="button" className={`f-btn ${sel ? 'f-btn-primary' : 'f-btn-outline'}`} aria-pressed={sel} onClick={() => s.selectPlan(p.key)}>{sel ? 'Selected' : 'Select'}</button>
              </div>
            );
          })}
          {/* Selected plan (option B): one rounded blue outline drawn over the whole column, white fill */}
          <div className="f-psel" aria-hidden="true"
            style={{ gridColumn: `${plans.findIndex((p) => p.key === s.plan) + 2} / span 1` }} />
          {KEY_BENEFITS.map((b, i) => {
            const edge = i === 0 ? ' top' : i === KEY_BENEFITS.length - 1 ? ' bottom' : '';
            return [
              <div className={`f-pb${edge}`} key={b.title}><strong>{b.title}</strong><span>{b.desc}</span></div>,
              ...plans.map((p) => <div className={`f-pv${edge}${s.plan === p.key ? ' sel' : ''}`} key={b.title + p.key}>{b.values[p.key]}</div>),
            ];
          })}
        </div>

        <div className="f-more">
          <button type="button" className="f-link" onClick={() => setCompareOpen(true)}>View Plan Comparison <ArrowRight /></button>
          <span>For more details, view <a className="f-link" href={POLICY_WORDING_URL} target="_blank" rel="noreferrer">policy wording</a></span>
        </div>

        <div className="f-actions">
          <button type="button" className="f-btn f-btn-back" onClick={() => s.goToScreen(1)}>Back</button>
          <button type="button" className="f-btn f-btn-primary f-push" onClick={s.goToAddons}>Next: Add-Ons</button>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <Footer />
      <PlanCompareModal open={compareOpen} onClose={() => setCompareOpen(false)} />
    </div>
  );
}
