import { useAssetsStore } from '@app/store/assetsStore';

/**
 * Convenience hook for liability-related state and actions.
 */
export function useLiabilities() {
  const liabilities            = useAssetsStore((s) => s.liabilities);
  const liabilitiesData        = useAssetsStore((s) => s.liabilitiesData);
  const realEstateLinks        = useAssetsStore((s) => s.realEstateLinks);
  const toggleLiability        = useAssetsStore((s) => s.toggleLiability);
  const setLiabilityItemField  = useAssetsStore((s) => s.setLiabilityItemField);
  const addLiabilityItem       = useAssetsStore((s) => s.addLiabilityItem);
  const removeLiabilityItem    = useAssetsStore((s) => s.removeLiabilityItem);
  const setRealEstateLink      = useAssetsStore((s) => s.setRealEstateLink);
  const removeRealEstateLink   = useAssetsStore((s) => s.removeRealEstateLink);
  const clearRealEstateLinks   = useAssetsStore((s) => s.clearRealEstateLinks);
  const setRealEstateLinkField = useAssetsStore((s) => s.setRealEstateLinkField);

  const getLiabilityItems = (liabilityId) =>
    liabilitiesData[liabilityId]?.items ?? { 1: {} };

  const isLiabilityActive = (liabilityId) => !!liabilities[liabilityId];

  return {
    liabilities,
    liabilitiesData,
    realEstateLinks,
    isLiabilityActive,
    getLiabilityItems,
    toggleLiability,
    setLiabilityItemField,
    addLiabilityItem,
    removeLiabilityItem,
    setRealEstateLink,
    removeRealEstateLink,
    clearRealEstateLinks,
    setRealEstateLinkField,
  };
}
