import { useState } from 'react';
import { Check, Sparkles, Link, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../common/Icon';
import { ToggleSwitch } from '../forms/ToggleSwitch';
import './ALCard.css';

export function ALCard({ id, icon, title, desc, hasFin, on, onToggle, isLinked, linkedMeta, isRealEstate, isLiability, children }) {
  const [finOpen, setFinOpen] = useState(false);
  const [finNote, setFinNote] = useState(false);

  const handleFinToggle = () => {
    setFinOpen(p => !p);
    setFinNote(p => !p);
  };

  return (
    <div className={`al-card ${on ? 'on' : ''}`}>
      <div className="al-head" onClick={onToggle}>
        <div className="al-head-left">
          <div className="al-icon-box"><Icon name={icon} size={17} /></div>
          <div className="al-head-info">
            <div className="al-title">{title}</div>
            <div className="al-desc">{desc}</div>
            {on && <div className="al-meta">1 item declared</div>}
            {linkedMeta && <div className="al-meta al-meta-linked">{linkedMeta}</div>}
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
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="al-body">
              {isLinked ? (
                <LinkedEntry />
              ) : id === 'creditcard' ? (
                <CreditCardEntry title={title} />
              ) : isLiability ? (
                <LiabilityEntry title={title} />
              ) : (
                <DefaultEntry
                  title={title}
                  isRealEstate={isRealEstate}
                  hasFin={hasFin}
                  finOpen={finOpen}
                  finNote={finNote}
                  onFinToggle={handleFinToggle}
                />
              )}
              {!isLinked && (
                <button className="add-entry-btn">+ Add another {title.toLowerCase()}</button>
              )}
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
      <div className="text-small text-border2" style={{ marginTop: 8 }}>To edit, update in Assets section.</div>
    </div>
  );
}

function CreditCardEntry({ title }) {
  const [cardNum, setCardNum] = useState('');

  const handleCardNum = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g) || [];
    setCardNum(groups.join(' '));
  };

  return (
    <div className="al-entry">
      <div className="flex-between" style={{ marginBottom: 10 }}>
        <span className="text-strong" style={{ fontSize: 12.5 }}>{title} 1</span>
        <span className="badge badge-blue">$0</span>
      </div>
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

function LiabilityEntry({ title }) {
  return (
    <div className="al-entry">
      <div className="flex-between" style={{ marginBottom: 10 }}>
        <span className="text-strong" style={{ fontSize: 12.5 }}>{title} 1</span>
        <span className="badge badge-blue">$0</span>
      </div>
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
          <input placeholder="e.g. 6.99" />
        </div>
        <div className="al-field" style={{ gridColumn: 'span 2' }}>
          <label>Repayments</label>
          <input placeholder="$0" />
        </div>
      </div>
    </div>
  );
}

function DefaultEntry({ title, isRealEstate, hasFin, finOpen, finNote, onFinToggle }) {
  return (
    <div className="al-entry">
      <div className="flex-between" style={{ marginBottom: 10 }}>
        <span className="text-strong" style={{ fontSize: 12.5 }}>{title} 1</span>
        <span className="badge badge-blue">$0</span>
      </div>
      <div className="al-fields">
        <div className="al-field"><label>Description</label><input placeholder="Description" /></div>
        <div className="al-field">
          <label>{isRealEstate ? 'Market value' : 'Current value'}</label>
          <input placeholder="$0" />
        </div>
        {isRealEstate && (
          <>
            <div className="al-field" style={{ gridColumn: 'span 2' }}>
              <label>Address</label><input placeholder="⌕ Search address" />
            </div>
            <div className="al-field">
              <label>Property use</label>
              <select><option>Owner occupied</option><option>Investment</option></select>
            </div>
          </>
        )}
      </div>
      {hasFin && (
        <>
          <div className="fin-toggle-row">
            <span className="fin-toggle-lbl">Has finance attached?</span>
            <ToggleSwitch on={finOpen} onToggle={onFinToggle} />
          </div>
          {finOpen && (
            <div className="fin-body open">
              <div className="al-field"><label>Lender</label><input placeholder="e.g. CBA" /></div>
              <div className="al-field"><label>Original amount</label><input placeholder="$0" /></div>
              <div className="al-field"><label>Current balance</label><input placeholder="$0" /></div>
              <div className="al-field"><label>Interest rate %</label><input placeholder="e.g. 6.24" /></div>
              <div className="al-field"><label>Monthly repayment</label><input placeholder="$0" /></div>
              <div className="al-field"><label>Loan type</label><select><option>P&I</option><option>Interest only</option></select></div>
            </div>
          )}
          {finNote && (
            <div className="fin-note"><Link size={10} /> Auto-linked to Liabilities section</div>
          )}
        </>
      )}
    </div>
  );
}
