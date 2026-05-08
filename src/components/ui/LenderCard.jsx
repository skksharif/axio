import { useState } from 'react';
import { Star, Clock } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import './LenderCard.css';

function Tooltip({ body }) {
  const [vis, setVis] = useState(false);
  return (
    <div className="tooltip-wrap">
      <div className="qmark" onClick={() => setVis(p => !p)}>
        <div className={`tooltip ${vis ? 'vis' : ''}`}>
          <div className="tooltip-ai">
            <div className="tooltip-ai-icon">AI</div>
            <div className="tooltip-title">Anika explains</div>
          </div>
          <div className="tooltip-body">{body}</div>
        </div>
      </div>
    </div>
  );
}

export function LenderCard({ lender }) {
  const { next } = useApp();
  const { name, rate, comp, best, etFee, estFee, brokFee, baseRepay, monthlyFee, totalRepay,
    types, approval, reasons, sla, etTip, estTip, brokTip } = lender;

  const etGreen = etFee.includes('$0');
  const estGreen = estFee === '$0';
  const feeGreen = monthlyFee === '$0';

  return (
    <div className={`lender-card ${best ? 'best' : ''}`}>
      <div className="lender-head">
        {best
          ? <Badge variant="green" style={{ marginBottom: 8 }}><Star size={11} fill="currentColor" /> Best match</Badge>
          : <div style={{ height: 28 }} />
        }
        <div className="lender-name">{name}</div>
        <div className="lender-rate">{rate} <span>p.a.</span></div>
        <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
          {types.map(t => (
            <span key={t} className={`type-pill ${t === 'Fixed' ? 'type-fixed' : 'type-variable'}`}>{t}</span>
          ))}
        </div>
      </div>

      <div className="lender-body">
        <FeeRow label="Yearly interest rate" value={rate} />
        <FeeRow label="Comparison rate" value={comp} />
        <FeeRow label="Early termination fee" value={etFee} valCls={etGreen ? 'green' : 'yellow'} tooltip={<Tooltip body={etTip} />} />
        <FeeRow label="Establishment fee"     value={estFee} valCls={estGreen ? 'green' : 'yellow'} tooltip={<Tooltip body={estTip} />} />
        <FeeRow label="Brokerage fee"         value={brokFee} valCls="green" tooltip={<Tooltip body={brokTip} />} />
        <FeeRow label="Base monthly repayment" value={baseRepay} />
        <FeeRow label="Monthly fees" value={monthlyFee} valCls={feeGreen ? 'green' : 'yellow'} last />
      </div>

      <div className="lender-repay">
        <div className="lr-label">Total monthly repayment (all-in)</div>
        <div className="lr-val">{totalRepay}</div>
        <div className="lr-note">Inclusive of all fees and lender charges</div>
      </div>

      <div className="approval-section">
        <div className="flex-between" style={{ marginBottom: 6 }}>
          <span className="text-small text-border2">Approval probability</span>
          <span className="text-strong" style={{ color: approval >= 85 ? 'var(--green)' : 'var(--accent)' }}>{approval}%</span>
        </div>
        <div className="approval-bar">
          <div className="approval-fill" style={{ width: `${approval}%`, background: approval >= 85 ? 'var(--green)' : 'var(--accent)' }} />
        </div>
        <div className="text-small text-border2" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock size={11} /> Decision in {sla}
        </div>
        {reasons.map((r, i) => <div key={i} className="reason">{r}</div>)}
      </div>

      <div className="lender-cta">
        <button
          className={best ? 'primary-cta' : 'ghost-cta'}
          onClick={next}
        >
          Apply with {name} →
        </button>
      </div>
    </div>
  );
}

function FeeRow({ label, value, valCls = '', tooltip, last }) {
  return (
    <div className={`fee-row ${last ? 'last' : ''}`}>
      <span className="fee-label">
        {tooltip}
        {label}
      </span>
      <span className={`fee-val ${valCls}`}>{value}</span>
    </div>
  );
}
