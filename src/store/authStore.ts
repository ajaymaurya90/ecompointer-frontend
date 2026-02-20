import { create } from "zustand";

interface AuthState {
    accessToken: string | null;
    isInitialized: boolean;
    setAccessToken: (token: string | null) => void;
    setInitialized: (value: boolean) => void;
    clearAccessToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    isInitialized: false,

    setAccessToken: (token) =>
        set({ accessToken: token }),

    setInitialized: (value) =>
        set({ isInitialized: value }),

    clearAccessToken: () =>
        set({ accessToken: null }),
}));