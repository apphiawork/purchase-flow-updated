import SiteHeader from '../flow/SiteHeader';
import Footer from '../layout/Footer';

/** Shown while the quote is calculated (Figma 7318:107234): 60px spinner, 16px medium caption. */
export default function ScreenLoading() {
  return (
    <div className="f-screen">
      <SiteHeader />
      <div className="f-loading" role="status">
        <svg className="f-spinner" width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
          <defs><linearGradient id="fSpin" x1="30" y1="5" x2="55" y2="30" gradientUnits="userSpaceOnUse"><stop stopColor="#005EB8" /><stop offset="1" stopColor="#5C55EB" /></linearGradient></defs>
          <circle cx="30" cy="30" r="25" stroke="#C9CED6" strokeWidth="8" />
          <circle cx="30" cy="30" r="25" stroke="url(#fSpin)" strokeWidth="8" strokeLinecap="round" strokeDasharray="62.83 157.08" transform="rotate(-90 30 30)" />
        </svg>
        Hang tight, finding the best plan for your trip…
      </div>
      <Footer />
    </div>
  );
}
