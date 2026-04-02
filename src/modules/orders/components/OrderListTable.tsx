"use client";

import Link from "next/link";
import type { OrderListItem } from "@/modules/orders/types/order";

type Props = {
    orders: OrderListItem[];
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

function formatCurrency(amount: string, currencyCode: string) {
    const numericValue = Number(amount || 0);

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode || "INR",
        maximumFractionDigits: 2,
    }).format(numericValue);
}

function formatDate(dateValue: string) {
    return new Date(dateValue).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function statusBadgeClass(status: string) {
    switch (status) {
        case "PAID":
        case "DELIVERED":
            return "bg-green-100 text-green-700";
        case "PARTIALLY_PAID":
        case "PROCESSING":
        case "CONFIRMED":
            return "bg-blue-100 text-blue-700";
        case "PENDING":
            return "bg-yellow-100 text-yellow-700";
        case "CANCELLED":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

export default function OrderListTable({
    orders,
    page,
    totalPages,
    onPageChange,
}: Props) {
    if (!orders.length) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Try changing the filters or create a new order.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                        <tr>
                            <th className="px-4 py-3 font-medium">Order</th>
                            <th className="px-4 py-3 font-medium">Buyer</th>
                            <th className="px-4 py-3 font-medium">Items</th>
                            <th className="px-4 py-3 font-medium">Order Status</th>
                            <th className="px-4 py-3 font-medium">Payment</th>
                            <th className="px-4 py-3 font-medium">Total</th>
                            <th className="px-4 py-3 font-medium">Pending</th>
                            <th className="px-4 py-3 font-medium">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-gray-100 align-top">
                                <td className="px-4 py-4">
                                    <div className="font-semibold text-gray-900">{order.orderNumber}</div>
                                    <div className="mt-1 text-xs text-gray-500">
                                        {formatDate(order.createdAt)}
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">
                                        {order.salesChannel.replaceAll("_", " ")}
                                    </div>
                                </td>

                                <td className="px-4 py-4">
                                    <div className="font-medium text-gray-900">{order.buyerName}</div>
                                    <div className="mt-1 text-xs text-gray-500">{order.buyerType}</div>
                                    {order.buyerPhone ? (
                                        <div className="mt-1 text-xs text-gray-500">{order.buyerPhone}</div>
                                    ) : null}
                                </td>

                                <td className="px-4 py-4">
                                    <div className="font-medium text-gray-900">{order.itemCount} item(s)</div>
                                    <div className="mt-2 space-y-1">
                                        {order.itemSummary.slice(0, 2).map((item) => (
                                            <div key={item.id} className="text-xs text-gray-500">
                                                {item.productName}
                                                {item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity}
                                            </div>
                                        ))}
                                        {order.itemSummary.length > 2 ? (
                                            <div className="text-xs text-gray-400">
                                                +{order.itemSummary.length - 2} more
                                            </div>
                                        ) : null}
                                    </div>
                                </td>

                                <td className="px-4 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(
                                            order.status
                                        )}`}
                                    >
                                        {order.status.replaceAll("_", " ")}
                                    </span>
                                </td>

                                <td className="px-4 py-4">
                                    <div>
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(
                                                order.paymentStatus
                                            )}`}
                                        >
                                            {order.paymentStatus.replaceAll("_", " ")}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        Paid: {formatCurrency(order.totalPaid, order.currencyCode)}
                                    </div>
                                </td>

                                <td className="px-4 py-4 font-medium text-gray-900">
                                    {formatCurrency(order.totalAmount, order.currencyCode)}
                                </td>

                                <td className="px-4 py-4 font-medium text-gray-900">
                                    {formatCurrency(order.pendingAmount, order.currencyCode)}
                                </td>

                                <td className="px-4 py-4">
                                    <Link
                                        href={`/dashboard/orders/${order.id}`}
                                        className="inline-flex rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Previous
                </button>

                <div className="text-sm text-gray-600">
                    Page {page} of {Math.max(totalPages, 1)}
                </div>

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}