import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useLenderStore = create(
  devtools(
    (set) => ({
      selectedServiceability: 'green',
      bankConnected:          false,
      selectedBank:           null,
      matchedLenders:         [],
      selectedLender:         null,

      setServiceability: (value) => set({ selectedServiceability: value }),
      setSelectedLender: (lender) => set({ selectedLender: lender }),
      setMatchedLenders: (lenders) => set({ matchedLenders: lenders }),

      connectBank: (bank) =>
        set({ bankConnected: true, selectedBank: bank }),

      disconnectBank: () =>
        set({ bankConnected: false, selectedBank: null }),

      update: (fields) => set((s) => ({ ...s, ...fields })),
      reset:  () =>
        set({
          selectedServiceability: 'green',
          bankConnected:  false,
          selectedBank:   null,
          matchedLenders: [],
          selectedLender: null,
        }),
    }),
    { name: 'LenderStore' }
  )
);
