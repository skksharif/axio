import { cn } from '@shared/utils/cn';
import styles from './Spinner.module.css';

export function Spinner({ size = 'md', className }) {
  return (
    <div className={cn(styles.spinner, styles[size], className)} aria-label="Loading" />
  );
}

export function FullPageSpinner() {
  return (
    <div className={styles.fullPage}>
      <Spinner size="lg" />
    </div>
  );
}
