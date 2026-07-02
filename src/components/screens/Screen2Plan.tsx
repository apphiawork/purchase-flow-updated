import { useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { PLAN_FEATURES, PLAN_PRICES } from '../../data/plans';
import { PROMO_RATE } from '../../data/constants';
import { fmt } from '../../store/selectors';
import type { PlanKey } from '../../types';
import { useIsMobile } from '../../hooks/useIsMobile';
import TopNav from '../layout/TopNav';
import QuoteBar from '../layout/QuoteBar';
import Footer from '../layout/Footer';
import ActionBar from '../layout/ActionBar';
import Stepper from '../ui/Stepper';
import SaveDraftModal from '../modals/SaveDraftModal';
import PlanCompareModal from '../modals/PlanCompareModal';
import { ArrowRight } from '../icons';

const PLANS: { key: PlanKey; name: string; popular?: boolean }[] = [
  { key: 'value', name: 'Value' },
  { key: 'plus', name: 'Plus', popular: true },
  { key: 'pro', name: 'Pro' },
];

const FEATURE_FIELD: Record<PlanKey, 'v' | 'p' | 'pro'> = { value: 'v', plus: 'p', pro: 'pro' };

function PriceRow({ plan, type, label }: { plan: PlanKey; type: 'adult' | 'child'; label: string }) {
  const s = usePurchaseStore();
  const count = s.planCounts[plan][type];
  return (
    <div className="plan-price-control">
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span className="price">{fmt(PLAN_PRICES[plan][type] * (1 - PROMO_RATE))}</span>
          <span className="per-label">{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span className="original">{fmt(PLAN_PRICES[plan][type])}</span>
          <span className="discount">–60%</span>
        </div>
      </div>
      <Stepper value={count} minusDisabled={count === 0}
        onMinus={() => s.adjustCount(plan, type, -1)} onPlus={() => s.adjustCount(plan, type, 1)} />
    </div>
  );
}

/** Mobile-only Select Plan layout: segmented plan tabs + a single stacked card + vertical Key Features. */
function MobilePlanSelector({ onCompare }: { onCompare: () => void }) {
  const [active, setActive] = useState<PlanKey>('plus');
  const plan = PLANS.find((p) => p.key === active)!;
  const vf = FEATURE_FIELD[active];

  return (
    <>
      <div className="mplan-tabs">
        {PLANS.map(({ key, name }) => (
          <button key={key} className={`mplan-tab ${active === key ? 'active' : ''}`} onClick={() => setActive(key)}>{name}</button>
        ))}
      </div>

      <div className="mplan-card">
        <div className="plan-name">{plan.name}{plan.popular && <span className="badge badge-blue">★ Most Popular</span>}</div>
        <PriceRow plan={active} type="adult" label="Per Adult" />
        <PriceRow plan={active} type="child" label="Per Child" />
      </div>

      <div className="mplan-features">
        <div className="mplan-features-title">Key Features</div>
        {PLAN_FEATURES.map((row, i) => {
          const val = row[vf];
          if (row.header && !val) return <div className="mplan-feat-header" key={i}>{row.label}</div>;
          return (
            <div className={`mplan-feat-row${row.header ? ' bold' : ''}`} key={i}>
              <span>{row.label}</span><span>{val}</span>
            </div>
          );
        })}
      </div>

      <div className="mplan-foot">
        <div className="view-comparison" onClick={onCompare} style={{ cursor: 'pointer' }}>
          View Plan Comparison <ArrowRight />
        </div>
        <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>For full summary, please refer to <a href="#" onClick={(e) => e.preventDefault()}>policy wording.</a></p>
      </div>
    </>
  );
}

export default function Screen2Plan() {
  const s = usePurchaseStore();
  const isMobile = useIsMobile();
  const [draftOpen, setDraftOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  return (
    <div className="screen active">
      <TopNav stepNum={1} />
      <QuoteBar showTotal />
      <div className="page-body">
        <div className="page-main">
          <h1 className="page-title">Select Plan</h1>
          <p className="page-subtitle">Choose a plan based on your travel needs and customise with add-ons later.</p>

          {isMobile ? <MobilePlanSelector onCompare={() => setCompareOpen(true)} /> : (
          <div className="plan-table">
            <div className="plan-table-header">
              <div className="plan-col-features">Key Features</div>
              {PLANS.map(({ key, name, popular }) => (
                <div className={`plan-col${popular ? ' popular' : ''}`} key={key}>
                  <div className="plan-name">{name}{popular && <span className="badge badge-blue">★ Most Popular</span>}</div>
                  <PriceRow plan={key} type="adult" label="Per Adult" />
                  <PriceRow plan={key} type="child" label="Per Child" />
                </div>
              ))}
            </div>

            <div className="plan-table-rows">
              {PLAN_FEATURES.map((row, i) => (
                <div className="plan-row" key={i}>
                  <div className={`plan-row-label${row.header ? ' group-header' : ''}`}>{row.label}</div>
                  <div className="plan-row-val">{row.v}</div>
                  <div className="plan-row-val popular">{row.p}</div>
                  <div className="plan-row-val">{row.pro}</div>
                </div>
              ))}
            </div>

            <div className="plan-footer">
              <div className="view-comparison" onClick={() => setCompareOpen(true)} style={{ cursor: 'pointer' }}>
                View Plan Comparison <ArrowRight />
              </div>
              <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>For full summary, please refer to <a href="#" onClick={(e) => e.preventDefault()}>policy wording.</a></p>
            </div>
          </div>
          )}
        </div>
      </div>

      <ActionBar onBack={() => s.goToScreen(1)} onSaveDraft={() => setDraftOpen(true)}>
        <button className="btn-primary" onClick={() => s.goToScreen3()}>Next: Add-Ons →</button>
      </ActionBar>
      <Footer />

      <SaveDraftModal open={draftOpen} onClose={() => setDraftOpen(false)} />
      <PlanCompareModal open={compareOpen} onClose={() => setCompareOpen(false)} />
    </div>
  );
}
