import { create } from "zustand";
import {
    getProducts,
    type ProductListParams,
} from "@/modules/products/api/productApi";
import type { Product } from "@/modules/products/types/product";

export interface ProductListFilters {
    search: string;
    categoryId: string;
    sortBy: "createdAt" | "name" | "productCode";
    order: "asc" | "desc";
    limit: number;
}

interface ProductState {
    products: Product[];
    total: number;
    page: number;
    lastPage: number;
    loading: boolean;
    error: string | null;
    filters: ProductListFilters;

    fetchProducts: (overrides?: Partial<ProductListParams>) => Promise<void>;
    setPage: (page: number) => Promise<void>;
    setSearch: (search: string) => void;
    setCategoryId: (categoryId: string) => Promise<void>;
    setSort: (
        sortBy: "createdAt" | "name" | "productCode",
        order: "asc" | "desc"
    ) => Promise<void>;
    setLimit: (limit: number) => Promise<void>;
    applySearch: () => Promise<void>;
    resetFilters: () => Promise<void>;
    clearError: () => void;
}

const defaultFilters: ProductListFilters = {
    search: "",
    categoryId: "",
    sortBy: "createdAt",
    order: "desc",
    limit: 10,
};

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    total: 0,
    page: 1,
    lastPage: 1,
    loading: false,
    error: null,
    filters: defaultFilters,

    fetchProducts: async (overrides = {}) => {
        const { page, filters } = get();

        const params: ProductListParams = {
            page,
            limit: filters.limit,
            search: filters.search || undefined,
            categoryId: filters.categoryId || undefined,
            sortBy: filters.sortBy,
            order: filters.order,
            ...overrides,
        };

        try {
            set({
                loading: true,
                error: null,
            });

            const response = await getProducts(params);

            set({
                products: response.data ?? [],
                total: response.meta?.total ?? 0,
                page: response.meta?.page ?? 1,
                lastPage: response.meta?.lastPage ?? 1,
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

    setPage: async (page) => {
        set({ page });
        await get().fetchProducts({ page });
    },

    setSearch: (search) => {
        set((state) => ({
            filters: {
                ...state.filters,
                search,
            },
        }));
    },

    setCategoryId: async (categoryId) => {
        set((state) => ({
            page: 1,
            filters: {
                ...state.filters,
                categoryId,
            },
        }));

        await get().fetchProducts({ page: 1, categoryId: categoryId || undefined });
    },

    setSort: async (sortBy, order) => {
        set((state) => ({
            page: 1,
            filters: {
                ...state.filters,
                sortBy,
                order,
            },
        }));

        await get().fetchProducts({
            page: 1,
            sortBy,
            order,
        });
    },

    setLimit: async (limit) => {
        set((state) => ({
            page: 1,
            filters: {
                ...state.filters,
                limit,
            },
        }));

        await get().fetchProducts({ page: 1, limit });
    },

    applySearch: async () => {
        set({ page: 1 });
        await get().fetchProducts({ page: 1 });
    },

    resetFilters: async () => {
        set({
            page: 1,
            filters: defaultFilters,
        });

        await get().fetchProducts({
            page: 1,
            limit: defaultFilters.limit,
            sortBy: defaultFilters.sortBy,
            order: defaultFilters.order,
            search: undefined,
            categoryId: undefined,
        });
    },

    clearError: () =>
        set({
            error: null,
        }),
}));