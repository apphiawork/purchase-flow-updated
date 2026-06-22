import { useState } from 'react';
import { PC_DATA, PC_TABS } from '../../data/plans';
import Modal from '../ui/Modal';
import { CloseIcon } from '../icons';

export default function PlanCompareModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState(PC_TABS[0]);
  const rows = PC_DATA[tab] || [];

  return (
    <Modal open={open} onClose={onClose} variant="pc">
      <div className="pc-head">
        <h2>Compare InsureTravel Plans</h2>
        <button className="pc-x" onClick={onClose} aria-label="close"><CloseIcon /></button>
      </div>
      <div className="pc-tabs">
        {PC_TABS.map((t) => (
          <button key={t} className={`pc-tab ${t === tab ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="pc-table">
        <div className="pc-thead"><span>&nbsp;</span><span>Value (S$)</span><span>Plus (S$)</span><span>Pro (S$)</span></div>
        <div>
          {rows.map((r, i) => (
            <div className={`pc-row ${r.g ? 'pc-group' : ''}`} key={i}>
              <div className="pc-label">{r.label}</div>
              <div className="pc-cell">{r.v || '—'}</div>
              <div className="pc-cell">{r.p || '—'}</div>
              <div className="pc-cell">{r.pro || '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
