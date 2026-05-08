import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { AnikaStrip } from '../components/common/AnikaStrip';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { ALCard } from '../components/ui/ALCard';
import { LIABILITY_TYPES } from '../data/liabilityTypes';
import '../components/ui/ALCard.css';

export function LiabilitiesScreen() {
  const { state, toggleLiability, next, prev } = useApp();

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 6 · Liabilities"
        title="Your"
        titleGradient="liabilities"
        sub="Select all that apply. Any asset with finance attached is pre-linked below — no re-entry needed."
      />

      <AnikaStrip>
        <strong>Anika has pre-linked 1 liability</strong> from your assets — home loan auto-carried across. Select additional liability types and add details.
      </AnikaStrip>

      <div className="al-grid">
        {LIABILITY_TYPES.map(l => (
          <ALCard
            key={l.id}
            id={l.id}
            icon={l.icon}
            title={l.title}
            desc={l.desc}
            on={!!state.liabilities[l.id]}
            onToggle={() => toggleLiability(l.id)}
            isLinked={l.linked}
            linkedMeta={l.linked ? 'Auto-linked from Real-estate · $410,000' : null}
          />
        ))}
      </div>

      <div className="totals-row">
        <div className="tot-box hl">
          <div className="tot-lbl">Monthly commitments</div>
          <div className="tot-val">$2,650</div>
          <div className="text-small" style={{ color: 'rgba(15,224,133,.6)', marginTop: 3 }}>Home loan pre-linked</div>
        </div>
        <div className="tot-box red">
          <div className="tot-lbl">Total outstanding</div>
          <div className="tot-val">$410,000</div>
        </div>
        <div className="tot-box blue">
          <div className="tot-lbl">Types declared</div>
          <div className="tot-val">1</div>
        </div>
      </div>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue to expenses →</BtnPrimary>
      </BtnRow>
    </div>
  );
}
