import { Check } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import styles from './FormField.module.css';

export function FormField({ label, error, children, className, style }) {
  return (
    <div className={cn(styles.field, className)} style={style}>
      {label && <label className={styles.label}>{label}</label>}
      {children}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

export function RepayBox({ label, sub, value, rateLabel }) {
  return (
    <div className={styles.repayBox}>
      <div>
        <div className={styles.repayLabel}>{label}</div>
        <div className={styles.repaySub}>{sub}</div>
      </div>
      <div>
        <div className={styles.repayValue}>{value}</div>
        <div className={styles.repayRate}>{rateLabel}</div>
      </div>
    </div>
  );
}

export function CheckItem({ checked, onToggle, children }) {
  return (
    <div className={styles.checkItem}>
      <div
        className={cn(styles.checkBox, checked && styles.checkBoxChecked)}
        onClick={onToggle}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => e.key === ' ' && onToggle?.()}
      >
        {checked && <Check size={11} strokeWidth={2.5} />}
      </div>
      <div className={styles.checkContent}>{children}</div>
    </div>
  );
}

export function FormGrid({ cols = 2, children, className }) {
  return (
    <div
      className={cn(styles.grid, className)}
      style={{ '--fg-cols': cols }}
    >
      {children}
    </div>
  );
}
