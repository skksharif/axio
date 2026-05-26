import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SCREENS } from '@shared/constants/screens';

const initialState = {
  // Navigation
  currentScreen:    0,
  completedScreens: [],

  // Eligibility
  checkedEligibility: [],

  // Loan configuration
  loanType:         'personal',
  vehicleCondition: 'new',
  purchaseType:     'dealer',
  vehicleFound:     true,
  securityType:     'unsecured',
  securityAssetType:'vehicle',
  loanAmount:       25000,
  loanTerm:         null,
  deposit:          5000,
  tradeIn:          false,
  balloonPct:       0,
  purpose:          'debt',

  // Profile
  firstName:                '',
  lastName:                 '',
  relationshipStatus:       'single',
  dependants:               0,
  dependantAges:            [],
  residency:                'citizen',
  employmentTypes:          ['full-time'],
  livingStatus:             'mortgage',
  addressHistoryUnder3:     false,
  employmentHistoryUnder3:  false,

  // Income
  incomeTypes: [],

  // Applicant
  jointApplicant:  false,
  sharedExpenses:  false,
  sharedPct:       50,

  // Privacy / consents
  checkedConsents:          [],
  selectedServiceability:   'green',
};

export const useOnboardingStore = create(
  devtools(
    (set, get) => ({
      ...initialState,

      // ─── Navigation ───────────────────────────────────────────────────
      goTo: (i) => {
        if (i < 0 || i >= SCREENS.length) return;
        set((s) => {
          const completed = s.completedScreens.includes(s.currentScreen)
            ? s.completedScreens
            : [...s.completedScreens, s.currentScreen];
          return { currentScreen: i, completedScreens: completed };
        });
        window.scrollTo(0, 0);
      },

      next: () => {
        set((s) => {
          if (s.currentScreen >= SCREENS.length - 1) return s;
          const completed = s.completedScreens.includes(s.currentScreen)
            ? s.completedScreens
            : [...s.completedScreens, s.currentScreen];
          return { currentScreen: s.currentScreen + 1, completedScreens: completed };
        });
        window.scrollTo(0, 0);
      },

      prev: () => {
        set((s) =>
          s.currentScreen > 0 ? { currentScreen: s.currentScreen - 1 } : s
        );
        window.scrollTo(0, 0);
      },

      // ─── Generic updater ──────────────────────────────────────────────
      update: (fields) => set((s) => ({ ...s, ...fields })),

      // ─── Employment ───────────────────────────────────────────────────
      toggleEmploymentType: (id) => {
        set((s) => {
          const current = s.employmentTypes;
          let types;
          if (id === 'not-employed') {
            types = current.includes(id) ? [] : [id];
          } else {
            const without = current.filter((t) => t !== 'not-employed');
            types = without.includes(id)
              ? without.filter((t) => t !== id)
              : [...without, id];
          }
          return { employmentTypes: types };
        });
      },

      // ─── Income ───────────────────────────────────────────────────────
      toggleIncomeType: (id) => {
        set((s) => {
          const active = s.incomeTypes.includes(id)
            ? s.incomeTypes.filter((t) => t !== id)
            : [...s.incomeTypes, id];
          return { incomeTypes: active };
        });
      },

      // ─── Consents ─────────────────────────────────────────────────────
      toggleConsent: (idx) => {
        set((s) => {
          const checked = s.checkedConsents.includes(idx)
            ? s.checkedConsents.filter((i) => i !== idx)
            : [...s.checkedConsents, idx];
          return { checkedConsents: checked };
        });
      },

      // ─── Dependants ───────────────────────────────────────────────────
      toggleDependantAge: (age) => {
        set((s) => {
          const ages = s.dependantAges.includes(age)
            ? s.dependantAges.filter((a) => a !== age)
            : [...s.dependantAges, age];
          return { dependantAges: ages };
        });
      },

      reset: () => set(initialState),
    }),
    { name: 'OnboardingStore' }
  )
);
