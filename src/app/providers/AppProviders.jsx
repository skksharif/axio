/**
 * AppProviders — root provider tree for the application.
 * Add any future React Context providers here (auth, analytics, feature flags).
 * Zustand stores are module-level singletons — no provider needed for them.
 */
export function AppProviders({ children }) {
  return children;
}
