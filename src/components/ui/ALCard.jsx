import { useState, useRef } from 'react';
import { Check, Sparkles, Link, ChevronDown, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../common/Icon';
import { ToggleSwitch } from '../forms/ToggleSwitch';
import './ALCard.css';

const EASE = [0.25, 0.46, 0.45, 0.94];

export function ALCard({
  id, icon, title, desc, hasFin, on, onToggle,
  isLinked, linkedMeta, isRealEstate, isLiability,
  onFinanceLink, children,
}) {
  const nextItemId = useRef(2);
  const [itemIds, setItemIds] = useState([1]);

  const addItem = () => {
    const newId = nextItemId.current++;
    setItemIds(p => [...p, newId]);
  };

  const removeItem = (itemId) => setItemIds(p => p.filter(x => x !== itemId));

  return (
    <div className={`al-card ${on ? 'on' : ''}`}>
      <div className="al-head" onClick={onToggle}>
        <div className="al-head-left">
          <div className="al-icon-box"><Icon name={icon} size={17} /></div>
          <div className="al-head-info">
            <div className="al-title">{title}</div>
            <div className="al-desc">{desc}</div>
            {on && (
              <div className="al-meta">
                {itemIds.length} item{itemIds.length !== 1 ? 's' : ''} declared
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
                <LinkedEntry />
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
                              {...entryProps}
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  <button className="add-entry-btn" type="button" onClick={addItem}>
                    <Plus size={13} />
                    Add another {title.toLowerCase()}
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

/* ─── Linked (read-only, auto-populated from real-estate) ──────── */
function LinkedEntry() {
  return (
    <div className="al-entry">
      <div className="flex-between" style={{ marginBottom: 10 }}>
        <span className="text-strong" style={{ fontSize: 12.5 }}>Main home · CBA</span>
        <span className="linked-pill"><Sparkles size={10} /> From assets</span>
      </div>
      <div className="al-fields">
        <div className="al-field"><label>Lender</label><input value="CBA" readOnly style={{ color: 'var(--text2)' }} /></div>
        <div className="al-field"><label>Original amount</label><input value="$520,000" readOnly style={{ color: 'var(--text2)' }} /></div>
        <div className="al-field"><label>Current balance</label><input value="$410,000" readOnly style={{ color: 'var(--text2)' }} /></div>
        <div className="al-field"><label>Interest rate</label><input value="6.24%" readOnly style={{ color: 'var(--text2)' }} /></div>
        <div className="al-field"><label>Monthly repayment</label><input value="$2,650" readOnly style={{ color: 'var(--text2)' }} /></div>
        <div className="al-field"><label>Linked asset</label><input value="Real-estate: Main home" readOnly style={{ color: 'var(--hover)' }} /></div>
      </div>
      <div className="text-small text-border2" style={{ marginTop: 8 }}>
        To edit these details, update them in the Assets section.
      </div>
    </div>
  );
}

/* ─── Credit card entry ──────────────────────────────────────── */
function CreditCardEntry({ num, canRemove, onRemove }) {
  const [cardNum, setCardNum] = useState('');

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
    </div>
  );
}

/* ─── Generic liability entry ────────────────────────────────── */
function LiabilityEntry({ title, num, canRemove, onRemove }) {
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
    </div>
  );
}

/* ─── Default asset entry (savings, real-estate, vehicles…) ───── */
function DefaultEntry({ title, isRealEstate, hasFin, num, canRemove, onRemove, onFinanceLink }) {
  const [finOpen, setFinOpen] = useState(false);

  const handleFinToggle = () => {
    const next = !finOpen;
    setFinOpen(next);
    onFinanceLink?.(next);
  };

  return (
    <div className="al-entry">
      <EntryHeader label={`${title} ${num}`} canRemove={canRemove} onRemove={onRemove} />
      <div className="al-fields">
        <div className="al-field">
          <label>Description</label>
          <input placeholder="Description" />
        </div>
        <div className="al-field">
          <label>{isRealEstate ? 'Market value' : 'Current value'}</label>
          <input placeholder="$0" />
        </div>
        {isRealEstate && (
          <>
            <div className="al-field" style={{ gridColumn: 'span 2' }}>
              <label>Address</label>
              <input placeholder="⌕ Search address" />
            </div>
            <div className="al-field">
              <label>Property use</label>
              <select>
                <option>Owner occupied</option>
                <option>Investment</option>
              </select>
            </div>
          </>
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
                  <div className="al-field"><label>Lender</label><input placeholder="e.g. CBA" /></div>
                  <div className="al-field"><label>Original amount</label><input placeholder="$0" /></div>
                  <div className="al-field"><label>Current balance</label><input placeholder="$0" /></div>
                  <div className="al-field"><label>Interest rate %</label><input placeholder="e.g. 6.24" /></div>
                  <div className="al-field"><label>Monthly repayment</label><input placeholder="$0" /></div>
                  <div className="al-field">
                    <label>Loan type</label>
                    <select><option>P&I</option><option>Interest only</option></select>
                  </div>
                </div>
                <div className="fin-note">
                  <Link size={10} /> Auto-linked to Liabilities section
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
