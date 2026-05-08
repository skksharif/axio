import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { AnikaStrip } from '../components/common/AnikaStrip';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { ALCard } from '../components/ui/ALCard';
import { ASSET_TYPES } from '../data/assetTypes';
import '../components/ui/ALCard.css';

export function AssetsScreen() {
  const { state, toggleAsset, next, prev } = useApp();

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 5 · Assets"
        title="Your"
        titleGradient="assets"
        sub="Select each asset type to expand and declare. Toggle finance on if the asset has an attached loan — it auto-links to liabilities."
      />

      <AnikaStrip>
        <strong>Anika tip:</strong> If any asset has a loan attached, switch on "Has finance?" — those details auto-link to your Liabilities section. No double entry needed.
      </AnikaStrip>

      <div className="al-grid">
        {ASSET_TYPES.map(a => (
          <ALCard
            key={a.id}
            id={a.id}
            icon={a.icon}
            title={a.title}
            desc={a.desc}
            hasFin={a.hasFin}
            on={!!state.assets[a.id]}
            onToggle={() => toggleAsset(a.id)}
            isRealEstate={a.id === 'realestate'}
          />
        ))}
      </div>

      <div className="totals-row">
        <div className="tot-box hl">
          <div className="tot-lbl">Total assets</div>
          <div className="tot-val">$805,000</div>
          <div className="text-small" style={{ color: 'rgba(15,224,133,.6)', marginTop: 3 }}>2 types declared</div>
        </div>
        <div className="tot-box red">
          <div className="tot-lbl">Finance attached</div>
          <div className="tot-val">$410,000</div>
          <div className="text-small" style={{ color: 'rgba(247,95,122,.6)', marginTop: 3 }}>Auto-linked to liabilities</div>
        </div>
        <div className="tot-box blue">
          <div className="tot-lbl">Net position</div>
          <div className="tot-val">$395,000</div>
          <div className="text-small" style={{ color: 'rgba(79,110,247,.6)', marginTop: 3 }}>Assets minus finance</div>
        </div>
      </div>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue to liabilities →</BtnPrimary>
      </BtnRow>
    </div>
  );
}
