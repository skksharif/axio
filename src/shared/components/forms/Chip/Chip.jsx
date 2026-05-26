import { cn } from '@shared/utils/cn';
import styles from './Chip.module.css';

export function Chips({ children, className, style }) {
  return (
    <div className={cn(styles.chips, className)} style={style}>
      {children}
    </div>
  );
}

export function Chip({ children, selected, onClick, disabled, className, style }) {
  return (
    <div
      className={cn(styles.chip, selected && styles.on, disabled && styles.disabled, className)}
      onClick={disabled ? undefined : onClick}
      style={style}
      role="checkbox"
      aria-checked={selected}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => e.key === ' ' && !disabled && onClick?.()}
    >
      {children}
    </div>
  );
}
