"use client";

import { useEffect, useState } from "react";
import {
    deleteProductVariant,
    getProductVariantSummary,
    getProductVariants,
    type ProductVariant,
    type ProductVariantSummary,
} from "@/modules/products/api/productVariantApi";
import VariantGeneratorModal from "@/modules/products/components/VariantGeneratorModal";
import { Pencil, Trash2, Plus, WandSparkles } from "lucide-react";
import Button from "@/components/ui/Button";

interface ProductVariantsTabProps {
    productId: string;
    onAddVariant: () => void;
    onEditVariant: (variant: ProductVariant) => void;
    defaultValues: {
        taxRate: number;
        costPrice: number;
        wholesaleNet: number;
        retailNet: number;
        stock?: number;
        isActive?: boolean;
    };
}

function getAttributeSummary(variant: ProductVariant): string {
    const attributeValues = (variant as any).attributeValues as
        | Array<{
            attributeValue: {
                value: string;
                attribute: {
                    name: string;
                };
            };
        }>
        | undefined;

    if (!attributeValues?.length) {
        const fallback = [variant.size, variant.color].filter(Boolean);
        return fallback.length ? fallback.join(" / ") : "-";
    }

    return attributeValues
        .map(
            (item) =>
                `${item.attributeValue.attribute.name}: ${item.attributeValue.value}`
        )
        .join(" / ");
}

function formatMoney(value?: number) {
    return `₹${Number(value ?? 0).toFixed(2)}`;
}

export default function ProductVariantsTab({
    productId,
    onAddVariant,
    onEditVariant,
    defaultValues,
}: ProductVariantsTabProps) {
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [summary, setSummary] = useState<ProductVariantSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [showGenerator, setShowGenerator] = useState(false);

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
        void loadData();
    }, [productId]);

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

    return (
        <div className="space-y-6">
            {showGenerator ? (
                <VariantGeneratorModal
                    productId={productId}
                    defaultValues={defaultValues}
                    onClose={() => setShowGenerator(false)}
                    onGenerated={loadData}
                />
            ) : null}

            <div className="overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm">
                <div className="table-header px-6 py-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h4 className="text-lg font-semibold text-textPrimary">
                                Variant Overview
                            </h4>
                            <p className="mt-1 text-sm text-textSecondary">
                                Manage generated and manual variants for this product.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                variant="secondary"
                                leftIcon={<WandSparkles size={16} />}
                                onClick={() => setShowGenerator(true)}
                            >
                                Generate Variants
                            </Button>

                            <Button
                                variant="primary"
                                leftIcon={<Plus size={16} />}
                                onClick={onAddVariant}
                            >
                                Add Variant
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 px-6 py-6 md:grid-cols-3">
                    <div className="rounded-2xl bg-cardMuted p-4 ring-1 ring-borderSoft">
                        <div className="text-sm text-textSecondary">Total Variants</div>
                        <div className="mt-2 text-2xl font-semibold text-textPrimary">
                            {summary?.totalVariants ?? 0}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-cardMuted p-4 ring-1 ring-borderSoft">
                        <div className="text-sm text-textSecondary">Total Stock</div>
                        <div className="mt-2 text-2xl font-semibold text-textPrimary">
                            {summary?.totalStock ?? 0}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-cardMuted p-4 ring-1 ring-borderSoft">
                        <div className="text-sm text-textSecondary">Price Range</div>
                        <div className="mt-2 text-2xl font-semibold text-textPrimary">
                            {summary
                                ? `${formatMoney(summary.priceRange.min)} - ${formatMoney(
                                    summary.priceRange.max
                                )}`
                                : `${formatMoney(0)} - ${formatMoney(0)}`}
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm">
                <div className="table-header px-6 py-4">
                    <h4 className="text-lg font-semibold text-textPrimary">Variants</h4>
                </div>

                {loading ? (
                    <div className="p-6 text-textSecondary">Loading variants...</div>
                ) : variants.length === 0 ? (
                    <div className="p-10 text-center">
                        <h5 className="text-lg font-medium text-textPrimary">
                            No variants yet
                        </h5>
                        <p className="mt-2 text-textSecondary">
                            Add your first variant or generate combinations automatically.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
                            <thead className="table-header shadow-[inset_0_-1px_0_var(--border-soft)]">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-textPrimary">
                                        SKU
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-textPrimary">
                                        Attributes
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-textPrimary">
                                        Retail Gross
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-textPrimary">
                                        Wholesale Gross
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-textPrimary">
                                        Stock
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-textPrimary">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-textPrimary">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {variants.map((variant) => (
                                    <tr key={variant.id} className="table-row">
                                        <td className="px-6 py-4 text-sm font-medium text-textPrimary">
                                            {variant.sku}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-textSecondary">
                                            {getAttributeSummary(variant)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-textSecondary">
                                            {formatMoney(variant.retailGross)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-textSecondary">
                                            {formatMoney(variant.wholesaleGross)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-textSecondary">
                                            {variant.stock}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${variant.isActive
                                                        ? "bg-successSoft text-success"
                                                        : "bg-cardMuted text-textSecondary"
                                                    }`}
                                            >
                                                {variant.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onEditVariant(variant)}
                                                    className="interactive-button inline-flex h-9 w-9 items-center justify-center rounded-xl text-info hover:bg-infoSoft"
                                                    aria-label={`Edit ${variant.sku}`}
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => void handleDelete(variant)}
                                                    className="interactive-button inline-flex h-9 w-9 items-center justify-center rounded-xl text-danger hover:bg-dangerSoft"
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
                    </div>
                )}
            </div>
        </div>
    );
}