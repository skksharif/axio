import { cn } from '@shared/utils/cn';
import styles from './InfoBanner.module.css';

export function InfoBanner({ icon: Icon, children, variant = 'blue', className, style }) {
  return (
    <div className={cn(styles.banner, styles[variant], className)} style={style}>
      {Icon && (
        <span className={styles.icon}>
          <Icon size={15} />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}
