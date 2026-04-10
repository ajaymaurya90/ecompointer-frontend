"use client";

import { Layers3, Package } from "lucide-react";
import type { Product } from "@/modules/products/types/product";
import ProductRowActionMenu from "@/modules/products/components/ProductRowActionMenu";

interface ProductListTableProps {
    products: Product[];
    loading: boolean;
    onEdit: (product: Product) => void;
    onShowVariants: (product: Product) => void;
    onDelete: (product: Product) => void;
}

function formatCurrency(value?: number) {
    return `₹${Number(value ?? 0).toFixed(2)}`;
}

function resolveMediaUrl(url?: string | null) {
    if (!url) return null;
    if (url.startsWith("http")) return url;

    const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

    return `${apiBase}${url}`;
}

function formatCreatedDate(value?: string) {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getThumbnailUrl(product: Product) {
    return resolveMediaUrl(product.media?.[0]?.url);
}

/* ✅ FIXED */
function getStockToneClasses(stock: number) {
    if (stock <= 0) {
        return "bg-dangerSoft text-danger";
    }

    if (stock <= 5) {
        return "bg-warningSoft text-warning";
    }

    return "bg-successSoft text-success";
}

/* ✅ FIXED */
function getProductStatusDotClass(isActive?: boolean | null) {
    return isActive === false
        ? "bg-textMuted"
        : "bg-success";
}

export default function ProductListTable({
    products,
    loading,
    onEdit,
    onShowVariants,
    onDelete,
}: ProductListTableProps) {
    if (loading) {
        return (
            <div className="bg-card px-6 py-8 text-sm text-textSecondary">
                Loading products...
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="bg-card px-6 py-12 text-center">
                <h3 className="text-lg font-medium text-textPrimary">
                    No products found
                </h3>
                <p className="mt-2 text-sm text-textSecondary">
                    Try adjusting your search or filters.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-card">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1120px] table-fixed border-collapse text-left">

                    {/* HEADER */}
                    <thead className="bg-tableHeader border-b border-borderSoft">
                        <tr>
                            <th className="w-[35%] px-4 py-2 text-sm font-semibold text-textPrimary">
                                Product Name
                            </th>
                            <th className="w-[15%] px-2 py-2 text-sm font-semibold text-textPrimary">
                                Product Code
                            </th>
                            <th className="w-[10%] px-2 py-2 text-sm font-semibold text-textPrimary">
                                Category
                            </th>
                            <th className="w-[10%] px-2 py-2 text-sm font-semibold text-textPrimary">
                                Brand
                            </th>
                            <th className="w-[7%] px-2 py-2 text-sm font-semibold text-textPrimary">
                                Price
                            </th>
                            <th className="w-[7%] px-2 py-2 text-sm font-semibold text-textPrimary">
                                Stock
                            </th>
                            <th className="w-[12%] px-2 py-2 text-sm font-semibold text-textPrimary">
                                Created at
                            </th>
                            <th className="w-[4%]w-[64px] px-2 py-2 text-right" />
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {products.map((product) => {
                            const variantCount =
                                product.variantCount ??
                                product.variants?.length ??
                                0;

                            const hasVariants = variantCount > 0;
                            const stock =
                                product.totalStock ?? product.stock ?? 0;

                            const thumbnailUrl =
                                getThumbnailUrl(product);

                            return (
                                <tr
                                    key={product.id}
                                    className="group transition-colors duration-150 hover:bg-tableRowHover"
                                >
                                    <td className="text-sm w-[35%] px-4 py-1">
                                        <div className="flex items-center gap-3">

                                            {/* STATUS DOT */}
                                            <span
                                                className={`h-2.5 w-2.5 rounded-full ${getProductStatusDotClass(
                                                    product.isActive
                                                )}`}
                                            />

                                            {/* IMAGE */}
                                            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-cardMuted">
                                                {thumbnailUrl ? (
                                                    <img
                                                        src={thumbnailUrl}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <Package
                                                        size={18}
                                                        className="text-textSecondary"
                                                    />
                                                )}
                                            </div>

                                            {/* NAME */}
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                {hasVariants && (
                                                    <Layers3
                                                        size={14}
                                                        className="text-info"
                                                    />
                                                )}

                                                <span className="truncate font-medium text-textPrimary">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2 py-1 text-sm text-textSecondary">
                                        {product.productCode}
                                    </td>

                                    <td className="px-2 py-1 text-sm text-textSecondary">
                                        {product.category?.name || "-"}
                                    </td>

                                    <td className="px-2 py-1 text-sm text-textSecondary">
                                        {product.brand?.name || "Generic"}
                                    </td>

                                    <td className="px-2 py-1 text-sm font-medium text-textPrimary">
                                        {formatCurrency(product.retailGrossPrice)}
                                    </td>

                                    {/* STOCK BADGE */}
                                    <td className="px-2 py-1">
                                        <span
                                            className={`inline-flex min-w-[56px] items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${getStockToneClasses(
                                                stock
                                            )}`}
                                        >
                                            {stock}
                                        </span>
                                    </td>

                                    <td className="w-32.5 px-2 py-1 text-sm text-textSecondary">
                                        {formatCreatedDate(product.createdAt)}
                                    </td>

                                    <td className="px-2 py-1 text-right">
                                        <ProductRowActionMenu
                                            onEdit={() => onEdit(product)}
                                            onDuplicate={() =>
                                                alert("Coming soon")
                                            }
                                            onShowVariants={() =>
                                                onShowVariants(product)
                                            }
                                            onDelete={() =>
                                                onDelete(product)
                                            }
                                        />
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