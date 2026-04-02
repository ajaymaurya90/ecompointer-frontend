"use client";

import { useMemo, useState } from "react";
import type { OrderDetail } from "@/modules/orders/types/order";
import AddPaymentModal from "@/modules/orders/components/AddPaymentModal";

type Props = {
    order: OrderDetail;
    onPaymentAdded: () => Promise<void> | void;
};

function formatCurrency(amount: string, currencyCode: string) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode || "INR",
        maximumFractionDigits: 2,
    }).format(Number(amount || 0));
}

function formatDate(dateValue: string) {
    return new Date(dateValue).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export default function OrderPaymentsCard({ order, onPaymentAdded }: Props) {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const totalPaid = useMemo(() => {
        return order.payments.reduce(
            (sum, payment) => sum + Number(payment.amountPaid || 0),
            0
        );
    }, [order.payments]);

    const pendingAmount = Number(order.totalAmount || 0) - totalPaid;
    const canAddPayment = order.status !== "CANCELLED" && pendingAmount > 0;

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Payments</h2>

                    {canAddPayment ? (
                        <button
                            type="button"
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            Add Payment
                        </button>
                    ) : null}
                </div>

                <div className="px-6 py-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <div className="text-xs uppercase tracking-wide text-gray-400">Total</div>
                            <div className="mt-2 text-lg font-semibold text-gray-900">
                                {formatCurrency(order.totalAmount, order.currencyCode)}
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <div className="text-xs uppercase tracking-wide text-gray-400">Paid</div>
                            <div className="mt-2 text-lg font-semibold text-gray-900">
                                {formatCurrency(String(totalPaid), order.currencyCode)}
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <div className="text-xs uppercase tracking-wide text-gray-400">Pending</div>
                            <div className="mt-2 text-lg font-semibold text-gray-900">
                                {formatCurrency(String(pendingAmount), order.currencyCode)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {order.payments.length ? (
                            order.payments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="rounded-xl border border-gray-100 p-4"
                                >
                                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {formatCurrency(payment.amountPaid, order.currencyCode)}
                                            </div>
                                            <div className="mt-1 text-sm text-gray-500">
                                                {payment.paymentMethod || "Unknown method"}
                                            </div>
                                            <div className="mt-1 text-sm text-gray-500">
                                                {formatDate(payment.paymentDate)}
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500 md:text-right">
                                            <div>Reference: {payment.referenceNo || "-"}</div>
                                            <div className="mt-1">Note: {payment.note || "-"}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                                No payment history available.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddPaymentModal
                orderId={order.id}
                currencyCode={order.currencyCode}
                totalAmount={order.totalAmount}
                alreadyPaidAmount={totalPaid}
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSuccess={onPaymentAdded}
            />
        </>
    );
}