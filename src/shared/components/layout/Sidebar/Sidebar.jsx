import { Fragment, useMemo, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Icon } from '@/components/common/Icon';
import { useOnboardingStore } from '@app/store/onboardingStore';
import { useUIStore }         from '@app/store/uiStore';
import { SCREENS, TRUST_SIDEBAR } from '@shared/constants/screens';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const currentScreen    = useOnboardingStore((s) => s.currentScreen);
  const completedScreens = useOnboardingStore((s) => s.completedScreens);
  const goTo             = useOnboardingStore((s) => s.goTo);

  const sidebarOpen  = useUIStore((s) => s.sidebarOpen);
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  const pct         = ((currentScreen + 1) / SCREENS.length) * 100;
  const navListRef  = useRef(null);
  const activeItemRef = useRef(null);

  useEffect(() => {
    const el   = activeItemRef.current;
    const list = navListRef.current;
    if (!el || !list) return;
    const id = setTimeout(() => {
      const elRect   = el.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      const listH    = list.clientHeight;
      const elH      = el.offsetHeight;
      const buffer   = 56;
      const topOk = elRect.top    >= listRect.top    + buffer;
      const botOk = elRect.bottom <= listRect.bottom - buffer;
      if (!topOk || !botOk) {
        const delta = (elRect.top - listRect.top) - (listH - elH) / 2;
        list.scrollTo({ top: Math.max(0, list.scrollTop + delta), behavior: 'smooth' });
      }
    }, 60);
    return () => clearTimeout(id);
  }, [currentScreen, sidebarOpen]);

  const groups = useMemo(() => {
    const result = [];
    SCREENS.forEach((s, i) => {
      const isActive    = i === currentScreen;
      const isCompleted = completedScreens.includes(i);
      const isLocked    = i > currentScreen && !isCompleted;
      const item        = { screen: s, index: i, isActive, isCompleted, isLocked };
      const last        = result[result.length - 1];
      if (!last || last.label !== s.group) {
        result.push({ label: s.group, items: [item] });
      } else {
        last.items.push(item);
      }
    });
    return result;
  }, [currentScreen, completedScreens]);

  const handleNavClick = (item) => {
    if (!item.isLocked) { goTo(item.index); closeSidebar(); }
  };

  return (
    <>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar} aria-hidden="true" />
      )}

      <div
        className={`${styles.sidebar} ${sidebarOpen ? styles.mobileOpen : ''}`}
        role="navigation"
        aria-label="Journey navigation"
      >
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <div className={styles.brandIcon}>Ax</div>
            <div className={styles.brandText}>
              <div className={styles.brandName}>Axio Finance</div>
              <div className={styles.brandBadge}>
                <span className={styles.brandDot} />
                AI-guided
              </div>
            </div>
          </div>
          <div className={styles.brandTag}>Consumer Quote Journey · Finance for the new generation</div>
        </div>

        <div className={styles.progress}>
          <div className={styles.progressHead}>
            <span className={styles.progressEyebrow}>Journey Progress</span>
            <span className={styles.progressPct}>{Math.round(pct)}%</span>
          </div>
          <div className={styles.progressCounter}>
            <div className={styles.progressMain}>
              <span className={styles.progressNum}>{currentScreen + 1}</span>
              <span className={styles.progressSep}>/</span>
              <span className={styles.progressTotal}>{SCREENS.length}</span>
            </div>
            <span className={styles.progressUnit}>steps completed</span>
          </div>
          <div className={styles.progressTrackWrap}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${pct.toFixed(1)}%` }} />
            </div>
            <div className={styles.progressMark} style={{ left: '25%' }} />
            <div className={styles.progressMark} style={{ left: '50%' }} />
            <div className={styles.progressMark} style={{ left: '75%' }} />
          </div>
        </div>

        <nav className={styles.navList} ref={navListRef}>
          {groups.map((group, gi) => (
            <div key={gi} className={styles.navGroup}>
              <div className={styles.navGroupHeader}>
                <span className={styles.navGroupLabel}>{group.label}</span>
                <span className={styles.navGroupRule} />
              </div>
              <div className={styles.navGroupFlow}>
                {group.items.map((item, ii) => (
                  <Fragment key={item.index}>
                    <div
                      ref={item.isActive ? activeItemRef : undefined}
                      className={[
                        styles.navItem,
                        item.isActive    && styles.active,
                        item.isCompleted && styles.completed,
                        item.isLocked    && styles.locked,
                      ].filter(Boolean).join(' ')}
                      onClick={() => handleNavClick(item)}
                      role="button"
                      tabIndex={item.isLocked ? -1 : 0}
                      onKeyDown={(e) => e.key === 'Enter' && handleNavClick(item)}
                      aria-current={item.isActive ? 'step' : undefined}
                    >
                      <div className={styles.navTrack}>
                        <div className={styles.navInd}>
                          {item.isCompleted
                            ? <Check size={10} strokeWidth={2.8} />
                            : <span>{item.index + 1}</span>}
                        </div>
                      </div>
                      <span className={styles.navLabel}>{item.screen.label}</span>
                      <span className={styles.navDot} />
                    </div>
                    {ii < group.items.length - 1 && (
                      <div
                        className={[
                          styles.navSeg,
                          item.isCompleted && styles.segDone,
                          item.isActive    && styles.segActive,
                        ].filter(Boolean).join(' ')}
                        aria-hidden="true"
                      />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className={styles.trust}>
          {TRUST_SIDEBAR.map((t, i) => (
            <div key={i} className={styles.trustItem}>
              <span className={styles.trustIcon}><Icon name={t.icon} size={14} /></span>
              {t.text}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
