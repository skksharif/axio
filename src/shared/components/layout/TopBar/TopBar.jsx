import { CircleDot } from 'lucide-react';
import { useOnboardingStore } from '@app/store/onboardingStore';
import { useUIStore }         from '@app/store/uiStore';
import { SCREENS }            from '@shared/constants/screens';
import { getInitials }        from '@shared/utils/format';
import styles from './TopBar.module.css';

export function TopBar() {
  const currentScreen = useOnboardingStore((s) => s.currentScreen);
  const firstName     = useOnboardingStore((s) => s.firstName);
  const lastName      = useOnboardingStore((s) => s.lastName);
  const openSidebar   = useUIStore((s) => s.openSidebar);

  const screen   = SCREENS[currentScreen];
  const initials = getInitials(firstName, lastName);

  return (
    <div className={styles.topbar}>
      <div className={styles.left}>
        <button
          className={styles.hamburger}
          onClick={openSidebar}
          aria-label="Open navigation"
        >
          <span /><span /><span />
        </button>
        <span className={styles.step}>Step {currentScreen + 1} of {SCREENS.length}</span>
        <span className={styles.divider}>·</span>
        <span className={styles.title}>{screen?.label}</span>
      </div>
      <div className={styles.right}>
        <span className={styles.saveIndicator}>
          <CircleDot size={8} />
          Progress saved
        </span>
        <div className={styles.avatar}>{initials}</div>
      </div>
    </div>
  );
}
