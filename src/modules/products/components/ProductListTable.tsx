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
    if (url.startsWith("http://") || url.startsWith("https://")) return url;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
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
    const directMedia = product.media?.[0]?.url;
    return resolveMediaUrl(directMedia);
}

function getStockToneClasses(stock: number) {
    if (stock <= 0) {
        return "dangerSoft text-danger";
    }

    if (stock <= 5) {
        return "warningSoft text-warning";
    }

    return "successSoft text-success";
}

function getProductStatusDotClass(isActive?: boolean | null) {
    return isActive === false ? "textMuted" : "success";
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
                    <thead className="table-header shadow-[inset_0_-1px_0_var(--border-soft)]">
                        <tr>
                            <th className="w-[35%] px-5 py-4 text-sm font-semibold text-textPrimary">
                                Product Name
                            </th>
                            <th className="px-3 py-4 text-sm font-semibold text-textPrimary">
                                Product Code
                            </th>
                            <th className="px-3 py-4 text-sm font-semibold text-textPrimary">
                                Category
                            </th>
                            <th className="px-3 py-4 text-sm font-semibold text-textPrimary">
                                Brand
                            </th>
                            <th className="w-[90px] px-3 py-4 text-sm font-semibold text-textPrimary">
                                Price
                            </th>
                            <th className="w-[100px] px-3 py-4 text-sm font-semibold text-textPrimary">
                                Stock
                            </th>
                            <th className="px-3 py-4 text-sm font-semibold text-textPrimary">
                                Created
                            </th>
                            <th className="w-[64px] px-3 py-4 text-right" />
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product, index) => {
                            const variantCount =
                                typeof product.variantCount === "number"
                                    ? product.variantCount
                                    : product.variants?.length || 0;

                            const hasVariants = variantCount > 0;
                            const stock = product.totalStock ?? product.stock ?? 0;
                            const thumbnailUrl = getThumbnailUrl(product);

                            return (
                                <tr
                                    key={product.id}
                                    className={`group transition-all duration-150 table-row`}
                                >
                                    <td className="w-[35%] text-sm">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span
                                                className={`h-2.5 w-2.5 shrink-0 rounded-full ${getProductStatusDotClass(
                                                    product.isActive
                                                )}`}
                                            />

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cardMuted">
                                                {thumbnailUrl ? (
                                                    <img
                                                        src={thumbnailUrl}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <Package
                                                        size={18}
                                                        className="text-textSecondary"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1 overflow-hidden">
                                                <div className="flex min-w-0 items-center gap-2 overflow-hidden">
                                                    {hasVariants ? (
                                                        <Layers3
                                                            size={14}
                                                            className="shrink-0 text-info"
                                                        />
                                                    ) : null}

                                                    <div className="relative min-w-0 flex-1 overflow-hidden">
                                                        <div className="product-name-marquee whitespace-nowrap font-medium text-textPrimary">
                                                            {product.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className=" text-sm text-textSecondary">
                                        {product.productCode}
                                    </td>

                                    <td className=" text-sm text-textSecondary">
                                        {product.category?.name || "-"}
                                    </td>

                                    <td className="text-sm text-textSecondary">
                                        {product.brand?.name || "Generic"}
                                    </td>

                                    <td className="w-[90px] text-sm font-medium text-textPrimary">
                                        {formatCurrency(product.retailGrossPrice)}
                                    </td>

                                    <td className="w-[100px]">
                                        <span
                                            className={`inline-flex min-w-[56px] items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${getStockToneClasses(
                                                stock
                                            )}`}
                                        >
                                            {stock}
                                        </span>
                                    </td>

                                    <td className="text-sm text-textSecondary">
                                        {formatCreatedDate(product.createdAt)}
                                    </td>

                                    <td className="text-right">
                                        <ProductRowActionMenu
                                            onEdit={() => onEdit(product)}
                                            onDuplicate={() =>
                                                alert(
                                                    `Duplicate flow for "${product.name}" comes next`
                                                )
                                            }
                                            onShowVariants={() => onShowVariants(product)}
                                            onDelete={() => onDelete(product)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .product-name-marquee {
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .group:hover .product-name-marquee {
                    display: inline-block;
                    overflow: visible;
                    text-overflow: clip;
                    padding-right: 32px;
                    animation: product-name-marquee 8s linear forwards;
                }

                @keyframes product-name-marquee {
                    0% {
                        transform: translateX(0);
                    }
                    15% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-55%);
                    }
                }
            `}</style>
        </div>
    );
}