"use client";

import { useEffect, useMemo, useState } from "react";
import type {
    ProductVariant,
    ProductVariantFormData,
} from "@/modules/products/api/productVariantApi";

interface ProductVariantFormProps {
    variant?: ProductVariant | null;
    onSubmit: (data: ProductVariantFormData) => Promise<void>;
    onCancel: () => void;
    submitting?: boolean;
}

const emptyForm: ProductVariantFormData = {
    sku: "",
    size: "",
    color: "",
    taxRate: 18,
    costPrice: 0,
    wholesaleNet: 0,
    retailNet: 0,
    stock: 0,
    isActive: true,
};

export default function ProductVariantForm({
    variant,
    onSubmit,
    onCancel,
    submitting = false,
}: ProductVariantFormProps) {
    const [form, setForm] = useState<ProductVariantFormData>(emptyForm);

    useEffect(() => {
        if (variant) {
            setForm({
                sku: variant.sku || "",
                size: variant.size || "",
                color: variant.color || "",
                taxRate: variant.taxRate,
                costPrice: variant.costPrice,
                wholesaleNet: variant.wholesaleNet,
                retailNet: variant.retailNet,
                stock: variant.stock,
                isActive: variant.isActive,
            });
        } else {
            setForm(emptyForm);
        }
    }, [variant]);

    const wholesaleGross = useMemo(() => {
        return Number(
            (form.wholesaleNet + (form.wholesaleNet * form.taxRate) / 100).toFixed(2)
        );
    }, [form.wholesaleNet, form.taxRate]);

    const retailGross = useMemo(() => {
        return Number(
            (form.retailNet + (form.retailNet * form.taxRate) / 100).toFixed(2)
        );
    }, [form.retailNet, form.taxRate]);

    const handleNumberChange = (
        field: keyof ProductVariantFormData,
        value: string
    ) => {
        const parsed = value === "" ? 0 : Number(value);

        setForm((prev) => ({
            ...prev,
            [field]: Number.isNaN(parsed) ? 0 : parsed,
        }));
    };

    const handleSubmit = async () => {
        if (form.sku !== undefined && form.sku.trim() === "") {
            const payload = { ...form };
            delete payload.sku;
            await onSubmit(payload);
            return;
        }

        await onSubmit({
            ...form,
            sku: form.sku?.trim() || undefined,
            size: form.size?.trim() || undefined,
            color: form.color?.trim() || undefined,
        });
    };

    return (
        <div className="rounded-2xl border border-borderColorCustom bg-white">
            <div className="border-b border-borderColorCustom px-6 py-4">
                <h4 className="text-lg font-semibold text-textPrimary">
                    {variant ? "Edit Variant" : "Add Variant"}
                </h4>
            </div>

            <div className="space-y-6 px-6 py-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            SKU
                        </label>
                        <input
                            type="text"
                            value={form.sku || ""}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, sku: e.target.value }))
                            }
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                            placeholder="Leave empty to auto-generate"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Size
                        </label>
                        <input
                            type="text"
                            value={form.size || ""}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, size: e.target.value }))
                            }
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                            placeholder="e.g. M, L, XL"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Color
                        </label>
                        <input
                            type="text"
                            value={form.color || ""}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, color: e.target.value }))
                            }
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                            placeholder="e.g. Black"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Tax Rate %
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={form.taxRate}
                            onChange={(e) => handleNumberChange("taxRate", e.target.value)}
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Cost Price
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.costPrice}
                            onChange={(e) => handleNumberChange("costPrice", e.target.value)}
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Wholesale Net
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.wholesaleNet}
                            onChange={(e) =>
                                handleNumberChange("wholesaleNet", e.target.value)
                            }
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Wholesale Gross
                        </label>
                        <div className="rounded-lg border border-borderColorCustom bg-background px-3 py-2 text-textSecondary">
                            {wholesaleGross}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Retail Net
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.retailNet}
                            onChange={(e) =>
                                handleNumberChange("retailNet", e.target.value)
                            }
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Retail Gross
                        </label>
                        <div className="rounded-lg border border-borderColorCustom bg-background px-3 py-2 text-textSecondary">
                            {retailGross}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Stock
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={form.stock}
                            onChange={(e) => handleNumberChange("stock", e.target.value)}
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Status
                        </label>
                        <select
                            value={form.isActive ? "ACTIVE" : "INACTIVE"}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    isActive: e.target.value === "ACTIVE",
                                }))
                            }
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-borderColorCustom px-6 py-4">
                <button
                    onClick={onCancel}
                    className="rounded-lg border border-borderColorCustom px-4 py-2 transition hover:bg-background"
                >
                    Cancel
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                    {submitting ? "Saving..." : "Save Variant"}
                </button>
            </div>
        </div>
    );
}