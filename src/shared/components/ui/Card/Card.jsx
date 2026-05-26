import { cn } from '@shared/utils/cn';
import styles from './Card.module.css';

export function Card({ children, className, style, elevated }) {
  return (
    <div
      className={cn(styles.card, elevated && styles.elevated, className)}
      style={style}
    >
      {children}
    </div>
  );
}

export function CardTitle({ icon: Icon, children, className }) {
  return (
    <div className={cn(styles.title, className)}>
      {Icon && (
        <div className={styles.iconBox}>
          <Icon size={18} />
        </div>
      )}
      {children}
    </div>
  );
}

export function CardSection({ children, className }) {
  return <div className={cn(styles.section, className)}>{children}</div>;
}
