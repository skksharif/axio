import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import styles from './Modal.module.css';

export function Modal({ open, onClose, title, children, width = 480, className }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={cn(styles.panel, className)}
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || onClose) && (
          <div className={styles.header}>
            {title && <div className={styles.title}>{title}</div>}
            {onClose && (
              <button className={styles.close} onClick={onClose}>
                <X size={16} />
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
