import { useState } from 'react';
import { BarChart2, Sparkles, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BtnGhost, BtnRow } from '../components/common/Button';
import { AnikaPanel } from '../components/common/AnikaPanel';
import { InfoBanner } from '../components/common/InfoBanner';
import { LenderCard } from '../components/ui/LenderCard';
import { LENDERS } from '../data/lenders';
import './LendersScreen.css';

const FREQ_TABS = [
  
  { id: 'weekly',      label: 'Weekly'       },
  { id: 'fortnightly', label: 'Fortnightly'  },
  { id: 'monthly',     label: 'Monthly'     },
];

export function LendersScreen() {
  const { next, prev } = useApp();
  const [frequency, setFrequency] = useState('monthly');

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 10 · Lender Results"
        title="Your lender"
        titleGradient="matches"
        sub={
          <>
            <span className="sh-sub-row">
              <BarChart2 size={13} style={{ color: 'var(--hover)' }} />
              <span>Results ranked by approval probability based on your profile.</span>
            </span>
            <span className="sh-sub-row">
              <Sparkles size={13} style={{ color: 'var(--hover)' }} />
              <span>Powered by Anika AI — no credit file impact.</span>
            </span>
            <span className="sh-sub-row">
              <Building2 size={13} style={{ color: 'rgba(16,185,129,0.85)' }} />
              <span>Select a lender to review rates, fees and repayment options.</span>
            </span>
          </>
        }
      />

      <AnikaPanel
        message={`I found ${LENDERS.length} lender matches based on your profile — stable PAYG income, 42% debt-to-income ratio, and 6+ years residential stability. Results are ranked by approval probability.`}
        thinkingMs={600}
      />
      <InfoBanner icon="Sparkles" variant="green" style={{ marginBottom: 14 }}>
        Axio works on full transparency — no hidden fees. Every total shown is exactly what you pay, inclusive of all fees and lender charges.
      </InfoBanner>

      {/* ── Frequency tab bar ── */}
      <div className="freq-bar">
        <div className="freq-tabs">
          {FREQ_TABS.map(f => (
            <button
              key={f.id}
              className={`freq-tab${frequency === f.id ? ' active' : ''}`}
              onClick={() => setFrequency(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lender-grid">
        {LENDERS.map(l => (
          <LenderCard key={l.id} lender={l} frequency={frequency} />
        ))}
      </div>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
      </BtnRow>
    </div>
  );
}
