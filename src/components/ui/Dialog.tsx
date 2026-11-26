import { usePurchaseStore } from '../../store/usePurchaseStore';
import FDialog from '../flow/FDialog';

/** System dialog driven by store.dialog. */
export default function Dialog() {
  const { dialog, closeDialog } = usePurchaseStore();
  return (
    <FDialog open={dialog.open} onClose={closeDialog} title={dialog.title} className="f-dialog-sm"
      footer={<button type="button" className="f-btn f-btn-primary" onClick={closeDialog}>OK</button>}>
      <p style={{ margin: 0 }}>{dialog.msg}</p>
    </FDialog>
  );
}
