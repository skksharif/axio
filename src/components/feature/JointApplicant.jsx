import { useState } from 'react';
import { useApp } from '@shared/hooks/useApp';
import { ToggleSwitch } from '../forms/ToggleSwitch';
import { InfoBanner } from '../common/InfoBanner';
import { BtnPrimary } from '../common/Button';
import './JointApplicant.css';

export function JointApplicant() {
  const { state, updateState } = useApp();
  const [sent, setSent] = useState(false);

  const toggle = () => updateState({ jointApplicant: !state.jointApplicant });

  return (
    <div className="card">
      <div className="flex-between" onClick={toggle} style={{ cursor: 'pointer' }}>
        <div className="flex-between" style={{ gap: 12 }}>
          <div className="card-icon">👥</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>Add a joint applicant?</div>
            <div style={{ fontSize: 12, color: 'var(--text1)', marginTop: 2 }}>Adding a co-borrower can improve approval odds and rate</div>
          </div>
        </div>
        <ToggleSwitch on={state.jointApplicant} onToggle={e => { e.stopPropagation(); toggle(); }} />
      </div>

      {state.jointApplicant && (
        <div className="joint-panel open">
          <InfoBanner icon="✦" variant="blue" style={{ marginTop: 0, marginBottom: 14 }}>
            We'll send a secure digital invite. Your co-applicant completes their own profile independently in the Axio portal — no in-person meeting needed.
          </InfoBanner>
          <div className="g2">
            <div className="fld"><label className="fl">Co-applicant full name</label><input className="inp" placeholder="Full name" /></div>
            <div className="fld"><label className="fl">Relationship</label>
              <select className="sel">
                <option>Spouse / partner</option><option>Parent</option>
                <option>Sibling</option><option>Friend</option><option>Other</option>
              </select>
            </div>
            <div className="fld"><label className="fl">Mobile number</label><input className="inp" placeholder="0400 000 000" /></div>
            <div className="fld"><label className="fl">Email address</label><input className="inp" placeholder="jane@example.com" /></div>
          </div>
          <BtnPrimary style={{ width: '100%' }} onClick={() => setSent(true)}>Send digital application invite →</BtnPrimary>
          {sent && (
            <InfoBanner icon="✅" variant="green" style={{ marginTop: 12 }}>
              <strong style={{ color: 'var(--green)' }}>Invite sent.</strong> They'll receive a secure SMS and email link to complete their application.
            </InfoBanner>
          )}
        </div>
      )}
    </div>
  );
}
