import { usePurchaseStore } from '../../store/usePurchaseStore';
import Modal from './Modal';
import { CloseIcon } from '../icons';

/** System dialog — replaces raw's showDialog/alert. Driven by store.dialog. */
export default function Dialog() {
  const { dialog, closeDialog } = usePurchaseStore();
  return (
    <Modal open={dialog.open} onClose={closeDialog} variant="cov" modalStyle={{ width: 440 }}>
      <div className="cov-head">
        <h3 style={{ fontSize: 16 }}>{dialog.title}</h3>
        <button className="cov-x" onClick={closeDialog} aria-label="close"><CloseIcon /></button>
      </div>
      <div className="cov-body"><p style={{ fontSize: 14, color: '#6E6E6E', lineHeight: 1.5 }}>{dialog.msg}</p></div>
      <div className="cov-foot"><button className="btn-primary" onClick={closeDialog} style={{ padding: '10px 28px' }}>OK</button></div>
    </Modal>
  );
}
