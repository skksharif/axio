import { lazy, Suspense, useState, useCallback } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';

const ProductScreen     = lazy(() => import('./screens/ProductScreen').then(m => ({ default: m.ProductScreen })));
const LoanDetailsScreen = lazy(() => import('./screens/LoanDetailsScreen').then(m => ({ default: m.LoanDetailsScreen })));
const ProfileScreen     = lazy(() => import('./screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const IncomeScreen      = lazy(() => import('./screens/IncomeScreen').then(m => ({ default: m.IncomeScreen })));
const AssetsScreen      = lazy(() => import('./screens/AssetsScreen').then(m => ({ default: m.AssetsScreen })));
const LiabilitiesScreen = lazy(() => import('./screens/LiabilitiesScreen').then(m => ({ default: m.LiabilitiesScreen })));
const ExpensesScreen    = lazy(() => import('./screens/ExpensesScreen').then(m => ({ default: m.ExpensesScreen })));
const DocumentsScreen   = lazy(() => import('./screens/DocumentsScreen').then(m => ({ default: m.DocumentsScreen })));
const PrivacyScreen     = lazy(() => import('./screens/PrivacyScreen').then(m => ({ default: m.PrivacyScreen })));
const SummaryScreen     = lazy(() => import('./screens/SummaryScreen').then(m => ({ default: m.SummaryScreen })));
const LendersScreen     = lazy(() => import('./screens/LendersScreen').then(m => ({ default: m.LendersScreen })));
const SignupScreen      = lazy(() => import('./screens/SignupScreen').then(m => ({ default: m.SignupScreen })));
const DashboardScreen   = lazy(() => import('./screens/DashboardScreen').then(m => ({ default: m.DashboardScreen })));

const SCREEN_COMPONENTS = [
  ProductScreen,
  LoanDetailsScreen,
  ProfileScreen,
  IncomeScreen,
  AssetsScreen,
  LiabilitiesScreen,
  ExpensesScreen,
  DocumentsScreen,
  PrivacyScreen,
  SummaryScreen,
  LendersScreen,
  SignupScreen,
  DashboardScreen,
];

function ScreenFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, color: 'var(--text2)', fontSize: 13 }}>
      Loading…
    </div>
  );
}

export default function App() {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar  = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const CurrentScreen = SCREEN_COMPONENTS[state.currentScreen] ?? SCREEN_COMPONENTS[0];

  return (
    <div className="app">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="main-content">
        <TopBar onMenuClick={openSidebar} />
        <div className="screen-area">
          <Suspense fallback={<ScreenFallback />}>
            <CurrentScreen key={state.currentScreen} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
