import { Fragment } from 'react';
import { STEPS } from '../../data/constants';

/** stepNum is 1-based: 1=Select Plan … 4=Review & Pay. */
export default function StepNav({ stepNum }: { stepNum: number }) {
  return (
    <div className="step-nav">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < stepNum;
        const active = n === stepNum;
        return (
          <Fragment key={label}>
            {i > 0 && <div className={`step-connector ${done ? 'done' : ''}`} />}
            <div className={`step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
              <div className="step-circle">
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <polyline points="2 6.5 4.8 9.5 10 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : n}
              </div>
              <span className="step-label">{label}</span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
