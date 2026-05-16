import { ListChecks, Link2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { AnikaPanel } from '../components/common/AnikaPanel';
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
        sub={
          <>
            <span style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 7 }}>
              <ListChecks size={13} style={{ color: 'var(--hover)', flexShrink: 0, marginTop: 5 }} />
              <span>Select applicable liabilities.</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 7 }}>
              <Link2 size={13} style={{ color: 'rgba(16,185,129,0.85)', flexShrink: 0, marginTop: 5 }} />
              <span>Financed assets are already listed.</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
              <Sparkles size={13} style={{ color: 'var(--hover)', flexShrink: 0, marginTop: 5 }} />
              <span>Your liabilities help Anika AI understand your existing financial commitments and borrowing capacity.</span>
            </span>
          </>
        }
      />

      <AnikaPanel
        message="I've pre-linked 1 liability from your assets — your home loan has been auto-carried across. Select any additional liability types below and add the details."
        thinkingMs={400}
      />

      <div className="al-cols">
        {[0, 1].map(col => (
          <div key={col} className="al-col">
            {LIABILITY_TYPES.filter((_, i) => i % 2 === col).map(l => {
              const isLinked = !!(l.linked && state.realEstateFinance);
              return (
                <ALCard
                  key={l.id}
                  id={l.id}
                  icon={l.icon}
                  title={l.title}
                  desc={l.desc}
                  on={!!state.liabilities[l.id]}
                  onToggle={() => toggleLiability(l.id)}
                  isLinked={isLinked}
                  linkedMeta={isLinked ? 'Auto-linked from Real-estate · $410,000' : null}
                  isLiability={!isLinked}
                  addLabel={l.addLabel}
                  addDesc={l.addDesc}
                />
              );
            })}
          </div>
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
