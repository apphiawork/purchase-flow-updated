import { useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { fmt, totalCost } from '../../store/selectors';

/** 2C2P-hosted "Verify OTP" payment page (Figma 4326:34260).
 *  We don't build a bespoke card form — this mirrors the 2C2P redirect screen.
 *  Submitting the OTP (the popup's primary action) takes the user to the success page. */
export default function PaymentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = usePurchaseStore();
  const [otp, setOtp] = useState('');

  if (!open) return null;

  const amount = fmt(totalCost(s)); // raw uses the undiscounted total here
  const now = new Date();
  const txnDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

  const submit = () => { onClose(); s.completePayment(); };

  const detailRow = (label: string, value: string) => (
    <div style={{ display: 'flex', gap: 12, fontSize: 14, lineHeight: 1.6 }}>
      <span style={{ width: 130, textAlign: 'right', color: '#212121' }}>{label}:</span>
      <span style={{ color: '#212121', fontWeight: 500 }}>{value}</span>
    </div>
  );

  return (
    <div className="modal-overlay open">
      <div style={{ background: '#fff', width: 545, maxWidth: 'calc(100% - 32px)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,.25)', fontFamily: "'Noto Sans',sans-serif" }}>
        {/* Language selector */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 20px 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #CBD2DA', borderRadius: 4, padding: '4px 10px', fontSize: 13, color: '#333' }}>
            English <span style={{ fontSize: 9 }}>▼</span>
          </div>
        </div>

        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 24px 14px', borderBottom: '1px solid #E5E7EB' }}>
          <span style={{ fontSize: 34, fontWeight: 700, color: '#0F7A73', letterSpacing: '-1px' }}>2C2P</span>
          <span style={{ fontSize: 30, fontWeight: 700, fontStyle: 'italic', color: '#1A1F71', letterSpacing: '-0.5px' }}>VISA</span>
        </div>

        {/* OTP body */}
        <div style={{ padding: '20px 32px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#212121', marginBottom: 12 }}>Verify OTP</h2>
          <p style={{ fontSize: 14, color: '#444', lineHeight: 1.5, marginBottom: 20 }}>
            Please enter your OTP in field below which has been sent to your<br />pXXXXXXXXXXXX@XXXX.com
          </p>

          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
            {detailRow('Merchant Name', '2C2P.COM')}
            {detailRow('Amount', amount)}
            {detailRow('Transaction Date', txnDate)}
            {detailRow('Card Number', '41111111****1111')}
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, color: '#212121', marginBottom: 12 }}>
            Enter OTP (Test mode OTP Value is 123456) (uCZrOr):
          </div>
          <input type="password" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} autoFocus
            style={{ width: '80%', maxWidth: 300, padding: '10px 12px', border: '1px solid #C9CED6', borderRadius: 4, fontSize: 16, outline: 'none', fontFamily: "'Noto Sans',sans-serif" }} />
          <div style={{ marginTop: 14 }}>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 14, color: '#1A6CC4', fontWeight: 500 }}>Resend OTP</a>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 16, padding: '0 32px 28px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', background: '#9E9E9E', color: '#fff', border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>cancel</button>
          <button onClick={submit} style={{ flex: 1, padding: '12px', background: '#1A6CC4', color: '#fff', border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Submit</button>
        </div>
      </div>
    </div>
  );
}
