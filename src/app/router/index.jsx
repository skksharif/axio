import { lazy } from 'react';

// ─── Feature screen lazy imports ──────────────────────────────────────────────
const EligibilityScreen        = lazy(() => import('@features/eligibility'));
const ProductScreen            = lazy(() => import('@features/product-selection'));
const LoanDetailsScreen        = lazy(() => import('@features/loan-details'));
const ProfileScreen            = lazy(() => import('@features/profile'));
const IncomeScreen             = lazy(() => import('@features/income'));
const AssetsScreen             = lazy(() => import('@features/assets'));
const LiabilitiesScreen        = lazy(() => import('@features/liabilities'));
const ExpensesScreen           = lazy(() => import('@features/expenses'));
const PrivacyScreen            = lazy(() => import('@features/privacy'));
const SummaryScreen            = lazy(() => import('@features/summary'));
const LendersScreen            = lazy(() => import('@features/lenders'));
const CreateAccountScreen      = lazy(() => import('@features/create-account'));
const DocumentsScreen          = lazy(() => import('@features/documents'));
const ConnectBanksScreen       = lazy(() => import('@features/connect-banks'));
const VerificationScreen       = lazy(() => import('@features/verification'));
const DashboardScreen          = lazy(() => import('@features/dashboard'));

/**
 * Maps screen index (from SCREENS array) to a lazy-loaded component.
 * Order MUST match shared/constants/screens.js SCREENS array exactly.
 */
export const SCREEN_COMPONENTS = [
  EligibilityScreen,    //  0  Step 1
  ProductScreen,        //  1  Step 2
  LoanDetailsScreen,    //  2  Step 3
  ProfileScreen,        //  3  Step 4
  IncomeScreen,         //  4  Step 5
  AssetsScreen,         //  5  Step 6
  LiabilitiesScreen,    //  6  Step 7
  ExpensesScreen,       //  7  Step 8
  PrivacyScreen,        //  8  Step 9
  SummaryScreen,        //  9  Step 10
  LendersScreen,        // 10  Step 11
  CreateAccountScreen,  // 11  Step 12
  DocumentsScreen,      // 12  Step 13
  ConnectBanksScreen,   // 13  Step 14
  VerificationScreen,   // 14  Step 15
  DashboardScreen,      // 15  Step 16
];
