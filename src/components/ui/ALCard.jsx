import { useState, useRef } from 'react';
import { Check, Link, ChevronDown, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../common/Icon';
import { ToggleSwitch } from '../forms/ToggleSwitch';
import './ALCard.css';

const EASE = [0.25, 0.46, 0.45, 0.94];

const PROPERTY_TYPES = [
  { value: 'owner-occupied',      label: 'Owner - Occupied'   },
  { value: 'investment-property', label: 'Investment Property' },
  { value: 'vacant-land',         label: 'Vacant Land'        },
];

const PROPERTY_TYPE_LABELS = Object.fromEntries(PROPERTY_TYPES.map(p => [p.value, p.label]));

function PropertyTypeSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Click-outside handler
  const handleMouseDown = (e) => {
    if (ref.current && !ref.current.contains(e.target)) setOpen(false);
  };

  // Attach/detach via inline event delegation on the wrapper
  const selected = PROPERTY_TYPES.find(o => o.value === value);

  return (
    <div
      className="al-select-wrap"
      ref={ref}
      onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget)) setOpen(false); }}
    >
      <button
        type="button"
        className={`al-select-trigger${open ? ' open' : ''}${value ? ' has-value' : ''}`}
        onClick={() => setOpen(p => !p)}
        onMouseDown={(e) => e.stopPropagation()}
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
            onMouseDown={(e) => e.stopPropagation()}
          >
            {PROPERTY_TYPES.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={`al-select-option${value === opt.value ? ' selected' : ''}`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                <span>{opt.label}</span>
                {value === opt.value && <Check size={11} strokeWidth={2.5} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ALCard({
  id, icon, title, desc, hasFin, on, onToggle,
  isLinked, linkedItems, linkedMeta, isRealEstate, isLiability,
  onFinanceLink, addLabel, addDesc, children,
  onRealEstateChange,
}) {
  const nextItemId = useRef(2);
  const [itemIds, setItemIds] = useState([1]);

  const addItem = () => {
    const newId = nextItemId.current++;
    setItemIds(p => [...p, newId]);
  };

  const removeItem = (itemId) => {
    setItemIds(p => p.filter(x => x !== itemId));
    onRealEstateChange?.(itemId, null);
  };

  const displayCount = isLinked ? (linkedItems?.length || 0) : itemIds.length;

  return (
    <div className={`al-card ${on ? 'on' : ''}`}>
      <div className="al-head" onClick={onToggle} style={isLinked && !onToggle ? { cursor: 'default' } : undefined}>
        <div className="al-head-left">
          <div className="al-icon-box"><Icon name={icon} size={17} /></div>
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
                  <LinkedEntry key={item.id} data={item} />
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
                            <CreditCardEntry {...entryProps} />
                          ) : isLiability ? (
                            <LiabilityEntry title={title} {...entryProps} />
                          ) : (
                            <DefaultEntry
                              title={title}
                              isRealEstate={isRealEstate}
                              hasFin={hasFin}
                              onFinanceLink={idx === 0 ? onFinanceLink : undefined}
                              onDataChange={isRealEstate ? (data) => onRealEstateChange?.(itemId, data) : undefined}
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

/* ─── Linked entry — dynamically populated from real-estate asset ─ */
function LinkedEntry({ data }) {
  const propLabel = PROPERTY_TYPE_LABELS[data?.propertyType] || data?.propertyType || 'Property';

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
          <input value={data?.interestRate || '—'} readOnly style={{ color: 'var(--text2)' }} />
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
    </div>
  );
}

/* ─── Credit card entry ──────────────────────────────────────── */
function CreditCardEntry({ num, canRemove, onRemove }) {
  const [cardNum, setCardNum] = useState('');
  const [consolidate, setConsolidate] = useState(false);

  const handleCardNum = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNum((digits.match(/.{1,4}/g) || []).join(' '));
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
          <input placeholder="e.g. ANZ, NAB, Westpac" />
        </div>
        <div className="al-field">
          <label>Card Limit</label>
          <input placeholder="$0" />
        </div>
        <div className="al-field">
          <label>Current Balance</label>
          <input placeholder="$0" />
        </div>
      </div>
      <div className="fin-toggle-row">
        <span className="fin-toggle-lbl">Consolidate this debt?</span>
        <ToggleSwitch on={consolidate} onToggle={() => setConsolidate(c => !c)} />
      </div>
    </div>
  );
}

/* ─── Generic liability entry ────────────────────────────────── */
function LiabilityEntry({ title, num, canRemove, onRemove }) {
  const [consolidate, setConsolidate] = useState(false);

  return (
    <div className="al-entry">
      <EntryHeader label={`${title} ${num}`} canRemove={canRemove} onRemove={onRemove} />
      <div className="al-fields">
        <div className="al-field">
          <label>Lender</label>
          <input placeholder="e.g. ANZ, CBA, Latitude" />
        </div>
        <div className="al-field">
          <label>Amount Borrowed</label>
          <input placeholder="$0" />
        </div>
        <div className="al-field">
          <label>Current Balance</label>
          <input placeholder="$0" />
        </div>
        <div className="al-field">
          <label>Interest Rate</label>
          <input placeholder="e.g. 6.99%" />
        </div>
        <div className="al-field" style={{ gridColumn: 'span 2' }}>
          <label>Monthly Repayments</label>
          <input placeholder="$0" />
        </div>
      </div>
      <div className="fin-toggle-row">
        <span className="fin-toggle-lbl">Consolidate this debt?</span>
        <ToggleSwitch on={consolidate} onToggle={() => setConsolidate(c => !c)} />
      </div>
    </div>
  );
}

/* ─── Default asset entry — real-estate entries are fully controlled ─ */
function DefaultEntry({ title, isRealEstate, hasFin, num, canRemove, onRemove, onFinanceLink, onDataChange }) {
  const [finOpen, setFinOpen] = useState(false);
  const [propType, setPropType] = useState('');
  const [address, setAddress] = useState('');
  const [lender, setLender] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyRepayment, setMonthlyRepayment] = useState('');
  const [loanType, setLoanType] = useState('P&I');

  // Reports current state to parent; patch overrides one field with its NEW value
  // before the setState call has been processed.
  const notify = (patch = {}, open = finOpen) => {
    if (!isRealEstate) return;
    if (open) {
      onDataChange?.({
        propertyType: propType,
        address,
        lender,
        originalAmount,
        currentBalance,
        interestRate,
        monthlyRepayment,
        loanType,
        ...patch,
      });
    } else {
      onDataChange?.(null);
    }
  };

  const handleFinToggle = () => {
    const next = !finOpen;
    setFinOpen(next);
    onFinanceLink?.(next);
    notify({}, next);
  };

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
                onChange={val => { setPropType(val); notify({ propertyType: val }); }}
              />
            </>
          ) : (
            <>
              <label>Description</label>
              <input placeholder="Description" />
            </>
          )}
        </div>
        <div className="al-field">
          <label>{isRealEstate ? 'Market value' : 'Current value'}</label>
          <input placeholder="$0" />
        </div>
        {isRealEstate && (
          <div className="al-field" style={{ gridColumn: 'span 2' }}>
            <label>Address</label>
            <input
              placeholder="⌕ Search address"
              value={address}
              onChange={e => { const v = e.target.value; setAddress(v); notify({ address: v }); }}
            />
          </div>
        )}
      </div>

      {hasFin && (
        <>
          <div className="fin-toggle-row">
            <span className="fin-toggle-lbl">Has finance attached?</span>
            <ToggleSwitch on={finOpen} onToggle={handleFinToggle} />
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
                    <input
                      placeholder="e.g. CBA"
                      value={lender}
                      onChange={e => { const v = e.target.value; setLender(v); notify({ lender: v }); }}
                    />
                  </div>
                  <div className="al-field">
                    <label>Original amount</label>
                    <input
                      placeholder="$0"
                      value={originalAmount}
                      onChange={e => { const v = e.target.value; setOriginalAmount(v); notify({ originalAmount: v }); }}
                    />
                  </div>
                  <div className="al-field">
                    <label>Current balance</label>
                    <input
                      placeholder="$0"
                      value={currentBalance}
                      onChange={e => { const v = e.target.value; setCurrentBalance(v); notify({ currentBalance: v }); }}
                    />
                  </div>
                  <div className="al-field">
                    <label>Interest rate %</label>
                    <input
                      placeholder="e.g. 6.24"
                      value={interestRate}
                      onChange={e => { const v = e.target.value; setInterestRate(v); notify({ interestRate: v }); }}
                    />
                  </div>
                  <div className="al-field">
                    <label>Monthly repayment</label>
                    <input
                      placeholder="$0"
                      value={monthlyRepayment}
                      onChange={e => { const v = e.target.value; setMonthlyRepayment(v); notify({ monthlyRepayment: v }); }}
                    />
                  </div>
                  <div className="al-field">
                    <label>Loan type</label>
                    <select
                      value={loanType}
                      onChange={e => { const v = e.target.value; setLoanType(v); notify({ loanType: v }); }}
                    >
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
