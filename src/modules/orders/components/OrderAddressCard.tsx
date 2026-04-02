"use client";

import type { OrderDetail } from "@/modules/orders/types/order";

type Props = {
    order: OrderDetail;
};

function renderAddress(lines: Array<string | null | undefined>) {
    return lines.filter(Boolean).join(", ");
}

export default function OrderAddressCard({ order }: Props) {
    const billingAddress = renderAddress([
        order.billingAddressLine1,
        order.billingAddressLine2,
        order.billingLandmark,
        order.billingCity,
        order.billingDistrict,
        order.billingState,
        order.billingCountry,
        order.billingPostalCode,
    ]);

    const shippingAddress = renderAddress([
        order.shippingAddressLine1,
        order.shippingAddressLine2,
        order.shippingLandmark,
        order.shippingCity,
        order.shippingDistrict,
        order.shippingState,
        order.shippingCountry,
        order.shippingPostalCode,
    ]);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Addresses</h2>

            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <div className="text-sm font-semibold text-gray-900">Billing Address</div>
                    <div className="mt-2 text-sm text-gray-600">{order.billingFullName || "-"}</div>
                    <div className="mt-1 text-sm text-gray-600">{order.billingPhone || "-"}</div>
                    <div className="mt-2 text-sm leading-6 text-gray-700">{billingAddress || "-"}</div>
                </div>

                <div>
                    <div className="text-sm font-semibold text-gray-900">Shipping Address</div>
                    <div className="mt-2 text-sm text-gray-600">{order.shippingFullName || "-"}</div>
                    <div className="mt-1 text-sm text-gray-600">{order.shippingPhone || "-"}</div>
                    <div className="mt-2 text-sm leading-6 text-gray-700">{shippingAddress || "-"}</div>
                </div>
            </div>
        </div>
    );
}