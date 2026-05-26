import { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import styles from './AnikaCard.module.css';

export function AnikaCard({ message, thinkingMs = 800 }) {
  const [phase, setPhase] = useState('thinking');
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setPhase('streaming'), thinkingMs);
    return () => clearTimeout(t);
  }, [thinkingMs]);

  useEffect(() => {
    if (phase !== 'streaming') return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(message.slice(0, i));
      if (i >= message.length) { clearInterval(id); setPhase('done'); }
    }, 14);
    return () => clearInterval(id);
  }, [phase, message]);

  const isThinking  = phase === 'thinking';
  const isStreaming = phase === 'streaming';

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatarRing} />
          <div className={styles.avatar}><Sparkles size={16} /></div>
        </div>
        <div className={styles.headerBody}>
          <div className={styles.name}>Anika AI</div>
          <div className={styles.status}>
            {isThinking ? (
              <>
                <span>Thinking</span>
                <span className={styles.dots}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </span>
              </>
            ) : (
              <span className={styles.statusDone}>Ready</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {isThinking ? (
          <div className={styles.shimmer}>
            <div className={`${styles.shimmerLine} ${styles.w85}`} />
            <div className={`${styles.shimmerLine} ${styles.w65}`} />
          </div>
        ) : (
          <p className={styles.message}>
            {displayed}
            {isStreaming && <span className={styles.cursor} />}
          </p>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerDivider} />
        <div className={styles.footerTrust}>
          <ShieldCheck size={11} />
          <span>Soft enquiry only — zero credit file impact.</span>
        </div>
      </div>
    </div>
  );
}
