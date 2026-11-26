import type { AddonKey } from '../../types';
import { AO_ICONS, COVERAGE, addonByKey } from '../../data/addons';
import FDialog from '../flow/FDialog';

/** "View coverage details" (Figma 7344:34221). */
export default function CoverageModal({ coverageKey, onClose }: { coverageKey: AddonKey | null; onClose: () => void }) {
  const ao = coverageKey ? addonByKey(coverageKey) : null;
  const c = coverageKey ? COVERAGE[coverageKey] : null;
  return (
    <FDialog open={!!ao} onClose={onClose} title={ao?.name ?? ''}
      icon={ao && <span className="f-ao-icon" dangerouslySetInnerHTML={{ __html: AO_ICONS[ao.key] }} />}
      footer={<button type="button" className="f-btn f-btn-primary" onClick={onClose}>OK</button>}>
      {c && <><p style={{ margin: 0 }}>{c.intro}</p><ul>{c.items.map((i) => <li key={i}>{i}</li>)}</ul></>}
    </FDialog>
  );
}
