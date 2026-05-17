import { createContext, useContext, useState, useCallback } from 'react';
import { SCREENS } from '../constants/screens';
import { EXPENSE_CATEGORIES } from '../data/expenseCategories';

const initialExpenses = Object.fromEntries(
  EXPENSE_CATEGORIES.map(e => [e.id, e.defaultVal])
);

const initialState = {
  currentScreen: 0,
  completedScreens: [],
  loanType: 'personal',
  vehicleCondition: 'new',
  purchaseType: 'dealer',
  vehicleFound: true,
  securityType: 'unsecured',
  loanAmount: 25000,
  loanTerm: null,
  deposit: 5000,
  tradeIn: false,
  balloonPct: 0,
  purpose: 'debt',
  relationshipStatus: 'single',
  dependants: 0,
  residency: 'citizen',
  employmentTypes: ['full-time'],
  livingStatus: 'mortgage',
  incomeTypes: [],
  sharedExpenses: false,
  sharedPct: 50,
  bankConnected: false,
  selectedBank: null,
  jointApplicant: false,
  firstName: '',
  lastName: '',
  checkedConsents: [],
  selectedServiceability: 'green',
  uploadedDocs: {},
  assets: {},
  liabilities: {},
  realEstateLinks: {},
  expenses: initialExpenses,
  addressHistoryUnder3: false,
  employmentHistoryUnder3: false,
  dependantAges: [],
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(initialState);

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const goTo = useCallback((i) => {
    if (i < 0 || i >= SCREENS.length) return;
    setState(prev => {
      const completed = prev.completedScreens.includes(prev.currentScreen)
        ? prev.completedScreens
        : [...prev.completedScreens, prev.currentScreen];
      return { ...prev, currentScreen: i, completedScreens: completed };
    });
    window.scrollTo(0, 0);
  }, []);

  const next = useCallback(() => {
    setState(prev => {
      if (prev.currentScreen >= SCREENS.length - 1) return prev;
      const completed = prev.completedScreens.includes(prev.currentScreen)
        ? prev.completedScreens
        : [...prev.completedScreens, prev.currentScreen];
      return { ...prev, currentScreen: prev.currentScreen + 1, completedScreens: completed };
    });
    window.scrollTo(0, 0);
  }, []);

  const prev = useCallback(() => {
    setState(s => s.currentScreen > 0 ? { ...s, currentScreen: s.currentScreen - 1 } : s);
    window.scrollTo(0, 0);
  }, []);

  const toggleAsset = useCallback((id) => {
    setState(s => ({ ...s, assets: { ...s.assets, [id]: !s.assets[id] } }));
  }, []);

  const toggleLiability = useCallback((id) => {
    setState(s => ({ ...s, liabilities: { ...s.liabilities, [id]: !s.liabilities[id] } }));
  }, []);

  const setRealEstateLink = useCallback((itemId, data) => {
    setState(s => ({
      ...s,
      realEstateLinks: { ...s.realEstateLinks, [itemId]: { id: itemId, ...data } },
    }));
  }, []);

  const removeRealEstateLink = useCallback((itemId) => {
    setState(s => {
      const { [itemId]: _removed, ...rest } = s.realEstateLinks;
      return { ...s, realEstateLinks: rest };
    });
  }, []);

  const clearRealEstateLinks = useCallback(() => {
    setState(s => ({ ...s, realEstateLinks: {} }));
  }, []);

  const toggleConsent = useCallback((idx) => {
    setState(s => {
      const checked = s.checkedConsents.includes(idx)
        ? s.checkedConsents.filter(i => i !== idx)
        : [...s.checkedConsents, idx];
      return { ...s, checkedConsents: checked };
    });
  }, []);

  const toggleIncomeType = useCallback((id) => {
    setState(s => {
      const active = s.incomeTypes.includes(id)
        ? s.incomeTypes.filter(t => t !== id)
        : [...s.incomeTypes, id];
      return { ...s, incomeTypes: active };
    });
  }, []);

  const stepExpense = useCallback((id, delta) => {
    setState(s => ({
      ...s,
      expenses: { ...s.expenses, [id]: Math.max(0, (s.expenses[id] || 0) + delta) },
    }));
  }, []);

  const toggleDependantAge = useCallback((age) => {
    setState(s => {
      const ages = s.dependantAges.includes(age)
        ? s.dependantAges.filter(a => a !== age)
        : [...s.dependantAges, age];
      return { ...s, dependantAges: ages };
    });
  }, []);

  const toggleEmploymentType = useCallback((id) => {
    setState(s => {
      const current = s.employmentTypes;
      let types;
      if (id === 'not-employed') {
        types = current.includes(id) ? [] : [id];
      } else {
        const without = current.filter(t => t !== 'not-employed');
        types = without.includes(id)
          ? without.filter(t => t !== id)
          : [...without, id];
      }
      return { ...s, employmentTypes: types };
    });
  }, []);

  const value = {
    state,
    updateState,
    goTo,
    next,
    prev,
    toggleAsset,
    toggleLiability,
    setRealEstateLink,
    removeRealEstateLink,
    clearRealEstateLinks,
    toggleConsent,
    toggleIncomeType,
    stepExpense,
    toggleDependantAge,
    toggleEmploymentType,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
