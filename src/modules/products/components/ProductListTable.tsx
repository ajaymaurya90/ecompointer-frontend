"use client";

import { Package, Pencil, Trash2 } from "lucide-react";
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
                <h3 className="text-lg font-medium text-textPrimary">No products yet</h3>
                <p className="mt-2 text-textSecondary">
                    Create your first product to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-borderColorCustom bg-card">
            <table className="w-full border-collapse text-left">
                <thead className="border-b border-borderColorCustom bg-background">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-textPrimary">Name</th>
                        <th className="px-6 py-4 font-semibold text-textPrimary">Product Code</th>
                        <th className="px-6 py-4 font-semibold text-textPrimary">Brand</th>
                        <th className="px-6 py-4 font-semibold text-textPrimary">Category</th>
                        <th className="px-6 py-4 font-semibold text-textPrimary">Stock</th>
                        <th className="px-6 py-4 text-right font-semibold text-textPrimary">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => {
                        const totalStock =
                            product.variants?.reduce(
                                (sum, variant) => sum + (variant.stock ?? 0),
                                0
                            ) ?? 0;

                        return (
                            <tr
                                key={product.id}
                                className="border-b border-borderColorCustom transition hover:bg-background"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-borderColorCustom bg-white">
                                            <Package size={18} className="text-textSecondary" />
                                        </div>
                                        <div className="font-medium text-textPrimary">
                                            {product.name}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-textSecondary">
                                    {product.productCode}
                                </td>

                                <td className="px-6 py-4 text-textSecondary">
                                    {"brand" in product && product.brand?.name
                                        ? product.brand.name
                                        : "-"}
                                </td>

                                <td className="px-6 py-4 text-textSecondary">
                                    {"category" in product && product.category?.name
                                        ? product.category.name
                                        : "-"}
                                </td>

                                <td className="px-6 py-4 text-textSecondary">
                                    {totalStock}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="text-blue-600 hover:text-blue-700"
                                            aria-label={`Edit ${product.name}`}
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
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
    );
}