import { BtnGhost, BtnPrimary, BtnRow } from '@shared/components/ui/Button';

/**
 * Unified navigation footer used by every onboarding screen.
 * Renders inside BtnRow so the mobile-sticky CSS applies.
 */
export function ScreenActions({ onBack, onContinue, continueDisabled = false, continueLabel }) {
  return (
    <BtnRow justify={!onBack && onContinue ? 'flex-end' : undefined}>
      {onBack     && <BtnGhost   onClick={onBack}>← Back</BtnGhost>}
      {onContinue && (
        <BtnPrimary onClick={onContinue} disabled={continueDisabled}>
          {continueLabel ?? 'Continue →'}
        </BtnPrimary>
      )}
    </BtnRow>
  );
}
