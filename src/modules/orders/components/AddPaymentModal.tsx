"use client";

import { useMemo, useState } from "react";
import { addOrderPayment } from "@/modules/orders/api/order.api";

type Props = {
    orderId: string;
    currencyCode: string;
    totalAmount: string;
    alreadyPaidAmount: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void> | void;
};

function formatCurrency(amount: number, currencyCode: string) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode || "INR",
        maximumFractionDigits: 2,
    }).format(amount || 0);
}

export default function AddPaymentModal({
    orderId,
    currencyCode,
    totalAmount,
    alreadyPaidAmount,
    isOpen,
    onClose,
    onSuccess,
}: Props) {
    const [amountPaid, setAmountPaid] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [referenceNo, setReferenceNo] = useState("");
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pendingAmount = useMemo(() => {
        return Number(totalAmount || 0) - alreadyPaidAmount;
    }, [totalAmount, alreadyPaidAmount]);

    const handleClose = () => {
        if (isSubmitting) return;

        setAmountPaid("");
        setPaymentDate("");
        setPaymentMethod("UPI");
        setReferenceNo("");
        setNote("");
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        try {
            setError(null);

            const numericAmount = Number(amountPaid || 0);

            if (!numericAmount || numericAmount <= 0) {
                setError("Payment amount must be greater than 0.");
                return;
            }

            if (numericAmount > pendingAmount) {
                setError("Payment amount cannot exceed pending amount.");
                return;
            }

            if (!paymentDate) {
                setError("Payment date is required.");
                return;
            }

            setIsSubmitting(true);

            await addOrderPayment(orderId, {
                amountPaid,
                paymentDate: new Date(paymentDate).toISOString(),
                paymentMethod,
                referenceNo: referenceNo || undefined,
                note: note || undefined,
            });

            await onSuccess();
            handleClose();
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to add payment"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Add Payment</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Record a payment against this order.
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                        type="button"
                    >
                        Close
                    </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-gray-400">
                            Total Amount
                        </div>
                        <div className="mt-2 text-lg font-semibold text-gray-900">
                            {formatCurrency(Number(totalAmount || 0), currencyCode)}
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-gray-400">
                            Pending Amount
                        </div>
                        <div className="mt-2 text-lg font-semibold text-gray-900">
                            {formatCurrency(pendingAmount, currencyCode)}
                        </div>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Amount Paid
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            placeholder="Enter payment amount"
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Payment Date
                        </label>
                        <input
                            type="datetime-local"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Payment Method
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        >
                            <option value="CASH">Cash</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="UPI">UPI</option>
                            <option value="CARD">Card</option>
                            <option value="CHEQUE">Cheque</option>
                            <option value="CREDIT">Credit</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Reference No
                        </label>
                        <input
                            type="text"
                            value={referenceNo}
                            onChange={(e) => setReferenceNo(e.target.value)}
                            placeholder="Optional reference number"
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Note
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Optional note"
                            rows={3}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>
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
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Saving..." : "Add Payment"}
                    </button>
                </div>
            </div>
        </div>
    );
}