import { useAssetsStore } from '@app/store/assetsStore';

/**
 * Convenience hook for asset-related state and actions.
 * Keeps asset logic out of screen components.
 */
export function useAssets() {
  const assets            = useAssetsStore((s) => s.assets);
  const assetsData        = useAssetsStore((s) => s.assetsData);
  const toggleAsset       = useAssetsStore((s) => s.toggleAsset);
  const setAssetItemField = useAssetsStore((s) => s.setAssetItemField);
  const addAssetItem      = useAssetsStore((s) => s.addAssetItem);
  const removeAssetItem   = useAssetsStore((s) => s.removeAssetItem);

  const getAssetItems = (assetId) =>
    assetsData[assetId]?.items ?? { 1: {} };

  const isAssetActive = (assetId) => !!assets[assetId];

  return {
    assets,
    assetsData,
    isAssetActive,
    getAssetItems,
    toggleAsset,
    setAssetItemField,
    addAssetItem,
    removeAssetItem,
  };
}
