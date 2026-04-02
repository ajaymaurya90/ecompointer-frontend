import { create } from "zustand";
import { getShopOwners } from "@/modules/shop-owners/api/shopOwnerApi";
import type {
    ShopOwner,
    ShopOwnerListParams,
    ShopOwnerListResponse,
} from "@/modules/shop-owners/types/shopOwner";

type ShopOwnerFilters = {
    page: number;
    limit: number;
    search: string;
    isActive: "true" | "false" | "";
};

type ShopOwnerStore = {
    items: ShopOwner[];
    pagination: ShopOwnerListResponse["pagination"];
    filters: ShopOwnerFilters;
    isLoading: boolean;
    error: string | null;
    setFilters: (updates: Partial<ShopOwnerFilters>) => void;
    resetFilters: () => void;
    fetchShopOwners: () => Promise<void>;
};

const defaultPagination = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
};

const defaultFilters: ShopOwnerFilters = {
    page: 1,
    limit: 10,
    search: "",
    isActive: "",
};

export const useShopOwnerStore = create<ShopOwnerStore>((set, get) => ({
    items: [],
    pagination: defaultPagination,
    filters: defaultFilters,
    isLoading: false,
    error: null,

    setFilters: (updates) =>
        set((state) => ({
            filters: {
                ...state.filters,
                ...updates,
            },
        })),

    resetFilters: () =>
        set({
            filters: defaultFilters,
        }),

    fetchShopOwners: async () => {
        const { filters } = get();

        const params: ShopOwnerListParams = {
            page: filters.page,
            limit: filters.limit,
            search: filters.search,
            isActive: filters.isActive,
        };

        set({ isLoading: true, error: null });

        try {
            const response = await getShopOwners(params);

            set({
                items: response.data,
                pagination: response.pagination,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to load shop owners",
            });
        }
    },
}));