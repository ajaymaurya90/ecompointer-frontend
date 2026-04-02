import { api } from "@/lib/http";
import type {
    CreateOrderPayload,
    OrderDetail,
    OrderDetailResponse,
    OrderListParams,
    OrderListResponse,
    OrderSearchProductItem,
    ShopOwnerSearchItem,
} from "@/modules/orders/types/order";
import type { CustomerListResponse } from "@/modules/customers/types/customer";

function cleanParams<T extends object>(params: T) {
    return Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) => value !== "" && value !== undefined && value !== null
        )
    );
}

export async function getOrders(
    params: OrderListParams = {}
): Promise<OrderListResponse> {
    const response = await api.get("/orders", {
        params: cleanParams(params),
    });

    return response.data;
}

export async function getOrderById(orderId: string): Promise<OrderDetail> {
    const response = await api.get<OrderDetailResponse>(`/orders/${orderId}`);
    return response.data?.data;
}

export async function createOrder(data: CreateOrderPayload) {
    const response = await api.post("/orders", data);
    return response.data?.order ?? response.data?.data ?? response.data;
}

export async function addOrderPayment(
    orderId: string,
    data: {
        amountPaid: string;
        paymentDate: string;
        paymentMethod?: string;
        referenceNo?: string;
        note?: string;
    }
) {
    const response = await api.post(`/orders/${orderId}/payments`, data);
    return response.data?.data ?? response.data;
}

export async function updateOrderStatus(
    orderId: string,
    data: {
        status: string;
        note?: string;
    }
) {
    const response = await api.patch(`/orders/${orderId}/status`, data);
    return response.data?.data ?? response.data;
}

export async function cancelOrder(
    orderId: string,
    data: {
        reason?: string;
    }
) {
    const response = await api.patch(`/orders/${orderId}/cancel`, data);
    return response.data?.data ?? response.data;
}

export async function searchCustomers(search: string) {
    const response = await api.get<CustomerListResponse>("/customers", {
        params: cleanParams({
            page: 1,
            limit: 10,
            search,
        }),
    });

    return response.data?.data ?? [];
}

export async function searchShopOwners(search: string): Promise<ShopOwnerSearchItem[]> {
    const response = await api.get("/shop-owners/order-search/list", {
        params: cleanParams({ search }),
    });

    return response.data?.data ?? [];
}

export async function searchOrderProducts(search: string): Promise<OrderSearchProductItem[]> {
    const response = await api.get("/products/order-search", {
        params: cleanParams({ search }),
    });

    return response.data?.data ?? [];
}