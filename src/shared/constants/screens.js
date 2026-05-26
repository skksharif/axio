/**
 * Single source of truth for all onboarding screens.
 * Used by: router, sidebar, progress bar, step tags, navigation, summary edit links.
 */
export const SCREENS = [
  // GET STARTED
  { id: 'eligibility',        label: 'Eligibility check',    group: 'Get started',   route: '/'                   },
  { id: 'product',            label: 'Product selection',    group: 'Get started',   route: '/product'            },
  { id: 'loandetails',        label: 'Loan details',         group: 'Get started',   route: '/loan-details'       },

  // PROFILE
  { id: 'profile',            label: 'Your profile',         group: 'Profile',       route: '/profile'            },
  { id: 'income',             label: 'Income',               group: 'Profile',       route: '/income'             },
  { id: 'assets',             label: 'Assets',               group: 'Profile',       route: '/assets'             },
  { id: 'liabilities',        label: 'Liabilities',          group: 'Profile',       route: '/liabilities'        },
  { id: 'expenses',           label: 'Living expenses',      group: 'Profile',       route: '/expenses'           },

  // APPLICATION
  { id: 'privacy',            label: 'Privacy & consent',    group: 'Application',   route: '/privacy'            },
  { id: 'summary',            label: 'Final summary',        group: 'Application',   route: '/summary'            },

  // MATCHING
  { id: 'lenders',            label: 'Your matches',         group: 'Matching',      route: '/lenders'            },

  // ACCOUNT SETUP
  { id: 'signup',             label: 'Create account',       group: 'Account Setup', route: '/create-account'     },

  // VERIFICATION
  { id: 'documentsupload',    label: 'Document uploads',     group: 'Verification',  route: '/documents'          },
  { id: 'connectbanks',       label: 'Connect banks',        group: 'Verification',  route: '/connect-banks'      },
  { id: 'verificationstatus', label: 'Verification status',  group: 'Verification',  route: '/verification'       },

  // PORTAL
  { id: 'dashboard',          label: 'Dashboard',            group: 'Portal',        route: '/dashboard'          },
];

export const SCREEN_GROUPS = [
  'Get started',
  'Profile',
  'Application',
  'Matching',
  'Account Setup',
  'Verification',
  'Portal',
];

/** 1-based step number for a screen id */
export function getStep(id) {
  const idx = SCREENS.findIndex((s) => s.id === id);
  return idx === -1 ? 1 : idx + 1;
}

/** Screen by index */
export function getScreenByIndex(index) {
  return SCREENS[index] ?? SCREENS[0];
}

/** Screen by id */
export function getScreenById(id) {
  return SCREENS.find((s) => s.id === id) ?? SCREENS[0];
}

/** All screens for a given group */
export function getScreensByGroup(group) {
  return SCREENS.filter((s) => s.group === group);
}

export const TRUST_SIDEBAR = [
  { icon: 'ShieldCheck', text: 'Zero credit file impact during matching' },
  { icon: 'Lock',        text: 'Bank-grade 256-bit encryption'           },
  { icon: 'Smartphone',  text: 'Electronic only — no pressure calls'     },
];
