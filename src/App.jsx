import { lazy, Suspense, useState, useCallback } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';

const EligibilityScreen        = lazy(() => import('./screens/EligibilityScreen').then(m => ({ default: m.EligibilityScreen })));
const ProductScreen            = lazy(() => import('./screens/ProductScreen').then(m => ({ default: m.ProductScreen })));
const LoanDetailsScreen        = lazy(() => import('./screens/LoanDetailsScreen').then(m => ({ default: m.LoanDetailsScreen })));
const ProfileScreen            = lazy(() => import('./screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const IncomeScreen             = lazy(() => import('./screens/IncomeScreen').then(m => ({ default: m.IncomeScreen })));
const AssetsScreen             = lazy(() => import('./screens/AssetsScreen').then(m => ({ default: m.AssetsScreen })));
const LiabilitiesScreen        = lazy(() => import('./screens/LiabilitiesScreen').then(m => ({ default: m.LiabilitiesScreen })));
const ExpensesScreen           = lazy(() => import('./screens/ExpensesScreen').then(m => ({ default: m.ExpensesScreen })));
const PrivacyScreen            = lazy(() => import('./screens/PrivacyScreen').then(m => ({ default: m.PrivacyScreen })));
const SummaryScreen            = lazy(() => import('./screens/SummaryScreen').then(m => ({ default: m.SummaryScreen })));
const LendersScreen            = lazy(() => import('./screens/LendersScreen').then(m => ({ default: m.LendersScreen })));
const CreateAccount            = lazy(() => import('./screens/CreateAccount').then(m => ({ default: m.CreateAccount })));
const DocumentsUploadScreen    = lazy(() => import('./screens/DocumentsUploadScreen').then(m => ({ default: m.DocumentsUploadScreen })));
const ConnectBanksScreen       = lazy(() => import('./screens/ConnectBanksScreen').then(m => ({ default: m.ConnectBanksScreen })));
const VerificationStatusScreen = lazy(() => import('./screens/VerificationStatusScreen').then(m => ({ default: m.VerificationStatusScreen })));
const DashboardScreen          = lazy(() => import('./screens/DashboardScreen').then(m => ({ default: m.DashboardScreen })));

// Order MUST match screens.js exactly (index → component)
const SCREEN_COMPONENTS = [
  EligibilityScreen,        //  0  Step 1
  ProductScreen,            //  1  Step 2
  LoanDetailsScreen,        //  2  Step 3
  ProfileScreen,            //  3  Step 4
  IncomeScreen,             //  4  Step 5
  AssetsScreen,             //  5  Step 6
  LiabilitiesScreen,        //  6  Step 7
  ExpensesScreen,           //  7  Step 8
  ConnectBanksScreen,       //  8  Step 9
  DocumentsUploadScreen,    //  9  Step 10
  PrivacyScreen,            // 10  Step 11
  SummaryScreen,            // 11  Step 12
  LendersScreen,            // 12  Step 13
  CreateAccount,            // 13  Step 14
  VerificationStatusScreen, // 14  Step 15
  DashboardScreen,          // 15  Step 16
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
