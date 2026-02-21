import { create } from "zustand";
import { api } from "@/lib/api";

export interface Product {
    id: string;
    name: string;
    productCode: string;
    description: string;
    media: {
        id: string;
        url: string;
        isPrimary: boolean;
    }[];
    variants: {
        id: string;
        retailGross: number;
        stock: number;
        size: string;
        color: string;
    }[];
}

interface ProductState {
    products: Product[];
    total: number;
    page: number;
    lastPage: number;
    loading: boolean;
    error: string | null;
    fetchProducts: (page?: number) => Promise<void>;
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
            set({ loading: true, error: null });

            const response = await api.get("/products", {
                params: { page },
            });

            set({
                products: response.data.data,
                total: response.data.meta.total,
                page: response.data.meta.page,
                lastPage: response.data.meta.lastPage,
                loading: false,
            });
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.message ||
                    "Failed to fetch products",
                loading: false,
            });
        }
    },
}));