"use client";

import { useEffect, useState } from "react";
import {
    deleteProductVariant,
    getProductVariants,
    type ProductVariant,
} from "@/modules/products/api/productVariantApi";
import VariantGeneratorModal from "@/modules/products/components/VariantGeneratorModal";
import { Pencil, Trash2, Plus, WandSparkles, Boxes } from "lucide-react";
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
    const [loading, setLoading] = useState(true);
    const [showGenerator, setShowGenerator] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const variantData = await getProductVariants(productId);
            setVariants(variantData);
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

            <div className="overflow-hidden rounded-[28px] border border-borderSoft bg-card shadow-sm">
                <div className="table-header px-6 py-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card ring-1 ring-borderSoft">
                                <Boxes size={20} className="text-textSecondary" />
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-textPrimary">
                                    Variants ({variants.length})
                                </h4>
                                <p className="mt-1 text-sm text-textSecondary">
                                    Manage all generated and manually created variants for this product.
                                </p>
                            </div>
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

                {loading ? (
                    <div className="p-6 text-textSecondary">Loading variants...</div>
                ) : variants.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cardMuted ring-1 ring-borderSoft">
                            <Boxes size={24} className="text-textSecondary" />
                        </div>
                        <h5 className="mt-4 text-lg font-medium text-textPrimary">
                            No variants yet
                        </h5>
                        <p className="mx-auto mt-2 max-w-md text-textSecondary">
                            Add your first variant manually or generate combinations automatically.
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <Button
                                variant="secondary"
                                leftIcon={<WandSparkles size={16} />}
                                onClick={() => setShowGenerator(true)}
                            >
                                Generate
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
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
                            <thead className="table-header shadow-[inset_0_-1px_0_var(--border-soft)]">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-textSecondary">
                                        SKU
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-textSecondary">
                                        Attributes
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-textSecondary">
                                        Retail Gross
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-textSecondary">
                                        Wholesale Gross
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-textSecondary">
                                        Stock
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-textSecondary">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-textSecondary">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {variants.map((variant) => (
                                    <tr
                                        key={variant.id}
                                        className="border-b border-borderSoft/70 transition hover:bg-cardMuted/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-textPrimary">
                                                {variant.sku}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-textSecondary">
                                            {getAttributeSummary(variant)}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium text-textPrimary">
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
                                                    className="interactive-button inline-flex h-10 w-10 items-center justify-center rounded-xl text-info hover:bg-infoSoft"
                                                    aria-label={`Edit ${variant.sku}`}
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => void handleDelete(variant)}
                                                    className="interactive-button inline-flex h-10 w-10 items-center justify-center rounded-xl text-danger hover:bg-dangerSoft"
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