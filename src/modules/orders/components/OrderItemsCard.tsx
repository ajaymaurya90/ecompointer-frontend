"use client";

import type { OrderDetail } from "@/modules/orders/types/order";

type Props = {
    order: OrderDetail;
};

function formatCurrency(amount: string, currencyCode: string) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode || "INR",
        maximumFractionDigits: 2,
    }).format(Number(amount || 0));
}

export default function OrderItemsCard({ order }: Props) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                        <tr>
                            <th className="px-6 py-3 font-medium">Product</th>
                            <th className="px-6 py-3 font-medium">SKU</th>
                            <th className="px-6 py-3 font-medium">Qty</th>
                            <th className="px-6 py-3 font-medium">Unit Price</th>
                            <th className="px-6 py-3 font-medium">Tax</th>
                            <th className="px-6 py-3 font-medium">Line Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {order.items.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{item.productName}</div>
                                    <div className="mt-1 text-xs text-gray-500">
                                        {item.productCode || "-"}
                                        {item.variantLabel ? ` · ${item.variantLabel}` : ""}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-700">{item.variantSku}</td>
                                <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
                                <td className="px-6 py-4 text-gray-700">
                                    {formatCurrency(item.unitPrice, order.currencyCode)}
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                    {formatCurrency(item.taxAmount, order.currencyCode)}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {formatCurrency(item.lineTotal, order.currencyCode)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}