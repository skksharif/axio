import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useUIStore = create(
  devtools(
    (set) => ({
      sidebarOpen:  false,
      isLoading:    false,
      globalError:  null,
      toasts:       [],
      theme:        'dark',

      openSidebar:  () => set({ sidebarOpen: true }),
      closeSidebar: () => set({ sidebarOpen: false }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      setLoading: (value) => set({ isLoading: value }),
      setError:   (error) => set({ globalError: error }),
      clearError: () => set({ globalError: null }),

      addToast: (toast) =>
        set((s) => ({
          toasts: [...s.toasts, { id: Date.now(), ...toast }],
        })),

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      setTheme: (theme) => set({ theme }),
    }),
    { name: 'UIStore' }
  )
);
