import { ArrowLeft, ArrowRight } from 'lucide-react';
import styles from './Button.module.css';

function stripArrows(children) {
  if (typeof children !== 'string') return { label: children, left: false, right: false };
  let s = children;
  const left  = s.startsWith('← ');
  const right = s.endsWith(' →') || (s.endsWith('→') && !s.endsWith(' →'));
  if (left)  s = s.slice(2);
  if (right) s = s.endsWith(' →') ? s.slice(0, -2) : s.slice(0, -1).trimEnd();
  return { label: s, left, right };
}

export function BtnPrimary({ children, onClick, className, disabled }) {
  const { label, right } = stripArrows(children);
  return (
    <button
      className={`${styles.primary} ${className ?? ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
      {right && <ArrowRight size={14} className={styles.arrRight} strokeWidth={2.2} />}
    </button>
  );
}

export function BtnGhost({ children, onClick, className, disabled }) {
  const { label, left } = stripArrows(children);
  return (
    <button
      className={`${styles.ghost} ${className ?? ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {left && <ArrowLeft size={14} className={styles.arrLeft} strokeWidth={2.2} />}
      {label}
    </button>
  );
}

export function BtnRow({ children, className, justify }) {
  return (
    <div
      className={`${styles.row} ${className ?? ''}`}
      style={justify ? { justifyContent: justify } : undefined}
    >
      {children}
    </div>
  );
}

export function Button({ variant = 'primary', ...props }) {
  if (variant === 'ghost') return <BtnGhost {...props} />;
  return <BtnPrimary {...props} />;
}
