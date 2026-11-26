import { useState } from 'react';

/** Mock Singpass hand-off (Figma 7318:51001 login, 7318:51010 approve). Tapping the QR code or
 *  "Use password" logs in; "I Agree" shares the demo Myinfo profile. */
export default function SingpassFlow({ onAgree, onCancel }: { onAgree: () => void; onCancel: () => void }) {
  const [step, setStep] = useState<'login' | 'approve'>('login');
  if (step === 'login') {
    return (
      <div className="f-sp-overlay" role="dialog" aria-label="Log in with Singpass">
        <div className="f-sp-login">
          <img src="/singpass-login.jpg" alt="Singpass login: scan the QR code or use your password" />
          <button type="button" className="f-sp-hot" style={{ left: '55.8%', top: '13.3%', width: '10.4%', height: '9.3%' }} aria-label="Scan QR code" onClick={() => setStep('approve')} />
          <button type="button" className="f-sp-hot" style={{ left: '52.6%', top: '23.9%', width: '16.7%', height: '2.6%' }} aria-label="Use password" onClick={() => setStep('approve')} />
        </div>
      </div>
    );
  }
  return (
    <div className="f-sp-overlay f-sp-approve" role="dialog" aria-label="Share your Myinfo data">
      <div style={{ width: 400, maxWidth: 'calc(100% - 32px)' }}>
        <div className="f-sp-card">
          <div className="f-sp-top">
            <div className="logo">singpass</div>
            Singpass retrieves personal data from relevant government agencies to pre-fill the relevant fields, making digital transactions faster and more convenient.
            <b>UOI Customer Portal by United Overseas Insurance is requesting your information from Singpass to register for an account.</b>
          </div>
          <div className="f-sp-list">
            {['Name', 'NRIC/FIN', 'Mobile Number', 'Date of Birth', 'Registered Address'].map((i) => <span key={i}>&gt; {i}</span>)}
          </div>
        </div>
        <p className="f-sp-note">Clicking the "I Agree" button permits the digital service to retrieve your data based on the Terms of Use.</p>
        <div className="f-sp-btns">
          <button type="button" className="f-sp-cancel" onClick={onCancel}>Cancel</button>
          <button type="button" className="f-sp-agree" onClick={onAgree}>I Agree</button>
        </div>
      </div>
    </div>
  );
}
