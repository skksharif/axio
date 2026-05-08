import { Check } from 'lucide-react';
import './FormField.css';

export function FormField({ label, error, children, style }) {
  return (
    <div className="fld" style={style}>
      {label && <label className="fl">{label}</label>}
      {children}
      {error && <div className="error-msg">{error}</div>}
    </div>
  );
}

export function RepayBox({ label, sub, value, rateLabel }) {
  return (
    <div className="repay-box">
      <div>
        <div className="rb-label">{label}</div>
        <div className="rb-sub">{sub}</div>
      </div>
      <div>
        <div className="rb-val">{value}</div>
        <div className="rb-rate">{rateLabel}</div>
      </div>
    </div>
  );
}

export function UploadZone({ done, onMark, children }) {
  return (
    <div className={`upload-zone ${done ? 'done' : ''}`} onClick={onMark}>
      {children}
    </div>
  );
}

export function CheckItem({ checked, onToggle, children }) {
  return (
    <div className="check-item">
      <div
        className={`check-box ${checked ? 'checked' : ''}`}
        onClick={onToggle}
      >
        {checked ? <Check size={11} strokeWidth={2.5} /> : null}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text1)', lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}
