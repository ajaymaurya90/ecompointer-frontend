"use client";

import type { OrderDetail } from "@/modules/orders/types/order";

type Props = {
    order: OrderDetail;
};

export default function OrderBuyerCard({ order }: Props) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Buyer Details</h2>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Buyer Name
                    </div>
                    <div className="mt-1 text-sm text-gray-900">{order.buyerName}</div>
                </div>

                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Buyer Type
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                        {order.buyerType.replaceAll("_", " ")}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Email
                    </div>
                    <div className="mt-1 text-sm text-gray-900">{order.buyerEmail || "-"}</div>
                </div>

                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Phone
                    </div>
                    <div className="mt-1 text-sm text-gray-900">{order.buyerPhone || "-"}</div>
                </div>
            </div>

            {order.customer ? (
                <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-sm font-semibold text-gray-900">Customer Reference</div>
                    <div className="mt-2 text-sm text-gray-600">
                        {order.customer.customerCode} · {order.customer.firstName}{" "}
                        {order.customer.lastName || ""}
                    </div>
                </div>
            ) : null}

            {order.shopOwner ? (
                <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-sm font-semibold text-gray-900">Shop Owner Reference</div>
                    <div className="mt-2 text-sm text-gray-600">
                        {order.shopOwner.shopName} · {order.shopOwner.ownerName}
                    </div>
                </div>
            ) : null}
        </div>
    );
}