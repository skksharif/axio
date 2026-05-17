import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'axio-theme';

export function useTheme() {
  const [theme, setTheme] = useState(() =>
    typeof window !== 'undefined'
      ? (localStorage.getItem(STORAGE_KEY) || 'dark')
      : 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
