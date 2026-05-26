import { lazy, Suspense } from 'react';
import { useOnboardingStore } from '@app/store/onboardingStore';
import { useUIStore }         from '@app/store/uiStore';
import { Sidebar }            from '@shared/components/layout/Sidebar';
import { TopBar }             from '@shared/components/layout/TopBar';
import { FullPageSpinner }    from '@shared/components/ui/Spinner';
import { SCREEN_COMPONENTS }  from '@app/router';

function ScreenFallback() {
  return <FullPageSpinner />;
}

export default function App() {
  const currentScreen = useOnboardingStore((s) => s.currentScreen);

  const CurrentScreen = SCREEN_COMPONENTS[currentScreen] ?? SCREEN_COMPONENTS[0];

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="screen-area">
          <Suspense fallback={<ScreenFallback />}>
            <CurrentScreen key={currentScreen} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
