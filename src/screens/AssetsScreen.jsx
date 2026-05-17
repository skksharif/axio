import { useCallback } from 'react';
import { LayoutGrid, Sparkles } from 'lucide-react';
import { useApp } from "../context/AppContext";
import { ScreenHeader } from "../components/common/ScreenHeader";
import { AnikaPanel } from "../components/common/AnikaPanel";
import { BtnPrimary, BtnGhost, BtnRow } from "../components/common/Button";
import { ALCard } from "../components/ui/ALCard";
import { ASSET_TYPES } from "../data/assetTypes";
import "../components/ui/ALCard.css";

export function AssetsScreen() {
  const { state, toggleAsset, setRealEstateLink, removeRealEstateLink, clearRealEstateLinks, next, prev } = useApp();

  const handleToggleRealEstate = useCallback(() => {
    if (state.assets.realestate) clearRealEstateLinks();
    toggleAsset('realestate');
  }, [state.assets.realestate, toggleAsset, clearRealEstateLinks]);

  const handleRealEstateChange = useCallback((itemId, data) => {
    if (data) setRealEstateLink(itemId, data);
    else removeRealEstateLink(itemId);
  }, [setRealEstateLink, removeRealEstateLink]);

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 5 · Assets"
        title="Your"
        titleGradient="assets"
        sub={
          <>
            <span style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 7 }}>
              <LayoutGrid size={13} style={{ color: 'var(--hover)', flexShrink: 0, marginTop: 5 }} />
              <span>Select each asset type to expand and declare your assets.</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
              <Sparkles size={13} style={{ color: 'var(--hover)', flexShrink: 0, marginTop: 5 }} />
              <span>Your asset position helps Anika AI understand your financial profile, borrowing strength, and lender eligibility.</span>
            </span>
          </>
        }
      />

      <AnikaPanel
        message="If any asset has an attached loan, enable 'Has finance?' — those details auto-link to your Liabilities section with no double entry required."
        thinkingMs={400}
      />

      <div className="al-cols">
        {[0, 1].map((col) => (
          <div key={col} className="al-col">
            {ASSET_TYPES.filter((_, i) => i % 2 === col).map((a) => (
              <ALCard
                key={a.id}
                id={a.id}
                icon={a.icon}
                title={a.title}
                desc={a.desc}
                hasFin={a.hasFin}
                on={!!state.assets[a.id]}
                onToggle={a.id === 'realestate' ? handleToggleRealEstate : () => toggleAsset(a.id)}
                isRealEstate={a.id === 'realestate'}
                onRealEstateChange={a.id === 'realestate' ? handleRealEstateChange : undefined}
                addLabel={a.addLabel}
                addDesc={a.addDesc}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="totals-row">
        <div className="tot-box hl">
          <div className="tot-lbl">Total assets</div>
          <div className="tot-val">$805,000</div>
          <div
            className="text-small"
            style={{ color: "rgba(15,224,133,.6)", marginTop: 3 }}
          >
            2 types declared
          </div>
        </div>
        <div className="tot-box red">
          <div className="tot-lbl">Finance attached</div>
          <div className="tot-val">$410,000</div>
          <div
            className="text-small"
            style={{ color: "rgba(247,95,122,.6)", marginTop: 3 }}
          >
            Auto-linked to liabilities
          </div>
        </div>
        <div className="tot-box blue">
          <div className="tot-lbl">Net position</div>
          <div className="tot-val">$395,000</div>
          <div
            className="text-small"
            style={{ color: "rgba(79,110,247,.6)", marginTop: 3 }}
          >
            Assets minus finance
          </div>
        </div>
      </div>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue to liabilities →</BtnPrimary>
      </BtnRow>
    </div>
  );
}
