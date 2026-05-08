import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { SnapCard } from '../components/ui/SnapCard';
import { SvcPill } from '../components/common/Badge';
import { SERVICEABILITY_DATA, SNAP_CARDS } from '../data/summaryData';
import './SummaryScreen.css';

export function SummaryScreen() {
  const { state, updateState, next, prev } = useApp();
  const [openSnap, setOpenSnap] = useState(null);

  const svc = state.selectedServiceability || 'green';
  const s = SERVICEABILITY_DATA[svc];

  const setServiceability = (v) => updateState({ selectedServiceability: v });
  const toggleSnap = (id) => setOpenSnap(prev => prev === id ? null : id);

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 10 · Final Summary"
        title="Application"
        titleGradient="summary"
        sub="Review your complete application before submission. Edit any section if needed."
      />

      <div className="svc-demo-bar">
        <div className="text-small text-border2" style={{ padding: '0 10px' }}>Demo:</div>
        {['green', 'yellow', 'red'].map(v => (
          <button
            key={v}
            className="svc-demo-btn"
            style={{
              background: svc === v ? 'var(--bg0)' : 'transparent',
              color: v === 'green' ? 'var(--green)' : v === 'yellow' ? 'var(--yellow)' : 'var(--red)',
            }}
            onClick={() => setServiceability(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      <div className="anika-hero">
        <div className="ah-top">
          <div className="ah-row">
            <div className="ah-left">
              <div className="ai-orb-lg">AI</div>
              <div>
                <div className="ah-title">Anika financial assessment</div>
                <div className="ah-narrative" dangerouslySetInnerHTML={{ __html: s.narrative }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <SvcPill variant={s.pillCls}>{s.pill}</SvcPill>
              <div className="text-small text-border2">Serviceability status</div>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="metric-box">
              <div className="metric-lbl">Annual income</div>
              <div className="metric-val">$74,400</div>
              <div className="metric-sub" style={{ color: 'var(--green)' }}>PAYG verified</div>
            </div>
            <div className="metric-box">
              <div className="metric-lbl">Monthly surplus</div>
              <div className="metric-val" style={{ color: s.surplusColor }}>{s.surplus}</div>
              <div className="metric-sub" style={{ color: s.surplusColor }}>After all commitments</div>
            </div>
            <div className="metric-box">
              <div className="metric-lbl">Net assets</div>
              <div className="metric-val">$395,000</div>
              <div className="metric-sub" style={{ color: 'var(--green)' }}>Strong position</div>
            </div>
            <div className="metric-box">
              <div className="metric-lbl">Lender matches</div>
              <div className="metric-val" style={{ color: s.matchColor }}>{s.matches}</div>
              <div className="metric-sub" style={{ color: s.matchColor }}>From 45+ panel</div>
            </div>
          </div>
        </div>

        <div className="ah-bottom">
          <div>
            <div className="flex-between" style={{ marginBottom: 8 }}>
              <span className="text-small text-border2">Debt-to-income ratio (DTI)</span>
              <span className="text-strong" style={{ color: s.dtiColor }}>{s.dtiVal}</span>
            </div>
            <div className="dti-track">
              <div className="dti-fill" style={{ width: s.dtiFill, background: s.dtiColor }} />
            </div>
            <div className="flex-between" style={{ fontSize: 10.5, color: 'var(--text2)' }}>
              <span style={{ color: 'var(--green)' }}>0–50% Strong</span>
              <span style={{ color: 'var(--yellow)' }}>50–65% Marginal</span>
              <span style={{ color: 'var(--red)' }}>65%+ At risk</span>
            </div>
          </div>
          <div className="dti-narrative" dangerouslySetInnerHTML={{ __html: s.dtiNote }} />
        </div>
      </div>

      {SNAP_CARDS.map(snap => (
        <SnapCard
          key={snap.id}
          icon={snap.icon}
          title={snap.title}
          sub={snap.sub}
          fields={snap.fields}
          open={openSnap === snap.id}
          onToggle={() => toggleSnap(snap.id)}
        />
      ))}

      <div className="card submit-card">
        <div>
          <div className="text-strong">Ready to view your lender matches?</div>
          <div className="text-small text-border2">Submitting sends your application to Anika's matching engine across 45+ lenders. Results ready in seconds.</div>
          <div className="text-small text-border2" style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <ShieldCheck size={13} /> <strong className="text-strong">does not</strong> affect your credit file — soft check only until you choose a lender
          </div>
        </div>
        <BtnPrimary onClick={next} style={{ flexShrink: 0, height: 50, fontSize: 15 }}>Submit &amp; view matches →</BtnPrimary>
      </div>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
      </BtnRow>
    </div>
  );
}
