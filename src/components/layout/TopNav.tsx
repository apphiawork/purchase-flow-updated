import Logo from '../Logo';
import StepNav from './StepNav';
import { HelpIcon } from '../icons';

/** Top nav used on screens 2–5 (with step indicator) and the loading screen.
 *  Pass stepNum to show the step indicator; omit on the confirmation screen. */
export default function TopNav({ stepNum, borderless = false }: { stepNum?: number; borderless?: boolean }) {
  return (
    <nav className="top-nav" style={borderless ? { borderBottom: 'none' } : undefined}>
      <Logo />
      {stepNum !== undefined && <StepNav stepNum={stepNum} />}
      <a href="https://www.uoi.com.sg/uoi/resources/index.page" target="_blank" rel="noopener noreferrer" className="nav-assist">
        <HelpIcon /> Need Assistance?
      </a>
    </nav>
  );
}
