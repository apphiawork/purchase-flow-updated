import { usePurchaseStore } from '../../store/usePurchaseStore';
import TopNav from '../layout/TopNav';
import Footer from '../layout/Footer';

const PRODUCTS = [
  { img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=240&q=70&fit=crop', alt: 'Car', title: 'Car Insurance', icon: <path d="M5 16v2H3v-2m18 0v2h-2v-2M4 16l1.6-5.4A2 2 0 0 1 7.5 9h9a2 2 0 0 1 1.9 1.6L20 16H4z" stroke="#005EB8" strokeWidth="1.6" strokeLinejoin="round" />, desc: 'Get medical coverage for accidents and have peace of mind.', extra: <><circle cx="7.5" cy="16" r="1.3" stroke="#005EB8" strokeWidth="1.6" /><circle cx="16.5" cy="16" r="1.3" stroke="#005EB8" strokeWidth="1.6" /></> },
  { img: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=240&q=70&fit=crop', alt: 'Home', title: 'Home Insurance', icon: <><path d="M4 11l8-6 8 6M6 10v9h12v-9" stroke="#005EB8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 19v-5h4v5" stroke="#005EB8" strokeWidth="1.6" /></>, desc: 'Protect your home and loved ones from unforeseen events.' },
  { img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=240&q=70&fit=crop', alt: 'Hospital', title: 'Hospital Protection', icon: <><rect x="4" y="4" width="16" height="16" rx="2" stroke="#005EB8" strokeWidth="1.6" /><path d="M12 8v8M8 12h8" stroke="#005EB8" strokeWidth="1.6" strokeLinecap="round" /></>, desc: 'Cover day-to-day hospital expenses when you need it most.' },
  { img: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=240&q=70&fit=crop', alt: 'PA', title: 'Personal Accident', icon: <><circle cx="12" cy="8" r="3.2" stroke="#005EB8" strokeWidth="1.6" /><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#005EB8" strokeWidth="1.6" strokeLinecap="round" /></>, desc: 'Get medical coverage for accidents and have peace of mind.' },
];

export default function Screen6Confirm() {
  const s = usePurchaseStore();
  return (
    <div className="screen active">
      <TopNav borderless />
      <div className="confirm-body">
        <div className="confirm-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h1>Thank you for your purchase, you're ready to go!</h1>
        <p className="subtitle">
          Thank you for insuring with United Overseas Insurance. Your Certificate of Insurance <strong className="policy-number">{s.policyNumber}</strong> will be sent to your email address <strong>{s.applicant.email || 'your registered email'}</strong> and accessible via UOI Customer Portal. For further assistance, you may contact us at 6222 7733.
        </p>
        <div className="confirm-actions">
          <button className="btn-primary" style={{ padding: '14px 36px', fontSize: 15 }}>Log In Customer Portal</button>
          <button className="btn-ghost" onClick={() => s.resetFlow()}>Buy Again</button>
        </div>
      </div>

      <div className="s6-more">
        <h2>Stay protected beyond your travels</h2>
        <div className="product-grid">
          {PRODUCTS.map((p) => (
            <div className="product-card" key={p.title}>
              <img className="product-card-img" src={p.img} alt={p.alt} />
              <div className="product-card-body">
                <div className="product-card-head">
                  <div className="product-card-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">{p.icon}{p.extra}</svg>
                    {p.title}
                  </div>
                  <div className="meta">From S$X/year</div>
                </div>
                <p>{p.desc}</p>
                <a href="#" onClick={(e) => e.preventDefault()}>Get Quote →</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
