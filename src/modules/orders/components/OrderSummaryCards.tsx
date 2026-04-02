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

export default function OrderSummaryCards({ order }: Props) {
    const totalPaid = order.payments.reduce(
        (sum, payment) => sum + Number(payment.amountPaid || 0),
        0
    );

    const pendingAmount = Number(order.totalAmount || 0) - totalPaid;

    const cards = [
        {
            label: "Grand Total",
            value: formatCurrency(order.totalAmount, order.currencyCode),
        },
        {
            label: "Paid Amount",
            value: formatCurrency(String(totalPaid), order.currencyCode),
        },
        {
            label: "Pending Amount",
            value: formatCurrency(String(pendingAmount), order.currencyCode),
        },
        {
            label: "Items",
            value: String(order.items.length),
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                    <div className="text-sm text-gray-500">{card.label}</div>
                    <div className="mt-2 text-2xl font-bold text-gray-900">{card.value}</div>
                </div>
            ))}
        </div>
    );
}