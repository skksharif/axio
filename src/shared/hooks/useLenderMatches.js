import { useMemo } from 'react';
import { useOnboardingStore } from '@app/store/onboardingStore';
import { useLenderStore }     from '@app/store/lenderStore';
import { LENDERS }            from '@shared/data/lenders';
import { getRate }            from '@shared/utils/format';

/**
 * Derives and memoizes lender matches from current onboarding state.
 * Returns filtered + sorted list of matched lenders.
 */
export function useLenderMatches() {
  const loanType              = useOnboardingStore((s) => s.loanType);
  const vehicleCondition      = useOnboardingStore((s) => s.vehicleCondition);
  const securityType          = useOnboardingStore((s) => s.securityType);
  const loanAmount            = useOnboardingStore((s) => s.loanAmount);
  const loanTerm              = useOnboardingStore((s) => s.loanTerm);
  const selectedServiceability = useLenderStore((s) => s.selectedServiceability);

  const rate = getRate(loanType, vehicleCondition, securityType);

  const matches = useMemo(() => {
    return LENDERS.map((lender) => ({
      ...lender,
      rate,
    }));
  }, [loanType, vehicleCondition, securityType, loanAmount, loanTerm, selectedServiceability]);

  return { matches, rate, selectedServiceability };
}
