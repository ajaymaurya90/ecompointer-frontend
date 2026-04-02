import { api } from "@/lib/http";
import type {
    OrderDetail,
    OrderDetailResponse,
    OrderListParams,
    OrderListResponse,
} from "@/modules/orders/types/order";

function cleanParams(params: OrderListParams = {}) {
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