/**
 * Compatibility shim — lets existing screens keep using useApp()
 * while reading from Zustand stores under the hood.
 *
 * Gradually migrate screens to consume stores directly,
 * then delete this file when no screen imports it.
 */
import { useOnboardingStore } from '@app/store/onboardingStore';
import { useAssetsStore }     from '@app/store/assetsStore';
import { useExpensesStore }   from '@app/store/expensesStore';
import { useLenderStore }     from '@app/store/lenderStore';
import { useDocumentsStore }  from '@app/store/documentsStore';

export function useApp() {
  // ─── Onboarding state ───────────────────────────────────────────────────
  const onboarding = useOnboardingStore();
  const assets     = useAssetsStore();
  const expenses   = useExpensesStore();
  const lender     = useLenderStore();
  const documents  = useDocumentsStore();

  const state = {
    // Navigation
    currentScreen:    onboarding.currentScreen,
    completedScreens: onboarding.completedScreens,

    // Eligibility
    checkedEligibility: onboarding.checkedEligibility,

    // Loan
    loanType:          onboarding.loanType,
    vehicleCondition:  onboarding.vehicleCondition,
    purchaseType:      onboarding.purchaseType,
    vehicleFound:      onboarding.vehicleFound,
    securityType:      onboarding.securityType,
    securityAssetType: onboarding.securityAssetType,
    loanAmount:        onboarding.loanAmount,
    loanTerm:          onboarding.loanTerm,
    deposit:           onboarding.deposit,
    tradeIn:           onboarding.tradeIn,
    balloonPct:        onboarding.balloonPct,
    purpose:           onboarding.purpose,

    // Profile
    firstName:               onboarding.firstName,
    lastName:                onboarding.lastName,
    relationshipStatus:      onboarding.relationshipStatus,
    dependants:              onboarding.dependants,
    dependantAges:           onboarding.dependantAges,
    residency:               onboarding.residency,
    employmentTypes:         onboarding.employmentTypes,
    livingStatus:            onboarding.livingStatus,
    addressHistoryUnder3:    onboarding.addressHistoryUnder3,
    employmentHistoryUnder3: onboarding.employmentHistoryUnder3,

    // Income
    incomeTypes:    onboarding.incomeTypes,
    jointApplicant: onboarding.jointApplicant,

    // Assets / Liabilities
    assets:          assets.assets,
    assetsData:      assets.assetsData,
    liabilities:     assets.liabilities,
    liabilitiesData: assets.liabilitiesData,
    realEstateLinks: assets.realEstateLinks,

    // Expenses
    expenses:       expenses.expenses,
    sharedExpenses: expenses.sharedExpenses,
    sharedPct:      expenses.sharedPct,

    // Lender
    selectedServiceability: lender.selectedServiceability,
    bankConnected:          lender.bankConnected,
    selectedBank:           lender.selectedBank,

    // Consents
    checkedConsents: onboarding.checkedConsents,

    // Documents
    uploadedDocs: documents.uploadedDocs,
  };

  return {
    state,
    // Navigation
    updateState: onboarding.update,
    goTo:   onboarding.goTo,
    next:   onboarding.next,
    prev:   onboarding.prev,
    // Assets
    toggleAsset:         assets.toggleAsset,
    setAssetItemField:   assets.setAssetItemField,
    addAssetItem:        assets.addAssetItem,
    removeAssetItem:     assets.removeAssetItem,
    // Liabilities
    toggleLiability:       assets.toggleLiability,
    setLiabilityItemField: assets.setLiabilityItemField,
    addLiabilityItem:      assets.addLiabilityItem,
    removeLiabilityItem:   assets.removeLiabilityItem,
    // Real estate links
    setRealEstateLink:    assets.setRealEstateLink,
    removeRealEstateLink: assets.removeRealEstateLink,
    clearRealEstateLinks: assets.clearRealEstateLinks,
    setRealEstateLinkField: assets.setRealEstateLinkField,
    // Expenses
    stepExpense: expenses.stepExpense,
    // Onboarding actions
    toggleIncomeType:    onboarding.toggleIncomeType,
    toggleConsent:       onboarding.toggleConsent,
    toggleDependantAge:  onboarding.toggleDependantAge,
    toggleEmploymentType: onboarding.toggleEmploymentType,
  };
}
