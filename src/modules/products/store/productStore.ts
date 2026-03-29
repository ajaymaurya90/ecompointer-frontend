import { create } from "zustand";
import { api } from "@/lib/http";
import type { Product } from "@/modules/products/types/product";

interface ProductState {
    products: Product[];
    total: number;
    page: number;
    lastPage: number;
    loading: boolean;
    error: string | null;

    fetchProducts: (page?: number) => Promise<void>;
    clearError: () => void;
    resetProducts: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    total: 0,
    page: 1,
    lastPage: 1,
    loading: false,
    error: null,

    fetchProducts: async (page = 1) => {
        try {
            set({
                loading: true,
                error: null,
            });

            const response = await api.get("/products", {
                params: { page },
            });

            set({
                products: response.data.data ?? [],
                total: response.data.meta?.total ?? 0,
                page: response.data.meta?.page ?? 1,
                lastPage: response.data.meta?.lastPage ?? 1,
                loading: false,
            });
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.message || "Failed to fetch products",
                loading: false,
            });
        }
    },

    clearError: () =>
        set({
            error: null,
        }),

    resetProducts: () =>
        set({
            products: [],
            total: 0,
            page: 1,
            lastPage: 1,
            loading: false,
            error: null,
        }),
}));