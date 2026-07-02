import { useEffect } from 'react';
import { usePurchaseStore } from '../../store/usePurchaseStore';

/** Flat success alert (UOI design system 1358:378): green fill, check icon, message. Auto-dismisses. */
export default function Toast() {
  const { toast, hideToast } = usePurchaseStore();

  useEffect(() => {
    if (!toast.open) return;
    const t = setTimeout(hideToast, 4000);
    return () => clearTimeout(t);
  }, [toast.open, toast.msg, hideToast]);

  if (!toast.open) return null;

  return (
    <div className="toast-wrap">
      <div className="toast toast-success" role="status" onClick={hideToast}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.667" fill="#08754F" />
          <path d="M5.2 8.2 7 10 10.8 6.1" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="toast-msg">{toast.msg}</span>
      </div>
    </div>
  );
}
