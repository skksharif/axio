import { cn } from '@shared/utils/cn';
import styles from './Toggle.module.css';

export function Toggle({ on, onToggle, disabled, label }) {
  return (
    <label className={styles.wrap}>
      <div
        className={cn(styles.track, on && styles.on, disabled && styles.disabled)}
        onClick={disabled ? undefined : onToggle}
        role="switch"
        aria-checked={on}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && onToggle?.()}
      >
        <div className={styles.thumb} />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
