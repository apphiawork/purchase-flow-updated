import { useState } from 'react';
import Modal from '../ui/Modal';
import { CloseIcon } from '../icons';

export default function SaveDraftModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  return (
    <Modal open={open} onClose={onClose} variant="cov" modalStyle={{ width: 560 }}>
      <div className="cov-head">
        <h3>Save quote for later?</h3>
        <button className="cov-x" onClick={onClose} aria-label="close"><CloseIcon /></button>
      </div>
      <div className="cov-body" style={{ overflow: 'visible' }}>
        <p style={{ fontSize: 14, color: '#212121', marginBottom: 16 }}>We'll email your quote so you can finish it at your own convenience.</p>
        <input type="email" className="form-input" placeholder="Enter Email" style={{ width: '100%' }} value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="cov-foot"><button className="btn-primary" onClick={onClose} style={{ padding: '12px 28px' }}>Confirm</button></div>
    </Modal>
  );
}
