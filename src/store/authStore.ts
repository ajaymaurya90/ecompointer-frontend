/*import { create } from "zustand";

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
}));*/
import { create } from "zustand";

interface User {
    id: string;
    email: string;
    role: "BrandOwner" | "ShopOwner";
}

interface AuthState {
    accessToken: string | null;
    user: User | null;
    isInitialized: boolean;

    setAccessToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
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