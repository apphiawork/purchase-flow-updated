import { ReactNode } from 'react';

/** Bottom action bar.
 *  Desktop: Back on the left, Save Draft + primary CTA grouped on the right.
 *  Mobile: stacked full-width — primary, then Back, then Save Draft (Figma 4674:16097). */
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
        <button className="btn-ghost-outline ab-back" onClick={onBack}>Back</button>
        <button className="btn-ghost ab-save" style={{ padding: '12px 0' }} onClick={onSaveDraft}>Save Draft</button>
        {children}
      </div>
    </>
  );
}
