import { useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { fmt, formatDateDisplay, getDestinationLabel, totalCost } from '../../store/selectors';

const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1  ').trim();
const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '');
  return d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2, 4) : d;
};

export default function PaymentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = usePurchaseStore();
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [processing, setProcessing] = useState(false);

  if (!open) return null;

  const total = totalCost(s); // raw uses the undiscounted total here
  const amount = fmt(total);

  const submit = () => {
    const num = card.number.replace(/\s/g, '');
    if (num.length < 16 || !card.name || card.expiry.length < 4 || card.cvv.length < 3) {
      s.showDialog('Card details incomplete', 'Please fill in all card details.');
      return;
    }
    setProcessing(true);
    setTimeout(() => { onClose(); setProcessing(false); s.completePayment(); }, 2400);
  };

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <div>
              <div className="brand">2C2P SECURE PAYMENT</div>
              <div className="amount-label">Total Amount</div>
              <div className="amount">{amount}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="modal-logo">2C2P</div>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="modal-body">
          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 12 }}>
            <strong style={{ color: 'var(--gray-800)', fontSize: 13 }}>UniTravel Insurance – UOI</strong><br />
            <span>UniTravel – {getDestinationLabel(s)}, {formatDateDisplay(s.departDate)}–{formatDateDisplay(s.returnDate)}</span>
          </div>
          <div className="modal-tabs">
            <button className="modal-tab active">💳 Credit/Debit Card</button>
            <button className="modal-tab" style={{ color: 'var(--gray-300)', cursor: 'not-allowed' }}>PayNow</button>
            <button className="modal-tab" style={{ color: 'var(--gray-300)', cursor: 'not-allowed' }}>GrabPay</button>
          </div>

          <div className="modal-field">
            <label>Card Number</label>
            <input type="text" placeholder="1234  5678  9012  3456" maxLength={19}
              value={card.number} onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })} />
          </div>
          <div className="modal-field">
            <label>Name on Card</label>
            <input type="text" placeholder="As printed on card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>Expiry Date</label>
              <input type="text" placeholder="MM / YY" maxLength={7} value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} />
            </div>
            <div className="modal-field">
              <label>CVV</label>
              <input type="password" placeholder="•••" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
            </div>
          </div>

          <div className="modal-secure">
            <svg className="secure-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span>256-bit SSL encrypted. Your card details are never stored.</span>
          </div>

          <button className="modal-submit" onClick={submit} disabled={processing}>
            {processing ? <><div className="spinner" /> Processing…</> : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                Pay <span>{amount}</span> Now
              </>
            )}
          </button>

          <div className="card-brands">
            <div className="card-brand visa">VISA</div>
            <div className="card-brand mc">MC</div>
            <div className="card-brand">AMEX</div>
            <div className="card-brand">UnionPay</div>
          </div>
        </div>
      </div>
    </div>
  );
}
