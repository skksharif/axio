import { useState } from 'react';
import { ChevronDown, Check, FileText, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { Card, CardTitle } from '../components/common/Card';
import { PRIVACY_SECTIONS, DECLARATIONS } from '../data/privacyData';
import { getStep } from '../constants/screens';
import './PrivacyScreen.css';

export function PrivacyScreen() {
  const { state, toggleConsent, next, prev } = useApp();
  const [openPanel, setOpenPanel] = useState(0);

  function togglePanel(i) {
    setOpenPanel(prev => prev === i ? null : i);
  }

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow={`Step ${getStep('privacy')} · Privacy & Consent`}
        title="Privacy &"
        titleGradient="consent"
        sub={
          <>
            <span className="sh-sub-row">
              <FileText size={13} style={{ color: 'var(--hover)' }} />
              <span>Please read and confirm the privacy disclosures below.</span>
            </span>
            <span className="sh-sub-row">
              <Send size={13} style={{ color: 'var(--hover)' }} />
              <span>Your application will be submitted to matched lenders upon confirmation.</span>
            </span>
          </>
        }
      />

      <Card>
        <CardTitle icon="ClipboardList">Disclosures</CardTitle>
        {PRIVACY_SECTIONS.map((s, i) => (
          <div key={i} className="priv-section">
            <div className="priv-head" onClick={() => togglePanel(i)}>
              <span>{s.title}</span>
              <span style={{ transition: 'transform .2s', display: 'inline-flex', transform: openPanel === i ? 'rotate(180deg)' : 'none' }}>
                <ChevronDown size={16} />
              </span>
            </div>
            {openPanel === i && (
              <div className="priv-body open">{s.body}</div>
            )}
          </div>
        ))}
      </Card>

      <Card>
        <CardTitle icon="CheckCircle2">Declarations</CardTitle>
        {DECLARATIONS.map((d, i) => (
          <div key={i} className="check-item" onClick={() => toggleConsent(i)}>
            <div className={`check-box ${state.checkedConsents.includes(i) ? 'checked' : ''}`}>
              {state.checkedConsents.includes(i) ? <Check size={11} strokeWidth={2.5} /> : null}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text1)', lineHeight: 1.6 }}>{d}</div>
          </div>
        ))}
      </Card>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue to summary →</BtnPrimary>
      </BtnRow>
    </div>
  );
}
