import { useState } from 'react';
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
  const { prev } = useApp();
  const [frequency, setFrequency] = useState('monthly');

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 11 · Lender Results"
        title="Your lender"
        titleGradient="matches"
        sub="Ranked by approval probability. Powered by Anika AI."
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
        <span className="freq-bar-label">Repayment frequency</span>
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
