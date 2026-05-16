import { ArrowLeft, ArrowRight } from 'lucide-react';
import './Button.css';

function stripArrows(children) {
  if (typeof children !== 'string') return { label: children, left: false, right: false };
  let s = children;
  const left  = s.startsWith('← ');
  const right = s.endsWith(' →') || (s.endsWith('→') && !s.endsWith(' →'));
  if (left)  s = s.slice(2);
  if (right) s = s.endsWith(' →') ? s.slice(0, -2) : s.slice(0, -1).trimEnd();
  return { label: s, left, right };
}

export function BtnPrimary({ children, onClick, style, disabled }) {
  const { label, right } = stripArrows(children);
  return (
    <button className="btn-primary" onClick={onClick} style={style} disabled={disabled}>
      {label}
      {right && <ArrowRight size={14} className="btn-arr btn-arr-r" strokeWidth={2.2} />}
    </button>
  );
}

export function BtnGhost({ children, onClick, style, disabled }) {
  const { label, left } = stripArrows(children);
  return (
    <button className="btn-ghost" onClick={onClick} style={style} disabled={disabled}>
      {left && <ArrowLeft size={14} className="btn-arr btn-arr-l" strokeWidth={2.2} />}
      {label}
    </button>
  );
}

export function BtnRow({ children, style }) {
  return <div className="btn-row" style={style}>{children}</div>;
}
