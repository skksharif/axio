import { useState, useCallback } from 'react';

/**
 * Manages a currency input with formatted display and raw numeric value.
 * Handles comma-separated display, leading-zero stripping, and change events.
 */
export function useCurrencyInput(initialValue = 0) {
  const [raw, setRaw] = useState(String(initialValue));

  const numericValue = Number(raw.replace(/,/g, '')) || 0;

  const handleChange = useCallback((e) => {
    const stripped = e.target.value.replace(/[^0-9]/g, '');
    setRaw(stripped);
  }, []);

  const handleBlur = useCallback(() => {
    setRaw(String(numericValue));
  }, [numericValue]);

  const setValue = useCallback((value) => {
    setRaw(String(value));
  }, []);

  const displayValue = raw === '' ? '' : numericValue.toLocaleString('en-AU');

  return {
    raw,
    numericValue,
    displayValue,
    handleChange,
    handleBlur,
    setValue,
  };
}
