"use client";

import type { BuyerType, CreateOrderLineItem, ShopOwnerSearchItem } from "@/modules/orders/types/order";
import type { Customer } from "@/modules/customers/types/customer";

type Props = {
    buyerType: BuyerType;
    selectedCustomer: Customer | null;
    selectedShopOwner: ShopOwnerSearchItem | null;
    items: CreateOrderLineItem[];
    currencyCode: string;
};

function formatCurrency(amount: number, currencyCode: string) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode || "INR",
        maximumFractionDigits: 2,
    }).format(amount || 0);
}

export default function OrderCreateSidebarSummary({
    buyerType,
    selectedCustomer,
    selectedShopOwner,
    items,
    currencyCode,
}: Props) {
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.lineSubtotal, 0);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Live Summary</h2>
                <p className="text-sm text-gray-500">
                    Quick view of buyer and cart status.
                </p>
            </div>

            <div className="space-y-4">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Buyer Type
                    </div>
                    <div className="mt-2 text-sm font-semibold text-gray-900">
                        {buyerType === "CUSTOMER" ? "Customer Order" : "Shop Owner Order"}
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Selected Buyer
                    </div>

                    {buyerType === "CUSTOMER" ? (
                        selectedCustomer ? (
                            <div className="mt-2">
                                <div className="text-sm font-semibold text-gray-900">
                                    {selectedCustomer.firstName} {selectedCustomer.lastName || ""}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    {selectedCustomer.customerCode}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    {selectedCustomer.phone || "-"} · {selectedCustomer.email || "-"}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-2 text-sm text-gray-500">No customer selected</div>
                        )
                    ) : selectedShopOwner ? (
                        <div className="mt-2">
                            <div className="text-sm font-semibold text-gray-900">
                                {selectedShopOwner.shopName}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                                {selectedShopOwner.ownerName}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                                {selectedShopOwner.phone} · {selectedShopOwner.email || "-"}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 text-sm text-gray-500">No shop owner selected</div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Items
                        </div>
                        <div className="mt-2 text-lg font-bold text-gray-900">
                            {items.length}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Total Qty
                        </div>
                        <div className="mt-2 text-lg font-bold text-gray-900">
                            {totalQty}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Running Subtotal
                    </div>
                    <div className="mt-2 text-lg font-bold text-gray-900">
                        {formatCurrency(subtotal, currencyCode)}
                    </div>
                </div>
            </div>
        </div>
    );
}