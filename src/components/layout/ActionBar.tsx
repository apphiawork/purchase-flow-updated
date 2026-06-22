import { ReactNode } from 'react';

/** Bottom action bar: Back on the left, Save Draft + primary CTA on the right. */
export default function ActionBar({ onBack, onSaveDraft, children, narrow = false }: {
  onBack: () => void;
  onSaveDraft: () => void;
  children: ReactNode; // the primary CTA button(s)
  narrow?: boolean;
}) {
  return (
    <>
      <div style={{ flex: 1 }} />
      <div className={`action-bar ${narrow ? 'action-bar-narrow' : ''}`}>
        <button className="btn-secondary" onClick={onBack}>Back</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="btn-ghost" onClick={onSaveDraft}>Save Draft</button>
          {children}
        </div>
      </div>
    </>
  );
}
