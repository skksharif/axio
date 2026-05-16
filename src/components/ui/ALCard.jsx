import { useState } from 'react';
import { Check, Sparkles, Link } from 'lucide-react';
import { Icon } from '../common/Icon';
import { ToggleSwitch } from '../forms/ToggleSwitch';
import './ALCard.css';

export function ALCard({ id, icon, title, desc, hasFin, on, onToggle, isLinked, linkedMeta, isRealEstate, children }) {
  const [finOpen, setFinOpen] = useState(false);
  const [finNote, setFinNote] = useState(false);

  const handleFinToggle = () => {
    setFinOpen(p => !p);
    setFinNote(p => !p);
  };

  return (
    <div className={`al-card ${on ? 'on' : ''}`}>
      <div className="al-head" onClick={onToggle}>
        <div>
          <div className="al-icon-box"><Icon name={icon} size={20} /></div>
          <div className="al-title">{title}</div>
          <div className="al-desc">{desc}</div>
          {on && <div className="al-meta">1 item declared</div>}
          {linkedMeta && <div className="al-meta">{linkedMeta}</div>}
        </div>
        <div className="al-check">
          <Check size={13} strokeWidth={2.5} />
        </div>
      </div>

      {on && (
        <div className="al-body" style={{ display: 'flex' }}>
          {isLinked ? (
            <LinkedEntry />
          ) : id === 'creditcard' ? (
            <CreditCardEntry title={title} />
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
      )}
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
  return (
    <div className="al-entry">
      <div className="flex-between" style={{ marginBottom: 10 }}>
        <span className="text-strong" style={{ fontSize: 12.5 }}>{title} 1</span>
        <span className="badge badge-red">$0</span>
      </div>
      <div className="al-fields">
        <div className="al-field" style={{ gridColumn: 'span 2' }}>
          <label>Lender</label>
          <input placeholder="e.g. ANZ, NAB, Westpac" />
        </div>
        <div className="al-field">
          <label>Card limit</label>
          <input placeholder="$0" />
        </div>
        <div className="al-field">
          <label>Current balance</label>
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
