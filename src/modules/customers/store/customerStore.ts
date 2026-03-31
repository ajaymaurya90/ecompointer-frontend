import { create } from "zustand";
import { getCustomers } from "@/modules/customers/api/customerApi";
import type {
    Customer,
    CustomerListMeta,
    CustomerListParams,
} from "@/modules/customers/types/customer";

interface CustomerStoreState {
    items: Customer[];
    meta: CustomerListMeta | null;
    isLoading: boolean;
    error: string | null;

    filters: CustomerListParams;

    setFilters: (payload: Partial<CustomerListParams>) => void;
    resetFilters: () => void;
    fetchCustomers: () => Promise<void>;
}

const defaultFilters: CustomerListParams = {
    page: 1,
    limit: 10,
    search: "",
    type: "",
    status: "",
    source: "",
    sortBy: "createdAt",
    sortOrder: "desc",
};

export const useCustomerStore = create<CustomerStoreState>((set, get) => ({
    items: [],
    meta: null,
    isLoading: false,
    error: null,

    filters: defaultFilters,

    setFilters: (payload) =>
        set((state) => ({
            filters: {
                ...state.filters,
                ...payload,
            },
        })),

    resetFilters: () =>
        set({
            filters: defaultFilters,
        }),

    fetchCustomers: async () => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const result = await getCustomers(get().filters);

            set({
                items: result.data,
                meta: result.meta,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || "Failed to fetch customers",
            });
        }
    },
}));