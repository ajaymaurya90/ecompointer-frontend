
import { create } from "zustand";
import type { UserRole } from "@/modules/auth/types/auth";

export interface AuthUser {
    id: string;
    email: string;
    role: UserRole;
}

interface AuthState {
    accessToken: string | null;
    user: AuthUser | null;
    isInitialized: boolean;

    setAccessToken: (token: string | null) => void;
    setUser: (user: AuthUser | null) => void;
    setInitialized: (value: boolean) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    isInitialized: false,

    setAccessToken: (token) =>
        set({ accessToken: token }),

    setUser: (user) =>
        set({ user }),

    setInitialized: (value) =>
        set({ isInitialized: value }),

    clearAuth: () =>
        set({
            accessToken: null,
            user: null,
        }),
}));
