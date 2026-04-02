"use client";

import { useEffect, useMemo, useState } from "react";
import { searchOrderProducts } from "@/modules/orders/api/order.api";
import type {
    BuyerType,
    CreateOrderLineItem,
    OrderSearchProductItem,
} from "@/modules/orders/types/order";

type Props = {
    buyerType: BuyerType;
    existingItems: CreateOrderLineItem[];
    onAddItem: (item: CreateOrderLineItem) => void;
};

export default function OrderProductSearch({
    buyerType,
    existingItems,
    onAddItem,
}: Props) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<OrderSearchProductItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);

    const existingVariantIds = useMemo(
        () => new Set(existingItems.map((item) => item.productVariantId)),
        [existingItems]
    );

    useEffect(() => {
        const controller = new AbortController();

        const runSearch = async () => {
            if (search.trim().length < 2) {
                setResults([]);
                setSelectedVariantIds([]);
                setError(null);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const data = await searchOrderProducts(search.trim());

                if (!controller.signal.aborted) {
                    setResults(data);

                    // Auto-check already added items and clear stale selections.
                    const validSelectableIds = new Set(data.map((item) => item.id));

                    setSelectedVariantIds((prev) => {
                        const persisted = prev.filter((id) => validSelectableIds.has(id));
                        const alreadyAddedIds = data
                            .filter((item) => existingVariantIds.has(item.id))
                            .map((item) => item.id);

                        return Array.from(new Set([...persisted, ...alreadyAddedIds]));
                    });
                }
            } catch (error: any) {
                if (!controller.signal.aborted) {
                    setError(
                        error?.response?.data?.message ||
                        error?.message ||
                        "Failed to search products"
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
    }, [search, existingVariantIds]);

    const toggleSelection = (variantId: string) => {
        setSelectedVariantIds((prev) =>
            prev.includes(variantId)
                ? prev.filter((id) => id !== variantId)
                : [...prev, variantId]
        );
    };

    const buildCartItem = (item: OrderSearchProductItem): CreateOrderLineItem => {
        const unitPrice =
            buyerType === "SHOP_OWNER" ? item.wholesaleGross : item.retailGross;

        const defaultQty = buyerType === "SHOP_OWNER" ? 3 : 1;
        const lineSubtotal = unitPrice * defaultQty;
        const taxAmount = (lineSubtotal * item.taxRate) / 100;
        const lineTotal = lineSubtotal + taxAmount;

        return {
            brandOwnerId: item.brandOwnerId,
            productVariantId: item.id,
            productId: item.productId,
            productName: item.productName,
            productCode: item.productCode,
            sku: item.sku,
            variantLabel: item.variantLabel,
            quantity: defaultQty,
            stock: item.stock,
            taxRate: item.taxRate,
            unitPrice,
            lineSubtotal,
            taxAmount,
            lineTotal,
            shopOrderRules: item.shopOrderRules,
        };
    };

    const handleAddSingle = (item: OrderSearchProductItem) => {
        if (existingVariantIds.has(item.id)) {
            return;
        }

        onAddItem(buildCartItem(item));

        setSelectedVariantIds((prev) =>
            Array.from(new Set([...prev, item.id]))
        );
    };

    const handleAddSelected = () => {
        const itemsToAdd = results.filter(
            (item) =>
                selectedVariantIds.includes(item.id) &&
                !existingVariantIds.has(item.id)
        );

        itemsToAdd.forEach((item) => {
            onAddItem(buildCartItem(item));
        });

        if (itemsToAdd.length > 0) {
            const addedIds = itemsToAdd.map((item) => item.id);

            setSelectedVariantIds((prev) =>
                Array.from(new Set([...prev, ...addedIds]))
            );
        }
    };

    const selectableCount = results.filter(
        (item) =>
            selectedVariantIds.includes(item.id) &&
            !existingVariantIds.has(item.id)
    ).length;

    const canAddSelected = selectableCount > 0;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Add Products</h2>
                    <p className="text-sm text-gray-500">
                        Search active product variants and add them to the order.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddSelected}
                    disabled={!canAddSelected}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Add Selected {canAddSelected ? `(${selectableCount})` : ""}
                </button>
            </div>

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name, code, SKU"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />

            {isLoading ? (
                <div className="mt-3 text-sm text-gray-500">Searching products...</div>
            ) : null}

            {error ? (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {results.length > 0 ? (
                <div className="mt-3 max-h-80 space-y-2 overflow-y-auto rounded-xl border border-gray-200 p-2">
                    {results.map((item) => {
                        const alreadyAdded = existingVariantIds.has(item.id);
                        const isChecked = selectedVariantIds.includes(item.id);

                        return (
                            <div
                                key={item.id}
                                className="flex flex-col gap-3 rounded-xl border border-gray-200 p-3 md:flex-row md:items-center md:justify-between"
                            >
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        disabled={alreadyAdded}
                                        onChange={() => toggleSelection(item.id)}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black disabled:cursor-not-allowed"
                                    />

                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {item.productName}
                                            {item.variantLabel ? ` (${item.variantLabel})` : ""}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            {item.productCode} · {item.sku} · Stock: {item.stock}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            Price: ₹
                                            {buyerType === "SHOP_OWNER"
                                                ? item.wholesaleGross.toFixed(2)
                                                : item.retailGross.toFixed(2)}
                                        </div>
                                        {buyerType === "SHOP_OWNER" ? (
                                            <div className="mt-1 text-xs text-amber-600">
                                                Minimum {item.shopOrderRules.minLineQty} qty per line for shop owner orders
                                            </div>
                                        ) : null}
                                        {alreadyAdded ? (
                                            <div className="mt-1 text-xs font-medium text-green-700">
                                                Already added to cart
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={item.stock <= 0 || alreadyAdded}
                                    onClick={() => handleAddSingle(item)}
                                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {alreadyAdded ? "Already Added" : "Add"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}