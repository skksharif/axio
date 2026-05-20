import { createContext, useContext, useState, useCallback } from 'react';
import { SCREENS } from '../constants/screens';
import { EXPENSE_CATEGORIES } from '../data/expenseCategories';

const initialExpenses = Object.fromEntries(
  EXPENSE_CATEGORIES.map(e => [e.id, e.defaultVal])
);

const initialState = {
  currentScreen: 0,
  completedScreens: [],
  checkedEligibility: [],
  loanType: 'personal',
  vehicleCondition: 'new',
  purchaseType: 'dealer',
  vehicleFound: true,
  securityType: 'unsecured',
  securityAssetType: 'vehicle',
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
  // assets[id] = true/false (card on/off)
  assets: {},
  // assetsData[assetId] = { nextId: N, items: { [itemId]: { ...fields } } }
  // Persists form values independently of card on/off state.
  assetsData: {},
  liabilities: {},
  // liabilitiesData[liabilityId] = { nextId: N, items: { [itemId]: { ...fields } } }
  // Mirrors assetsData pattern — persists field values + consolidate flag per item.
  liabilitiesData: {},
  // realEstateLinks[itemId] = { id, propertyType, lender, consolidate, ... }
  // Derived from assetsData.realestate — kept in sync by AssetsScreen.
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

  // ─── Asset form data ──────────────────────────────────────────────────────
  // Updates one or more fields on a specific item within an asset type.
  // Creates the asset type entry + item if they don't exist yet.
  const setAssetItemField = useCallback((assetId, itemId, fields) => {
    setState(s => {
      const existing = s.assetsData[assetId] ?? { nextId: 2, items: {} };
      return {
        ...s,
        assetsData: {
          ...s.assetsData,
          [assetId]: {
            ...existing,
            items: {
              ...existing.items,
              [itemId]: { ...existing.items[itemId], ...fields },
            },
          },
        },
      };
    });
  }, []);

  // Appends a new empty item. The new item's ID equals the current nextId.
  const addAssetItem = useCallback((assetId) => {
    setState(s => {
      const existing = s.assetsData[assetId] ?? { nextId: 2, items: { 1: {} } };
      const newId = existing.nextId;
      return {
        ...s,
        assetsData: {
          ...s.assetsData,
          [assetId]: {
            nextId: newId + 1,
            items: { ...existing.items, [newId]: {} },
          },
        },
      };
    });
  }, []);

  // Removes a specific item from an asset type's items map.
  const removeAssetItem = useCallback((assetId, itemId) => {
    setState(s => {
      const existing = s.assetsData[assetId];
      if (!existing) return s;
      const { [itemId]: _dropped, ...restItems } = existing.items;
      return {
        ...s,
        assetsData: {
          ...s.assetsData,
          [assetId]: { ...existing, items: restItems },
        },
      };
    });
  }, []);

  // ─── Liability form data ──────────────────────────────────────────────────
  const setLiabilityItemField = useCallback((liabilityId, itemId, fields) => {
    setState(s => {
      const existing = s.liabilitiesData[liabilityId] ?? { nextId: 2, items: {} };
      return {
        ...s,
        liabilitiesData: {
          ...s.liabilitiesData,
          [liabilityId]: {
            ...existing,
            items: {
              ...existing.items,
              [itemId]: { ...existing.items[itemId], ...fields },
            },
          },
        },
      };
    });
  }, []);

  const addLiabilityItem = useCallback((liabilityId) => {
    setState(s => {
      const existing = s.liabilitiesData[liabilityId] ?? { nextId: 2, items: { 1: {} } };
      const newId = existing.nextId;
      return {
        ...s,
        liabilitiesData: {
          ...s.liabilitiesData,
          [liabilityId]: {
            nextId: newId + 1,
            items: { ...existing.items, [newId]: {} },
          },
        },
      };
    });
  }, []);

  const removeLiabilityItem = useCallback((liabilityId, itemId) => {
    setState(s => {
      const existing = s.liabilitiesData[liabilityId];
      if (!existing) return s;
      const { [itemId]: _dropped, ...restItems } = existing.items;
      return {
        ...s,
        liabilitiesData: {
          ...s.liabilitiesData,
          [liabilityId]: { ...existing, items: restItems },
        },
      };
    });
  }, []);

  // ─── Real estate ↔ Liabilities linking ───────────────────────────────────
  const setRealEstateLink = useCallback((itemId, data) => {
    setState(s => ({
      ...s,
      realEstateLinks: { ...s.realEstateLinks, [itemId]: { id: itemId, ...data } },
    }));
  }, []);

  const removeRealEstateLink = useCallback((itemId) => {
    setState(s => {
      const { [itemId]: _dropped, ...rest } = s.realEstateLinks;
      return { ...s, realEstateLinks: rest };
    });
  }, []);

  const clearRealEstateLinks = useCallback(() => {
    setState(s => ({ ...s, realEstateLinks: {} }));
  }, []);

  // Updates specific fields on an existing realEstateLink (e.g. consolidate flag).
  const setRealEstateLinkField = useCallback((itemId, fields) => {
    setState(s => {
      const existing = s.realEstateLinks[itemId];
      if (!existing) return s;
      return {
        ...s,
        realEstateLinks: {
          ...s.realEstateLinks,
          [itemId]: { ...existing, ...fields },
        },
      };
    });
  }, []);

  // ─── Other actions ────────────────────────────────────────────────────────
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
    setAssetItemField,
    addAssetItem,
    removeAssetItem,
    setLiabilityItemField,
    addLiabilityItem,
    removeLiabilityItem,
    setRealEstateLink,
    removeRealEstateLink,
    clearRealEstateLinks,
    setRealEstateLinkField,
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
