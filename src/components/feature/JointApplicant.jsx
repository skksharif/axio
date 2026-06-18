import { useState } from 'react';
import { Users, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ToggleSwitch } from '../forms/ToggleSwitch';
import './JointApplicant.css';

export function JointApplicant() {
  const { state, updateState } = useApp();
  const [sent, setSent] = useState(false);

  const toggle = () => updateState({ jointApplicant: !state.jointApplicant });

  return (
    <div className="jt-card">
      <div className="jt-header" onClick={toggle}>
        <div className="jt-icon-box">
          <Users size={17} />
        </div>
        <div className="jt-text">
          <div className="jt-title">Add a joint applicant?</div>
          <div className="jt-sub">A co-borrower can improve approval odds and your rate</div>
        </div>
        <ToggleSwitch on={state.jointApplicant} onToggle={e => { e.stopPropagation(); toggle(); }} />
      </div>

      {state.jointApplicant && (
        <div className="jt-panel">
          <div className="jt-info">
            <div className="jt-info-icon">
              <Sparkles size={12} />
            </div>
            <p className="jt-info-text">
              We'll send a secure invite. Your co-applicant completes their profile independently — no in-person meeting needed.
            </p>
          </div>

          <div className="jt-fields">
            <div className="fld">
              <label className="fl">Co-applicant name</label>
              <input className="inp" placeholder="Full name" />
            </div>
            <div className="fld">
              <label className="fl">Relationship</label>
              <select className="sel" value="Spouse / partner" onChange={() => {}} disabled>
                <option value="Spouse / partner">Spouse / Partner</option>
              </select>
            </div>
            <div className="fld">
              <label className="fl">Mobile</label>
              <input className="inp" type="tel" placeholder="0400 000 000" />
            </div>
            <div className="fld">
              <label className="fl">Email</label>
              <input className="inp" type="email" placeholder="jane@example.com" />
            </div>
          </div>

          {sent ? (
            <div className="jt-sent">
              <CheckCircle2 size={15} />
              <span>Invite sent — they'll receive a secure SMS &amp; email link.</span>
            </div>
          ) : (
            <button className="jt-cta" onClick={() => setSent(true)}>
              <Send size={13} />
              Send application invite
            </button>
          )}
        </div>
      )}
    </div>
  );
}
