"use client";

import { useEffect, useState } from "react";
import {
    createProductVariant,
    deleteProductVariant,
    getProductVariantSummary,
    getProductVariants,
    updateProductVariant,
    type ProductVariant,
    type ProductVariantFormData,
    type ProductVariantSummary,
} from "@/modules/products/api/productVariantApi";
import ProductVariantForm from "@/modules/products/components/ProductVariantForm";
import { Pencil, Trash2, Plus } from "lucide-react";

interface ProductVariantsTabProps {
    productId: string;
}

export default function ProductVariantsTab({
    productId,
}: ProductVariantsTabProps) {
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [summary, setSummary] = useState<ProductVariantSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);

            const [variantData, summaryData] = await Promise.all([
                getProductVariants(productId),
                getProductVariantSummary(productId),
            ]);

            setVariants(variantData);
            setSummary(summaryData);
        } catch (error) {
            console.error(error);
            alert("Failed to load variants");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [productId]);

    const handleAdd = () => {
        setEditingVariant(null);
        setShowForm(true);
    };

    const handleEdit = (variant: ProductVariant) => {
        setEditingVariant(variant);
        setShowForm(true);
    };

    const handleDelete = async (variant: ProductVariant) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete variant "${variant.sku}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteProductVariant(productId, variant.id);
            await loadData();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to delete variant");
        }
    };

    const handleSubmit = async (data: ProductVariantFormData) => {
        setSubmitting(true);

        try {
            if (editingVariant) {
                await updateProductVariant(productId, editingVariant.id, data);
            } else {
                await createProductVariant(productId, data);
            }

            setShowForm(false);
            setEditingVariant(null);
            await loadData();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to save variant");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingVariant(null);
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-borderColorCustom bg-white">
                <div className="border-b border-borderColorCustom px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-textPrimary">
                            Variant Overview
                        </h4>

                        <button
                            onClick={handleAdd}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Add Variant
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 px-6 py-6 md:grid-cols-3">
                    <div className="rounded-xl border border-borderColorCustom bg-background p-4">
                        <div className="text-sm text-textSecondary">Total Variants</div>
                        <div className="mt-2 text-2xl font-semibold text-textPrimary">
                            {summary?.totalVariants ?? 0}
                        </div>
                    </div>

                    <div className="rounded-xl border border-borderColorCustom bg-background p-4">
                        <div className="text-sm text-textSecondary">Total Stock</div>
                        <div className="mt-2 text-2xl font-semibold text-textPrimary">
                            {summary?.totalStock ?? 0}
                        </div>
                    </div>

                    <div className="rounded-xl border border-borderColorCustom bg-background p-4">
                        <div className="text-sm text-textSecondary">Price Range</div>
                        <div className="mt-2 text-2xl font-semibold text-textPrimary">
                            {summary
                                ? `${summary.priceRange.min} - ${summary.priceRange.max}`
                                : "0 - 0"}
                        </div>
                    </div>
                </div>
            </div>

            {showForm && (
                <ProductVariantForm
                    variant={editingVariant}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    submitting={submitting}
                />
            )}

            <div className="overflow-hidden rounded-2xl border border-borderColorCustom bg-white">
                <div className="border-b border-borderColorCustom px-6 py-4">
                    <h4 className="text-lg font-semibold text-textPrimary">
                        Variants
                    </h4>
                </div>

                {loading ? (
                    <div className="p-6 text-textSecondary">Loading variants...</div>
                ) : variants.length === 0 ? (
                    <div className="p-10 text-center">
                        <h5 className="text-lg font-medium text-textPrimary">
                            No variants yet
                        </h5>
                        <p className="mt-2 text-textSecondary">
                            Add your first variant to manage size, color, pricing and stock.
                        </p>
                    </div>
                ) : (
                    <table className="w-full border-collapse text-left">
                        <thead className="border-b border-borderColorCustom bg-background">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-textPrimary">SKU</th>
                                <th className="px-6 py-4 font-semibold text-textPrimary">Size</th>
                                <th className="px-6 py-4 font-semibold text-textPrimary">Color</th>
                                <th className="px-6 py-4 font-semibold text-textPrimary">Retail Gross</th>
                                <th className="px-6 py-4 font-semibold text-textPrimary">Wholesale Gross</th>
                                <th className="px-6 py-4 font-semibold text-textPrimary">Stock</th>
                                <th className="px-6 py-4 font-semibold text-textPrimary">Status</th>
                                <th className="px-6 py-4 text-right font-semibold text-textPrimary">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {variants.map((variant) => (
                                <tr
                                    key={variant.id}
                                    className="border-b border-borderColorCustom transition hover:bg-background"
                                >
                                    <td className="px-6 py-4 text-textPrimary">{variant.sku}</td>
                                    <td className="px-6 py-4 text-textSecondary">{variant.size || "-"}</td>
                                    <td className="px-6 py-4 text-textSecondary">{variant.color || "-"}</td>
                                    <td className="px-6 py-4 text-textSecondary">{variant.retailGross}</td>
                                    <td className="px-6 py-4 text-textSecondary">{variant.wholesaleGross}</td>
                                    <td className="px-6 py-4 text-textSecondary">{variant.stock}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${variant.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {variant.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => handleEdit(variant)}
                                                className="text-blue-600 hover:text-blue-700"
                                                aria-label={`Edit ${variant.sku}`}
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(variant)}
                                                className="text-red-600 hover:text-red-700"
                                                aria-label={`Delete ${variant.sku}`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}