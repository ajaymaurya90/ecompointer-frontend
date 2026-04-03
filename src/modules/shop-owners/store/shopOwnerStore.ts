import { create } from "zustand";
import {
    getShopOwnerById,
    getShopOwners,
    updateShopOwnerStatus,
} from "@/modules/shop-owners/api/shopOwnerApi";
import type {
    ShopOwner,
    ShopOwnerListParams,
    ShopOwnerListResponse,
    ShopOwnerStatusPayload,
} from "@/modules/shop-owners/types/shopOwner";

type ShopOwnerFilters = {
    page: number;
    limit: number;
    search: string;
    isActive: "true" | "false" | "";
};

type ShopOwnerStore = {
    items: ShopOwner[];
    currentItem: ShopOwner | null;
    pagination: ShopOwnerListResponse["pagination"];
    filters: ShopOwnerFilters;
    isLoading: boolean;
    isDetailLoading: boolean;
    isStatusUpdating: boolean;
    error: string | null;
    setFilters: (updates: Partial<ShopOwnerFilters>) => void;
    resetFilters: () => void;
    fetchShopOwners: () => Promise<void>;
    fetchShopOwnerById: (shopOwnerId: string) => Promise<void>;
    toggleShopOwnerStatus: (
        shopOwnerId: string,
        payload: ShopOwnerStatusPayload
    ) => Promise<void>;
    clearCurrentItem: () => void;
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
    currentItem: null,
    pagination: defaultPagination,
    filters: defaultFilters,
    isLoading: false,
    isDetailLoading: false,
    isStatusUpdating: false,
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

    clearCurrentItem: () =>
        set({
            currentItem: null,
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

    fetchShopOwnerById: async (shopOwnerId: string) => {
        set({
            isDetailLoading: true,
            error: null,
        });

        try {
            const response = await getShopOwnerById(shopOwnerId);

            set({
                currentItem: response,
                isDetailLoading: false,
            });
        } catch (error: any) {
            set({
                isDetailLoading: false,
                error:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to load shop owner details",
            });
        }
    },

    toggleShopOwnerStatus: async (shopOwnerId: string, payload: ShopOwnerStatusPayload) => {
        set({
            isStatusUpdating: true,
            error: null,
        });

        try {
            await updateShopOwnerStatus(shopOwnerId, payload);
            await get().fetchShopOwnerById(shopOwnerId);
            await get().fetchShopOwners();

            set({
                isStatusUpdating: false,
            });
        } catch (error: any) {
            set({
                isStatusUpdating: false,
                error:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to update shop owner status",
            });
        }
    },
}));