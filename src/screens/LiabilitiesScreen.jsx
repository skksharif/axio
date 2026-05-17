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

  const realEstateLinks = Object.values(state.realEstateLinks || {});
  const hasLinkedRealEstate = realEstateLinks.length > 0;

  const anikaMessage = hasLinkedRealEstate
    ? `I've pre-linked ${realEstateLinks.length} real estate ${realEstateLinks.length === 1 ? 'liability' : 'liabilities'} from your assets — auto-carried across. Select any additional liability types below.`
    : "Select applicable liabilities. If you have financed assets, enable 'Has finance?' in Assets to auto-link them here.";

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 6 · Liabilities"
        title="Your"
        titleGradient="liabilities"
        sub={
          <>
            <span className="sh-sub-row">
              <ListChecks size={13} style={{ color: 'var(--hover)' }} />
              <span>Select applicable liabilities.</span>
            </span>
            <span className="sh-sub-row">
              <Link2 size={13} style={{ color: 'rgba(16,185,129,0.85)' }} />
              <span>Financed assets are already listed.</span>
            </span>
            <span className="sh-sub-row">
              <Sparkles size={13} style={{ color: 'var(--hover)' }} />
              <span>Your liabilities help Anika AI understand your existing financial commitments and borrowing capacity.</span>
            </span>
          </>
        }
      />

      <AnikaPanel message={anikaMessage} thinkingMs={400} />

      <div className="al-cols">
        {[0, 1].map(col => (
          <div key={col} className="al-col">
            {LIABILITY_TYPES.filter((_, i) => i % 2 === col).map(l => {
              const linkedItems = l.linked ? realEstateLinks : [];
              const isLinked = linkedItems.length > 0;
              const linkedMeta = isLinked
                ? `Auto-linked · ${linkedItems.length} propert${linkedItems.length !== 1 ? 'ies' : 'y'}`
                : null;
              return (
                <ALCard
                  key={l.id}
                  id={l.id}
                  icon={l.icon}
                  title={l.title}
                  desc={l.desc}
                  on={isLinked || !!state.liabilities[l.id]}
                  onToggle={isLinked ? undefined : () => toggleLiability(l.id)}
                  isLinked={isLinked}
                  linkedItems={linkedItems}
                  linkedMeta={linkedMeta}
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
          <div className="text-small" style={{ color: 'rgba(15,224,133,.6)', marginTop: 3 }}>
            {hasLinkedRealEstate ? 'Real estate pre-linked' : 'None declared'}
          </div>
        </div>
        <div className="tot-box red">
          <div className="tot-lbl">Total outstanding</div>
          <div className="tot-val">$410,000</div>
        </div>
        <div className="tot-box blue">
          <div className="tot-lbl">Types declared</div>
          <div className="tot-val">{hasLinkedRealEstate ? 1 : 0}</div>
        </div>
      </div>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue to expenses →</BtnPrimary>
      </BtnRow>
    </div>
  );
}
