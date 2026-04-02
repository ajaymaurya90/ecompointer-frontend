"use client";

import { useEffect, useState } from "react";
import { getOrderById } from "@/modules/orders/api/order.api";
import type { OrderDetail } from "@/modules/orders/types/order";
import OrderDetailSkeleton from "@/modules/orders/components/OrderDetailSkeleton";
import OrderDetailHeader from "@/modules/orders/components/OrderDetailHeader";
import OrderSummaryCards from "@/modules/orders/components/OrderSummaryCards";
import OrderBuyerCard from "@/modules/orders/components/OrderBuyerCard";
import OrderAddressCard from "@/modules/orders/components/OrderAddressCard";
import OrderItemsCard from "@/modules/orders/components/OrderItemsCard";
import OrderPaymentsCard from "@/modules/orders/components/OrderPaymentsCard";
import OrderStatusActions from "@/modules/orders/components/OrderStatusActions";

type Props = {
    orderId: string;
};

export default function OrderDetailPage({ orderId }: Props) {
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrder = async (showLoader = true) => {
        try {
            if (showLoader) {
                setIsLoading(true);
            } else {
                setIsRefreshing(true);
            }

            setError(null);

            const response = await getOrderById(orderId);
            setOrder(response);
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load order detail"
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (orderId) {
            fetchOrder(true);
        }
    }, [orderId]);

    if (isLoading) {
        return <OrderDetailSkeleton />;
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
            </div>
        );
    }

    if (!order) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
                Order not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {isRefreshing ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
                    Refreshing order details...
                </div>
            ) : null}

            <OrderDetailHeader order={order} />
            <OrderSummaryCards order={order} />

            <OrderStatusActions
                order={order}
                onSuccess={() => fetchOrder(false)}
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <OrderBuyerCard order={order} />
                <OrderAddressCard order={order} />
            </div>

            <OrderItemsCard order={order} />

            <OrderPaymentsCard
                order={order}
                onPaymentAdded={() => fetchOrder(false)}
            />

            {order.notes ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
                    <pre className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                        {order.notes}
                    </pre>
                </div>
            ) : null}
        </div>
    );
}