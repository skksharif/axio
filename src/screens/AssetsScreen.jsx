import { useCallback, useEffect, useMemo } from 'react';
import { LayoutGrid, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { AnikaPanel } from '../components/common/AnikaPanel';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { ALCard } from '../components/ui/ALCard';
import { ASSET_TYPES } from '../data/assetTypes';
import '../components/ui/ALCard.css';

// Default data shape for an asset type before the user has touched it.
const DEFAULT_ASSET_DATA = { nextId: 2, items: { 1: {} } };

export function AssetsScreen() {
  const {
    state,
    toggleAsset,
    setAssetItemField,
    addAssetItem,
    removeAssetItem,
    setRealEstateLink,
    removeRealEstateLink,
    clearRealEstateLinks,
    next,
    prev,
  } = useApp();

  // ─── Owner-Occupied uniqueness tracking ──────────────────────────────────
  // Derived from items: which item ID (if any) currently holds owner-occupied.
  const reItems = state.assetsData?.realestate?.items;

  const ownerOccupiedItemId = useMemo(() => {
    if (!reItems) return null;
    for (const [id, vals] of Object.entries(reItems)) {
      if (vals.propertyType === 'owner-occupied') return Number(id);
    }
    return null;
  }, [reItems]);

  // ─── Real estate ↔ Liabilities sync ─────────────────────────────────────
  // Keeps realEstateLinks in context in sync with assetsData.realestate.items.
  // Runs whenever asset items change (field edits, add, remove) or the card
  // is toggled. This is the single source of truth for the Liabilities view.
  useEffect(() => {
    if (!state.assets.realestate) return;
    const items = reItems || {};
    Object.entries(items).forEach(([id, vals]) => {
      const numId = Number(id);
      if (vals.financeEnabled) {
        setRealEstateLink(numId, {
          propertyType:    vals.propertyType    ?? '',
          address:         vals.address         ?? '',
          lender:          vals.lender          ?? '',
          originalAmount:  vals.originalAmount  ?? '',
          currentBalance:  vals.currentBalance  ?? '',
          interestRate:    vals.interestRate     ?? '',
          monthlyRepayment: vals.monthlyRepayment ?? '',
          loanType:        vals.loanType        ?? 'P&I',
        });
      } else {
        removeRealEstateLink(numId);
      }
    });
    // setRealEstateLink/removeRealEstateLink are stable callbacks — excluded to
    // prevent false re-runs when realEstateLinks object reference changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reItems, state.assets.realestate]);

  // ─── Toggle handlers ─────────────────────────────────────────────────────
  const handleToggle = useCallback((assetId) => {
    // Turning off real estate clears all linked liabilities instantly.
    if (assetId === 'realestate' && state.assets.realestate) {
      clearRealEstateLinks();
    }
    toggleAsset(assetId);
  }, [state.assets.realestate, toggleAsset, clearRealEstateLinks]);

  // ─── Item callbacks (per asset type) ────────────────────────────────────
  // All three are generic — assetId is closed over in the ALCard render.
  const makeHandlers = useCallback((assetId) => ({
    onAddItem: () => addAssetItem(assetId),
    onRemoveItem: (itemId) => {
      removeAssetItem(assetId, itemId);
      // Real estate: also remove the linked liability for this item.
      if (assetId === 'realestate') removeRealEstateLink(itemId);
    },
    onItemChange: (itemId, fields) => setAssetItemField(assetId, itemId, fields),
  }), [addAssetItem, removeAssetItem, removeRealEstateLink, setAssetItemField]);

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 6 · Assets"
        title="Your"
        titleGradient="assets"
        sub={
          <>
            <span className="sh-sub-row">
              <LayoutGrid size={13} style={{ color: 'var(--hover)' }} />
              <span>Select each asset type to expand and declare your assets.</span>
            </span>
            <span className="sh-sub-row">
              <Sparkles size={13} style={{ color: 'var(--hover)' }} />
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
            {ASSET_TYPES.filter((_, i) => i % 2 === col).map((a) => {
              const handlers = makeHandlers(a.id);
              return (
                <ALCard
                  key={a.id}
                  id={a.id}
                  icon={a.icon}
                  title={a.title}
                  desc={a.desc}
                  hasFin={a.hasFin}
                  on={!!state.assets[a.id]}
                  onToggle={() => handleToggle(a.id)}
                  isRealEstate={a.id === 'realestate'}
                  assetData={state.assetsData[a.id] ?? DEFAULT_ASSET_DATA}
                  onAddItem={handlers.onAddItem}
                  onRemoveItem={handlers.onRemoveItem}
                  onItemChange={handlers.onItemChange}
                  addLabel={a.addLabel}
                  addDesc={a.addDesc}
                  ownerOccupiedItemId={a.id === 'realestate' ? ownerOccupiedItemId : undefined}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="totals-row">
        <div className="tot-box hl">
          <div className="tot-lbl">Total assets</div>
          <div className="tot-val">$805,000</div>
          <div className="text-small" style={{ color: 'rgba(15,224,133,.6)', marginTop: 3 }}>
            2 types declared
          </div>
        </div>
        <div className="tot-box red">
          <div className="tot-lbl">Finance attached</div>
          <div className="tot-val">$410,000</div>
          <div className="text-small" style={{ color: 'rgba(247,95,122,.6)', marginTop: 3 }}>
            Auto-linked to liabilities
          </div>
        </div>
        <div className="tot-box blue">
          <div className="tot-lbl">Net position</div>
          <div className="tot-val">$395,000</div>
          <div className="text-small" style={{ color: 'rgba(79,110,247,.6)', marginTop: 3 }}>
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
