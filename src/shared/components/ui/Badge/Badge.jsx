import { cn } from '@shared/utils/cn';
import styles from './Badge.module.css';

export function Badge({ children, variant = 'blue', className, style }) {
  return (
    <span className={cn(styles.badge, styles[variant], className)} style={style}>
      {children}
    </span>
  );
}

export function StatusPill({ children, variant = 'green', className }) {
  return (
    <div className={cn(styles.pill, styles[`pill_${variant}`], className)}>
      {children}
    </div>
  );
}
