import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  // Admin auth
  adminUser: any | null;
  adminRole: 'FOUNDER' | 'CLINIC_OWNER' | null;
  setAdminUser: (user: any, role: 'FOUNDER' | 'CLINIC_OWNER') => void;
  clearAdmin: () => void;

  // Doctor auth
  doctorUser: any | null;
  setDoctorUser: (user: any) => void;
  clearDoctor: () => void;

  // User (patient)
  currentUser: any | null;
  setCurrentUser: (user: any) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      adminUser: null,
      adminRole: null,
      setAdminUser: (user, role) => set({ adminUser: user, adminRole: role }),
      clearAdmin: () => set({ adminUser: null, adminRole: null }),

      doctorUser: null,
      setDoctorUser: (user) => set({ doctorUser: user }),
      clearDoctor: () => set({ doctorUser: null }),

      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      clearUser: () => set({ currentUser: null }),
    }),
    {
      name: 'medbook-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
