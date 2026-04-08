"use client";

import { Package, Pencil, Trash2, Layers3 } from "lucide-react";
import type { Product } from "@/modules/products/types/product";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

interface ProductListTableProps {
    products: Product[];
    loading: boolean;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

function formatCurrency(value?: number) {
    return `₹${Number(value ?? 0).toFixed(2)}`;
}

function getStockTone(stock: number) {
    if (stock <= 0) {
        return "bg-red-100 text-red-700";
    }

    if (stock <= 5) {
        return "bg-amber-100 text-amber-700";
    }

    return "bg-green-100 text-green-700";
}

function getTypeBadge(type?: string) {
    switch (type) {
        case "DIGITAL":
            return "bg-purple-100 text-purple-700";
        case "SERVICE":
            return "bg-indigo-100 text-indigo-700";
        case "OTHER":
            return "bg-slate-100 text-slate-700";
        default:
            return "bg-blue-100 text-blue-700";
    }
}

export default function ProductListTable({
    products,
    loading,
    onEdit,
    onDelete,
}: ProductListTableProps) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-borderColorCustom bg-card p-6 text-textSecondary">
                Loading products...
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="rounded-2xl border border-borderColorCustom bg-card p-10 text-center">
                <h3 className="text-lg font-medium text-textPrimary">
                    No products found
                </h3>
                <p className="mt-2 text-textSecondary">
                    Try adjusting your search or filters.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-borderColorCustom bg-card">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1500px] border-collapse text-left">
                    <thead className="border-b border-borderColorCustom bg-background">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Product
                            </th>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Type
                            </th>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Brand
                            </th>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Category
                            </th>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Price
                            </th>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Stock
                            </th>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Flags
                            </th>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Variants
                            </th>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right font-semibold text-textPrimary">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => {
                            const variantCount =
                                typeof product.variantCount === "number"
                                    ? product.variantCount
                                    : product.variants?.length || 0;

                            const hasVariants = variantCount > 0;
                            const stock = product.totalStock ?? product.stock ?? 0;

                            return (
                                <tr
                                    key={product.id}
                                    className="border-b border-borderColorCustom transition hover:bg-background"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-borderColorCustom bg-white">
                                                <Package size={18} className="text-textSecondary" />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <div className="truncate font-medium text-textPrimary">
                                                        {product.name}
                                                    </div>

                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${hasVariants
                                                            ? "bg-blue-50 text-blue-700"
                                                            : "bg-slate-100 text-slate-700"
                                                            }`}
                                                    >
                                                        {hasVariants ? (
                                                            <>
                                                                <Layers3 size={12} />
                                                                Parent
                                                            </>
                                                        ) : (
                                                            "Standalone"
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="mt-1 text-sm text-textSecondary">
                                                    {product.productCode}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${getTypeBadge(product.productType)
                                                }`}
                                        >
                                            {product.productType || "PHYSICAL"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-textSecondary">
                                        {product.brand?.name || "-"}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="text-textSecondary">
                                            {product.category?.name || "-"}
                                        </div>
                                        {(product.categoryIds?.length ?? 0) > 1 ? (
                                            <div className="mt-1 text-xs text-textSecondary">
                                                +{(product.categoryIds?.length ?? 1) - 1} more
                                            </div>
                                        ) : null}
                                    </td>

                                    <td className="px-6 py-4">
                                        {hasVariants ? (
                                            <div>
                                                <div className="font-medium text-textPrimary">
                                                    {formatCurrency(product.retailGrossPrice)}
                                                </div>
                                                <div className="mt-1 text-xs text-textSecondary">
                                                    parent default
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="font-medium text-textPrimary">
                                                    {formatCurrency(product.retailGrossPrice)}
                                                </div>
                                                <div className="mt-1 text-xs text-textSecondary">
                                                    Wholesale {formatCurrency(product.wholesaleGrossPrice)}
                                                </div>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="font-medium text-textPrimary">{stock}</div>
                                            <span
                                                className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium ${getStockTone(
                                                    stock
                                                )}`}
                                            >
                                                {stock <= 0
                                                    ? "Out of stock"
                                                    : stock <= 5
                                                        ? "Low stock"
                                                        : "In stock"}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <ToggleSwitch
                                                    checked={!!product.isFeatured}
                                                    disabled
                                                    size="sm"
                                                />
                                                <span className="text-xs text-textSecondary">
                                                    Featured
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <ToggleSwitch
                                                    checked={!!product.isFreeShipping}
                                                    disabled
                                                    size="sm"
                                                />
                                                <span className="text-xs text-textSecondary">
                                                    Free Shipping
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <ToggleSwitch
                                                    checked={!!product.isClearance}
                                                    disabled
                                                    size="sm"
                                                />
                                                <span className="text-xs text-textSecondary">
                                                    Clearance
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-textSecondary">
                                        {hasVariants ? `${variantCount} variants` : "No variants"}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${product.isActive === false
                                                ? "bg-gray-100 text-gray-600"
                                                : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {product.isActive === false ? "Inactive" : "Active"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(product)}
                                                className="text-blue-600 hover:text-blue-700"
                                                aria-label={`Edit ${product.name}`}
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onDelete(product)}
                                                className="text-red-600 hover:text-red-700"
                                                aria-label={`Delete ${product.name}`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}