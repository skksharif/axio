import { Check } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import styles from './ChoiceCard.module.css';

export function ChoiceGrid({ cols = 2, children, className, style }) {
  return (
    <div
      className={cn(styles.grid, className)}
      style={{ '--cc-cols': cols, ...style }}
    >
      {children}
    </div>
  );
}

export function ChoiceCard({ icon, title, desc, selected, onClick, children, className, style }) {
  return (
    <div
      className={cn(styles.card, selected && styles.selected, className)}
      onClick={onClick}
      style={style}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => e.key === ' ' && onClick?.()}
    >
      <div className={styles.check}><Check size={11} strokeWidth={2.5} /></div>
      {icon && <div className={styles.icon}>{icon}</div>}
      {title && <div className={styles.title}>{title}</div>}
      {desc  && <div className={styles.desc}>{desc}</div>}
      {children}
    </div>
  );
}

export function CondCard({ icon, title, desc, badge, selected, onClick }) {
  return (
    <div
      className={cn(styles.condCard, selected && styles.selected)}
      onClick={onClick}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => e.key === ' ' && onClick?.()}
    >
      <div className={styles.check}><Check size={11} strokeWidth={2.5} /></div>
      {icon  && <div className={styles.icon} style={{ fontSize: 30, marginBottom: 10 }}>{icon}</div>}
      {title && <div className={styles.title}>{title}</div>}
      {desc  && <div className={styles.desc}>{desc}</div>}
      {badge && <div style={{ marginTop: 9 }}>{badge}</div>}
    </div>
  );
}
