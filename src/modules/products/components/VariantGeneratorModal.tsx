"use client";

import { useEffect, useMemo, useState } from "react";
import {
    generateProductVariants,
    type GenerateProductVariantsPayload,
} from "@/modules/products/api/productVariantGeneratorApi";
import { Plus, Trash2, X } from "lucide-react";

interface VariantGeneratorModalProps {
    productId: string;
    defaultValues: {
        taxRate: number;
        costPrice: number;
        wholesaleNet: number;
        retailNet: number;
        stock?: number;
        isActive?: boolean;
    };
    onClose: () => void;
    onGenerated: () => Promise<void> | void;
}

interface AttributeRow {
    id: string;
    name: string;
    values: string;
}

const createAttributeRow = (): AttributeRow => ({
    id: Math.random().toString(36).slice(2),
    name: "",
    values: "",
});

export default function VariantGeneratorModal({
    productId,
    defaultValues,
    onClose,
    onGenerated,
}: VariantGeneratorModalProps) {
    const [attributes, setAttributes] = useState<AttributeRow[]>([
        createAttributeRow(),
        createAttributeRow(),
    ]);

    const [taxRate, setTaxRate] = useState(defaultValues.taxRate ?? 18);
    const [costPrice, setCostPrice] = useState(defaultValues.costPrice ?? 0);
    const [wholesaleNet, setWholesaleNet] = useState(defaultValues.wholesaleNet ?? 0);
    const [retailNet, setRetailNet] = useState(defaultValues.retailNet ?? 0);
    const [stock, setStock] = useState(defaultValues.stock ?? 0);
    const [isActive, setIsActive] = useState(defaultValues.isActive ?? true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setTaxRate(defaultValues.taxRate ?? 18);
        setCostPrice(defaultValues.costPrice ?? 0);
        setWholesaleNet(defaultValues.wholesaleNet ?? 0);
        setRetailNet(defaultValues.retailNet ?? 0);
        setStock(defaultValues.stock ?? 0);
        setIsActive(defaultValues.isActive ?? true);
    }, [defaultValues]);

    const parsedAttributes = useMemo(() => {
        return attributes
            .map((attribute) => ({
                name: attribute.name.trim(),
                values: attribute.values
                    .split(",")
                    .map((value) => value.trim())
                    .filter(Boolean),
            }))
            .filter(
                (attribute) =>
                    attribute.name.length > 0 && attribute.values.length > 0
            );
    }, [attributes]);

    const totalCombinations = useMemo(() => {
        if (!parsedAttributes.length) {
            return 0;
        }

        return parsedAttributes.reduce((acc, attribute) => {
            return acc * attribute.values.length;
        }, 1);
    }, [parsedAttributes]);

    const previewCombinations = useMemo(() => {
        if (!parsedAttributes.length || totalCombinations === 0) {
            return [];
        }

        const build = (index: number, current: string[]): string[] => {
            if (index === parsedAttributes.length) {
                return [current.join(" / ")];
            }

            const attribute = parsedAttributes[index];
            const result: string[] = [];

            for (const value of attribute.values) {
                result.push(...build(index + 1, [...current, value]));
            }

            return result;
        };

        return build(0, []).slice(0, 12);
    }, [parsedAttributes, totalCombinations]);

    const updateAttribute = (
        id: string,
        field: "name" | "values",
        value: string
    ) => {
        setAttributes((prev) =>
            prev.map((attribute) =>
                attribute.id === id ? { ...attribute, [field]: value } : attribute
            )
        );
    };

    const addAttribute = () => {
        setAttributes((prev) => [...prev, createAttributeRow()]);
    };

    const removeAttribute = (id: string) => {
        setAttributes((prev) => prev.filter((attribute) => attribute.id !== id));
    };

    const handleSubmit = async () => {
        if (!parsedAttributes.length) {
            alert("Please add at least one valid attribute with values.");
            return;
        }

        if (totalCombinations === 0) {
            alert("No valid combinations found.");
            return;
        }

        const payload: GenerateProductVariantsPayload = {
            attributes: parsedAttributes,
            taxRate,
            costPrice,
            wholesaleNet,
            retailNet,
            stock,
            isActive,
        };

        setSubmitting(true);

        try {
            const result = await generateProductVariants(productId, payload);

            const messageParts = [`${result.createdCount} variant(s) created`];

            if (result.skippedCount > 0) {
                messageParts.push(`${result.skippedCount} skipped`);
            }

            alert(messageParts.join(", "));

            await onGenerated();
            onClose();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to generate variants");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-borderColorCustom px-6 py-4">
                    <div>
                        <h3 className="text-xl font-semibold text-textPrimary">
                            Generate Variants
                        </h3>
                        <p className="mt-1 text-sm text-textSecondary">
                            Create multiple variant combinations from attributes.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-textSecondary transition hover:bg-background"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-borderColorCustom bg-white">
                            <div className="border-b border-borderColorCustom px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-semibold text-textPrimary">
                                        Attributes
                                    </h4>

                                    <button
                                        onClick={addAttribute}
                                        className="inline-flex items-center gap-2 rounded-lg border border-borderColorCustom px-3 py-2 text-sm transition hover:bg-background"
                                    >
                                        <Plus size={16} />
                                        Add Attribute
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 px-6 py-6">
                                {attributes.map((attribute, index) => (
                                    <div
                                        key={attribute.id}
                                        className="rounded-xl border border-borderColorCustom bg-background p-4"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="text-sm font-medium text-textPrimary">
                                                Attribute {index + 1}
                                            </div>

                                            {attributes.length > 1 && (
                                                <button
                                                    onClick={() => removeAttribute(attribute.id)}
                                                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-textPrimary">
                                                    Attribute Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={attribute.name}
                                                    onChange={(e) =>
                                                        updateAttribute(
                                                            attribute.id,
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g. Size, Color, Fabric"
                                                    className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-textPrimary">
                                                    Values
                                                </label>
                                                <input
                                                    type="text"
                                                    value={attribute.values}
                                                    onChange={(e) =>
                                                        updateAttribute(
                                                            attribute.id,
                                                            "values",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g. S, M, L"
                                                    className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                                                />
                                                <p className="mt-2 text-xs text-textSecondary">
                                                    Separate values with commas.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-borderColorCustom bg-white">
                            <div className="border-b border-borderColorCustom px-6 py-4">
                                <h4 className="text-lg font-semibold text-textPrimary">
                                    Shared Defaults
                                </h4>
                                <p className="mt-1 text-sm text-textSecondary">
                                    These values are prefilled from the parent product and will be
                                    applied to all generated variants.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                                        Tax Rate %
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
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
                                        value={costPrice}
                                        onChange={(e) => setCostPrice(Number(e.target.value) || 0)}
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
                                        value={wholesaleNet}
                                        onChange={(e) =>
                                            setWholesaleNet(Number(e.target.value) || 0)
                                        }
                                        className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                                        Retail Net
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={retailNet}
                                        onChange={(e) =>
                                            setRetailNet(Number(e.target.value) || 0)
                                        }
                                        className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={stock}
                                        onChange={(e) => setStock(Number(e.target.value) || 0)}
                                        className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                                        Status
                                    </label>
                                    <select
                                        value={isActive ? "ACTIVE" : "INACTIVE"}
                                        onChange={(e) => setIsActive(e.target.value === "ACTIVE")}
                                        className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-borderColorCustom bg-white">
                            <div className="border-b border-borderColorCustom px-6 py-4">
                                <h4 className="text-lg font-semibold text-textPrimary">
                                    Preview
                                </h4>
                            </div>

                            <div className="space-y-4 px-6 py-6">
                                <div className="rounded-xl border border-borderColorCustom bg-background p-4">
                                    <div className="text-sm text-textSecondary">
                                        Total combinations
                                    </div>
                                    <div className="mt-2 text-3xl font-semibold text-textPrimary">
                                        {totalCombinations}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-3 text-sm font-medium text-textPrimary">
                                        Sample combinations
                                    </div>

                                    {previewCombinations.length === 0 ? (
                                        <div className="rounded-xl border border-borderColorCustom bg-background p-4 text-sm text-textSecondary">
                                            Add valid attributes and values to preview combinations.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {previewCombinations.map((item, index) => (
                                                <div
                                                    key={`${item}-${index}`}
                                                    className="rounded-lg border border-borderColorCustom bg-background px-3 py-2 text-sm text-textPrimary"
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="rounded-lg border border-borderColorCustom px-4 py-2 transition hover:bg-background"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? "Generating..." : "Generate Variants"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}