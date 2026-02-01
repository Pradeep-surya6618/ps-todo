import { create } from "zustand";

export const useNavStore = create((set) => ({
  isSidebarCollapsed: false,
  isMobileDrawerOpen: false,
  isLogoutDialogOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (value) => set({ isSidebarCollapsed: value }),
  toggleMobileDrawer: () =>
    set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
  setMobileDrawer: (value) => set({ isMobileDrawerOpen: value }),
  setLogoutDialogOpen: (value) => set({ isLogoutDialogOpen: value }),
}));
