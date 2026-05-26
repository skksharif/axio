import { cn } from '@shared/utils/cn';
import styles from './Progress.module.css';

export function Progress({ value, max = 100, className, showLabel }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn(styles.wrap, className)}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct.toFixed(1)}%` }} />
      </div>
      {showLabel && <span className={styles.label}>{Math.round(pct)}%</span>}
    </div>
  );
}
