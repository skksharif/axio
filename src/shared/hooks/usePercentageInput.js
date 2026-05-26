import { useState, useCallback } from 'react';

/**
 * Manages a percentage input clamped to [0, 100].
 */
export function usePercentageInput(initialValue = 0) {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e) => {
    const num = parseFloat(e.target.value);
    if (isNaN(num)) {
      setValue(0);
    } else {
      setValue(Math.min(100, Math.max(0, num)));
    }
  }, []);

  const increment = useCallback((step = 1) => {
    setValue((v) => Math.min(100, v + step));
  }, []);

  const decrement = useCallback((step = 1) => {
    setValue((v) => Math.max(0, v - step));
  }, []);

  const set = useCallback((num) => {
    setValue(Math.min(100, Math.max(0, num)));
  }, []);

  return { value, handleChange, increment, decrement, set };
}
