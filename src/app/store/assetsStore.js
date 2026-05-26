import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAssetsStore = create(
  devtools(
    (set) => ({
      // assets[id] = true/false  (card toggled on/off)
      assets:     {},
      // assetsData[assetId] = { nextId: N, items: { [itemId]: { ...fields } } }
      assetsData: {},
      // liabilities mirror assets pattern
      liabilities:     {},
      liabilitiesData: {},
      // realEstateLinks[itemId] = { id, propertyType, lender, consolidate, ... }
      realEstateLinks: {},

      // ─── Asset toggles ────────────────────────────────────────────────
      toggleAsset: (id) =>
        set((s) => ({ assets: { ...s.assets, [id]: !s.assets[id] } })),

      setAssetItemField: (assetId, itemId, fields) =>
        set((s) => {
          const existing = s.assetsData[assetId] ?? { nextId: 2, items: {} };
          return {
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
        }),

      addAssetItem: (assetId) =>
        set((s) => {
          const existing = s.assetsData[assetId] ?? { nextId: 2, items: { 1: {} } };
          const newId = existing.nextId;
          return {
            assetsData: {
              ...s.assetsData,
              [assetId]: {
                nextId: newId + 1,
                items: { ...existing.items, [newId]: {} },
              },
            },
          };
        }),

      removeAssetItem: (assetId, itemId) =>
        set((s) => {
          const existing = s.assetsData[assetId];
          if (!existing) return s;
          const { [itemId]: _dropped, ...restItems } = existing.items;
          return {
            assetsData: {
              ...s.assetsData,
              [assetId]: { ...existing, items: restItems },
            },
          };
        }),

      // ─── Liability toggles ────────────────────────────────────────────
      toggleLiability: (id) =>
        set((s) => ({ liabilities: { ...s.liabilities, [id]: !s.liabilities[id] } })),

      setLiabilityItemField: (liabilityId, itemId, fields) =>
        set((s) => {
          const existing = s.liabilitiesData[liabilityId] ?? { nextId: 2, items: {} };
          return {
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
        }),

      addLiabilityItem: (liabilityId) =>
        set((s) => {
          const existing = s.liabilitiesData[liabilityId] ?? { nextId: 2, items: { 1: {} } };
          const newId = existing.nextId;
          return {
            liabilitiesData: {
              ...s.liabilitiesData,
              [liabilityId]: {
                nextId: newId + 1,
                items: { ...existing.items, [newId]: {} },
              },
            },
          };
        }),

      removeLiabilityItem: (liabilityId, itemId) =>
        set((s) => {
          const existing = s.liabilitiesData[liabilityId];
          if (!existing) return s;
          const { [itemId]: _dropped, ...restItems } = existing.items;
          return {
            liabilitiesData: {
              ...s.liabilitiesData,
              [liabilityId]: { ...existing, items: restItems },
            },
          };
        }),

      // ─── Real estate linking ──────────────────────────────────────────
      setRealEstateLink: (itemId, data) =>
        set((s) => ({
          realEstateLinks: {
            ...s.realEstateLinks,
            [itemId]: { id: itemId, ...data },
          },
        })),

      removeRealEstateLink: (itemId) =>
        set((s) => {
          const { [itemId]: _dropped, ...rest } = s.realEstateLinks;
          return { realEstateLinks: rest };
        }),

      clearRealEstateLinks: () => set({ realEstateLinks: {} }),

      setRealEstateLinkField: (itemId, fields) =>
        set((s) => {
          const existing = s.realEstateLinks[itemId];
          if (!existing) return s;
          return {
            realEstateLinks: {
              ...s.realEstateLinks,
              [itemId]: { ...existing, ...fields },
            },
          };
        }),

      reset: () =>
        set({
          assets: {}, assetsData: {},
          liabilities: {}, liabilitiesData: {},
          realEstateLinks: {},
        }),
    }),
    { name: 'AssetsStore' }
  )
);
