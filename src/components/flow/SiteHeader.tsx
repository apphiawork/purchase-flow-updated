import Logo from '../Logo';
import { HelpIcon } from '../icons';
import StepNav from '../layout/StepNav';

/** Top bar: logo, optional step bar (screens 2–5), Need Assistance. */
export default function SiteHeader({ step }: { step?: number }) {
  if (step !== undefined) {
    return (
      <nav className="top-nav">
        <Logo />
        <StepNav stepNum={step} />
        <a href="https://www.uoi.com.sg/uoi/resources/index.page" target="_blank" rel="noopener noreferrer" className="f-assist"><HelpIcon /> Need Assistance?</a>
      </nav>
    );
  }
  return (
    <header className="f-header">
      <div className="f-wide">
        <Logo />
        <a href="https://www.uoi.com.sg/uoi/resources/index.page" target="_blank" rel="noopener noreferrer" className="f-assist"><HelpIcon /> Need Assistance?</a>
      </div>
    </header>
  );
}
