import { usePurchaseStore } from '../../store/usePurchaseStore';
import { addonLines, fmt, planBase, planLabel, totals } from '../../store/selectors';
import PromoChip from './PromoChip';

/** Plan, add-ons, subtotal, TRAVEL60 and total. Shared by the desktop sidebar and the mobile summary bar. */
export function SummaryBody() {
  const s = usePurchaseStore();
  const lines = addonLines(s);
  const { subtotal, discount, total } = totals(s);
  return (
    <div className="f-sum-body">
      <div className="f-sum-sec">
        <div className="f-sum-title">Your plan <button type="button" className="f-link" onClick={() => s.goToScreen(2)}>Edit</button></div>
        <div className="f-sum-line"><span className="k">{planLabel(s)}</span><span className="f-sum-amt">{fmt(planBase(s, s.plan))}</span></div>
      </div>
      <div className="f-sum-sec">
        <div className="f-sum-title">Add-on(s) <button type="button" className="f-link" disabled={s.currentScreen === 3} onClick={() => s.goToScreen(3)}>Edit</button></div>
        {lines.length === 0 && <div className="f-sum-line"><span className="k">Not selected</span></div>}
        {lines.map((l) => <div className="f-sum-line" key={l.key}><span className="k">{l.label}</span><span className="f-sum-amt">{fmt(l.amount)}</span></div>)}
      </div>
      <hr className="f-sum-hr" />
      <div className="f-sum-sec">
        <div className="f-sum-line f-sum-strong"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
        <div className="f-sum-line"><span className="f-sum-strong">Discount Code</span><span className="f-discount">–{fmt(discount)}</span></div>
        <PromoChip />
      </div>
      <hr className="f-sum-hr" />
      <div className="f-sum-line f-sum-strong"><span>Total (incl. GST)</span><span>{fmt(total)}</span></div>
    </div>
  );
}

/** Order summary (Figma 7286:41002): total, plan, add-ons, subtotal, TRAVEL60, total incl. GST.
 *  Travellers aren't repeated here; the trip bar shows them. */
export default function SummaryCard() {
  const s = usePurchaseStore();
  return (
    <aside className="f-sum" aria-label="Order summary">
      <div className="f-sum-head"><div className="l">Total amount</div><div className="a">{fmt(totals(s).total)}</div></div>
      <SummaryBody />
    </aside>
  );
}
