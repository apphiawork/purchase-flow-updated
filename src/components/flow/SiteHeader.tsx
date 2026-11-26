import Logo from '../Logo';
import { HelpIcon } from '../icons';
import StepNav from '../layout/StepNav';

/** Nav (Figma "Nav / container", max 1120px): logo, step bar on screens 2–5, Need Assistance. */
export default function SiteHeader({ step }: { step?: number }) {
  return (
    <header className="f-header">
      <div className="f-wrap">
        <Logo />
        {step !== undefined && <StepNav stepNum={step} />}
        <a href="https://www.uoi.com.sg/uoi/resources/index.page" target="_blank" rel="noopener noreferrer" className="f-assist"><HelpIcon /> Need Assistance?</a>
      </div>
    </header>
  );
}
