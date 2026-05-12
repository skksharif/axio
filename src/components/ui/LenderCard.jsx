import { useState } from 'react';
import { Star, ChevronDown, Clock } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import './LenderCard.css';

const FREQ_TEXT   = { monthly: 'per month',      fortnightly: 'per fortnight', weekly: 'per week'      };
const FREQ_SUFFIX = { monthly: '/mo',             fortnightly: '/fn',           weekly: '/wk'           };

function Tooltip({ body }) {
  const [vis, setVis] = useState(false);
  return (
    <div className="tooltip-wrap">
      <div className="qmark" onClick={() => setVis(p => !p)}>
        ?
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

function FeeRow({ label, value, valCls = '', tooltip, last }) {
  return (
    <div className={`fee-row${last ? ' last' : ''}`}>
      <span className="fee-label">{tooltip}{label}</span>
      <span className={`fee-val ${valCls}`}>{value}</span>
    </div>
  );
}

export function LenderCard({ lender, frequency = 'monthly' }) {
  const { next } = useApp();
  const [open, setOpen] = useState(false);

  const {
    name, abbr, logoBg, rate, comp, best,
    etFee, estFee, brokFee, baseRepay, monthlyFee, totalRepayNum,
    types, approval, reasons, sla,
    loanTerm, extraRepayments, capacityNote, conductNote, stabilityNote,
    etTip, estTip, brokTip,
  } = lender;

  const repayNum = {
    monthly:     totalRepayNum,
    fortnightly: Math.round(totalRepayNum * 12 / 26),
    weekly:      Math.round(totalRepayNum * 12 / 52),
  }[frequency];

  const etGreen  = etFee.includes('$0');
  const estGreen = estFee === '$0';
  const feeGreen = monthlyFee === '$0';

  const feesSummary = [
    monthlyFee !== '$0' ? `${monthlyFee}/mo` : 'No monthly fee',
    estFee    !== '$0' ? `${estFee} est.`  : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className={`lender-card${best ? ' best' : ''}`}>

      {/* ── Header: logo + name + badge ── */}
      <div className="lc-header">
        <div className="lc-logo" style={{ background: logoBg }}>{abbr}</div>
        <div className="lc-header-body">
          <div className="lc-name">{name}</div>
          <div className="lc-types">
            {types.map(t => (
              <span key={t} className={`type-pill ${t === 'Fixed' ? 'type-fixed' : 'type-variable'}`}>{t}</span>
            ))}
          </div>
        </div>
        {best && (
          <Badge variant="green" style={{ flexShrink: 0, alignSelf: 'flex-start' }}>
            <Star size={10} fill="currentColor" /> Best
          </Badge>
        )}
      </div>

      {/* ── Repayment hero ── */}
      <div className="lc-repay">
        <div className="lc-repay-amount">
          <span className="lc-repay-curr">$</span>
          <span className="lc-repay-num">{repayNum.toLocaleString()}</span>
        </div>
        <div className="lc-repay-meta">
          {FREQ_TEXT[frequency]} · inclusive of all fees
        </div>
      </div>

      {/* ── Summary rows ── */}
      <div className="lc-summary">
        <div className="lc-sum-row">
          <span className="lc-sum-lbl">Interest rate</span>
          <span className="lc-sum-val">{rate} p.a.</span>
        </div>
        <div className="lc-sum-row">
          <span className="lc-sum-lbl">Comparison rate</span>
          <span className="lc-sum-val lc-val-muted">{comp} p.a.</span>
        </div>
        <div className="lc-sum-row lc-sum-last">
          <span className="lc-sum-lbl">Fees</span>
          <span className="lc-sum-val lc-val-muted">{feesSummary}</span>
        </div>
      </div>

      {/* ── Approval probability ── */}
      <div className="lc-approval">
        <div className="lca-row">
          <span className="lca-label">Approval probability</span>
          <span className="lca-pct" style={{ color: approval >= 85 ? 'var(--green)' : 'var(--hover)' }}>
            {approval}%
          </span>
        </div>
        <div className="lca-bar">
          <div
            className="lca-fill"
            style={{
              width: `${approval}%`,
              background: approval >= 85 ? 'var(--green)' : 'var(--accentg)',
            }}
          />
        </div>
      </div>

      {/* ── CTA + toggle ── */}
      <div className="lc-cta">
        <button
          className={`lc-apply${best ? ' lc-apply-primary' : ' lc-apply-ghost'}`}
          onClick={next}
        >
          Apply with {name} →
        </button>
        <button className="lc-toggle" onClick={() => setOpen(p => !p)}>
          <span>{open ? 'View less' : 'View more'}</span>
          <ChevronDown size={14} className={`lc-chevron${open ? ' open' : ''}`} />
        </button>
      </div>

      {/* ── Collapsible details ── */}
      <div className={`lc-details${open ? ' open' : ''}`}>
        <div className="lc-details-inner">

          <div className="lc-section">
            <div className="lc-section-head">Decision &amp; timing</div>
            <div className="lc-detail-row">
              <span className="lc-detail-lbl"><Clock size={11} /> Decision time</span>
              <span className="lc-detail-val">{sla}</span>
            </div>
            <div className="lc-detail-row">
              <span className="lc-detail-lbl">Loan term</span>
              <span className="lc-detail-val">{loanTerm}</span>
            </div>
            <div className="lc-detail-row lc-detail-last">
              <span className="lc-detail-lbl">Extra repayments</span>
              <span className="lc-detail-val">{extraRepayments}</span>
            </div>
          </div>

          <div className="lc-section">
            <div className="lc-section-head">Fee breakdown</div>
            <FeeRow label="Base monthly repayment" value={baseRepay} />
            <FeeRow label="Monthly fee"        value={monthlyFee} valCls={feeGreen ? 'green' : 'yellow'} />
            <FeeRow label="Establishment fee"  value={estFee}     valCls={estGreen ? 'green' : 'yellow'} tooltip={<Tooltip body={estTip} />} />
            <FeeRow label="Early exit fee"     value={etFee}      valCls={etGreen  ? 'green' : 'yellow'} tooltip={<Tooltip body={etTip} />} />
            <FeeRow label="Brokerage fee"      value={brokFee}    valCls="green" last tooltip={<Tooltip body={brokTip} />} />
          </div>

          <div className="lc-section">
            <div className="lc-section-head">Anika AI insights</div>
            {reasons.map((r, i) => (
              <div key={i} className="lc-reason">{r}</div>
            ))}
          </div>

          <div className="lc-section lc-section-last">
            <div className="lc-section-head">Assessment notes</div>
            <div className="lc-note">{capacityNote}</div>
            <div className="lc-note">{conductNote}</div>
            <div className="lc-note lc-note-last">{stabilityNote}</div>
          </div>

        </div>
      </div>

    </div>
  );
}
