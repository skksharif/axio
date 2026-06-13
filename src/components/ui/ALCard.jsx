import { useState, useRef, useEffect } from 'react';
import { Check, Link, ChevronDown, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBadge } from '../common/IconBadge';
import { Icon } from '../common/Icon';
import { ToggleSwitch } from '../forms/ToggleSwitch';
import { LenderAutocomplete } from '../common/LenderAutocomplete';
import './ALCard.css';

const EASE = [0.25, 0.46, 0.45, 0.94];

/* Format a raw numeric-string or number as "12.5%" — returns "—" for empty */
function fmtPct(v) {
  if (v === null || v === undefined || v === '') return '—';
  const raw = String(v).replace('%', '').trim();
  return raw ? raw + '%' : '—';
}

function usePercentInput(value, onCommit) {
  const focused = useRef(false);
  const [display, setDisplay] = useState(() => {
    const raw = String(value ?? '').replace('%', '').trim();
    return raw ? raw + '%' : '';
  });

  /* Sync display when value changes externally (prefilled / restored state) */
  useEffect(() => {
    if (focused.current) return;
    const raw = String(value ?? '').replace('%', '').trim();
    setDisplay(raw ? raw + '%' : '');
  }, [value]);

  const handleChange = (e) => {
    const v = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\./g, '$1');
    setDisplay(v);
  };
  const handleFocus = () => {
    focused.current = true;
    setDisplay(String(value ?? '').replace('%', '').trim());
  };
  const handleBlur  = () => {
    focused.current = false;
    const trimmed = display.replace('%', '').trim();
    if (trimmed) {
      setDisplay(trimmed + '%');
      onCommit(trimmed);
    } else {
      setDisplay('');
      onCommit('');
    }
  };

  return { display, handleChange, handleFocus, handleBlur };
}

const PROPERTY_TYPES = [
  { value: 'owner-occupied',      label: 'Owner - Occupied'   },
  { value: 'investment-property', label: 'Investment Property' },
  { value: 'vacant-land',         label: 'Vacant Land'        },
];

const PROPERTY_TYPE_LABELS = Object.fromEntries(PROPERTY_TYPES.map(p => [p.value, p.label]));

/* ─── Property type dropdown ──────────────────────────────────── */
function PropertyTypeSelect({ value, onChange, ownerOccupiedTaken }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = PROPERTY_TYPES.find(o => o.value === value);

  return (
    <div className="al-select-wrap" ref={ref}>
      <button
        type="button"
        className={`al-select-trigger${open ? ' open' : ''}${value ? ' has-value' : ''}`}
        onClick={() => setOpen(p => !p)}
        onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget)) setOpen(false); }}
      >
        <span>{selected?.label ?? 'Select property type'}</span>
        <ChevronDown size={13} className="al-select-chevron" strokeWidth={2} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="al-select-menu"
            initial={{ opacity: 0, y: -6, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0,  scaleY: 1    }}
            exit={{ opacity: 0, y: -4,    scaleY: 0.94 }}
            transition={{ duration: 0.16, ease: EASE }}
            style={{ transformOrigin: 'top' }}
          >
            {PROPERTY_TYPES.map(opt => {
              const isDisabled = opt.value === 'owner-occupied' && ownerOccupiedTaken;
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`al-select-option${value === opt.value ? ' selected' : ''}${isDisabled ? ' disabled' : ''}`}
                  title={isDisabled ? 'Only one owner-occupied property is allowed' : undefined}
                  aria-disabled={isDisabled || undefined}
                  onMouseDown={isDisabled ? undefined : (e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
                >
                  <span>{opt.label}</span>
                  {isDisabled
                    ? <span className="al-select-option-lock">1 max</span>
                    : value === opt.value && <Check size={11} strokeWidth={2.5} />
                  }
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── ALCard ──────────────────────────────────────────────────── */
/*
 * Dual-mode item management:
 *   Controlled  — when `assetData` is provided (all asset types).
 *                 Items come from context; add/remove go through callbacks.
 *                 DefaultEntry receives `values` + `onChange` props.
 *   Uncontrolled — when `assetData` is absent (liabilities).
 *                 Internal useState manages item IDs.
 *                 LiabilityEntry / CreditCardEntry manage their own fields.
 */
export function ALCard({
  id, icon, title, desc, hasFin, on, onToggle,
  isLinked, linkedItems, linkedMeta, onLinkedItemChange,
  isRealEstate, isLiability,
  allowConsolidate = true,
  addLabel, addDesc, children,
  // Controlled-mode props (assets)
  assetData,      // { nextId: N, items: { [itemId]: { ...fields } } }
  // Controlled-mode props (liabilities)
  liabilityData,  // { nextId: N, items: { [itemId]: { ...fields } } }
  onAddItem,      // () => void
  onRemoveItem,   // (itemId: number) => void
  onItemChange,   // (itemId: number, fields: object) => void
  ownerOccupiedItemId, // which itemId (if any) currently holds owner-occupied
}) {
  // Uncontrolled fallback (only when neither assetData nor liabilityData is provided)
  const nextItemId = useRef(2);
  const [internalItemIds, setInternalItemIds] = useState([1]);

  const isControlled = !!(assetData || liabilityData);
  const controlledItems = (assetData ?? liabilityData)?.items ?? { 1: {} };

  const itemIds = isControlled
    ? Object.keys(controlledItems).map(Number).sort((a, b) => a - b)
    : internalItemIds;

  const addItem = () => {
    if (isControlled) {
      onAddItem?.();
    } else {
      const newId = nextItemId.current++;
      setInternalItemIds(p => [...p, newId]);
    }
  };

  const removeItem = (itemId) => {
    if (isControlled) {
      onRemoveItem?.(itemId);
    } else {
      setInternalItemIds(p => p.filter(x => x !== itemId));
    }
  };

  const displayCount = isLinked
    ? (linkedItems?.length || 0)
    : itemIds.length;

  return (
    <div className={`al-card ${on ? 'on' : ''}`}>
      <div
        className="al-head"
        onClick={onToggle}
        style={isLinked && !onToggle ? { cursor: 'default' } : undefined}
      >
        <div className="al-head-left">
          <IconBadge name={icon} iconSize={17} />
          <div className="al-head-info">
            <div className="al-title">{title}</div>
            <div className="al-desc">{desc}</div>
            {on && (
              <div className="al-meta">
                {displayCount} item{displayCount !== 1 ? 's' : ''} declared
              </div>
            )}
            {on && linkedMeta && (
              <div className="al-meta al-meta-linked">{linkedMeta}</div>
            )}
          </div>
        </div>
        <div className="al-head-actions">
          <div className="al-check">
            <Check size={11} strokeWidth={2.8} />
          </div>
          <ChevronDown size={13} className="al-chevron" />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {on && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div className="al-body">
              {isLinked ? (
                (linkedItems || []).map(item => (
                  <LinkedEntry
                    key={item.id}
                    data={item}
                    allowConsolidate={allowConsolidate}
                    onChange={onLinkedItemChange
                      ? (fields) => onLinkedItemChange(item.id, fields)
                      : undefined}
                  />
                ))
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {itemIds.map((itemId, idx) => {
                      const entryProps = {
                        num: idx + 1,
                        canRemove: itemIds.length > 1,
                        onRemove: () => removeItem(itemId),
                      };
                      return (
                        <motion.div
                          key={itemId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          style={{ overflow: 'hidden' }}
                        >
                          {id === 'creditcard' ? (
                            <CreditCardEntry
                              values={isControlled ? (controlledItems[itemId] || {}) : {}}
                              onChange={isControlled ? (fields) => onItemChange?.(itemId, fields) : undefined}
                              {...entryProps}
                            />
                          ) : isLiability ? (
                            <LiabilityEntry
                              title={title}
                              allowConsolidate={allowConsolidate}
                              values={isControlled ? (controlledItems[itemId] || {}) : {}}
                              onChange={isControlled ? (fields) => onItemChange?.(itemId, fields) : undefined}
                              {...entryProps}
                            />
                          ) : (
                            <DefaultEntry
                              title={title}
                              isRealEstate={isRealEstate}
                              hasFin={hasFin}
                              values={isControlled ? (controlledItems[itemId] || {}) : {}}
                              onChange={isControlled ? (fields) => onItemChange?.(itemId, fields) : undefined}
                              ownerOccupiedTaken={
                                isRealEstate &&
                                ownerOccupiedItemId !== null &&
                                ownerOccupiedItemId !== undefined &&
                                ownerOccupiedItemId !== itemId
                              }
                              {...entryProps}
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  <button className="add-entry-btn" type="button" onClick={addItem}>
                    <div className="add-entry-icon">
                      <Plus size={14} strokeWidth={2.5} />
                    </div>
                    <div className="add-entry-text">
                      <div className="add-entry-label">Add another {addLabel ?? title.toLowerCase()}</div>
                      {addDesc && <div className="add-entry-sub">{addDesc}</div>}
                    </div>
                  </button>
                </>
              )}
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Shared entry header ─────────────────────────────────────── */
function EntryHeader({ label, canRemove, onRemove }) {
  return (
    <div className="flex-between" style={{ marginBottom: 10 }}>
      <span className="text-strong" style={{ fontSize: 12.5 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span className="badge badge-blue">$0</span>
        {canRemove && (
          <button
            className="remove-entry-btn"
            type="button"
            title="Remove"
            onClick={e => { e.stopPropagation(); onRemove(); }}
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Linked entry — read-only fields (real estate, no consolidation) ─── */
function LinkedEntry({ data, onChange, allowConsolidate }) {
  const propLabel = PROPERTY_TYPE_LABELS[data?.propertyType] || data?.propertyType || 'Property';
  const consolidate = data?.consolidate ?? false;

  return (
    <div className="al-entry al-entry-linked">
      <div className="flex-between" style={{ marginBottom: 10 }}>
        <span className="text-strong" style={{ fontSize: 12.5 }}>{propLabel} Loan</span>
        <span className="linked-pill"><Link size={10} strokeWidth={2.5} /> From Assets</span>
      </div>
      <div className="al-fields">
        <div className="al-field">
          <label>Lender</label>
          <input value={data?.lender || '—'} readOnly style={{ color: 'var(--text2)' }} />
        </div>
        <div className="al-field">
          <label>Original amount</label>
          <input value={data?.originalAmount || '—'} readOnly style={{ color: 'var(--text2)' }} />
        </div>
        <div className="al-field">
          <label>Current balance</label>
          <input value={data?.currentBalance || '—'} readOnly style={{ color: 'var(--text2)' }} />
        </div>
        <div className="al-field">
          <label>Interest rate</label>
          <input value={fmtPct(data?.interestRate)} readOnly style={{ color: 'var(--text2)' }} />
        </div>
        <div className="al-field">
          <label>Monthly repayment</label>
          <input value={data?.monthlyRepayment || '—'} readOnly style={{ color: 'var(--text2)' }} />
        </div>
        <div className="al-field">
          <label>Linked asset</label>
          <input value={`Real-estate: ${propLabel}`} readOnly style={{ color: 'var(--hover)' }} />
        </div>
      </div>
      <div className="linked-entry-note">
        To edit these details, update them in the Assets section.
      </div>
      {allowConsolidate && (
        <div className="fin-toggle-row">
          <span className="fin-toggle-lbl">Consolidate this debt?</span>
          <ToggleSwitch
            on={consolidate}
            onToggle={() => onChange?.({ consolidate: !consolidate })}
          />
        </div>
      )}
    </div>
  );
}

/* ─── Default asset entry — fully controlled via values + onChange ─ */
/*
 * No local state for form fields. All values flow from context through
 * AssetsScreen → ALCard → DefaultEntry. Changes are pushed back up
 * immediately via onChange, making every keystroke persistent.
 */
function DefaultEntry({ title, isRealEstate, hasFin, num, canRemove, onRemove, values = {}, onChange, ownerOccupiedTaken }) {
  const set = (field) => (e) => onChange?.({ [field]: e.target.value });
  const pctRate = usePercentInput(values.interestRate ?? '', (v) => onChange?.({ interestRate: v }));

  const propType        = values.propertyType   ?? '';
  const address         = values.address        ?? '';
  const marketValue     = values.marketValue    ?? '';
  const description     = values.description    ?? '';
  const currentValue    = values.currentValue   ?? '';
  const finOpen         = values.financeEnabled ?? false;
  const lender          = values.lender         ?? '';
  const originalAmount  = values.originalAmount ?? '';
  const currentBalance  = values.currentBalance ?? '';
  const interestRate    = values.interestRate   ?? '';
  const monthlyRepayment = values.monthlyRepayment ?? '';
  const loanType        = values.loanType       ?? 'P&I';

  return (
    <div className="al-entry">
      <EntryHeader label={`${title} ${num}`} canRemove={canRemove} onRemove={onRemove} />
      <div className="al-fields">
        <div className="al-field">
          {isRealEstate ? (
            <>
              <label>Property Type</label>
              <PropertyTypeSelect
                value={propType}
                onChange={val => onChange?.({ propertyType: val })}
                ownerOccupiedTaken={ownerOccupiedTaken}
              />
            </>
          ) : (
            <>
              <label>Description</label>
              <input
                placeholder="Description"
                value={description}
                onChange={set('description')}
              />
            </>
          )}
        </div>
        <div className="al-field">
          <label>{isRealEstate ? 'Market value' : 'Current value'}</label>
          <input
            placeholder="$0"
            value={isRealEstate ? marketValue : currentValue}
            onChange={isRealEstate ? set('marketValue') : set('currentValue')}
          />
        </div>
        {isRealEstate && (
          <div className="al-field" style={{ gridColumn: 'span 2' }}>
            <label>Address</label>
            <input
              placeholder="⌕ Search address"
              value={address}
              onChange={set('address')}
            />
          </div>
        )}
      </div>

      {hasFin && (
        <>
          <div className="fin-toggle-row">
            <span className="fin-toggle-lbl">Has finance attached?</span>
            <ToggleSwitch
              on={finOpen}
              onToggle={() => onChange?.({ financeEnabled: !finOpen })}
            />
          </div>
          <AnimatePresence initial={false}>
            {finOpen && (
              <motion.div
                key="fin"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: EASE }}
                style={{ overflow: 'hidden' }}
              >
                <div className="fin-body">
                  <div className="al-field">
                    <label>Lender</label>
                    <LenderAutocomplete
                      value={lender}
                      onChange={(val) => onChange?.({ lender: val })}
                      placeholder="e.g. CBA"
                    />
                  </div>
                  <div className="al-field">
                    <label>Original amount</label>
                    <input placeholder="$0" value={originalAmount} onChange={set('originalAmount')} />
                  </div>
                  <div className="al-field">
                    <label>Current balance</label>
                    <input placeholder="$0" value={currentBalance} onChange={set('currentBalance')} />
                  </div>
                  <div className="al-field">
                    <label>Interest rate %</label>
                    <input
                      placeholder="e.g. 6.24"
                      value={pctRate.display}
                      onChange={pctRate.handleChange}
                      onFocus={pctRate.handleFocus}
                      onBlur={pctRate.handleBlur}
                    />
                  </div>
                  <div className="al-field">
                    <label>Monthly repayment</label>
                    <input placeholder="$0" value={monthlyRepayment} onChange={set('monthlyRepayment')} />
                  </div>
                  <div className="al-field">
                    <label>Loan type</label>
                    <select value={loanType} onChange={set('loanType')}>
                      <option value="P&I">P&I</option>
                      <option value="Interest only">Interest only</option>
                    </select>
                  </div>
                </div>
                <div className="fin-note">
                  <Link size={10} strokeWidth={2.5} /> Auto-linked to Liabilities section
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

/* ─── Credit card entry ──────────────────────────────────────────── */
function CreditCardEntry({ num, canRemove, onRemove, values = {}, onChange }) {
  const cardNum    = values.cardNum       ?? '';
  const lender     = values.lender        ?? '';
  const cardLimit  = values.cardLimit     ?? '';
  const currentBalance = values.currentBalance ?? '';
  const consolidate    = values.consolidate    ?? false;

  const handleCardNum = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    onChange?.({ cardNum: (digits.match(/.{1,4}/g) || []).join(' ') });
  };

  return (
    <div className="al-entry">
      <EntryHeader label={`Credit card ${num}`} canRemove={canRemove} onRemove={onRemove} />
      <div className="al-fields">
        <div className="al-field" style={{ gridColumn: 'span 2' }}>
          <label>Credit Card Number</label>
          <input
            placeholder="•••• •••• •••• ••••"
            value={cardNum}
            onChange={handleCardNum}
            maxLength={19}
            className="cc-num-input"
          />
        </div>
        <div className="al-field" style={{ gridColumn: 'span 2' }}>
          <label>Lender</label>
          <LenderAutocomplete
            value={lender}
            onChange={(val) => onChange?.({ lender: val })}
            placeholder="e.g. ANZ, NAB, Westpac"
          />
        </div>
        <div className="al-field">
          <label>Card Limit</label>
          <input
            placeholder="$0"
            value={cardLimit}
            onChange={(e) => onChange?.({ cardLimit: e.target.value })}
          />
        </div>
        <div className="al-field">
          <label>Current Balance</label>
          <input
            placeholder="$0"
            value={currentBalance}
            onChange={(e) => onChange?.({ currentBalance: e.target.value })}
          />
        </div>
      </div>
      <div className="fin-toggle-row">
        <span className="fin-toggle-lbl">Consolidate this debt?</span>
        <ToggleSwitch on={consolidate} onToggle={() => onChange?.({ consolidate: !consolidate })} />
      </div>
    </div>
  );
}

/* ─── Generic liability entry ────────────────────────────────────── */
function LiabilityEntry({ title, num, canRemove, onRemove, values = {}, onChange, allowConsolidate = true }) {
  const lender           = values.lender           ?? '';
  const amountBorrowed   = values.amountBorrowed   ?? '';
  const currentBalance   = values.currentBalance   ?? '';
  const interestRate     = values.interestRate     ?? '';
  const monthlyRepayments = values.monthlyRepayments ?? '';
  const consolidate      = values.consolidate      ?? false;

  const set = (field) => (e) => onChange?.({ [field]: e.target.value });
  const pctRate = usePercentInput(values.interestRate ?? '', (v) => onChange?.({ interestRate: v }));

  return (
    <div className="al-entry">
      <EntryHeader label={`${title} ${num}`} canRemove={canRemove} onRemove={onRemove} />
      <div className="al-fields">
        <div className="al-field">
          <label>Lender</label>
          <LenderAutocomplete
            value={lender}
            onChange={(val) => onChange?.({ lender: val })}
            placeholder="e.g. ANZ, CBA, Latitude"
          />
        </div>
        <div className="al-field">
          <label>Amount Borrowed</label>
          <input placeholder="$0" value={amountBorrowed} onChange={set('amountBorrowed')} />
        </div>
        <div className="al-field">
          <label>Current Balance</label>
          <input placeholder="$0" value={currentBalance} onChange={set('currentBalance')} />
        </div>
        <div className="al-field">
          <label>Interest Rate</label>
          <input
            placeholder="e.g. 6.99"
            value={pctRate.display}
            onChange={pctRate.handleChange}
            onFocus={pctRate.handleFocus}
            onBlur={pctRate.handleBlur}
          />
        </div>
        <div className="al-field" style={{ gridColumn: 'span 2' }}>
          <label>Monthly Repayments</label>
          <input placeholder="$0" value={monthlyRepayments} onChange={set('monthlyRepayments')} />
        </div>
      </div>
      {allowConsolidate && (
        <div className="fin-toggle-row">
          <span className="fin-toggle-lbl">Consolidate this debt?</span>
          <ToggleSwitch on={consolidate} onToggle={() => onChange?.({ consolidate: !consolidate })} />
        </div>
      )}
    </div>
  );
}
