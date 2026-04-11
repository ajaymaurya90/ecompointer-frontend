"use client";

import { useEffect, useMemo, useState } from "react";
import * as Select from "@radix-ui/react-select";
import {
    generateProductVariants,
    type GenerateProductVariantsPayload,
} from "@/modules/products/api/productVariantGeneratorApi";
import { Check, ChevronDown, Plus, Trash2, X } from "lucide-react";
import Button from "@/components/ui/Button";

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

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function TextInput({
    value,
    onChange,
    placeholder,
    type = "text",
    min,
    step,
}: {
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    min?: string | number;
    step?: string | number;
}) {
    return (
        <input
            type={type}
            min={min}
            step={step}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-12 w-full rounded-xl bg-card px-4 text-sm text-textPrimary outline-none ring-1 ring-borderSoft transition placeholder:text-textSecondary focus:ring-2 focus:ring-borderFocus/30"
        />
    );
}

function StatusSelect({
    value,
    onChange,
}: {
    value: "ACTIVE" | "INACTIVE";
    onChange: (value: "ACTIVE" | "INACTIVE") => void;
}) {
    return (
        <Select.Root value={value} onValueChange={(next) => onChange(next as "ACTIVE" | "INACTIVE")}>
            <Select.Trigger className="interactive-button flex h-12 w-full items-center justify-between rounded-xl bg-card px-4 text-left text-sm text-textPrimary ring-1 ring-borderSoft shadow-sm hover:bg-cardMuted">
                <Select.Value />
                <Select.Icon>
                    <ChevronDown size={16} className="text-textSecondary" />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content
                    sideOffset={8}
                    position="popper"
                    className="z-[9999] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-borderSoft bg-elevated shadow-md"
                >
                    <Select.Viewport className="p-1">
                        {["ACTIVE", "INACTIVE"].map((option) => (
                            <Select.Item
                                key={option}
                                value={option}
                                className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2.5 text-sm text-textPrimary outline-none transition hover:bg-cardMuted focus:bg-cardMuted data-[state=checked]:bg-cardMuted"
                            >
                                <Select.ItemText>
                                    {option === "ACTIVE" ? "Active" : "Inactive"}
                                </Select.ItemText>
                                <Select.ItemIndicator>
                                    <Check size={14} className="text-primary" />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}

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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl border border-borderSoft bg-card shadow-2xl">
                <div className="table-header flex items-center justify-between px-6 py-4">
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
                        className="interactive-button rounded-xl p-2 text-textSecondary transition hover:bg-cardMuted"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                        <div className="overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm">
                            <div className="table-header px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-semibold text-textPrimary">
                                        Attributes
                                    </h4>

                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        leftIcon={<Plus size={16} />}
                                        onClick={addAttribute}
                                    >
                                        Add Attribute
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4 px-6 py-6">
                                {attributes.map((attribute, index) => (
                                    <div
                                        key={attribute.id}
                                        className="rounded-2xl bg-cardMuted p-4 ring-1 ring-borderSoft"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="text-sm font-medium text-textPrimary">
                                                Attribute {index + 1}
                                            </div>

                                            {attributes.length > 1 ? (
                                                <button
                                                    onClick={() => removeAttribute(attribute.id)}
                                                    className="interactive-button rounded-xl p-2 text-danger transition hover:bg-dangerSoft"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            ) : null}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-textPrimary">
                                                    Attribute Name
                                                </label>
                                                <TextInput
                                                    value={attribute.name}
                                                    onChange={(value) =>
                                                        updateAttribute(attribute.id, "name", value)
                                                    }
                                                    placeholder="e.g. Size, Color, Fabric"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-textPrimary">
                                                    Values
                                                </label>
                                                <TextInput
                                                    value={attribute.values}
                                                    onChange={(value) =>
                                                        updateAttribute(attribute.id, "values", value)
                                                    }
                                                    placeholder="e.g. S, M, L"
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

                        <div className="overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm">
                            <div className="table-header px-6 py-4">
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
                                    <TextInput
                                        type="number"
                                        min="0"
                                        value={taxRate}
                                        onChange={(value) =>
                                            setTaxRate(Number(value) || 0)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                                        Cost Price
                                    </label>
                                    <TextInput
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={costPrice}
                                        onChange={(value) =>
                                            setCostPrice(Number(value) || 0)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                                        Wholesale Net
                                    </label>
                                    <TextInput
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={wholesaleNet}
                                        onChange={(value) =>
                                            setWholesaleNet(Number(value) || 0)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                                        Retail Net
                                    </label>
                                    <TextInput
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={retailNet}
                                        onChange={(value) =>
                                            setRetailNet(Number(value) || 0)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                                        Stock
                                    </label>
                                    <TextInput
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={stock}
                                        onChange={(value) =>
                                            setStock(Number(value) || 0)
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                                        Status
                                    </label>
                                    <StatusSelect
                                        value={isActive ? "ACTIVE" : "INACTIVE"}
                                        onChange={(value) =>
                                            setIsActive(value === "ACTIVE")
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm">
                            <div className="table-header px-6 py-4">
                                <h4 className="text-lg font-semibold text-textPrimary">
                                    Preview
                                </h4>
                            </div>

                            <div className="space-y-4 px-6 py-6">
                                <div className="rounded-2xl bg-cardMuted p-4 ring-1 ring-borderSoft">
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
                                        <div className="rounded-2xl bg-cardMuted p-4 text-sm text-textSecondary ring-1 ring-borderSoft">
                                            Add valid attributes and values to preview combinations.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {previewCombinations.map((item, index) => (
                                                <div
                                                    key={`${item}-${index}`}
                                                    className="rounded-xl bg-cardMuted px-3 py-2 text-sm text-textPrimary ring-1 ring-borderSoft"
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
                            <Button variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>

                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? "Generating..." : "Generate Variants"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}