"use client";

import { useMemo, useState } from "react";
import { updateOrderStatus } from "@/modules/orders/api/order.api";
import type { OrderDetail, OrderStatus } from "@/modules/orders/types/order";
import CancelOrderModal from "@/modules/orders/components/CancelOrderModal";

type Props = {
    order: OrderDetail;
    onSuccess: () => Promise<void> | void;
};

type NextAction = {
    label: string;
    status: OrderStatus;
};

const STATUS_FLOW: Record<OrderStatus, NextAction[]> = {
    PENDING: [{ label: "Confirm Order", status: "CONFIRMED" }],
    CONFIRMED: [{ label: "Start Processing", status: "PROCESSING" }],
    PARTIALLY_CONFIRMED: [{ label: "Start Processing", status: "PROCESSING" }],
    PROCESSING: [{ label: "Mark Dispatched", status: "DISPATCHED" }],
    PARTIALLY_DISPATCHED: [{ label: "Mark Dispatched", status: "DISPATCHED" }],
    DISPATCHED: [{ label: "Mark Delivered", status: "DELIVERED" }],
    DELIVERED: [],
    CANCELLED: [],
};

export default function OrderStatusActions({ order, onSuccess }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const nextActions = useMemo(() => {
        return STATUS_FLOW[order.status] ?? [];
    }, [order.status]);

    const handleStatusUpdate = async (status: OrderStatus, label: string) => {
        try {
            setActionError(null);
            setIsSubmitting(true);

            await updateOrderStatus(order.id, {
                status,
                note: label,
            });

            await onSuccess();
        } catch (error: any) {
            setActionError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to update order status"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const canCancel = order.status !== "CANCELLED" && order.status !== "DELIVERED";

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Order Actions</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Update order progress or cancel the order when required.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {nextActions.map((action) => (
                            <button
                                key={action.status}
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => handleStatusUpdate(action.status, action.label)}
                                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {action.label}
                            </button>
                        ))}

                        {canCancel ? (
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => setIsCancelModalOpen(true)}
                                className="rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel Order
                            </button>
                        ) : null}
                    </div>
                </div>

                {nextActions.length === 0 && !canCancel ? (
                    <div className="mt-4 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
                        No further status actions available for this order.
                    </div>
                ) : null}

                {actionError ? (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {actionError}
                    </div>
                ) : null}
            </div>

            <CancelOrderModal
                orderId={order.id}
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onSuccess={onSuccess}
            />
        </>
    );
}