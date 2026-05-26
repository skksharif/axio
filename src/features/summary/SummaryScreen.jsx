import { useState, useCallback, useMemo } from 'react';
import { ShieldCheck, ClipboardList, Pencil } from 'lucide-react';
import { useApp } from '@shared/hooks/useApp';
import { SCREENS, getStep } from '@shared/constants/screens';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { BtnPrimary, BtnGhost, BtnRow } from '@/components/common/Button';
import { SnapCard } from '@/components/ui/SnapCard';
import { SvcPill } from '@/components/common/Badge';
import { SERVICEABILITY, SNAP_CARDS } from '@shared/data/summaryData';
import './SummaryScreen.css';

function parseCurrency(str) {
  return parseFloat(String(str ?? '').replace(/[^0-9.]/g, '')) || 0;
}

function formatAUD(n) {
  return '$' + n.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function SummaryScreen() {
  const { state, next, prev, goTo } = useApp();
  const [openSnap, setOpenSnap] = useState(null);

  const toggleSnap = (id) => setOpenSnap(p => p === id ? null : id);

  // Navigates to the screen matching a SCREENS id string.
  // Uses the centralized SCREENS config — no hardcoded indexes.
  const handleEdit = useCallback((screenId) => {
    const idx = SCREENS.findIndex(s => s.id === screenId);
    if (idx !== -1) goTo(idx);
  }, [goTo]);

  // Sum current balances of eligible liabilities where consolidate === true.
  // Real estate (realEstateLinks + homeloan liabilityData) is excluded — not eligible for consolidation.
  const totalConsolidation = useMemo(() => {
    let total = 0;
    Object.entries(state.liabilitiesData || {}).forEach(([typeId, liabType]) => {
      if (typeId === 'homeloan') return;
      Object.values(liabType.items || {}).forEach(item => {
        if (item.consolidate) total += parseCurrency(item.currentBalance);
      });
    });
    return total;
  }, [state.liabilitiesData]);

  // Build snap card list — always inject the Consolidate row into Assets & Liabilities.
  const snapCards = useMemo(() => SNAP_CARDS.map(snap => {
    if (snap.id !== 'assets') return snap;
    return {
      ...snap,
      fields: [
        ...snap.fields,
        ['Consolidate', formatAUD(totalConsolidation), totalConsolidation > 0 ? 'yellow' : undefined],
      ],
    };
  }), [totalConsolidation]);

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow={`Step ${getStep('summary')} · Final Summary`}
        title="Application"
        titleGradient="summary"
        sub={
          <>
            <span className="sh-sub-row">
              <ClipboardList size={13} style={{ color: 'rgba(16,185,129,0.85)' }} />
              <span>Review your complete application before submission.</span>
            </span>
            <span className="sh-sub-row">
              <Pencil size={13} style={{ color: 'var(--hover)' }} />
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

      {snapCards.map(snap => (
        <SnapCard
          key={snap.id}
          icon={snap.icon}
          title={snap.title}
          sub={snap.sub}
          fields={snap.fields}
          open={openSnap === snap.id}
          onToggle={() => toggleSnap(snap.id)}
          onEdit={snap.screenId ? () => handleEdit(snap.screenId) : undefined}
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
