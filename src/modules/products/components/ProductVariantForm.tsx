"use client";

import { useEffect, useMemo, useState } from "react";
import type {
    ProductVariant,
    ProductVariantFormData,
} from "@/modules/products/api/productVariantApi";
import FieldTooltip from "@/components/ui/FieldTooltip";
import { RotateCcw } from "lucide-react";

interface ProductVariantFormProps {
    variant?: ProductVariant | null;
    defaultValues?: {
        taxRate: number;
        costPrice: number;
        wholesaleNet: number;
        retailNet: number;
    };
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

type CommercialField =
    | "taxRate"
    | "costPrice"
    | "wholesaleNet"
    | "retailNet";

function formatNumber(value: number) {
    return Number(value || 0).toFixed(2);
}

export default function ProductVariantForm({
    variant,
    defaultValues,
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
            return;
        }

        setForm({
            ...emptyForm,
            taxRate: defaultValues?.taxRate ?? emptyForm.taxRate,
            costPrice: defaultValues?.costPrice ?? emptyForm.costPrice,
            wholesaleNet: defaultValues?.wholesaleNet ?? emptyForm.wholesaleNet,
            retailNet: defaultValues?.retailNet ?? emptyForm.retailNet,
        });
    }, [variant, defaultValues]);

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

    const productWholesaleGross = useMemo(() => {
        return Number(
            (
                (defaultValues?.wholesaleNet ?? 0) +
                ((defaultValues?.wholesaleNet ?? 0) * (defaultValues?.taxRate ?? 0)) / 100
            ).toFixed(2)
        );
    }, [defaultValues]);

    const productRetailGross = useMemo(() => {
        return Number(
            (
                (defaultValues?.retailNet ?? 0) +
                ((defaultValues?.retailNet ?? 0) * (defaultValues?.taxRate ?? 0)) / 100
            ).toFixed(2)
        );
    }, [defaultValues]);

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

    const isUsingProductDefault = (field: CommercialField) => {
        if (!defaultValues) {
            return false;
        }

        return form[field] === defaultValues[field];
    };

    const resetToProductDefault = (field: CommercialField) => {
        if (!defaultValues) {
            return;
        }

        setForm((prev) => ({
            ...prev,
            [field]: defaultValues[field],
        }));
    };

    const renderCommercialFieldHeader = (
        label: string,
        field: CommercialField,
        tooltip: string
    ) => {
        const inherited = isUsingProductDefault(field);

        return (
            <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-textPrimary">{label}</span>
                    <FieldTooltip text={tooltip} />
                </div>

                <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${inherited
                        ? "bg-slate-100 text-slate-600"
                        : "bg-blue-100 text-blue-700"
                        }`}
                >
                    {inherited ? "Same as product" : "Overridden"}
                </span>
            </div>
        );
    };

    const renderDefaultHint = (field: CommercialField, value: number) => {
        const inherited = isUsingProductDefault(field);

        return (
            <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                <span className={inherited ? "text-slate-500" : "text-blue-700"}>
                    Product default: {formatNumber(value)}
                </span>

                {!inherited ? (
                    <button
                        type="button"
                        onClick={() => resetToProductDefault(field)}
                        className="inline-flex items-center gap-1 text-slate-600 transition hover:text-textPrimary"
                    >
                        <RotateCcw size={12} />
                        Reset
                    </button>
                ) : null}
            </div>
        );
    };

    return (
        <div className="rounded-2xl border border-borderColorCustom bg-white">
            <div className="border-b border-borderColorCustom px-6 py-4">
                <h4 className="text-lg font-semibold text-textPrimary">
                    {variant ? "Edit Variant" : "Add Variant"}
                </h4>
                <p className="mt-1 text-sm text-textSecondary">
                    {variant
                        ? "Compare this variant against the product defaults and override only where needed."
                        : "New variants start from product defaults and can be adjusted here."}
                </p>
            </div>

            <div className="space-y-8 px-6 py-6">
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

                <div className="rounded-2xl border border-borderColorCustom bg-background/40 p-5">
                    <div className="mb-4">
                        <h5 className="text-base font-semibold text-textPrimary">
                            Commercial Values
                        </h5>
                        <p className="mt-1 text-sm text-textSecondary">
                            Product defaults are shown below each field. When the value differs,
                            this variant is treated as overridden.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div>
                            {renderCommercialFieldHeader(
                                "Tax Rate %",
                                "taxRate",
                                "Default tax rate comes from the parent product. Change only if this variant truly differs."
                            )}
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.taxRate}
                                onChange={(e) => handleNumberChange("taxRate", e.target.value)}
                                className={`w-full rounded-lg border bg-white px-3 py-2 outline-none focus:border-primary ${isUsingProductDefault("taxRate")
                                    ? "border-borderColorCustom text-textSecondary"
                                    : "border-blue-300 text-textPrimary"
                                    }`}
                            />
                            {renderDefaultHint("taxRate", defaultValues?.taxRate ?? 0)}
                        </div>

                        <div>
                            {renderCommercialFieldHeader(
                                "Cost Price",
                                "costPrice",
                                "Parent product default cost price for this variant."
                            )}
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.costPrice}
                                onChange={(e) => handleNumberChange("costPrice", e.target.value)}
                                className={`w-full rounded-lg border bg-white px-3 py-2 outline-none focus:border-primary ${isUsingProductDefault("costPrice")
                                    ? "border-borderColorCustom text-textSecondary"
                                    : "border-blue-300 text-textPrimary"
                                    }`}
                            />
                            {renderDefaultHint("costPrice", defaultValues?.costPrice ?? 0)}
                        </div>

                        <div>
                            {renderCommercialFieldHeader(
                                "Wholesale Net",
                                "wholesaleNet",
                                "Parent product default wholesale net price."
                            )}
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.wholesaleNet}
                                onChange={(e) =>
                                    handleNumberChange("wholesaleNet", e.target.value)
                                }
                                className={`w-full rounded-lg border bg-white px-3 py-2 outline-none focus:border-primary ${isUsingProductDefault("wholesaleNet")
                                    ? "border-borderColorCustom text-textSecondary"
                                    : "border-blue-300 text-textPrimary"
                                    }`}
                            />
                            {renderDefaultHint(
                                "wholesaleNet",
                                defaultValues?.wholesaleNet ?? 0
                            )}
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-textPrimary">
                                    Wholesale Gross
                                </span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${isUsingProductDefault("wholesaleNet") &&
                                        isUsingProductDefault("taxRate")
                                        ? "bg-slate-100 text-slate-600"
                                        : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {isUsingProductDefault("wholesaleNet") &&
                                        isUsingProductDefault("taxRate")
                                        ? "Same as product"
                                        : "Overridden"}
                                </span>
                            </div>
                            <div className="rounded-lg border border-borderColorCustom bg-white px-3 py-2 text-textSecondary">
                                {formatNumber(wholesaleGross)}
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                                Product default: {formatNumber(productWholesaleGross)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div>
                            {renderCommercialFieldHeader(
                                "Retail Net",
                                "retailNet",
                                "Parent product default retail net price."
                            )}
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.retailNet}
                                onChange={(e) =>
                                    handleNumberChange("retailNet", e.target.value)
                                }
                                className={`w-full rounded-lg border bg-white px-3 py-2 outline-none focus:border-primary ${isUsingProductDefault("retailNet")
                                    ? "border-borderColorCustom text-textSecondary"
                                    : "border-blue-300 text-textPrimary"
                                    }`}
                            />
                            {renderDefaultHint("retailNet", defaultValues?.retailNet ?? 0)}
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-textPrimary">
                                    Retail Gross
                                </span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${isUsingProductDefault("retailNet") &&
                                        isUsingProductDefault("taxRate")
                                        ? "bg-slate-100 text-slate-600"
                                        : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {isUsingProductDefault("retailNet") &&
                                        isUsingProductDefault("taxRate")
                                        ? "Same as product"
                                        : "Overridden"}
                                </span>
                            </div>
                            <div className="rounded-lg border border-borderColorCustom bg-white px-3 py-2 text-textSecondary">
                                {formatNumber(retailGross)}
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                                Product default: {formatNumber(productRetailGross)}
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
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-borderColorCustom px-6 py-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-borderColorCustom px-4 py-2 transition hover:bg-background"
                >
                    Cancel
                </button>

                <button
                    type="button"
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