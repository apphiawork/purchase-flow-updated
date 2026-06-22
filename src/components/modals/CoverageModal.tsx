import { COVERAGE } from '../../data/addons';
import Modal from '../ui/Modal';
import { CloseIcon } from '../icons';

export default function CoverageModal({ coverageKey, onClose }: { coverageKey: string | null; onClose: () => void }) {
  const c = coverageKey ? COVERAGE[coverageKey] : null;
  return (
    <Modal open={!!c} onClose={onClose} variant="cov">
      {c && (
        <>
          <div className="cov-head">
            <h3>{c.title}</h3>
            <button className="cov-x" onClick={onClose} aria-label="close"><CloseIcon /></button>
          </div>
          <div className="cov-body"><ul>{c.items.map((i) => <li key={i}>{i}</li>)}</ul></div>
          <div className="cov-foot"><button className="btn-primary" onClick={onClose} style={{ padding: '10px 28px' }}>OK</button></div>
        </>
      )}
    </Modal>
  );
}
