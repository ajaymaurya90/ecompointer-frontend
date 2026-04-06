"use client";

import { Package, Pencil, Trash2, Layers3 } from "lucide-react";
import type { Product } from "@/modules/products/types/product";

interface ProductListTableProps {
    products: Product[];
    loading: boolean;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
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
                <table className="w-full min-w-[980px] border-collapse text-left">
                    <thead className="border-b border-borderColorCustom bg-background">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Product
                            </th>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Product Code
                            </th>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Brand
                            </th>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Category
                            </th>
                            <th className="px-6 py-4 font-semibold text-textPrimary">
                                Stock
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

                                                    {hasVariants ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                                            <Layers3 size={12} />
                                                            {variantCount} variant
                                                            {variantCount > 1 ? "s" : ""}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-textSecondary">
                                        {product.productCode}
                                    </td>

                                    <td className="px-6 py-4 text-textSecondary">
                                        {product.brand?.name || "-"}
                                    </td>

                                    <td className="px-6 py-4 text-textSecondary">
                                        {product.category?.name || "-"}
                                    </td>

                                    <td className="px-6 py-4 text-textSecondary">
                                        {product.totalStock ?? 0}
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