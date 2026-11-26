import { usePurchaseStore } from '../store/usePurchaseStore';

/** UOI logo. Takes the customer back to the landing page; from the confirmation page it starts a fresh quote. */
export default function Logo() {
  const { currentScreen, goToScreen, resetFlow } = usePurchaseStore();
  return (
    <a href="/" className="logo" aria-label="UOI UniTravel home"
      onClick={(e) => { e.preventDefault(); if (currentScreen === 6) resetFlow(); else goToScreen(1); }}>
      <img src="/logo.png" width={60} height={30} alt="UOI" />
    </a>
  );
}
