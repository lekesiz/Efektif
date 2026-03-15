import { create } from "zustand";
import type { UserRole, AccessLevel } from "@efektif/shared";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  accessLevel: AccessLevel;
  avatarUrl: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () => {
    set({ user: null, isLoading: false });
    // Redirect to login after clearing state
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
}));
