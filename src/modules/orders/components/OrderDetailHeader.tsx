"use client";

import type { OrderDetail } from "@/modules/orders/types/order";

type Props = {
    order: OrderDetail;
};

function badgeClass(value: string) {
    switch (value) {
        case "PAID":
        case "DELIVERED":
            return "bg-green-100 text-green-700";
        case "PARTIALLY_PAID":
        case "CONFIRMED":
        case "PROCESSING":
            return "bg-blue-100 text-blue-700";
        case "PENDING":
            return "bg-yellow-100 text-yellow-700";
        case "CANCELLED":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

function formatDate(dateValue: string) {
    return new Date(dateValue).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export default function OrderDetailHeader({ order }: Props) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Created on {formatDate(order.createdAt)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Buyer: {order.buyerName} · {order.buyerType.replaceAll("_", " ")}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeClass(
                            order.status
                        )}`}
                    >
                        {order.status.replaceAll("_", " ")}
                    </span>
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeClass(
                            order.paymentStatus
                        )}`}
                    >
                        {order.paymentStatus.replaceAll("_", " ")}
                    </span>
                </div>
            </div>
        </div>
    );
}