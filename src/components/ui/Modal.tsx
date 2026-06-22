import { ReactNode } from 'react';

/** Generic overlay modal. `variant` selects the matching CSS overlay/modal classes
 *  so each modal keeps its exact look from raw. */
type Variant = 'cov' | 'pc' | 'payment';

const CLASSES: Record<Variant, { overlay: string; modal: string }> = {
  cov: { overlay: 'cov-overlay', modal: 'cov-modal' },
  pc: { overlay: 'pc-overlay', modal: 'pc-modal' },
  payment: { overlay: 'modal-overlay', modal: 'modal' },
};

export default function Modal({ open, onClose, variant, modalStyle, backdropClose = true, children }: {
  open: boolean;
  onClose: () => void;
  variant: Variant;
  modalStyle?: React.CSSProperties;
  backdropClose?: boolean;
  children: ReactNode;
}) {
  if (!open) return null;
  const { overlay, modal } = CLASSES[variant];
  return (
    <div
      className={`${overlay} open`}
      onClick={backdropClose ? (e) => { if (e.target === e.currentTarget) onClose(); } : undefined}
    >
      <div className={modal} style={modalStyle}>{children}</div>
    </div>
  );
}
