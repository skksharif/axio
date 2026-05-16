import { useState } from 'react';
import { ShieldCheck, ClipboardList, Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { SnapCard } from '../components/ui/SnapCard';
import { SvcPill } from '../components/common/Badge';
import { SERVICEABILITY, SNAP_CARDS } from '../data/summaryData';
import './SummaryScreen.css';

export function SummaryScreen() {
  const { next, prev } = useApp();
  const [openSnap, setOpenSnap] = useState(null);

  const toggleSnap = (id) => setOpenSnap(p => p === id ? null : id);

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 10 · Final Summary"
        title="Application"
        titleGradient="summary"
        sub={
          <>
            <span style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 7 }}>
              <ClipboardList size={13} style={{ color: 'rgba(16,185,129,0.85)', flexShrink: 0, marginTop: 5 }} />
              <span>Review your complete application before submission.</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
              <Pencil size={13} style={{ color: 'var(--hover)', flexShrink: 0, marginTop: 5 }} />
              <span>Edit any section if needed.</span>
            </span>
          </>
        }
      />

      <div className="anika-hero">
        <div className="ah-top">
          <div className="ah-row">
            <div className="ah-left">
              <div className="ai-orb-lg">AI</div>
              <div>
                <div className="ah-title">Anika financial assessment</div>
                <div className="ah-narrative" dangerouslySetInnerHTML={{ __html: SERVICEABILITY.narrative }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <SvcPill variant={SERVICEABILITY.pillCls}>{SERVICEABILITY.pill}</SvcPill>
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
              <div className="metric-val" style={{ color: 'var(--green)' }}>{SERVICEABILITY.surplus}</div>
              <div className="metric-sub" style={{ color: 'var(--green)' }}>After all commitments</div>
            </div>
            <div className="metric-box">
              <div className="metric-lbl">Net assets</div>
              <div className="metric-val">$395,000</div>
              <div className="metric-sub" style={{ color: 'var(--green)' }}>Strong position</div>
            </div>
            <div className="metric-box">
              <div className="metric-lbl">Lender matches</div>
              <div className="metric-val" style={{ color: 'var(--green)' }}>{SERVICEABILITY.matches}</div>
              <div className="metric-sub" style={{ color: 'var(--green)' }}>From 45+ panel</div>
            </div>
          </div>
        </div>

        <div className="ah-bottom">
          <div>
            <div className="flex-between" style={{ marginBottom: 8 }}>
              <span className="text-small text-border2">Debt-to-income ratio (DTI)</span>
              <span className="text-strong" style={{ color: 'var(--green)' }}>{SERVICEABILITY.dtiVal}</span>
            </div>
            <div className="dti-track">
              <div className="dti-fill" style={{ width: SERVICEABILITY.dtiFill }} />
            </div>
          </div>
          <div className="dti-narrative" dangerouslySetInnerHTML={{ __html: SERVICEABILITY.dtiNote }} />
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
