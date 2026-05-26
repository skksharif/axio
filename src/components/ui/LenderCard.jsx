import { useState, useEffect, useRef } from 'react';
import { Star, ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useApp } from '@shared/hooks/useApp';
import './LenderCard.css';

const FREQ_TEXT = {
  monthly:     'per month',
  fortnightly: 'per fortnight',
  weekly:      'per week',
};

/* ─── Lender logo with initials fallback ────────────────────────── */
function LenderLogo({ src, abbr, logoBg }) {
  const [errored, setErrored] = useState(false);

  if (src && !errored) {
    return (
      <div className="lc-logo lc-logo-real">
        <img
          src={src}
          alt={abbr}
          className="lc-logo-img"
          onError={() => setErrored(true)}
          loading="lazy"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className="lc-logo" style={{ background: logoBg }}>
      {abbr}
    </div>
  );
}

function InfoRow({ label, value, valCls = '', last }) {
  return (
    <div className={`lc-info-row${last ? ' lc-info-last' : ''}`}>
      <span className="lc-info-lbl">{label}</span>
      <span className={`lc-info-val ${valCls}`}>{value}</span>
    </div>
  );
}

/* ─── Character-by-character typing component ──────────────────── */
function TypewriterText({ text, phase, myPhase, onDone, charSpeed = 12 }) {
  const isTyping   = phase === myPhase;
  const isRevealed = phase > myPhase;
  const [count, setCount] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (isRevealed) { setCount(text.length); return; }
    if (!isTyping)  { setCount(0); return; }
    let i = 0;
    setCount(0);
    const id = setInterval(() => {
      i++;
      setCount(i);
      if (i >= text.length) {
        clearInterval(id);
        setTimeout(() => doneRef.current?.(), 80);
      }
    }, charSpeed);
    return () => clearInterval(id);
  }, [isTyping, isRevealed, text, charSpeed]);

  if (!isTyping && !isRevealed) return null;
  const done = count >= text.length;
  return (
    <span>
      {text.slice(0, count)}
      {isTyping && !done && <span className="tw-cursor" aria-hidden="true" />}
    </span>
  );
}

export function LenderCard({ lender, frequency = 'monthly' }) {
  const { next, state } = useApp();
  const [open, setOpen]             = useState(false);
  const [typingPhase, setTypingPhase] = useState(-1);

  const {
    name, displayName, abbr, logo, logoBg, rate, comp, best,
    etFee, estFee, brokFee, monthlyFee, totalRepayNum,
    types, approval, reasons, sla,
    loanTerm, extraRepayments,
    capacityNote, conductNote, stabilityNote,
  } = lender;

  const shortName = displayName ?? name;

  const notes   = [capacityNote, conductNote, stabilityNote];
  const nextPhase = () => setTypingPhase(p => p + 1);

  /* Start typing after expand animation; reset cleanly on collapse */
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setTypingPhase(0), 340);
      return () => clearTimeout(t);
    }
    setTypingPhase(-1);
  }, [open]);

  /* Once all reasons are done, reveal notes one-by-one at 250 ms each */
  useEffect(() => {
    if (typingPhase < reasons.length) return;
    const noteIdx = typingPhase - reasons.length;
    if (noteIdx >= notes.length) return;
    const t = setTimeout(() => setTypingPhase(p => p + 1), 250);
    return () => clearTimeout(t);
  }, [typingPhase, reasons.length, notes.length]);

  const repayNum = {
    monthly:     totalRepayNum,
    fortnightly: Math.round(totalRepayNum * 12 / 26),
    weekly:      Math.round(totalRepayNum * 12 / 52),
  }[frequency];

  const etGreen  = etFee.includes('$0');
  const estGreen = estFee === '$0';
  const feeGreen = monthlyFee === '$0';

  const approvalHigh  = approval >= 85;
  const approvalColor = approvalHigh ? 'var(--green)' : approval >= 75 ? 'var(--hover)' : 'var(--yellow)';
  const approvalBg    = approvalHigh ? 'var(--green)' : 'var(--accentg)';
  const approvalLabel = approvalHigh ? 'High'         : approval >= 75 ? 'Good'         : 'Moderate';

  return (
    <div className={`lender-card${best ? ' best' : ''}`}>

      {/* ── Header ── */}
      <div className="lc-header">
        <LenderLogo src={logo} abbr={abbr} logoBg={logoBg} />
        <div className="lc-header-body">
          <div className="lc-name-row">
            <div className="lc-name">{shortName}</div>
            {best && (
              <div className="lc-best-badge">
                <Badge variant="green">
                  <Star size={9} fill="currentColor" /> Best match
                </Badge>
              </div>
            )}
          </div>
          <div className="lc-types">
            {types.map(t => (
              <span key={t} className={`type-pill ${t === 'Fixed' ? 'type-fixed' : 'type-variable'}`}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Repayment hero ── */}
      <div className="lc-repay">
        <div className="lc-repay-freq">{FREQ_TEXT[frequency]}</div>
        <div className="lc-repay-amount">
          <span className="lc-repay-curr">$</span>
          <span className="lc-repay-num">{repayNum.toLocaleString()}</span>
        </div>
        <div className="lc-repay-meta">inclusive of all fees &amp; charges</div>
      </div>

      {/* ── Rate chips ── */}
      <div className="lc-chips">
        <div className="lc-chip">
          <div className="lc-chip-val">{rate}</div>
          <div className="lc-chip-lbl">Interest p.a.</div>
        </div>
        <div className="lc-chip-sep" />
        <div className="lc-chip">
          <div className="lc-chip-val lc-chip-muted">{comp}</div>
          <div className="lc-chip-lbl">Comparison p.a.</div>
        </div>
        <div className="lc-chip-sep" />
        <div className="lc-chip">
          <div className="lc-chip-val lc-chip-sm lc-chip-muted">{sla}</div>
          <div className="lc-chip-lbl">Decision time</div>
        </div>
      </div>

      {/* ── Fee & loan info ── */}
      <div className="lc-info">
        <InfoRow label="Monthly fee"       value={monthlyFee}      valCls={feeGreen ? 'val-green' : 'val-yellow'} />
        <InfoRow label="Establishment fee" value={estFee}          valCls={estGreen ? 'val-green' : 'val-yellow'} />
        <InfoRow label="Early exit fee"    value={etFee}           valCls={etGreen  ? 'val-green' : 'val-amber'}  />
        <InfoRow label="Extra repayments"  value={extraRepayments}                                                 />
        <InfoRow label="Loan term"         value={state.loanTerm + ' Months' ?? '—'} last />
      </div>

      {/* ── Brokerage transparency strip ── */}
      <div className="lc-brok">
        <span className="lc-brok-dot" />
        <span>Brokerage fee: <strong>{brokFee}</strong> — disclosed in your credit guide</span>
      </div>

      {/* ── Approval confidence ── */}
      <div className="lc-approval">
        <div className="lca-row">
          <span className="lca-label">Approval confidence</span>
          <div className="lca-right">
            <span className="lca-badge" style={{ color: approvalColor, borderColor: `${approvalColor}66`, background: `${approvalColor}18` }}>
              {approvalLabel}
            </span>
            <span className="lca-pct" style={{ color: approvalColor }}>{approval}%</span>
          </div>
        </div>
        <div className="lca-bar">
          <div className="lca-fill" style={{ width: `${approval}%`, background: approvalBg }} />
        </div>
      </div>

      {/* ── CTA + toggle ── */}
      <div className="lc-cta">
        <button
          className={`lc-apply${best ? ' lc-apply-primary' : ' lc-apply-ghost'}`}
          onClick={next}
        >
          Apply with {shortName} →
        </button>
        <button className="lc-toggle" onClick={() => setOpen(p => !p)}>
          <span>{open ? 'View less' : 'View more'}</span>
          <ChevronDown size={14} className={`lc-chevron${open ? ' open' : ''}`} />
        </button>
      </div>

      {/* ── Expandable: Anika AI insights (typed) + Assessment notes (fade-in) ── */}
      <div className={`lc-expand${open ? ' open' : ''}`}>
        <div className="lc-expand-inner">

          {/* Anika AI insights — character-by-character typing */}
          <div className="lc-section">
            <div className="lc-section-head">
              <Sparkles size={10} /> Anika AI insights
            </div>
            {reasons.map((r, i) => (
              <div
                key={i}
                className="lc-reason"
                style={{ opacity: typingPhase >= i ? 1 : 0, transition: 'opacity 0.12s ease' }}
              >
                <CheckCircle2 size={12} className="lc-reason-icon" />
                <TypewriterText
                  text={r}
                  phase={typingPhase}
                  myPhase={i}
                  onDone={nextPhase}
                />
              </div>
            ))}
          </div>

          {/* Assessment notes — sequential fade-in after reasons complete */}
          <div className="lc-section lc-section-last">
            <div
              className="lc-section-head"
              style={{ opacity: typingPhase >= reasons.length ? 1 : 0, transition: 'opacity 0.2s ease' }}
            >
              Assessment notes
            </div>
            {notes.map((note, j) => {
              const notePhase = reasons.length + j;
              return (
                <div
                  key={j}
                  className={`lc-note${j === notes.length - 1 ? ' lc-note-last' : ''}`}
                  style={{ opacity: typingPhase > notePhase ? 1 : 0, transition: 'opacity 0.3s ease' }}
                >
                  {note}
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}
