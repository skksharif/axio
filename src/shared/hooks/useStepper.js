import { useOnboardingStore } from '@app/store/onboardingStore';
import { SCREENS } from '@shared/constants/screens';

/**
 * Provides step navigation utilities consumed by all screens.
 * Wraps onboardingStore's goTo/next/prev with derived state.
 */
export function useStepper() {
  const currentScreen    = useOnboardingStore((s) => s.currentScreen);
  const completedScreens = useOnboardingStore((s) => s.completedScreens);
  const goTo = useOnboardingStore((s) => s.goTo);
  const next  = useOnboardingStore((s) => s.next);
  const prev  = useOnboardingStore((s) => s.prev);

  const currentScreenData = SCREENS[currentScreen];
  const totalScreens      = SCREENS.length;
  const isFirst           = currentScreen === 0;
  const isLast            = currentScreen === totalScreens - 1;
  const progressPct       = ((currentScreen + 1) / totalScreens) * 100;
  const isCompleted       = (idx) => completedScreens.includes(idx);

  return {
    currentScreen,
    currentScreenData,
    completedScreens,
    totalScreens,
    isFirst,
    isLast,
    progressPct,
    isCompleted,
    goTo,
    next,
    prev,
  };
}
