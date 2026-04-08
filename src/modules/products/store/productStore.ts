import { create } from "zustand";
import {
    getProducts,
    type ProductListParams,
} from "@/modules/products/api/productApi";
import type { Product } from "@/modules/products/types/product";

export interface ProductListFilters {
    search: string;

    categoryIds: string[];
    brandIds: string[];

    status: "active" | "inactive" | "all";
    flags: Array<"featured" | "free_shipping" | "clearance">;

    stockStatus: "" | "in_stock" | "low_stock" | "out_of_stock";
    imageStatus: "" | "with_image" | "without_image";

    productTypes: Array<"PHYSICAL" | "DIGITAL" | "SERVICE" | "OTHER">;

    createdPreset: "" | "today" | "last_day" | "last_week" | "last_month" | "last_year";
    createdFrom: string;
    createdTo: string;

    priceFrom: string;
    priceTo: string;

    salesFrom: string;
    salesTo: string;

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
    setLimit: (limit: number) => Promise<void>;
    setSearch: (search: string) => void;
    setSort: (
        sortBy: "createdAt" | "name" | "productCode",
        order: "asc" | "desc"
    ) => Promise<void>;
    applyFilters: (nextFilters: Partial<ProductListFilters>) => Promise<void>;
    removeFilterChip: (key: string, value?: string) => Promise<void>;
    resetFilters: () => Promise<void>;
    clearError: () => void;
}

const defaultFilters: ProductListFilters = {
    search: "",
    categoryIds: [],
    brandIds: [],
    status: "active",
    flags: [],
    stockStatus: "",
    imageStatus: "",
    productTypes: [],
    createdPreset: "",
    createdFrom: "",
    createdTo: "",
    priceFrom: "",
    priceTo: "",
    salesFrom: "",
    salesTo: "",
    sortBy: "createdAt",
    order: "desc",
    limit: 10,
};

function toNumberOrUndefined(value: string): number | undefined {
    if (value === "") return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
}

function buildParams(
    page: number,
    filters: ProductListFilters,
    overrides: Partial<ProductListParams> = {}
): ProductListParams {
    return {
        page,
        limit: filters.limit,
        search: filters.search || undefined,

        categoryIds: filters.categoryIds.length ? filters.categoryIds : undefined,
        brandIds: filters.brandIds.length ? filters.brandIds : undefined,

        status: filters.status,
        flags: filters.flags.length ? filters.flags : undefined,

        stockStatus: filters.stockStatus || undefined,
        imageStatus: filters.imageStatus || undefined,

        productTypes: filters.productTypes.length ? filters.productTypes : undefined,

        createdPreset: filters.createdPreset || undefined,
        createdFrom: filters.createdFrom || undefined,
        createdTo: filters.createdTo || undefined,

        priceFrom: toNumberOrUndefined(filters.priceFrom),
        priceTo: toNumberOrUndefined(filters.priceTo),

        salesFrom: toNumberOrUndefined(filters.salesFrom),
        salesTo: toNumberOrUndefined(filters.salesTo),

        sortBy: filters.sortBy,
        order: filters.order,
        ...overrides,
    };
}

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

        try {
            set({
                loading: true,
                error: null,
            });

            const response = await getProducts(buildParams(page, filters, overrides));

            set({
                products: response.data ?? [],
                total: response.meta?.total ?? 0,
                page: response.meta?.page ?? 1,
                lastPage: response.meta?.lastPage ?? 1,
                loading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Failed to fetch products",
                loading: false,
            });
        }
    },

    setPage: async (page) => {
        set({ page });
        await get().fetchProducts({ page });
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

    setSearch: (search) => {
        set((state) => ({
            filters: {
                ...state.filters,
                search,
            },
        }));
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

    applyFilters: async (nextFilters) => {
        set((state) => ({
            page: 1,
            filters: {
                ...state.filters,
                ...nextFilters,
            },
        }));

        await get().fetchProducts({ page: 1 });
    },

    removeFilterChip: async (key, value) => {
        set((state) => {
            const next = { ...state.filters };

            if (key === "categoryIds") {
                next.categoryIds = next.categoryIds.filter((item) => item !== value);
            } else if (key === "brandIds") {
                next.brandIds = next.brandIds.filter((item) => item !== value);
            } else if (key === "flags") {
                next.flags = next.flags.filter((item) => item !== value);
            } else if (key === "productTypes") {
                next.productTypes = next.productTypes.filter((item) => item !== value);
            } else if (key === "status") {
                next.status = "active";
            } else if (key === "stockStatus") {
                next.stockStatus = "";
            } else if (key === "imageStatus") {
                next.imageStatus = "";
            } else if (key === "createdPreset") {
                next.createdPreset = "";
            } else if (key === "createdRange") {
                next.createdFrom = "";
                next.createdTo = "";
            } else if (key === "priceRange") {
                next.priceFrom = "";
                next.priceTo = "";
            } else if (key === "salesRange") {
                next.salesFrom = "";
                next.salesTo = "";
            } else if (key === "search") {
                next.search = "";
            }

            return {
                page: 1,
                filters: next,
            };
        });

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
        });
    },

    clearError: () =>
        set({
            error: null,
        }),
}));