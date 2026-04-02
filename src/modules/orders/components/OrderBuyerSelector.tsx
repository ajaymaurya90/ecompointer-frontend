"use client";

import { useEffect, useState } from "react";
import { searchCustomers, searchShopOwners } from "@/modules/orders/api/order.api";
import type { BuyerType, ShopOwnerSearchItem } from "@/modules/orders/types/order";
import type { Customer } from "@/modules/customers/types/customer";

type Props = {
    buyerType: BuyerType;
    selectedCustomer: Customer | null;
    selectedShopOwner: ShopOwnerSearchItem | null;
    onCustomerSelect: (customer: Customer | null) => void;
    onShopOwnerSelect: (shopOwner: ShopOwnerSearchItem | null) => void;
};

export default function OrderBuyerSelector({
    buyerType,
    selectedCustomer,
    selectedShopOwner,
    onCustomerSelect,
    onShopOwnerSelect,
}: Props) {
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<Customer[] | ShopOwnerSearchItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const runSearch = async () => {
            if (search.trim().length < 2) {
                setResults([]);
                setError(null);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                if (buyerType === "CUSTOMER") {
                    const customers = await searchCustomers(search.trim());
                    if (!controller.signal.aborted) {
                        setResults(customers);
                    }
                } else {
                    const shopOwners = await searchShopOwners(search.trim());
                    if (!controller.signal.aborted) {
                        setResults(shopOwners);
                    }
                }
            } catch (error: any) {
                if (!controller.signal.aborted) {
                    setError(
                        error?.response?.data?.message ||
                        error?.message ||
                        "Search failed"
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        const timeout = setTimeout(runSearch, 300);

        return () => {
            controller.abort();
            clearTimeout(timeout);
        };
    }, [search, buyerType]);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-900">
                    {buyerType === "CUSTOMER" ? "Select Customer" : "Select Shop Owner"}
                </h2>
                <p className="text-sm text-gray-500">
                    Search and choose the buyer for this order.
                </p>
            </div>

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                    buyerType === "CUSTOMER"
                        ? "Search by name, phone, email, customer code"
                        : "Search by shop name, owner name, phone, email"
                }
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />

            {isLoading ? (
                <div className="mt-3 text-sm text-gray-500">Searching...</div>
            ) : null}

            {error ? (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {results.length > 0 ? (
                <div className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-xl border border-gray-200 p-2">
                    {buyerType === "CUSTOMER"
                        ? (results as Customer[]).map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onCustomerSelect(item)}
                                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-left hover:bg-gray-50"
                            >
                                <div className="font-medium text-gray-900">
                                    {item.firstName} {item.lastName || ""}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    {item.customerCode} · {item.phone || "-"} · {item.email || "-"}
                                </div>
                            </button>
                        ))
                        : (results as ShopOwnerSearchItem[]).map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onShopOwnerSelect(item)}
                                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-left hover:bg-gray-50"
                            >
                                <div className="font-medium text-gray-900">{item.shopName}</div>
                                <div className="mt-1 text-xs text-gray-500">
                                    {item.ownerName} · {item.phone} · {item.email || "-"}
                                </div>
                            </button>
                        ))}
                </div>
            ) : null}

            {buyerType === "CUSTOMER" && selectedCustomer ? (
                <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-sm font-semibold text-gray-900">Selected Customer</div>
                    <div className="mt-2 text-sm text-gray-700">
                        {selectedCustomer.firstName} {selectedCustomer.lastName || ""}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                        {selectedCustomer.customerCode} · {selectedCustomer.phone || "-"} · {selectedCustomer.email || "-"}
                    </div>
                </div>
            ) : null}

            {buyerType === "SHOP_OWNER" && selectedShopOwner ? (
                <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-sm font-semibold text-gray-900">Selected Shop Owner</div>
                    <div className="mt-2 text-sm text-gray-700">{selectedShopOwner.shopName}</div>
                    <div className="mt-1 text-xs text-gray-500">
                        {selectedShopOwner.ownerName} · {selectedShopOwner.phone} · {selectedShopOwner.email || "-"}
                    </div>
                </div>
            ) : null}
        </div>
    );
}