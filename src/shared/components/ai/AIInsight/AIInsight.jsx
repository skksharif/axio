import { Sparkles } from 'lucide-react';
import styles from './AIInsight.module.css';

export function AIInsight({ title, children }) {
  return (
    <div className={styles.insight}>
      <div className={styles.header}>
        <Sparkles size={13} className={styles.icon} />
        <span className={styles.label}>{title ?? 'AI Insight'}</span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}

export function AIRecommendation({ label, value, sub }) {
  return (
    <div className={styles.rec}>
      <div className={styles.recLabel}>{label}</div>
      <div className={styles.recValue}>{value}</div>
      {sub && <div className={styles.recSub}>{sub}</div>}
    </div>
  );
}
