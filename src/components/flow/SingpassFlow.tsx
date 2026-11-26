import { useState } from 'react';

/** Mock Singpass hand-off. Login (Figma 7318:51001): tapping anywhere on the page, including the QR code,
 *  logs in. Approve (Figma 7318:51010): "I Agree" shares the demo Myinfo profile. */
export default function SingpassFlow({ onAgree, onCancel }: { onAgree: () => void; onCancel: () => void }) {
  const [step, setStep] = useState<'login' | 'approve'>('login');
  if (step === 'login') {
    return (
      <button type="button" className="f-sp-overlay f-sp-login" onClick={() => setStep('approve')} aria-label="Scan the QR code to log in with Singpass">
        <img src="/singpass-login.jpg" alt="" />
      </button>
    );
  }
  return (
    <div className="f-sp-overlay f-sp-approve" role="dialog" aria-label="Share your Myinfo data">
      <div className="f-sp-wrap">
        <div className="f-sp-card">
          <div className="f-sp-top">
            <img src="/singpass-logo.png" alt="Singpass" />
            <p>Singpass retrieves personal data from relevant government agencies to pre-fill the relevant fields, making digital transactions faster and more convenient.</p>
            <b>UOI Customer Portal by United Overseas Insurance is requesting your information from Singpass to register for an account.</b>
          </div>
          <ul className="f-sp-list">
            {['Name', 'NRIC/FIN', 'Mobile Number', 'Date of Birth', 'Registered Address'].map((i) => <li key={i}>{i}</li>)}
          </ul>
        </div>
        <p className="f-sp-note">Clicking the “I Agree” button permits the digital service to retrieve your data based on the <a href="https://www.singpass.gov.sg/main/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</a></p>
        <div className="f-sp-btns">
          <button type="button" className="f-sp-cancel" onClick={onCancel}>Cancel</button>
          <button type="button" className="f-sp-agree" onClick={onAgree}>I Agree</button>
        </div>
      </div>
    </div>
  );
}
