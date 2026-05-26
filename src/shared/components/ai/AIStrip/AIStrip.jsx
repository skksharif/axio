import styles from './AIStrip.module.css';

export function AIStrip({ children, style }) {
  return (
    <div className={styles.strip} style={style}>
      <div className={styles.orb}>AI</div>
      <div className={styles.text}>{children}</div>
    </div>
  );
}

export function AIStatus({ status = 'ready', children }) {
  return (
    <div className={`${styles.status} ${styles[status]}`}>
      <span className={styles.statusDot} />
      {children}
    </div>
  );
}

export function AIAlert({ children, style }) {
  return (
    <div className={styles.alert} style={style}>
      <div className={styles.orb}>AI</div>
      <span>{children}</span>
    </div>
  );
}
