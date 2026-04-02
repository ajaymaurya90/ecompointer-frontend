"use client";

import type { BuyerType, CreateOrderLineItem } from "@/modules/orders/types/order";

type Props = {
    buyerType: BuyerType;
    items: CreateOrderLineItem[];
    currencyCode: string;
    onQuantityChange: (productVariantId: string, quantity: number) => void;
    onRemove: (productVariantId: string) => void;
};

function formatCurrency(amount: number, currencyCode: string) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode || "INR",
        maximumFractionDigits: 2,
    }).format(amount || 0);
}

export default function OrderItemsEditor({
    buyerType,
    items,
    currencyCode,
    onQuantityChange,
    onRemove,
}: Props) {
    const minQty =
        buyerType === "SHOP_OWNER"
            ? items[0]?.shopOrderRules?.minLineQty ?? 3
            : 1;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
                {buyerType === "SHOP_OWNER" ? (
                    <p className="mt-1 text-sm text-amber-600">
                        Shop owner rule: minimum {minQty} quantity per line item.
                    </p>
                ) : null}
            </div>

            {items.length === 0 ? (
                <div className="p-6 text-sm text-gray-500">
                    No products added yet.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                            <tr>
                                <th className="px-5 py-3 font-medium">Product</th>
                                <th className="px-5 py-3 font-medium">SKU</th>
                                <th className="px-5 py-3 font-medium">Stock</th>
                                <th className="px-5 py-3 font-medium">Quantity</th>
                                <th className="px-5 py-3 font-medium">Unit Price</th>
                                <th className="px-5 py-3 font-medium">Tax</th>
                                <th className="px-5 py-3 font-medium">Line Total</th>
                                <th className="px-5 py-3 font-medium">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.map((item) => (
                                <tr key={item.productVariantId} className="border-b border-gray-100">
                                    <td className="px-5 py-4">
                                        <div className="font-medium text-gray-900">
                                            {item.productName}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            {item.productCode}
                                            {item.variantLabel ? ` · ${item.variantLabel}` : ""}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-gray-700">{item.sku}</td>
                                    <td className="px-5 py-4 text-gray-700">{item.stock}</td>
                                    <td className="px-5 py-4">
                                        <input
                                            type="number"
                                            min={minQty}
                                            max={item.stock}
                                            value={item.quantity}
                                            onChange={(e) =>
                                                onQuantityChange(
                                                    item.productVariantId,
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="w-24 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                                        />
                                    </td>
                                    <td className="px-5 py-4 text-gray-700">
                                        {formatCurrency(item.unitPrice, currencyCode)}
                                    </td>
                                    <td className="px-5 py-4 text-gray-700">
                                        {formatCurrency(item.taxAmount, currencyCode)}
                                    </td>
                                    <td className="px-5 py-4 font-medium text-gray-900">
                                        {formatCurrency(item.lineTotal, currencyCode)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <button
                                            type="button"
                                            onClick={() => onRemove(item.productVariantId)}
                                            className="rounded-xl border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}