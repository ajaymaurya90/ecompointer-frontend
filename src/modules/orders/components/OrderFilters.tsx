"use client";

import type {
    BuyerType,
    OrderStatus,
    PaymentStatus,
    SalesChannelType,
} from "@/modules/orders/types/order";

type Props = {
    search: string;
    status: OrderStatus | "";
    paymentStatus: PaymentStatus | "";
    buyerType: BuyerType | "";
    salesChannel: SalesChannelType | "";
    fromDate: string;
    toDate: string;
    onChange: (key: string, value: string) => void;
    onApply: () => void;
    onReset: () => void;
};

const orderStatusOptions: { label: string; value: OrderStatus }[] = [
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Partially Confirmed", value: "PARTIALLY_CONFIRMED" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Partially Dispatched", value: "PARTIALLY_DISPATCHED" },
    { label: "Dispatched", value: "DISPATCHED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
];

const paymentStatusOptions: { label: string; value: PaymentStatus }[] = [
    { label: "Unpaid", value: "UNPAID" },
    { label: "Partially Paid", value: "PARTIALLY_PAID" },
    { label: "Paid", value: "PAID" },
];

const buyerTypeOptions: { label: string; value: BuyerType }[] = [
    { label: "Customer", value: "CUSTOMER" },
    { label: "Shop Owner", value: "SHOP_OWNER" },
];

const salesChannelOptions: { label: string; value: SalesChannelType }[] = [
    { label: "Manual", value: "MANUAL" },
    { label: "Direct Website", value: "DIRECT_WEBSITE" },
    { label: "Shop Order", value: "SHOP_ORDER" },
    { label: "Franchise Shop", value: "FRANCHISE_SHOP" },
    { label: "Marketplace", value: "MARKETPLACE" },
    { label: "Social Media", value: "SOCIAL_MEDIA" },
];

export default function OrderFilters({
    search,
    status,
    paymentStatus,
    buyerType,
    salesChannel,
    fromDate,
    toDate,
    onChange,
    onApply,
    onReset,
}: Props) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-gray-900">Order Filters</h2>
                <p className="text-sm text-gray-500">
                    Search and filter orders by buyer, payment, status, and date range.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Search
                    </label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onChange("search", e.target.value)}
                        placeholder="Order no, buyer name, email, phone"
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Order Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => onChange("status", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="">All</option>
                        {orderStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Payment Status
                    </label>
                    <select
                        value={paymentStatus}
                        onChange={(e) => onChange("paymentStatus", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="">All</option>
                        {paymentStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Buyer Type
                    </label>
                    <select
                        value={buyerType}
                        onChange={(e) => onChange("buyerType", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="">All</option>
                        {buyerTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Sales Channel
                    </label>
                    <select
                        value={salesChannel}
                        onChange={(e) => onChange("salesChannel", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="">All</option>
                        {salesChannelOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        From Date
                    </label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => onChange("fromDate", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        To Date
                    </label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => onChange("toDate", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    />
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                    onClick={onApply}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    Apply Filters
                </button>
                <button
                    onClick={onReset}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}