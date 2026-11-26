import { ReactNode, useEffect } from 'react';
import { CloseIcon } from '../icons';

/** Centred dialog on a 40% black overlay. Closes on backdrop click and Escape. */
export default function FDialog({ open, onClose, title, icon, footer, children, className = '' }: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="f-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`f-dialog ${className}`} role="dialog" aria-modal="true">
        <div className="f-dialog-head">
          {icon}
          <h3>{title}</h3>
          <button type="button" className="f-x" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        <div className="f-dialog-body">{children}</div>
        {footer && <div className="f-dialog-foot">{footer}</div>}
      </div>
    </div>
  );
}
