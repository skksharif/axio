import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { EXPENSE_CATEGORIES } from '@shared/data/expenseCategories';

const initialExpenses = Object.fromEntries(
  EXPENSE_CATEGORIES.map((e) => [e.id, e.defaultVal])
);

export const useExpensesStore = create(
  devtools(
    (set) => ({
      expenses:       initialExpenses,
      sharedExpenses: false,
      sharedPct:      50,

      stepExpense: (id, delta) =>
        set((s) => ({
          expenses: {
            ...s.expenses,
            [id]: Math.max(0, (s.expenses[id] || 0) + delta),
          },
        })),

      setExpense: (id, value) =>
        set((s) => ({
          expenses: {
            ...s.expenses,
            [id]: Math.max(0, value),
          },
        })),

      update: (fields) => set((s) => ({ ...s, ...fields })),

      reset: () => set({ expenses: initialExpenses, sharedExpenses: false, sharedPct: 50 }),
    }),
    { name: 'ExpensesStore' }
  )
);
