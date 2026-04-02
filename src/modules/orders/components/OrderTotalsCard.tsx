"use client";

type Props = {
    currencyCode: string;
    subtotal: number;
    taxAmount: number;
    shippingAmount: string;
    discountAmount: string;
    onShippingChange: (value: string) => void;
    onDiscountChange: (value: string) => void;
};

function formatCurrency(amount: number, currencyCode: string) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode || "INR",
        maximumFractionDigits: 2,
    }).format(amount || 0);
}

export default function OrderTotalsCard({
    currencyCode,
    subtotal,
    taxAmount,
    shippingAmount,
    discountAmount,
    onShippingChange,
    onDiscountChange,
}: Props) {
    const shipping = Number(shippingAmount || 0);
    const discount = Number(discountAmount || 0);
    const grandTotal = subtotal + taxAmount + shipping - discount;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                <p className="text-sm text-gray-500">
                    Review totals before creating the order.
                </p>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-700">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal, currencyCode)}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-700">
                    <span>Tax</span>
                    <span>{formatCurrency(taxAmount, currencyCode)}</span>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Shipping
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={shippingAmount}
                        onChange={(e) => onShippingChange(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Discount
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={discountAmount}
                        onChange={(e) => onDiscountChange(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                        <span>Grand Total</span>
                        <span>{formatCurrency(grandTotal, currencyCode)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}