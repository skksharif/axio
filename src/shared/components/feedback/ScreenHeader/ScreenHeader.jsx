import { Sparkles } from 'lucide-react';
import styles from './ScreenHeader.module.css';

export function ScreenHeader({ eyebrow, title, titleGradient, sub }) {
  return (
    <div className={styles.wrap}>
      {eyebrow && (
        <div className={styles.eyebrow}>
          <Sparkles size={10} />
          {eyebrow}
        </div>
      )}
      <div className={styles.title}>
        {title}
        {titleGradient && <span className={styles.gradient}> {titleGradient}</span>}
      </div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}
