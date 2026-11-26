import { useState } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import FDialog from '../flow/FDialog';

export default function SaveDraftModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = usePurchaseStore();
  const [email, setEmail] = useState(s.applicant.email);
  const confirm = () => { s.showToast('Draft saved. We’ve emailed your quote so you can resume anytime.'); onClose(); };
  return (
    <FDialog open={open} onClose={onClose} title="Save quote for later?"
      footer={<button type="button" className="f-btn f-btn-primary" onClick={confirm}>Confirm</button>}>
      <p style={{ margin: '0 0 16px' }}>We'll email your quote so you can finish it at your own convenience.</p>
      <input type="email" className="f-input" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
    </FDialog>
  );
}
