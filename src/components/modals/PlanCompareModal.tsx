import { useEffect, useRef, useState } from 'react';
import { PC_SECTIONS, PC_TABS } from '../../data/comparison';
import { PLAN_META } from '../../data/plans';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { PLANS, visiblePlans } from '../../store/selectors';
import FDialog from '../flow/FDialog';

/** Compare Plans (Figma 7337:31584–36661): one tab at a time, opens on the first tab. Max height 800px; only the body scrolls. */
export default function PlanCompareModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = usePurchaseStore();
  const [tab, setTab] = useState(PC_TABS[0]);
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open) setTab(PC_TABS[0]); }, [open]);
  useEffect(() => { bodyRef.current?.scrollTo({ top: 0 }); }, [tab]);
  const plans = visiblePlans(s);
  const idx = plans.map((p) => PLANS.indexOf(p));
  const grid = { '--cols': plans.length } as React.CSSProperties;

  return (
    <FDialog open={open} onClose={onClose} title="Compare Plans" className="f-pc">
      <div className="f-pc-tabs" role="tablist">
        {PC_TABS.map((t) => <button key={t} type="button" role="tab" aria-selected={t === tab} className={`f-pc-tab ${t === tab ? 'on' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      <div className="f-pc-body" ref={bodyRef} style={grid}>
        <div className="f-pc-grid f-pc-thead"><span />{plans.map((p) => <span key={p}>{PLAN_META.find((m) => m.key === p)!.name} (S$)</span>)}</div>
        {PC_SECTIONS.filter((sec) => sec.tab === tab).map((sec) => (
          <div key={sec.title}>
            <div className="f-pc-sec">{sec.title}{sec.addon && <span className="f-pc-tag">Optional add-on</span>}</div>
            {sec.lines.map((ln, i) => (
              <div className={`f-pc-grid f-pc-row ${ln.kind === 'B' ? 'b' : 'r'}`} key={i}>
                <span>{ln.label}</span>
                {idx.map((c) => <span key={c}>{ln.values[c]}</span>)}
              </div>
            ))}
          </div>
        ))}
        <div className="f-pc-end" />
      </div>
    </FDialog>
  );
}
