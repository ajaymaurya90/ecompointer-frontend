import { create } from "zustand";
import { getOrders } from "@/modules/orders/api/order.api";
import type {
    BuyerType,
    OrderListItem,
    OrderListPagination,
    OrderListParams,
    OrderStatus,
    PaymentStatus,
    SalesChannelType,
} from "@/modules/orders/types/order";

type OrderFilterState = {
    search: string;
    status: OrderStatus | "";
    paymentStatus: PaymentStatus | "";
    buyerType: BuyerType | "";
    salesChannel: SalesChannelType | "";
    fromDate: string;
    toDate: string;
    page: number;
    limit: number;
};

type OrderListStore = {
    items: OrderListItem[];
    pagination: OrderListPagination;
    filters: OrderFilterState;
    isLoading: boolean;
    error: string | null;

    setFilter: <K extends keyof OrderFilterState>(key: K, value: OrderFilterState[K]) => void;
    setPage: (page: number) => void;
    resetFilters: () => void;
    fetchOrders: () => Promise<void>;
};

const defaultPagination: OrderListPagination = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
};

const defaultFilters: OrderFilterState = {
    search: "",
    status: "",
    paymentStatus: "",
    buyerType: "",
    salesChannel: "",
    fromDate: "",
    toDate: "",
    page: 1,
    limit: 10,
};

export const useOrderListStore = create<OrderListStore>((set, get) => ({
    items: [],
    pagination: defaultPagination,
    filters: defaultFilters,
    isLoading: false,
    error: null,

    setFilter: (key, value) => {
        set((state) => ({
            filters: {
                ...state.filters,
                [key]: value,
                page: key === "page" || key === "limit" ? state.filters.page : 1,
            },
        }));
    },

    setPage: (page) => {
        set((state) => ({
            filters: {
                ...state.filters,
                page,
            },
        }));
    },

    resetFilters: () => {
        set({
            filters: defaultFilters,
        });
    },

    fetchOrders: async () => {
        const { filters } = get();

        const params: OrderListParams = {
            page: filters.page,
            limit: filters.limit,
            search: filters.search,
            status: filters.status,
            paymentStatus: filters.paymentStatus,
            buyerType: filters.buyerType,
            salesChannel: filters.salesChannel,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
        };

        set({ isLoading: true, error: null });

        try {
            const response = await getOrders(params);

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
                    "Failed to load orders",
            });
        }
    },
}));