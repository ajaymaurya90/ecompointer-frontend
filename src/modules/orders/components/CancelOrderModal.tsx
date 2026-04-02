"use client";

import { useState } from "react";
import { cancelOrder } from "@/modules/orders/api/order.api";

type Props = {
    orderId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void> | void;
};

export default function CancelOrderModal({
    orderId,
    isOpen,
    onClose,
    onSuccess,
}: Props) {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        if (isSubmitting) return;
        setReason("");
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        try {
            setError(null);
            setIsSubmitting(true);

            await cancelOrder(orderId, {
                reason: reason || undefined,
            });

            await onSuccess();
            handleClose();
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to cancel order"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Cancel Order</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            This will mark the order as cancelled and restore stock.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>

                <div className="mt-5">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Cancellation Reason
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Optional reason for cancellation"
                        rows={4}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                {error ? (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Cancelling..." : "Confirm Cancel"}
                    </button>
                </div>
            </div>
        </div>
    );
}