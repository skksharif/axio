import { Check } from 'lucide-react';
import './ChoiceCard.css';

export function ChoiceGrid({ cols = 2, children, style }) {
  return (
    <div className={`choice-grid-${cols}`} style={style}>
      {children}
    </div>
  );
}

export function ChoiceCard({ icon, title, desc, selected, onClick, children, style }) {
  return (
    <div
      className={`choice-card ${selected ? 'on' : ''}`}
      onClick={onClick}
      style={style}
    >
      <div className="cc-check"><Check size={11} strokeWidth={2.5} /></div>
      {icon && <div className="cc-icon">{icon}</div>}
      {title && <div className="cc-title">{title}</div>}
      {desc && <div className="cc-desc">{desc}</div>}
      {children}
    </div>
  );
}

export function CondCard({ icon, title, desc, badge, selected, onClick }) {
  return (
    <div className={`cond-card ${selected ? 'on' : ''}`} onClick={onClick}>
      <div className="cc-check"><Check size={11} strokeWidth={2.5} /></div>
      {icon && <div className="cc-icon" style={{ fontSize: 30, marginBottom: 10 }}>{icon}</div>}
      {title && <div className="cc-title">{title}</div>}
      {desc && <div className="cc-desc">{desc}</div>}
      {badge && <div style={{ marginTop: 9 }}>{badge}</div>}
    </div>
  );
}
